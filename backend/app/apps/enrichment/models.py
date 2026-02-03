from tortoise import fields, models

class EnrichmentRule(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
    description = fields.TextField(null=True)
    
    # Conditions
    erp_module_condition = fields.CharField(max_length=50, null=True)
    environment_condition = fields.CharField(max_length=50, null=True)
    keyword_condition = fields.CharField(max_length=255, null=True)
    
    # Outcomes
    severity_outcome = fields.CharField(max_length=10, null=True)
    category_outcome = fields.CharField(max_length=100, null=True)
    summary_template = fields.TextField(null=True)
    suggested_action_outcome = fields.TextField(null=True)
    
    priority = fields.IntField(default=0)
    is_active = fields.BooleanField(default=True)
    
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "enrichment_rules"

