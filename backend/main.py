import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI(
    title="Crop Suggestion API",
    description="A service to suggest the ideal crop based on environmental factors."
)

# Allow frontend CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DETAILED CROP DESCRIPTIONS ---
CROP_DESCRIPTIONS = {
    "rice": "Rice thrives in hot, humid conditions with abundant water. It's ideal for clayey loam soil in regions with heavy rainfall, making it a staple of the Kharif season.",
    "maize": "Maize (Corn) is a versatile crop that requires warm weather and ample sunlight. It grows best in well-drained, fertile loamy soil and is a popular choice for the Kharif season.",
    "wheat": "Wheat is a primary Rabi crop that prefers a cool, dry climate for growth and bright sun for ripening. It's well-suited for loamy soils and is a cornerstone of food security.",
    "chickpea": "Chickpea (Gram) is a major pulse crop for dry, cool climates. It performs well on light to heavy soils and enriches the soil by fixing nitrogen, benefiting future crops.",
    "kidneybeans": "Kidney beans require a mild climate and well-drained soils. They are sensitive to both frost and high temperatures, needing a consistent but moderate supply of water.",
    "pigeonpeas": "Pigeon peas are a hardy, drought-resistant crop perfect for semi-arid regions. They adapt to various soil types and are an important source of protein.",
    "cotton": "Cotton is a Kharif crop needing a long, frost-free period with high temperatures and sun. It grows best in the deep black (regur) soils of the Deccan Plateau.",
    "jute": "Known as the 'Golden Fibre', Jute is a cash crop that requires a hot, humid climate with plenty of rainfall. It is primarily grown in the rich alluvial soils of river deltas.",
    "coffee": "Coffee is a plantation crop grown in the shade on hilly slopes. It requires a warm, humid climate with deep, well-drained loamy soil rich in organic matter."
}

# Load Crop Model
MODELS_DIR = "models"
CROP_MODEL_PATH = os.path.join(MODELS_DIR, "crop_suggestion.pkl")
crop_model = None

try:
    if os.path.exists(CROP_MODEL_PATH):
        crop_model = joblib.load(CROP_MODEL_PATH)
        print("Crop suggestion model loaded successfully.")
    else:
        print(f"Warning: Crop suggestion model not found at {CROP_MODEL_PATH}")
except Exception as e:
    print(f"Error loading crop suggestion model: {e}")


@app.get("/")
def root():
    return {"message": "Crop Suggestion API is running"}


@app.post("/suggest-crop")
async def suggest_crop(data: dict):
    """
    Predict the best crop based on input features.
    Expected input: { "feature1": value1, "feature2": value2, ... }
    """
    if crop_model is None:
        raise HTTPException(status_code=503, detail="Crop suggestion model is not available.")

    try:
        # Convert input dictionary to NumPy array (much faster than pandas for single prediction)
        input_features = np.array([list(data.values())], dtype=float)
        
        # Make prediction
        prediction = crop_model.predict(input_features)[0]

        # Get detailed description
        reason = CROP_DESCRIPTIONS.get(prediction.lower(), f"{prediction.capitalize()} is ideal for the provided climate and soil conditions.")

        return {"crop": prediction, "reason": reason}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
