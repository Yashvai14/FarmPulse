import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from io import BytesIO
from PIL import Image
import torch
import torchvision.transforms as T

# ----------------- CONFIG -----------------
FRONTEND_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://farm-pulse-7ika.vercel.app"
]

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
CROP_MODEL_FILE = "crop_suggestion.pkl"
DISEASE_MODEL_FILE = "disease_model.pt"
DISEASE_CLASSES_FILE = "disease_classes.json"

# ----------------- FASTAPI INIT -----------------
app = FastAPI(
    title="FarmPulse API",
    description="APIs for crop suggestion and plant disease prediction",
    version="1.1"
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
        populate_by_name = True  # allow internal use of 'nitrogen', etc. (Pydantic v2)

# ----------------- DETAILED CROP DESCRIPTIONS -----------------
CROP_DESCRIPTIONS = {
    "rice": "Rice is ideal for your conditions! This crop thrives in warm, humid environments (20-35°C) with abundant water supply. Rice prefers slightly acidic to neutral soils (pH 5.5-7.0) and requires high nitrogen levels for optimal growth. With proper water management, rice can yield 4-6 tons per hectare. Best grown during monsoon season with 1000-2000mm annual rainfall.",
    
    "maize": "Maize (corn) is an excellent choice for your farm conditions! This versatile crop grows well in temperatures of 21-27°C and requires well-drained fertile soils with moderate nitrogen, phosphorus, and potassium levels. Maize is drought-tolerant once established and can yield 5-8 tons per hectare. It requires 500-800mm of well-distributed rainfall during the growing season.",
    
    "wheat": "Wheat is perfectly suited for your conditions! As a Rabi crop, wheat prefers cool, dry weather (15-25°C) during growth and warm, dry conditions during harvesting. It thrives in well-drained loamy soils with good phosphorus content and moderate nitrogen levels. Wheat typically yields 3-5 tons per hectare and requires 300-400mm of water during its growth cycle.",
    
    "chickpea": "Chickpea (gram) is an ideal legume crop for your soil conditions! This hardy crop prefers cool, dry climates (15-25°C) and well-drained soils with good phosphorus and potassium content. Being a nitrogen-fixing legume, it requires less nitrogen fertilizer and actually improves soil fertility. Chickpea yields 1.5-2.5 tons per hectare and is drought-tolerant, requiring only 300-400mm annual rainfall.",
    
    "kidneybeans": "Kidney beans are an excellent choice for your farm! These legumes prefer moderate temperatures (18-24°C) and well-drained, fertile soils with good organic matter. They require high potassium levels and moderate phosphorus. Kidney beans fix nitrogen naturally, improving soil health. They yield 1.5-2 tons per hectare and need consistent moisture (400-500mm) during pod formation.",
    
    "pigeonpeas": "Pigeon peas are perfect for your conditions! This hardy, drought-tolerant crop thrives in warm climates (20-30°C) and can grow in marginal soils with low fertility. It requires high phosphorus levels and is excellent for intercropping. Pigeon peas are nitrogen-fixing legumes that improve soil fertility while yielding 1-2 tons per hectare. They're highly resilient to water stress, requiring only 200-1000mm annual rainfall.",
    
    "cotton": "Cotton is well-suited for your environmental conditions! This cash crop requires warm weather (21-35°C), full sunshine, and well-drained soils with moderate to high nitrogen levels. Cotton needs careful water management - moderate rainfall (500-1200mm) with dry periods during harvesting. It typically yields 400-600 kg of lint per hectare and requires 180-200 frost-free days for optimal growth.",
    
    "jute": "Jute, the 'Golden Fibre', is excellent for your humid conditions! This fiber crop thrives in hot, humid climates (24-35°C) with high rainfall (1500-2500mm). It grows best in fertile alluvial soils with good nitrogen content and slightly acidic pH. Jute is relatively low-maintenance, yields 2-4 tons of fiber per hectare, and provides good economic returns in textile markets.",
    
    "coffee": "Coffee cultivation could be ideal for your conditions! This plantation crop prefers moderate temperatures (18-25°C) with high humidity and well-distributed rainfall (1200-2000mm annually). Coffee thrives in well-drained, slightly acidic soils rich in organic matter. While it takes 3-4 years to establish, coffee can yield 500-800 kg per hectare for decades, providing long-term economic stability."
}

# ----------------- LOAD CROP MODEL -----------------
crop_model = None
disease_model = None
disease_classes = None
CROP_MODEL_PATH = os.path.join(MODELS_DIR, CROP_MODEL_FILE)
DISEASE_MODEL_PATH = os.path.join(MODELS_DIR, DISEASE_MODEL_FILE)
DISEASE_CLASSES_PATH = os.path.join(MODELS_DIR, DISEASE_CLASSES_FILE)

try:
    if os.path.exists(CROP_MODEL_PATH):
        crop_model = joblib.load(CROP_MODEL_PATH)
        print("✅ Crop suggestion model loaded successfully.")
    else:
        print(f"⚠️ Warning: Crop model not found at {CROP_MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading crop suggestion model: {e}")

# Lazy-load disease model when first used
image_transforms = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def load_disease_assets():
    global disease_model, disease_classes
    if disease_model is not None and disease_classes is not None:
        return disease_model, disease_classes
    
    try:
        if os.path.exists(DISEASE_MODEL_PATH) and os.path.exists(DISEASE_CLASSES_PATH):
            print(f"🔄 Loading disease model from {DISEASE_MODEL_PATH}")
            disease_model = torch.jit.load(DISEASE_MODEL_PATH, map_location="cpu")
            disease_model.eval()
            
            print(f"🔄 Loading disease classes from {DISEASE_CLASSES_PATH}")
            import json
            with open(DISEASE_CLASSES_PATH, "r", encoding="utf-8") as f:
                disease_classes = json.load(f)
            
            print(f"✅ Disease model loaded successfully with {len(disease_classes)} classes")
            return disease_model, disease_classes
        else:
            print(f"⚠️ Warning: Disease model or classes not found:")
            print(f"   Model: {DISEASE_MODEL_PATH} (exists: {os.path.exists(DISEASE_MODEL_PATH)})")
            print(f"   Classes: {DISEASE_CLASSES_PATH} (exists: {os.path.exists(DISEASE_CLASSES_PATH)})")
            return None, None
    except Exception as e:
        print(f"❌ Error loading disease model: {e}")
        import traceback
        traceback.print_exc()
        return None, None

# ----------------- ROUTES -----------------
@app.get("/")
def root():
    return {"message": "FarmPulse API is running", "endpoints": ["/suggest-crop", "/predict-crop", "/predict-disease"]}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "crop_model_loaded": crop_model is not None,
        "disease_model_loaded": disease_model is not None,
        "disease_classes_loaded": disease_classes is not None
    }

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

