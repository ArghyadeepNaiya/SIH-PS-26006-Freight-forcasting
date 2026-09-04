from fastapi import APIRouter
from app.schemas.request import RecommendRequest
from app.schemas.response import RecommendResponse
from app.core.candidates import generate_candidates
from app.core.constraints import check_constraints
from app.core.capacity import compute_capacity
from app.core.cost_model import compute_cost
from app.core.decision import make_decision
from app.forecasting.baseline import get_mock_forecast
import datetime
from pymongo import MongoClient
from app.config import settings

router = APIRouter()

@router.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    client = MongoClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    
    ports = list(db.ports.find({}, {"_id": 0}))
    vessel_classes = list(db.vessel_classes.find({}, {"_id": 0}))
    routes = list(db.routes.find({}, {"_id": 0}))
    db_assumptions = list(db.cost_assumptions.find({}, {"_id": 0}))
    
    assumptions_dict = {"routes": routes, "cost_assumptions": db_assumptions}
    
    candidates = generate_candidates(req.quantity_tonnes, req.origin, ports, vessel_classes)
    
    options = []
    rejected = []
    
    for c in candidates:
        constraint_result = check_constraints(c)
        if not constraint_result["feasible"]:
            rejected.append({
                "vessel_class": c["vessel_class"],
                "discharge_port": c["discharge_port"],
                "failed_constraint": constraint_result["failed_constraint"],
                "limit_value": constraint_result["limit_value"],
                "required_value": constraint_result["required_value"],
                "source_citation": constraint_result["source_citation"]
            })
            continue
            
        capacity_info = compute_capacity(c, req.quantity_tonnes)
        forecast = get_mock_forecast(c["vessel_class"], req.earliest_arrival)
        cost_info = compute_cost(c, capacity_info, assumptions_dict, forecast["point"])
        
        options.append({
            "vessel_class": c["vessel_class"],
            "discharge_port": c["discharge_port"],
            "nominal_capacity_tonnes": c["nominal_capacity_tonnes"],
            "deliverable_tonnes": capacity_info["deliverable_tonnes"],
            "load_percentage": capacity_info["load_percentage"],
            "requires_lightering": capacity_info["requires_lightering"],
            "landed_cost_per_tonne": cost_info["landed_cost_per_tonne"],
            "cost_breakdown": cost_info["cost_breakdown"],
            "reason": f"Estimated landed cost ${cost_info['landed_cost_per_tonne']} per tonne"
        })
        
    options = sorted(options, key=lambda x: x["landed_cost_per_tonne"])
    
    forecast_skill = {v["name"]: 0.15 for v in vessel_classes}
    recommendation = make_decision(options, forecast_skill)
    
    return RecommendResponse(
        recommendation=recommendation,
        options=options,
        rejected=rejected,
        forecast_summary={"horizon_days": 30, "skill_score": 0.15},
        assumptions={"overrides_applied": bool(req.overrides)},
        generated_at=datetime.datetime.utcnow().isoformat()
    )
