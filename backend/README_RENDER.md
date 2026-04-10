# Render deployment notes

- Recommended Python runtime: 3.11.x — set your Render service to use Python 3.11.
- Use `backend/requirements-render.txt` for deployments to avoid heavy, incompatible packages.
- Do NOT install the monolithic `requirements.txt` from the repo root for the Render service.

Quick deploy steps (Render web service using the repo):

1. Create a new service (Web Service) on Render and link this repo.
2. In the service settings set the **Environment** to `Python 3.11` (or select 3.11.x).
3. Use the build command:

   pip install --upgrade pip
   pip install -r backend/requirements-render.txt

4. Set the start command (example):

   gunicorn -k uvicorn.workers.UvicornWorker "app.main:app" --bind 0.0.0.0:$PORT

5. (Optional) Train and upload a full model before scaling: run locally
   `python backend/train.py --data language_dataset.csv --output backend/models/model.pkl`
   then commit `backend/models/model.pkl` to the repo or store it in a blob and adjust `MODEL_PATH`.

Why this helps:
- Removes large dependencies (pyspark, datasets, pyarrow, snowflake) that often fail on small cloud builders.
- Pins compatible `numpy` / `scipy` / `scikit-learn` to avoid the mismatched-version failures you saw.
