from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictRequest, PredictResponse
from app.model_runner import load_model, predict_text
from pathlib import Path

app = FastAPI(title='Language Detection API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


MODEL_FILE = Path(__file__).parent.parent / 'models' / 'model.pkl'


@app.on_event('startup')
async def startup_event():
    # Load model during application startup to avoid heavy work at import time
    app.state.model = load_model(MODEL_FILE)


@app.post('/predict', response_model=PredictResponse)
def predict(req: PredictRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail='Text is empty')
    try:
        model = getattr(app.state, 'model', None)
        if model is None:
            raise RuntimeError('Model not loaded')
        lang, conf = predict_text(text, model)
        return PredictResponse(language=lang, confidence=round(conf, 4))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
