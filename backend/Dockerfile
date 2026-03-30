FROM python:3.11-slim
WORKDIR /app
# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends build-essential git && rm -rf /var/lib/apt/lists/*
# Copy only requirements first for caching
COPY requirements.txt ./
RUN python -m pip install --upgrade pip && pip install -r requirements.txt
# Copy backend source
COPY backend ./backend
WORKDIR /app/backend
# Expose port and run with gunicorn (uvicorn workers)
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000", "--workers", "1"]
