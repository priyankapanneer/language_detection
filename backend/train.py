"""
Train a TF-IDF + Logistic Regression language detection model and save it with joblib.

Usage:
  python train.py --data ../language_dataset.csv --output backend/models/model.pkl
If no dataset path is provided, the script will try to use `language_dataset.csv` in repo root.
"""
import argparse
from pathlib import Path
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib


def load_data(path: Path):
    df = pd.read_csv(path)
    if 'text' not in df.columns or 'lang' not in df.columns:
        raise ValueError('CSV must contain columns: text, lang')
    df = df.dropna(subset=['text', 'lang'])
    return df['text'].astype(str).values, df['lang'].astype(str).values


def build_and_train(X, y):
    pipe = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=20000)),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.1, random_state=42, stratify=y)
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_val)
    print(classification_report(y_val, preds))
    return pipe


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=str, default='language_dataset.csv')
    parser.add_argument('--output', type=str, default='backend/models/model.pkl')
    args = parser.parse_args()

    data_path = Path(args.data)
    if not data_path.exists():
        raise FileNotFoundError(f'Data file not found: {data_path}')

    X, y = load_data(data_path)
    model = build_and_train(X, y)
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, out_path)
    print('Saved model to', out_path)


if __name__ == '__main__':
    main()
