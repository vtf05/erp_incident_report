from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EnrichmentRuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    erp_module_condition: Optional[str] = None
    environment_condition: Optional[str] = None
    keyword_condition: Optional[str] = None
    severity_outcome: Optional[str] = None
    category_outcome: Optional[str] = None
    summary_template: Optional[str] = None
    suggested_action_outcome: Optional[str] = None
    priority: int = 0
    is_active: bool = True

class EnrichmentRuleCreate(EnrichmentRuleBase):
    pass

class EnrichmentRuleSchema(EnrichmentRuleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
