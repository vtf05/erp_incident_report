# ERP Incident Triage Portal

A full-stack application for monitoring, managing, and automatically enriching ERP system incidents.

## Features
- **Automated Triage**: Incidents are automatically categorized and prioritized based on configurable rules.
- **Dashboard**: High-level stats and filtered incident views.
- **Detailed Inquiry**: Deep-dive into case metadata and enrichment summaries.
- **Admin Panel**: Manage users, rules, and incidents via a Django-inspired interface.

## Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Redis** (Required for the Admin Panel)

## Setup Instructions

### 1. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Initialize the database and superuser:
```bash
python scripts/initial_setup.py
```

Run the API:
```bash
uvicorn app.main:app --reload
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Admin Panel: [http://localhost:8000/admin](http://localhost:8000/admin)

### 2. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Run the application:
```bash
npm run dev
```
- Web App: [http://localhost:5173](http://localhost:5173)

## Project Structure
- **/backend**: FastAPI application, Tortoise ORM models, and rule engine.
- **/frontend**: React application with Vite, using vanilla CSS for aesthetics.
- **DESIGN.md**: Detailed architecture, technology rationale, and flow diagrams.

## Quick Start (Initial Admin Account)
- **Username**: `admin`
- **Password**: `adminpassword`
