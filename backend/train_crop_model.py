import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import numpy as np

# Enhanced dataset with more diverse crop data
data = pd.DataFrame([
    # Rice varieties
    {"N": 90, "P": 42, "K": 43, "temperature": 20.8, "humidity": 82, "ph": 6.5, "rainfall": 202, "label": "rice"},
    {"N": 85, "P": 40, "K": 45, "temperature": 21.5, "humidity": 85, "ph": 6.8, "rainfall": 220, "label": "rice"},
    {"N": 95, "P": 38, "K": 40, "temperature": 22.0, "humidity": 80, "ph": 6.2, "rainfall": 195, "label": "rice"},
    
    # Wheat varieties
    {"N": 85, "P": 58, "K": 41, "temperature": 22.5, "humidity": 80, "ph": 6.2, "rainfall": 190, "label": "wheat"},
    {"N": 80, "P": 55, "K": 38, "temperature": 20.0, "humidity": 75, "ph": 6.5, "rainfall": 180, "label": "wheat"},
    {"N": 88, "P": 60, "K": 42, "temperature": 18.5, "humidity": 78, "ph": 6.8, "rainfall": 200, "label": "wheat"},
    
    # Maize varieties
    {"N": 40, "P": 40, "K": 40, "temperature": 26.0, "humidity": 70, "ph": 6.0, "rainfall": 150, "label": "maize"},
    {"N": 45, "P": 35, "K": 38, "temperature": 25.5, "humidity": 65, "ph": 6.2, "rainfall": 140, "label": "maize"},
    {"N": 50, "P": 42, "K": 45, "temperature": 27.0, "humidity": 72, "ph": 5.8, "rainfall": 160, "label": "maize"},
    
    # Cotton varieties
    {"N": 120, "P": 18, "K": 24, "temperature": 35.0, "humidity": 50, "ph": 8.0, "rainfall": 50, "label": "cotton"},
    {"N": 110, "P": 20, "K": 26, "temperature": 32.0, "humidity": 55, "ph": 7.8, "rainfall": 60, "label": "cotton"},
    {"N": 125, "P": 16, "K": 22, "temperature": 30.0, "humidity": 45, "ph": 8.2, "rainfall": 45, "label": "cotton"},
    
    # Chickpea varieties
    {"N": 20, "P": 60, "K": 80, "temperature": 18.0, "humidity": 55, "ph": 7.5, "rainfall": 80, "label": "chickpea"},
    {"N": 25, "P": 55, "K": 75, "temperature": 20.0, "humidity": 60, "ph": 7.8, "rainfall": 90, "label": "chickpea"},
    {"N": 18, "P": 65, "K": 85, "temperature": 16.5, "humidity": 50, "ph": 7.2, "rainfall": 70, "label": "chickpea"},
    
    # Kidney beans varieties
    {"N": 25, "P": 52, "K": 142, "temperature": 20.0, "humidity": 65, "ph": 6.5, "rainfall": 130, "label": "kidneybeans"},
    {"N": 30, "P": 48, "K": 138, "temperature": 22.0, "humidity": 70, "ph": 6.8, "rainfall": 125, "label": "kidneybeans"},
    {"N": 28, "P": 50, "K": 145, "temperature": 18.5, "humidity": 62, "ph": 6.2, "rainfall": 135, "label": "kidneybeans"},
    
    # Pigeon peas varieties
    {"N": 20, "P": 67, "K": 17, "temperature": 26.0, "humidity": 60, "ph": 7.0, "rainfall": 100, "label": "pigeonpeas"},
    {"N": 22, "P": 65, "K": 15, "temperature": 28.0, "humidity": 55, "ph": 7.2, "rainfall": 95, "label": "pigeonpeas"},
    {"N": 18, "P": 70, "K": 20, "temperature": 25.0, "humidity": 65, "ph": 6.8, "rainfall": 110, "label": "pigeonpeas"},
    
    # Jute varieties
    {"N": 78, "P": 42, "K": 40, "temperature": 25.0, "humidity": 85, "ph": 6.5, "rainfall": 200, "label": "jute"},
    {"N": 80, "P": 38, "K": 42, "temperature": 27.0, "humidity": 88, "ph": 6.8, "rainfall": 220, "label": "jute"},
    {"N": 75, "P": 45, "K": 38, "temperature": 24.0, "humidity": 82, "ph": 6.2, "rainfall": 190, "label": "jute"},
    
    # Coffee varieties
    {"N": 100, "P": 20, "K": 30, "temperature": 23.0, "humidity": 70, "ph": 6.0, "rainfall": 150, "label": "coffee"},
    {"N": 95, "P": 22, "K": 32, "temperature": 25.0, "humidity": 75, "ph": 6.2, "rainfall": 160, "label": "coffee"},
    {"N": 105, "P": 18, "K": 28, "temperature": 21.0, "humidity": 68, "ph": 5.8, "rainfall": 140, "label": "coffee"},
])

# Prepare features and target
X = data.drop("label", axis=1)
y = data["label"]

print(f"📊 Dataset info:")
print(f"   Total samples: {len(data)}")
print(f"   Features: {list(X.columns)}")
print(f"   Crops: {y.unique()}")
print(f"   Samples per crop: {y.value_counts().to_dict()}")

# Split data for training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

# Train model with better parameters
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    min_samples_split=2,
    min_samples_leaf=1
)

print("🔄 Training Random Forest model...")
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n📈 Model Performance:")
print(f"   Accuracy: {accuracy:.2%}")
print(f"   Training samples: {len(X_train)}")
print(f"   Test samples: {len(X_test)}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\n🎯 Feature Importance:")
for _, row in feature_importance.iterrows():
    print(f"   {row['feature']}: {row['importance']:.3f}")

# Create models folder if not exists
os.makedirs("models", exist_ok=True)

# Save model
joblib.dump(model, "models/crop_suggestion.pkl")

print("\n✅ crop_suggestion.pkl saved successfully!")
print(f"📁 Model saved to: {os.path.abspath('models/crop_suggestion.pkl')}")

# Test the model with sample data
print("\n🧪 Testing model with sample data:")
sample_data = [[90, 42, 43, 20.8, 82, 6.5, 202]]  # Rice-like conditions
prediction = model.predict(sample_data)[0]
confidence = model.predict_proba(sample_data)[0].max()
print(f"   Sample input: N=90, P=42, K=43, Temp=20.8°C, Humidity=82%, pH=6.5, Rainfall=202mm")
print(f"   Prediction: {prediction.capitalize()} (confidence: {confidence:.2%})")
