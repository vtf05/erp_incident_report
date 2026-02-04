from typing import List, Optional
from fastapi import HTTPException
from .models import Incident
from .schemas import IncidentCreate, IncidentUpdate
from app.apps.enrichment.services import enrichment_service
from app.core.aws import s3_service
from datetime import datetime

class IncidentService:
    @staticmethod
    async def create_incident(incident_in: IncidentCreate) -> Incident:
        """
        Creates a new incident and automatically enriches it using the rule engine.
        """
        incident = await Incident.create(**incident_in.model_dump())
        await enrichment_service.enrich_incident(incident)
        await incident.save()
        
        # Upload to S3
        s3_service.upload_payload(
            folder="incidents",
            filename=f"incident_{incident.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            payload=incident_in.model_dump()
        )
        
        return incident

    @staticmethod
    async def list_incidents(severity: Optional[str] = None, module: Optional[str] = None) -> List[Incident]:
        """
        Lists all incidents with optional filtering by severity or ERP module.
        """
        query = Incident.all()
        if severity:
            query = query.filter(severity=severity)
        if module:
            query = query.filter(erp_module=module)
        return await query

    @staticmethod
    async def get_incident_by_id(incident_id: int) -> Incident:
        """
        Retrieves a single incident by its ID. Raises 404 if not found.
        """
        incident = await Incident.get_or_none(id=incident_id)
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")
        return incident

    @staticmethod
    async def update_incident(incident_id: int, incident_in: IncidentUpdate) -> Incident:
        """
        Updates an existing incident's specific fields.
        """
        incident = await IncidentService.get_incident_by_id(incident_id)
        
        update_data = incident_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(incident, field, value)
        
        await incident.save()
        return incident

public_service = IncidentService()
