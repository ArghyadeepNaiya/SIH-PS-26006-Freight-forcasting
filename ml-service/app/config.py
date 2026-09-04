import os
from pydantic import BaseModel

class Settings(BaseModel):
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    DB_NAME: str = os.getenv("DB_NAME", "freight_decision_system")

settings = Settings()
