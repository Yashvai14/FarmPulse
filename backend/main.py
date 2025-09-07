import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ----------------- CONFIG -----------------
FRONTEND_ORIGINS = [
    "http://localhost:3000",  # Local dev
    "https://farmpulse.vercel.app"  # Deployed frontend
]

MODELS_DIR = "models"
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
    nitrogen: float = Field(..., gt=0, description="Nitrogen content in soil")
    phosphorus: float = Field(..., gt=0, description="Phosphorus content in soil")
    potassium: float = Field(..., gt=0, description="Potassium content in soil")
    temperature: float = Field(..., gt=0, description="Average temperature in °C")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity in %")
    ph: float = Field(..., gt=0, description="Soil pH value")
    rainfall: float = Field(..., ge=0, description="Annual rainfall in mm")

# ----------------- DETAILED CROP DESCRIPTIONS -----------------
CROP_DESCRIPTIONS = {
    "rice": (
        "Rice thrives in hot, humid conditions with abundant water. "
        "It is ideally grown in clayey loam soils that retain moisture and is "
        "commonly cultivated in regions with heavy rainfall. Rice planting requires "
        "flooded fields for proper seedling growth and weed control. Nutrient-rich "
        "soil with adequate nitrogen and potassium significantly enhances yield. "
        "It is a staple crop in Kharif season and supports millions of livelihoods "
        "throughout Asia."
    ),
    "maize": (
        "Maize, or corn, is a versatile crop requiring warm weather, bright sunlight, "
        "and well-drained fertile loamy soils. Optimal growth occurs at temperatures "
        "between 18°C and 27°C. Maize is highly sensitive to water stress during the "
        "flowering stage, so consistent irrigation is critical. It is a key cereal crop "
        "used for food, feed, and industrial purposes. Crop rotation with legumes can "
        "improve soil fertility and reduce pest incidence."
    ),
    "wheat": (
        "Wheat is a primary Rabi crop that prefers cool, dry climates and ample sunlight "
        "for ripening. Loamy soils with moderate fertility provide the best yield. "
        "Wheat requires careful management of irrigation and fertilizers, especially "
        "nitrogen for optimal grain development. Disease-resistant varieties help reduce "
        "crop loss from rusts and blights. Wheat cultivation is crucial for food security "
        "and contributes significantly to global cereal production."
    ),
    "chickpea": (
        "Chickpea, or gram, is a legume crop suitable for dry and cool climates. "
        "It tolerates light to heavy soils and enriches the soil by fixing atmospheric nitrogen, "
        "benefiting future crops. Optimal growth occurs at moderate temperatures with well-distributed "
        "rainfall. Proper pest and disease management, especially for blights and pod borers, "
        "ensures high yield. Chickpea is a rich source of protein and is widely used in human diets."
    ),
    "kidneybeans": (
        "Kidney beans require a mild climate with well-drained, fertile soils. "
        "They are sensitive to frost and extreme heat and need consistent, moderate irrigation. "
        "Soil with good organic content promotes strong root development. Proper staking or trellising "
        "may be needed for climbing varieties. Kidney beans are high in protein and essential nutrients, "
        "making them a valuable pulse crop for both domestic and export markets."
    ),
    "pigeonpeas": (
        "Pigeon peas are hardy, drought-tolerant crops ideal for semi-arid regions. "
        "They adapt to a wide range of soil types, from light sandy to clay soils. "
        "Their deep root system allows them to access moisture from deeper layers, making them resilient "
        "during dry periods. Pigeon peas enrich soil nitrogen and are a key protein source. "
        "They are grown both as a food crop and a soil-improving cover crop."
    ),
    "cotton": (
        "Cotton is a long-duration Kharif crop that requires high temperatures, full sunlight, "
        "and a frost-free period for optimal growth. Deep black (regur) soils of the Deccan Plateau "
        "are ideal. Adequate irrigation, pest control for bollworms, and nutrient management, "
        "especially nitrogen and potassium, are essential for high-quality fiber. Cotton supports "
        "the textile industry and provides raw material for numerous industries globally."
    ),
    "jute": (
        "Jute, known as the 'Golden Fibre', thrives in hot, humid climates with high rainfall. "
        "Alluvial soils in river delta regions provide ideal conditions. Jute cultivation requires "
        "frequent water supply and careful retting post-harvest for fiber extraction. Jute is a "
        "sustainable, biodegradable fiber used for sacks, ropes, mats, and eco-friendly products. "
        "It is an important cash crop in India, Bangladesh, and Southeast Asia."
    ),
    "coffee": (
        "Coffee is a plantation crop grown in shaded hilly areas with warm, humid climates. "
        "Well-drained loamy soils rich in organic matter support healthy plant growth. "
        "Optimal temperature ranges between 15°C and 24°C, and excess water can cause root rot. "
        "Shade management, pruning, and pest control are vital for high-quality beans. "
        "Coffee contributes significantly to export revenue and is a key economic crop for many tropical countries."
    )
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
        # Convert input to NumPy array
        features = np.array([list(input_data.dict().values())], dtype=float)

        # Make prediction
        prediction = crop_model.predict(features)[0].lower()

        # Get detailed description
        description = CROP_DESCRIPTIONS.get(
            prediction,
            f"{prediction.capitalize()} is ideal for the provided climate and soil conditions."
        )

        return {
            "crop": prediction.capitalize(),
            "description": description
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
