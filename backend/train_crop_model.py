import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Example dataset (Replace with your own CSV if available)
data = pd.DataFrame([
    {"N": 90, "P": 42, "K": 43, "temperature": 20.8, "humidity": 82, "ph": 6.5, "rainfall": 202, "label": "rice"},
    {"N": 85, "P": 58, "K": 41, "temperature": 22.5, "humidity": 80, "ph": 6.2, "rainfall": 190, "label": "wheat"},
    {"N": 40, "P": 40, "K": 40, "temperature": 26.0, "humidity": 70, "ph": 6.0, "rainfall": 150, "label": "maize"},
])

X = data.drop("label", axis=1)
y = data["label"]

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Create models folder if not exists
os.makedirs("models", exist_ok=True)

# Save model
joblib.dump(model, "models/crop_suggestion.pkl")

print("✅ crop_suggestion.pkl saved successfully!")
