from fastapi import APIRouter

from app.api.endpoints import runners, races, results

api_router = APIRouter()
api_router.include_router(runners.router, prefix="/runners", tags=["runners"])
api_router.include_router(races.router, prefix="/races", tags=["races"])
api_router.include_router(results.router, prefix="/results", tags=["results"])
