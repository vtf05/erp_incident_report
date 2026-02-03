# Monkeypatch distutils for Python 3.13 compatibility with aioredis
import sys
import types
distutils = types.ModuleType("distutils")
distutils.util = types.ModuleType("distutils.util")
distutils.util.strtobool = lambda val: val.lower() in ("y", "yes", "t", "true", "on", "1")
sys.modules["distutils"] = distutils
sys.modules["distutils.util"] = distutils.util

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import init_db, close_db
from app.api.api import api_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    await init_db()
    
    # Initialize Admin
    try:
        from app.admin.setup import setup_admin
        from fastapi_admin.app import app as admin_app
        await setup_admin(app)
        app.mount("/admin", admin_app)
    except Exception as e:
        print(f"Error initializing admin: {e}")
    
    yield
    
    # Shutdown: Close database connections
    await close_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": f"{settings.API_V1_STR}/docs",
        "admin": "/admin"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
