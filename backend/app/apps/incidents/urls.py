from fastapi import APIRouter
from typing import List
from .schemas import IncidentCreate, IncidentSchema, IncidentUpdate
from .public import public_service

router = APIRouter()

@router.post("/", response_model=IncidentSchema)
async def create_incident(incident_in: IncidentCreate):
    return await public_service.create_incident(incident_in)

@router.get("/", response_model=List[IncidentSchema])
async def list_incidents(severity: str | None = None, module: str | None = None):
    return await public_service.list_incidents(severity=severity, module=module)

@router.get("/{incident_id}", response_model=IncidentSchema)
async def get_incident(incident_id: int):
    return await public_service.get_incident_by_id(incident_id)

@router.patch("/{incident_id}", response_model=IncidentSchema)
async def update_incident(incident_id: int, incident_in: IncidentUpdate):
    return await public_service.update_incident(incident_id, incident_in)
