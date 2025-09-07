import joblib, json, numpy as np

clf = joblib.load("models/crop_model.pkl")
profiles = json.load(open("models/crop_profiles.json"))

FEATURES = ["N","P","K","temperature","humidity","ph","rainfall"]
sample = dict(N=90,P=42,K=43,temperature=20.9,humidity=82.0,ph=6.5,rainfall=203.0)

X = np.array([[sample[f] for f in FEATURES]])
proba = clf.predict_proba(X)[0]
classes = clf.classes_
best_idx = int(proba.argmax())
best = classes[best_idx]
top3 = sorted(zip(classes, proba), key=lambda x: x[1], reverse=True)[:3]

def explain(crop: str, s: dict):
    prof = profiles.get(crop, {})
    diffs = ", ".join([f"{k}: {s[k]} (avg {prof.get(k,'?')})" for k in FEATURES])
    return f"Recommended: {crop}. Your conditions vs typical: {diffs}."

print("Best:", best, round(float(proba[best_idx]), 4))
print("Top3:", [(c, round(float(p),4)) for c,p in top3])
print(explain(best, sample))
