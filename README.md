# ERP Incident Report Portal

A full-stack application for monitoring, managing, and automatically enriching ERP system incidents.


## Features
- **Automated Report**: Incidents are automatically categorized and prioritized based on configurable rules.
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


## AWS Implementation Status (Infrastructure Note)

> [!IMPORTANT]
> AWS services were not utilized in this MVP because i do not have free tier available have exhausted all the limits already.

For a production-grade deployment of this platform, the following AWS architecture is recommended:

- **Networking**:
  - **VPC** with Public and Private Subnets.
  - **Application Load Balancer (ALB)** for secure traffic routing.
- **Compute**:
  - **AWS Fargate** or **ECS** for scalable container orchestration.
- **Storage & Databases**:
  - **Amazon RDS (PostgreSQL)**: Preferred for structured incident data and relational integrity.
  - **Amazon S3**: To store enrichment logs and raw incident payloads.
- **Monitoring**:
  - **Amazon CloudWatch**: For centralized logging, metrics, and incident tracing.