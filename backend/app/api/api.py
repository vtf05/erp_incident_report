from fastapi import APIRouter
from app.apps.incidents.urls import router as incidents_router
from app.apps.enrichment.urls import router as enrichment_router

api_router = APIRouter()
api_router.include_router(incidents_router, prefix="/incidents", tags=["incidents"])
api_router.include_router(enrichment_router, prefix="/enrichment/rules", tags=["enrichment"])
