"use client";
import { useState } from "react";

type FormData = {
  N: string;
  P: string;
  K: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
};

type FieldInfo = {
  label: string;
  placeholder: string;
  tooltip: string;
  unit: string;
  min: number;
  max: number;
  icon: string;
};

const fieldInfoMap: Record<keyof FormData, FieldInfo> = {
  N: {
    label: "Nitrogen (N)",
    placeholder: "Enter nitrogen content",
    tooltip: "Nitrogen content in the soil (0-140 ppm). Essential for leaf growth and green color.",
    unit: "ppm",
    min: 0,
    max: 140,
    icon: "🍃"
  },
  P: {
    label: "Phosphorus (P)",
    placeholder: "Enter phosphorus content",
    tooltip: "Phosphorus content in the soil (5-145 ppm). Important for root development and flowering.",
    unit: "ppm",
    min: 5,
    max: 145,
    icon: "🌿"
  },
  K: {
    label: "Potassium (K)",
    placeholder: "Enter potassium content",
    tooltip: "Potassium content in the soil (5-205 ppm). Helps with disease resistance and water regulation.",
    unit: "ppm",
    min: 5,
    max: 205,
    icon: "⚡"
  },
  temperature: {
    label: "Temperature",
    placeholder: "Enter average temperature",
    tooltip: "Average temperature in Celsius (8-45°C). Affects crop growth rate and development.",
    unit: "°C",
    min: 8,
    max: 45,
    icon: "🌡️"
  },
  humidity: {
    label: "Humidity",
    placeholder: "Enter humidity percentage",
    tooltip: "Relative humidity percentage (14-100%). Affects plant transpiration and disease susceptibility.",
    unit: "%",
    min: 14,
    max: 100,
    icon: "💧"
  },
  ph: {
    label: "Soil pH",
    placeholder: "Enter soil pH value",
    tooltip: "Soil pH level (3.5-9.9). Affects nutrient availability to plants.",
    unit: "pH",
    min: 3.5,
    max: 9.9,
    icon: "⚗️"
  },
  rainfall: {
    label: "Rainfall",
    placeholder: "Enter annual rainfall",
    tooltip: "Annual rainfall in millimeters (20-3000mm). Critical for crop water requirements.",
    unit: "mm",
    min: 20,
    max: 3000,
    icon: "🌧️"
  }
};

type CropResult = {
  crop?: string;
  reason?: string;
  error?: string;
};

export default function CropForm() {
  const [formData, setFormData] = useState<FormData>({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [result, setResult] = useState<CropResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const validateField = (name: keyof FormData, value: string): string | null => {
    if (!value.trim()) return "This field is required";
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Please enter a valid number";
    
    const fieldInfo = fieldInfoMap[name];
    if (numValue < fieldInfo.min || numValue > fieldInfo.max) {
      return `Value should be between ${fieldInfo.min} and ${fieldInfo.max} ${fieldInfo.unit}`;
    }
    
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
    
    // Real-time validation
    if (value.trim()) {
      const error = validateField(name as keyof FormData, value);
      if (error) {
        setErrors({ ...errors, [name]: error });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormData] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/suggest-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: parseFloat(formData.N),
          P: parseFloat(formData.P),
          K: parseFloat(formData.K),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          ph: parseFloat(formData.ph),
          rainfall: parseFloat(formData.rainfall),
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Crop suggestion API error:', err);
      let errorMessage = "Failed to get crop recommendation. ";
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        errorMessage += "Please make sure the backend server is running on http://localhost:8000. ";
        errorMessage += "Start it by running 'python main.py' in the backend folder.";
      } else if (err.message.includes('NetworkError')) {
        errorMessage += "Network connection issue. Please check your internet connection and try again.";
      } else {
        errorMessage += "An unexpected error occurred. Please try again later.";
      }
      
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-2xl mr-4">
              <span className="text-4xl">🌱</span>
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl text-green-600 font-bold mb-4">AI Crop Advisor</h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Get intelligent crop recommendations based on your soil and environmental conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Enter Your Farm Conditions
            </h2>
            <p className="text-gray-600">
              Provide accurate soil and environmental data for the best crop recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData).map(([key, value]) => {
                const fieldInfo = fieldInfoMap[key as keyof FormData];
                const hasError = errors[key as keyof FormData];
                
                return (
                  <div key={key} className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{fieldInfo.icon}</span>
                      <label className="block text-gray-700 font-semibold">
                        {fieldInfo.label}
                      </label>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        onMouseEnter={() => setShowTooltip(key)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        ℹ️
                      </button>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="number"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        placeholder={fieldInfo.placeholder}
                        step="0.1"
                        min={fieldInfo.min}
                        max={fieldInfo.max}
                        className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-colors text-lg ${
                          hasError 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-green-200 focus:border-green-500'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        {fieldInfo.unit}
                      </div>
                    </div>
                    
                    {hasError && (
                      <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
                        <span>⚠️</span>
                        {hasError}
                      </p>
                    )}
                    
                    {showTooltip === key && (
                      <div className="absolute z-10 bg-gray-800 text-white p-3 rounded-lg text-sm max-w-xs top-full mt-2 left-0 shadow-lg">
                        {fieldInfo.tooltip}
                        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                      </div>
                    )}
                    
                    <div className="mt-1 text-xs text-gray-500">
                      Range: {fieldInfo.min} - {fieldInfo.max} {fieldInfo.unit}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🌾</span>
                    Get Crop Recommendation
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              {result.error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">❌</span>
                    <h3 className="text-lg font-semibold text-red-800">Error</h3>
                  </div>
                  <p className="text-red-700">{result.error}</p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-lime-50 border border-green-200 rounded-xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 p-3 rounded-full">
                      <span className="text-3xl">🌾</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-800">
                        Recommended Crop: {result.crop}
                      </h3>
                      <p className="text-green-600">Based on your soil and environmental conditions</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-green-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span>💡</span>
                      Why this crop?
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{result.reason}</p>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-blue-800 text-sm flex items-center gap-2">
                      <span>📝</span>
                      <strong>Note:</strong> This recommendation is based on AI analysis of your inputs. Consider local market conditions and consult with agricultural experts for best results.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