# Backward-compatible alias for frontend expecting /predict-crop
@app.post("/predict-crop")
async def predict_crop_alias(input_data: CropInput):
    return await suggest_crop(input_data)

# ----------------- DISEASE PREDICTION -----------------
@app.post("/predict-disease")
async def predict_disease(files: List[UploadFile] = File(...)):
    try:
        # Load disease assets if not already loaded
        current_model, current_classes = load_disease_assets()
        
        # Check if models are available
        if current_model is None:
            raise HTTPException(
                status_code=503, 
                detail="Disease model is not loaded. Model file might be missing from backend/models/disease_model.pt"
            )
        
        if current_classes is None:
            raise HTTPException(
                status_code=503, 
                detail="Disease classes not loaded. Classes file might be missing from backend/models/disease_classes.json"
            )
        
        if not files:
            raise HTTPException(status_code=400, detail="No files provided")
        
        results = []
        for file in files:
            if not file.content_type or not file.content_type.startswith('image/'):
                results.append({
                    "filename": file.filename,
                    "error": "File is not an image",
                    "label": None,
                    "confidence": 0.0
                })
                continue
                
            try:
                content = await file.read()
                if len(content) == 0:
                    raise ValueError("Empty file")
                    
                image = Image.open(BytesIO(content)).convert("RGB")
                tensor = image_transforms(image).unsqueeze(0)
                
                with torch.no_grad():
                    logits = current_model(tensor)
                    probs = torch.softmax(logits, dim=1)[0]
                    conf, idx = torch.max(probs, dim=0)
                
                results.append({
                    "filename": file.filename,
                    "label": current_classes[int(idx)],
                    "confidence": float(conf)
                })
                
            except Exception as file_error:
                results.append({
                    "filename": file.filename,
                    "error": f"Failed to process image: {str(file_error)}",
                    "label": None,
                    "confidence": 0.0
                })
        
        return {"predictions": results}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Disease prediction error: {e}")  # Log the error
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error during disease prediction: {str(e)}"
        )

# Preload disease assets on server startup
print("🔄 Preloading disease prediction assets...")
load_disease_assets()
if disease_model is not None and disease_classes is not None:
    print(f"✅ Disease prediction ready with {len(disease_classes)} classes")
else:
    print("⚠️ Disease prediction models not loaded - check model files")

# ----------------- RUN SERVER -----------------
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FarmPulse API server...")
    print("🔗 Server will be available at: http://localhost:8000")
    print("📝 API Documentation: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
