import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ----------------- CONFIG -----------------
FRONTEND_ORIGINS = [
    "http://localhost:3000",
    "https://farm-pulse-7ika.vercel.app"
]

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
CROP_MODEL_FILE = "crop_suggestion.pkl"

# ----------------- FASTAPI INIT -----------------
app = FastAPI(
    title="Crop Suggestion API",
    description="Predicts the ideal crop based on environmental and soil factors",
    version="1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- DATA MODELS -----------------
class CropInput(BaseModel):
    nitrogen: float = Field(..., alias="N", gt=0)
    phosphorus: float = Field(..., alias="P", gt=0)
    potassium: float = Field(..., alias="K", gt=0)
    temperature: float = Field(..., gt=0)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., gt=0)
    rainfall: float = Field(..., ge=0)

    class Config:
        allow_population_by_field_name = True  # allow internal use of 'nitrogen', etc.

# ----------------- DETAILED CROP DESCRIPTIONS -----------------
CROP_DESCRIPTIONS = {
    "rice": "Rice thrives in hot, humid conditions with abundant water. It is ideally grown in clayey loam soils that retain moisture...",
    "maize": "Maize, or corn, is a versatile crop requiring warm weather, bright sunlight, and well-drained fertile loamy soils...",
    "wheat": "Wheat is a primary Rabi crop that prefers cool, dry climates and ample sunlight for ripening...",
    "chickpea": "Chickpea, or gram, is a legume crop suitable for dry and cool climates...",
    "kidneybeans": "Kidney beans require a mild climate with well-drained, fertile soils...",
    "pigeonpeas": "Pigeon peas are hardy, drought-tolerant crops ideal for semi-arid regions...",
    "cotton": "Cotton is a long-duration Kharif crop that requires high temperatures, full sunlight...",
    "jute": "Jute, known as the 'Golden Fibre', thrives in hot, humid climates with high rainfall...",
    "coffee": "Coffee is a plantation crop grown in shaded hilly areas with warm, humid climates..."
}

# ----------------- LOAD CROP MODEL -----------------
crop_model = None
CROP_MODEL_PATH = os.path.join(MODELS_DIR, CROP_MODEL_FILE)

try:
    if os.path.exists(CROP_MODEL_PATH):
        crop_model = joblib.load(CROP_MODEL_PATH)
        print("✅ Crop suggestion model loaded successfully.")
    else:
        print(f"⚠️ Warning: Crop model not found at {CROP_MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading crop suggestion model: {e}")

# ----------------- ROUTES -----------------
@app.get("/")
def root():
    return {"message": "Crop Suggestion API is running"}

@app.post("/suggest-crop")
async def suggest_crop(input_data: CropInput):
    if crop_model is None:
        raise HTTPException(status_code=503, detail="Crop suggestion model is not available.")

    try:
        features = np.array([[input_data.nitrogen, input_data.phosphorus, input_data.potassium,
                              input_data.temperature, input_data.humidity, input_data.ph,
                              input_data.rainfall]], dtype=float)
        prediction = crop_model.predict(features)[0].lower()
        description = CROP_DESCRIPTIONS.get(prediction, f"{prediction.capitalize()} is ideal for the provided climate and soil conditions.")

        return {
            "crop": prediction.capitalize(),
            "reason": description
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
