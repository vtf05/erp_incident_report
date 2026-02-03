from tortoise import fields, models
from enum import Enum

class ERPModule(str, Enum):
    AP = "AP"
    AR = "AR"
    GL = "GL"
    INVENTORY = "Inventory"
    HR = "HR"
    PAYROLL = "Payroll"

class Environment(str, Enum):
    PROD = "Prod"
    TEST = "Test"

class IncidentStatus(str, Enum):
    NEW = "New"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class Incident(models.Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    description = fields.TextField()
    erp_module = fields.CharEnumField(ERPModule)
    environment = fields.CharEnumField(Environment)
    business_unit = fields.CharField(max_length=100)
    
    # Enriched fields
    severity = fields.CharField(max_length=10, null=True)
    category = fields.CharField(max_length=100, null=True)
    summary = fields.TextField(null=True)
    suggested_action = fields.TextField(null=True)
    
    status = fields.CharEnumField(IncidentStatus, default=IncidentStatus.NEW)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "incidents"

