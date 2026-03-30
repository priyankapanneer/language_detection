Deployment Guide
================

Overview
--------
This repo is organized with a React frontend in `frontend/` and a Python FastAPI backend in `backend/`.

Recommended hosting
-------------------
- Frontend: Vercel (static/Vite app)
- Backend: Render (Docker) — supports Python and ML artifacts

Required repository secrets (GitHub Actions)
-------------------------------------------
- `VERCEL_TOKEN` — your Vercel personal token
- `VERCEL_ORG_ID` — Vercel organization ID
- `VERCEL_PROJECT_ID` — Vercel project ID
- `RENDER_API_KEY` — Render API key
- `RENDER_SERVICE_ID` — Render service id (for deploy trigger)

Trigger a CI deploy (after adding secrets)
-----------------------------------------
Run locally:

```
git add .
git commit -m "Trigger CI deploy"
git push origin main
```

Vercel — manual local deploy (interactive)
------------------------------------------
Install Vercel CLI and deploy the `frontend` directory:

```
npm install -g vercel
vercel login
cd d:\\dlproject
vercel --cwd frontend --prod --confirm --name language-detect-frontend
```

Vercel — connect via web UI
---------------------------
1. Go to Vercel → New Project → Import Git Repository
2. Choose the `language_detection` repo
3. Set Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Set environment variables/secrets in Vercel dashboard if needed

Render — Docker deploy (recommended for backend)
------------------------------------------------
We added `backend/Dockerfile` and `render.yaml`.

Using Render web UI (recommended):
1. Sign in to Render
2. New → Web Service → Connect GitHub repo
3. Render detects `render.yaml` and creates a service
4. Choose `main` branch and deploy

Trigger a Render deploy via API (replace values):

```
curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": true}'
```

Optional: Build & push Docker image instead
------------------------------------------
```
cd d:\\dlproject
docker build -t <dockerhub-user>/language-detection-backend:latest -f backend/Dockerfile .
docker push <dockerhub-user>/language-detection-backend:latest
```
Then configure Render to use that image.

GitHub Actions
--------------
Two workflows were added:
- `.github/workflows/vercel-deploy.yml` — deploys `frontend` to Vercel when `main` is pushed.
- `.github/workflows/render-deploy.yml` — triggers a Render deploy when `main` is pushed.

If you want me to run any remote deploys from this environment, provide `VERCEL_TOKEN` and/or `RENDER_API_KEY` (I can run CLI/API calls). Otherwise run the commands above locally after setting the secrets.

Add GitHub Actions secrets
--------------------------
Set these in your GitHub repo: Settings → Secrets and variables → Actions → New repository secret.

- `VERCEL_TOKEN` — Vercel personal token
- `VERCEL_ORG_ID` — Vercel organization ID (find in Vercel dashboard Settings)
- `VERCEL_PROJECT_ID` — Vercel project ID (find in Vercel dashboard or via `vercel projects ls`)
- `RENDER_API_KEY` — Render API key (Account → API Keys)
- `RENDER_SERVICE_ID` — Render service id (from Render service dashboard or `render.yaml`)

You can also add secrets using GitHub CLI:

```bash
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"
gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID"
gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID"
gh secret set RENDER_API_KEY --body "$RENDER_API_KEY"
gh secret set RENDER_SERVICE_ID --body "$RENDER_SERVICE_ID"
```

Manually triggering the workflows
--------------------------------
After adding secrets you can trigger CI deploys by pushing to `main` or manually dispatching workflows.

Push to `main` to trigger both workflows:

```bash
git add .
git commit -m "Trigger CI deploy"
git push origin main
```

To manually run a workflow from the CLI (example using GitHub CLI):

```bash
gh workflow run vercel-deploy.yml --ref main
gh workflow run render-deploy.yml --ref main
```

Train the backend model locally (optional, recommended before production deploy)
-----------------------------------------------------------------------
If you want a full model rather than the fallback, train and save `backend/models/model.pkl`:

```bash
python -m pip install -r requirements.txt
python backend/train.py --data language_dataset.csv --output backend/models/model.pkl
```

Run and test the backend locally
--------------------------------
Start the FastAPI app from the `backend` directory so Python package imports resolve correctly:

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
# then test:
curl -X POST http://127.0.0.1:8000/predict -H "Content-Type: application/json" -d '{"text":"hello world"}'
```

If you'd like, I can run the deploy steps from this environment — tell me which service to start (Vercel frontend, Render backend) and provide the corresponding secrets, or say "I'll run locally" and follow the commands above.
