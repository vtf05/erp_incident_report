from fastapi_admin.resources import Model, Field
from fastapi_admin.widgets import inputs, displays, filters
from app.apps.incidents.models import Incident
from app.apps.enrichment.models import EnrichmentRule
from app.apps.auth.models import User

class UserResource(Model):
    label = "Users"
    model = User
    fields = [
        "id",
        "username",
        "email",
        "is_active",
        "is_superuser",
        "created_at",
    ]

class IncidentResource(Model):
    label = "Incidents"
    model = Incident
    fields = [
        "id",
        "title",
        "erp_module",
        "environment",
        "severity",
        "status",
        "created_at",
    ]

class EnrichmentRuleResource(Model):
    label = "Enrichment Rules"
    model = EnrichmentRule
    fields = [
        "id",
        "name",
        "erp_module_condition",
        "environment_condition",
        "severity_outcome",
        "priority",
        "is_active",
    ]
