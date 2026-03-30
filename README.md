# Language Detection — Full-Stack App

This repository contains a full-stack language detection web application.

Folders:
- `backend/` — FastAPI app, training script, model persistence
- `frontend/` — React (Vite) app styled with Tailwind CSS and animated with Framer Motion

Quick start

1. Backend
   - Create a Python environment and install dependencies:

     python -m venv .venv
     .venv\Scripts\activate
     pip install -r backend/requirements.txt

   - (Optional) Train the model using `language_dataset.csv` in repository root:

     python backend/train.py --data language_dataset.csv --output backend/models/model.pkl

   - Run the API:

     uvicorn app.main:app --reload --app-dir backend/app --port 8000

2. Frontend
   - Install and run dev server:

     cd frontend
     npm install
     npm run dev

Open the frontend dev server URL printed by Vite (usually http://localhost:5173).
