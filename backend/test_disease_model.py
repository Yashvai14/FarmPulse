#!/usr/bin/env python3
"""
Quick test script to verify disease model loading
"""
import os
import torch
import json

# Test model loading
MODEL_PATH = "models/disease_model.pt"
CLASSES_PATH = "models/disease_classes.json"

print("🔍 Testing disease model loading...")
print(f"Current directory: {os.getcwd()}")
print(f"Model file exists: {os.path.exists(MODEL_PATH)}")
print(f"Classes file exists: {os.path.exists(CLASSES_PATH)}")

if os.path.exists(MODEL_PATH) and os.path.exists(CLASSES_PATH):
    try:
        print("📦 Loading model...")
        model = torch.jit.load(MODEL_PATH, map_location="cpu")
        model.eval()
        print("✅ Model loaded successfully")
        
        print("📦 Loading classes...")
        with open(CLASSES_PATH, "r", encoding="utf-8") as f:
            classes = json.load(f)
        print(f"✅ Classes loaded successfully: {len(classes)} classes")
        
        # Test prediction with dummy data
        print("🧪 Testing dummy prediction...")
        dummy_input = torch.randn(1, 3, 224, 224)
        with torch.no_grad():
            logits = model(dummy_input)
            probs = torch.softmax(logits, dim=1)[0]
            conf, idx = torch.max(probs, dim=0)
            
        print(f"✅ Test prediction successful:")
        print(f"   Predicted class: {classes[int(idx)]}")
        print(f"   Confidence: {float(conf):.4f}")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
else:
    print("❌ Model or classes file not found")
    
print("🏁 Test complete")
