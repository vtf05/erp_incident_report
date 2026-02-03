import asyncio
from app.core.db import init_db, close_db
from app.apps.auth.models import User, pwd_context
from app.apps.enrichment.models import EnrichmentRule

async def create_initial_data():
    await init_db()
    
    username = "admin"
    password = "adminpassword"
    email = "admin@example.com"
    
    existing_user = await User.get_or_none(username=username)
    if not existing_user:
        hashed_password = pwd_context.hash(password)
        await User.create(
            username=username,
            hashed_password=hashed_password,
            email=email,
            is_superuser=True
        )
        print(f"Superuser '{username}' created successfully.")
        
    if await EnrichmentRule.all().count() == 0:
        await EnrichmentRule.create(
            name="Critical AP Issue",
            erp_module_condition="AP",
            environment_condition="Prod",
            severity_outcome="P1",
            category_outcome="Financial Impact",
            summary_template="Critical {module} incident in {env}: {title}",
            priority=100
        )
        print("Initial rules created.")

    await close_db()

if __name__ == "__main__":
    asyncio.run(create_initial_data())
