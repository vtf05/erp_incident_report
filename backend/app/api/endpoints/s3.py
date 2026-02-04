from fastapi import APIRouter, HTTPException
from typing import List
from app.core.aws import s3_service

router = APIRouter()

@router.get("/payloads")
async def list_s3_payloads(prefix: str = ""):
    """
    Lists all payloads uploaded to S3.
    """
    try:
        return s3_service.list_payloads(prefix=prefix)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payloads/{key:path}")
async def get_s3_payload(key: str):
    """
    Retrieves a specific payload from S3.
    """
    payload = s3_service.get_payload(key)
    if not payload:
        raise HTTPException(status_code=404, detail="Payload not found in S3")
    return payload
