import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ERP Incident Triage Portal"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite://./erp_portal.db")
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"  # In production, use a secure secret key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    AWS_ACCESS_KEY_ID: str = "AKIAS7B7SP43YZA7VY6Q"
    AWS_SECRET_ACCESS_KEY: str = "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"
    AWS_REGION: str = "ap-south-1"
    S3_BUCKET_NAME: str = "avi-test-buck"
    
    # Enrichment App
    ENRICHMENT_APP_ACTIVE: bool = True

    class Config:
        case_sensitive = True

settings = Settings()
