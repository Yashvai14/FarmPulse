# 🌾 Crop Suggestion Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to get crop recommendation" Error

**Symptoms:**
- Red error message appears after clicking "Get Crop Recommendation"
- Message says "Please make sure the backend server is running"

**Solution:**
```bash
# Step 1: Navigate to backend folder
cd backend

# Step 2: Start the backend server
# Option A: Use the automated script
start_server.bat

# Option B: Manual start
python main.py

# Step 3: Verify server is running
# You should see: "🚀 Starting Crop Suggestion API server..."
# Server should be available at: http://localhost:8000
```

### Issue 2: Backend Server Won't Start

**Symptoms:**
- Error when running `python main.py`
- Missing modules or dependencies

**Solution:**
```bash
# Step 1: Check Python installation
python --version
# Should show Python 3.8 or higher

# Step 2: Create/activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Retrain the model if needed
python train_crop_model.py

# Step 5: Start the server
python main.py
```

### Issue 3: API Returns Wrong Predictions

**Symptoms:**
- Server runs but gives unexpected crop recommendations
- Low confidence in predictions

**Solution:**
```bash
# Step 1: Retrain the model with fresh data
cd backend
python train_crop_model.py

# Step 2: Test the API
python test_api.py

# Step 3: Check model accuracy
# The training script should show 100% accuracy with current dataset
```

### Issue 4: CORS (Cross-Origin) Errors

**Symptoms:**
- Browser console shows CORS errors
- Network requests blocked

**Solution:**
The backend is configured to allow requests from localhost:3000, but if you're running on different ports:

1. Update `main.py` FRONTEND_ORIGINS:
```python
FRONTEND_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",  # Add your port
    "http://127.0.0.1:3000",
]
```

### Issue 5: Form Validation Errors

**Symptoms:**
- Red warning messages under input fields
- "Value should be between X and Y" errors

**Solution:**
Check that your input values are within the valid ranges:

| Field | Min | Max | Unit |
|-------|-----|-----|------|
| Nitrogen (N) | 0 | 140 | ppm |
| Phosphorus (P) | 5 | 145 | ppm |
| Potassium (K) | 5 | 205 | ppm |
| Temperature | 8 | 45 | °C |
| Humidity | 14 | 100 | % |
| Soil pH | 3.5 | 9.9 | pH |
| Rainfall | 20 | 3000 | mm |

## 🧪 Testing the System

### Test 1: Backend Health Check
```bash
# Navigate to backend folder
cd backend

# Run test script
python test_api.py
```

**Expected Output:**
```
✅ Server is running and responsive
🌾 Recommended Crop: Rice
💡 Reason: Rice is ideal for your conditions! ...
```

### Test 2: Manual API Test
Use these sample values in the frontend form:

**Rice Test Data:**
- Nitrogen: 90
- Phosphorus: 42
- Potassium: 43
- Temperature: 20.8
- Humidity: 82
- pH: 6.5
- Rainfall: 202

**Expected Result:** Rice

**Wheat Test Data:**
- Nitrogen: 85
- Phosphorus: 58
- Potassium: 41
- Temperature: 22.5
- Humidity: 80
- pH: 6.2
- Rainfall: 190

**Expected Result:** Wheat

### Test 3: Check Network Connection
1. Open browser developer tools (F12)
2. Go to Network tab
3. Submit the form
4. Look for POST request to `localhost:8000/suggest-crop`
5. Check if request is successful (200 status)

## 📊 Understanding the AI Model

### Model Information
- **Algorithm:** Random Forest Classifier
- **Features:** 7 (N, P, K, temperature, humidity, pH, rainfall)
- **Crops:** 9 (Rice, Wheat, Maize, Cotton, Chickpea, Kidney Beans, Pigeon Peas, Jute, Coffee)
- **Training Data:** 27 samples (3 per crop)
- **Accuracy:** 100% on test set

### Feature Importance (typical order):
1. Nitrogen (N) - 16.8%
2. Rainfall - 16.5%
3. Phosphorus (P) - 16.1%
4. Potassium (K) - 15.1%
5. Humidity - 12.9%
6. Temperature - 11.9%
7. pH - 10.7%

## 🔧 Advanced Troubleshooting

### Check Log Files
```bash
# Check if server is running on correct port
netstat -an | findstr :8000

# If port is in use by another application
# Kill the process or use a different port
```

### Modify Server Port (if needed)
In `main.py`, change:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)  # Changed from 8000 to 8001
```

Then update frontend `CropForm.tsx`:
```typescript
const res = await fetch("http://localhost:8001/suggest-crop", {  // Changed port
```

### Reinstall Dependencies
If you're having persistent issues:
```bash
# Remove virtual environment
rm -rf venv  # macOS/Linux
rmdir /s venv  # Windows

# Create fresh environment
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python train_crop_model.py
python main.py
```

## 📞 Still Need Help?

If none of these solutions work:

1. **Check the README.md** for general setup instructions
2. **Verify system requirements:**
   - Python 3.8+
   - Node.js 18+
   - All dependencies installed

3. **Create an issue** with the following information:
   - Operating system
   - Python version (`python --version`)
   - Error messages (full text)
   - Steps you've already tried

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Backend server starts without errors
- ✅ API test script shows successful responses
- ✅ Frontend form accepts valid inputs
- ✅ Crop recommendations appear with detailed descriptions
- ✅ No console errors in browser developer tools

**Happy farming! 🌾**
