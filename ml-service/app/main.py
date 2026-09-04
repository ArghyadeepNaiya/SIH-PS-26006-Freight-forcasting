from fastapi import FastAPI
from app.api import routes_recommend, routes_forecast, routes_health

app = FastAPI(title="ML Service - SIH PS 26006")

app.include_router(routes_recommend.router, prefix="/ml")
app.include_router(routes_forecast.router, prefix="/ml")
app.include_router(routes_health.router, prefix="/ml")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
