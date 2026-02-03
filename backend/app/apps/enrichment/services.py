import asyncio
from .models import EnrichmentRule

class EnrichmentService:
    @staticmethod
    async def enrich_incident(incident) -> None:
        rules = await EnrichmentRule.filter(is_active=True).order_by("-priority")
        
        for rule in rules:
            if EnrichmentService._matches_rule(incident, rule):
                if rule.severity_outcome:
                    incident.severity = rule.severity_outcome
                if rule.category_outcome:
                    incident.category = rule.category_outcome
                if rule.suggested_action_outcome:
                    incident.suggested_action = rule.suggested_action_outcome
                if rule.summary_template:
                    incident.summary = EnrichmentService._format_summary(rule.summary_template, incident)
                break
        
        if not incident.severity:
            incident.severity = "P3"
        if not incident.category:
            incident.category = "Unknown"

    @staticmethod
    def _matches_rule(incident, rule: EnrichmentRule) -> bool:
        if rule.erp_module_condition and rule.erp_module_condition != incident.erp_module:
            return False
        if rule.environment_condition and rule.environment_condition != incident.environment:
            return False
        if rule.keyword_condition and rule.keyword_condition.lower() not in incident.description.lower():
            return False
        return True

    @staticmethod
    def _format_summary(template: str, incident) -> str:
        try:
            return template.format(
                title=incident.title,
                module=incident.erp_module,
                env=incident.environment,
                unit=incident.business_unit
            )
        except Exception:
            return f"Auto-summary for {incident.title}"

enrichment_service = EnrichmentService()
