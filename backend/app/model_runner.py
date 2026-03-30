from pathlib import Path
import joblib
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator
from typing import Tuple


MODEL_PATH = Path(__file__).parent.parent.parent / 'backend' / 'models' / 'model.pkl'


def _train_fallback_and_save(path: Path):
    # A tiny fallback model trained on a few examples so the API can run without the full dataset.
    from sklearn.pipeline import Pipeline
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression

    X = [
        'Hello, how are you?', 'This is a test sentence.',
        'Bonjour, comment ça va?', 'Je suis content.',
        'Hola, cómo estás?', 'Esto es una prueba.'
    ]
    y = ['en', 'en', 'fr', 'fr', 'es', 'es']
    pipe = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=5000)),
        ('clf', LogisticRegression(max_iter=500))
    ])
    pipe.fit(X, y)
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipe, path)
    return pipe


def load_model(model_path: Path = None) -> Pipeline:
    path = model_path or MODEL_PATH
    try:
        model = joblib.load(path)
        return model
    except Exception:
        # If model missing or load fails, train a tiny fallback model.
        model = _train_fallback_and_save(path)
        return model


def predict_text(text: str, model: Pipeline) -> Tuple[str, float]:
    probs = model.predict_proba([text])[0]
    classes = model.classes_
    idx = probs.argmax()
    return classes[idx], float(probs[idx])
