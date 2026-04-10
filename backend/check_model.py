import pathlib, joblib, sys
p = pathlib.Path(__file__).parent / 'models' / 'model.pkl'
print('model path:', p)
print('exists:', p.exists())
if not p.exists():
    print('Model missing; fallback model may be used by app.model_runner.')
    sys.exit(0)
mdl = joblib.load(p)
print('classes:', getattr(mdl, 'classes_', None))
# sample Tamil text prediction
try:
    sample = 'தமிழ் வணக்கம்'
    probs = mdl.predict_proba([sample])[0]
    classes = mdl.classes_
    idx = probs.argmax()
    print('sample text:', sample)
    print('predicted:', classes[idx], probs[idx])
except Exception as e:
    print('prediction error:', e)
