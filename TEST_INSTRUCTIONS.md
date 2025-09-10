# 🧪 Disease Prediction Test Instructions

## ✅ **Current Status**
- ✅ Backend server running with disease model loaded
- ✅ API endpoints working (tested with Python script)
- ✅ 14 disease classes available for prediction
- ✅ Frontend updated with better error handling
- ✅ **FIXED**: Both `/disease-prediction` and `/predictor` pages now use correct `/predict-disease` endpoint

## 🚀 **Testing Steps**

### 1. **Ensure Backend is Running**
```powershell
# In Terminal 1 (Backend)
cd "C:\Users\AdmiN\OneDrive\Desktop\v\farmpulse\backend"
.\venv\Scripts\Activate.ps1
python main.py

# You should see:
# ✅ Disease prediction ready with 14 classes
# INFO: Uvicorn running on http://0.0.0.0:8000
```

### 2. **Start Frontend**
```powershell
# In Terminal 2 (Frontend)
cd "C:\Users\AdmiN\OneDrive\Desktop\v\farmpulse"
npm run dev

# You should see:
# ✓ Ready in X.Xs
# - Local: http://localhost:3000
```

### 3. **Test Disease Prediction**
You can test on either page:

**Option A - Multiple Images Page:**
1. Open: http://localhost:3000/disease-prediction
2. Upload ANY images (plant or not - model will still make predictions)
3. Click "Analyze Images"
4. Check browser console (F12 → Console) for detailed logs

**Option B - Single Image Page:**
1. Open: http://localhost:3000/predictor
2. Upload a single image 
3. Click "Detect Disease"
4. See result immediately

### 4. **Expected Results**
If working correctly, you should see:
```
Console logs:
- "Checking backend connectivity..."
- "Backend health: {status: 'healthy', disease_model_loaded: true}"
- "Starting disease analysis..."
- "API Response: {predictions: [...]}"

On page:
- Analysis results showing predicted disease class
- Confidence percentage
- Treatment recommendations
```

### 5. **If Still Not Working - Debug Steps**

#### Check Backend Health Directly:
Visit: http://localhost:8000/health
Should return:
```json
{
  "status": "healthy",
  "crop_model_loaded": true,
  "disease_model_loaded": true,
  "disease_classes_loaded": true
}
```

#### Check CORS Issues:
- Make sure both servers are running
- Try refreshing the page (Ctrl+F5)
- Check if there are CORS errors in browser console

#### Test API Directly:
```powershell
cd backend
python test_api.py
```
Should show: "🎉 All tests passed! Disease prediction is working."

## 🔧 **Common Issues & Solutions**

### Issue: "Backend connection failed"
**Solution**: 
- Make sure backend is running on port 8000
- Check firewall/antivirus blocking the port
- Try: `netstat -an | findstr :8000` (should show LISTENING)

### Issue: "Disease model not loaded"
**Solution**:
- Restart backend server
- Check that disease_model.pt and disease_classes.json exist in backend/models/
- Verify with: `python test_disease_model.py`

### Issue: Frontend shows old cached error
**Solution**:
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Try incognito mode

## 🎯 **If Everything Fails**
Run this complete restart sequence:

```powershell
# Stop all Python processes
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start backend fresh
cd "C:\Users\AdmiN\OneDrive\Desktop\v\farmpulse\backend"
.\venv\Scripts\Activate.ps1
python main.py
```

Then in a new terminal:
```powershell
# Start frontend
cd "C:\Users\AdmiN\OneDrive\Desktop\v\farmpulse"
npm run dev
```

## 📞 **Support**
If you're still having issues:
1. Check the console logs in browser (F12)
2. Check backend terminal for error messages  
3. Run `python test_api.py` to verify backend API works
4. Share any error messages you see

**The disease prediction should now work!** 🎉
