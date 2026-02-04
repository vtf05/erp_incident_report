from fastapi import APIRouter
from typing import List
from .models import EnrichmentRule
from .schemas import EnrichmentRuleCreate, EnrichmentRuleSchema
from app.core.aws import s3_service
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[EnrichmentRuleSchema])
async def list_rules():
    return await EnrichmentRule.all().order_by("-priority")

@router.post("/", response_model=EnrichmentRuleSchema)
async def create_rule(rule_in: EnrichmentRuleCreate):
    rule = await EnrichmentRule.create(**rule_in.dict())
    
    # Upload to S3
    s3_service.upload_payload(
        folder="rules",
        filename=f"rule_{rule.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        payload=rule_in.dict()
    )
    
    return rule

@router.patch("/{rule_id}", response_model=EnrichmentRuleSchema)
async def update_rule(rule_id: int, rule_in: EnrichmentRuleCreate):
    rule = await EnrichmentRule.get(id=rule_id)
    await rule.update_from_dict(rule_in.dict(exclude_unset=True)).save()
    return rule

@router.delete("/{rule_id}")
async def delete_rule(rule_id: int):
    rule = await EnrichmentRule.get(id=rule_id)
    await rule.delete()
    return {"status": "deleted"}
