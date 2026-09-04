from fastapi import APIRouter
from app.forecasting.baseline import get_mock_forecast

router = APIRouter()

@router.post("/forecast")
def forecast(vessel_class: str, date_str: str):
    return get_mock_forecast(vessel_class, date_str)

@router.get("/skill")
def skill():
    return {"Capesize": 0.15, "Panamax": 0.15, "Supramax": 0.15, "Handysize": 0.15}
