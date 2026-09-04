from pydantic import BaseModel
from typing import List, Dict, Any

class RecommendResponse(BaseModel):
    recommendation: Dict[str, str]
    options: List[Dict[str, Any]]
    rejected: List[Dict[str, Any]]
    forecast_summary: Dict[str, Any]
    assumptions: Dict[str, Any]
    generated_at: str
