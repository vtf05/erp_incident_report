from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .models import ERPModule, Environment, IncidentStatus

class IncidentBase(BaseModel):
    title: str
    description: str
    erp_module: ERPModule
    environment: Environment
    business_unit: str

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    status: Optional[IncidentStatus] = None
    severity: Optional[str] = None
    category: Optional[str] = None

class IncidentSchema(IncidentBase):
    id: int
    severity: Optional[str]
    category: Optional[str]
    summary: Optional[str]
    suggested_action: Optional[str]
    status: IncidentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
