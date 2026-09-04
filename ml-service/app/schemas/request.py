from pydantic import BaseModel
from typing import Optional, Dict

class RecommendRequest(BaseModel):
    cargo_type: str
    quantity_tonnes: float
    origin: str
    earliest_arrival: str
    latest_arrival: str
    destination_plant: Optional[str] = None
    destination_port: Optional[str] = None
    overrides: Optional[Dict] = {}
