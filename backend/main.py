from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from keras.models import load_model
from PIL import Image
import numpy as np
import json
import io
from googletrans import Translator

app = FastAPI()

origins = ["*"]  # You can restrict this in prod

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("./model/mobilenetv2_disease_model.h5")
translator = Translator()

with open("remedies.json", "r", encoding="utf-8") as f:
    remedies = json.load(f)

labels = list(remedies["en"].keys())

def predict_disease(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    predictions = model.predict(image)[0]
    idx = np.argmax(predictions)
    confidence = round(float(predictions[idx]) * 100, 2)
    return labels[idx], confidence

@app.post("/predict")
async def predict(file: UploadFile = File(...), language: str = Form("en")):
    img_bytes = await file.read()
    disease, confidence = predict_disease(img_bytes)
    remedy = remedies.get(language, {}).get(disease, "No remedy found")

    return {
        "disease": disease,
        "confidence": confidence,
        "remedy": remedy
    }
