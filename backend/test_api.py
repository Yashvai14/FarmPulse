#!/usr/bin/env python3
"""
Test script for the crop suggestion API
"""
#!/usr/bin/env python3
"""
Test the disease prediction API directly
"""
import requests
import json
from pathlib import Path
from PIL import Image
import io

def test_health_endpoint():
    """Test the health endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Health endpoint working")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Crop model loaded: {data.get('crop_model_loaded', False)}")
            print(f"   Disease model loaded: {data.get('disease_model_loaded', False)}")
            print(f"   Disease classes loaded: {data.get('disease_classes_loaded', False)}")
            return data.get('disease_model_loaded', False)
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False

def create_test_image():
    """Create a simple test image"""
    # Create a simple 224x224 test image
    img = Image.new('RGB', (224, 224), color='green')
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    return img_bytes

def test_disease_prediction():
    """Test the disease prediction endpoint"""
    print("🔬 Testing disease prediction endpoint...")
    
    try:
        # Create test image
        test_image = create_test_image()
        
        # Prepare files for upload
        files = {
            'files': ('test_plant.jpg', test_image, 'image/jpeg')
        }
        
        # Make API call
        response = requests.post(
            "http://localhost:8000/predict-disease", 
            files=files,
            timeout=30
        )
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Disease prediction API working!")
            print("Response:")
            print(json.dumps(data, indent=2))
            return True
        else:
            print(f"❌ Disease prediction failed: {response.status_code}")
            print("Response text:", response.text)
            return False
            
    except Exception as e:
        print(f"❌ Disease prediction error: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Testing FarmPulse Disease Prediction API")
    print("=" * 50)
    
    # Test health endpoint first
    health_ok = test_health_endpoint()
    
    print()
    
    if not health_ok:
        print("⚠️ Disease model not loaded in backend - predictions will fail")
        print("💡 Restart the backend server to load the models")
        return
    
    # Test disease prediction
    prediction_ok = test_disease_prediction()
    
    print()
    print("=" * 50)
    if health_ok and prediction_ok:
        print("🎉 All tests passed! Disease prediction is working.")
    else:
        print("❌ Some tests failed. Check the backend server.")

if __name__ == "__main__":
    main()
import json

def test_crop_suggestion_api():
    """Test the crop suggestion endpoint"""
    
    # API endpoint
    url = "http://localhost:8000/suggest-crop"
    
    # Test data - Rice-like conditions
    test_data = {
        "N": 90,
        "P": 42,
        "K": 43,
        "temperature": 20.8,
        "humidity": 82,
        "ph": 6.5,
        "rainfall": 202
    }
    
    print("🧪 Testing Crop Suggestion API")
    print(f"📡 Endpoint: {url}")
    print(f"📊 Test data: {json.dumps(test_data, indent=2)}")
    print("\n" + "="*50)
    
    try:
        # Make the request
        response = requests.post(url, json=test_data, timeout=10)
        
        print(f"📈 Response Status: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success! API Response:")
            print(f"   🌾 Recommended Crop: {result.get('crop', 'N/A')}")
            print(f"   💡 Reason: {result.get('reason', 'N/A')}")
        else:
            print(f"❌ Error Response:")
            print(f"   Status: {response.status_code}")
            print(f"   Body: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Could not connect to the API server.")
        print("💡 Make sure the backend server is running on http://localhost:8000")
        print("   Run: cd backend && python main.py")
        
    except requests.exceptions.Timeout:
        print("⏰ Timeout Error: API took too long to respond")
        
    except Exception as e:
        print(f"🐛 Unexpected Error: {e}")

def test_server_health():
    """Test if the server is running"""
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running and responsive")
            return True
    except:
        print("❌ Server is not running or not accessible")
        return False

if __name__ == "__main__":
    print("🔍 FarmPulse API Test Suite")
    print("="*50)
    
    # Test 1: Server health check
    print("\n1️⃣ Testing server health...")
    if test_server_health():
        print("\n2️⃣ Testing crop suggestion endpoint...")
        test_crop_suggestion_api()
    else:
        print("\n💡 To start the server:")
        print("   cd backend")
        print("   python main.py")
