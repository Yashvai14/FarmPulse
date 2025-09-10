'use client';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import NavBar from '@/components/navBar';

type PredictionResult = {
  disease: string;
  confidence: number;
  remedy: string;
};

type LanguageOption = {
  code: string;
  name: string;
  flag: string;
};

const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' }
];

export default function PredictorPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('Image size should be less than 5MB');
      return false;
    }
    
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && validateImageFile(file)) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('files', selectedImage);
    
    try {
      const response = await axios.post('http://localhost:8000/predict-disease', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });
      // Transform the new API response format to match the expected format
      const apiResponse = response.data;
      if (apiResponse.predictions && apiResponse.predictions.length > 0) {
        const prediction = apiResponse.predictions[0]; // Take the first prediction
        setResult({
          disease: prediction.label.replace(/_/g, ' '),
          confidence: Math.round(prediction.confidence * 100),
          remedy: prediction.label.toLowerCase().includes('healthy') 
            ? 'Your plant appears healthy! Continue with regular care and monitoring.'
            : 'Disease detected. Consider consulting an agricultural expert and applying appropriate treatment.'
        });
      } else {
        throw new Error('No predictions received from the API');
      }
    } catch (error: any) {
      console.error('Prediction error:', error);
      let errorMessage = 'Failed to analyze the image. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please try again.';
      } else if (error.response?.status === 404) {
        errorMessage += 'AI service not available. Please check if the backend is running.';
      } else if (error.response?.status >= 500) {
        errorMessage += 'Server error. Please try again later.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      setResult({
        disease: 'Error',
        confidence: 0,
        remedy: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
                <div className="bg-emerald-100 p-3 lg:p-4 rounded-2xl">
                  <span className="text-3xl lg:text-4xl">🌿</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-emerald-600 font-bold mb-4">Crop Disease Detector</h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                    Upload an image of your crop to get AI-powered disease detection and treatment recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Upload Section */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-emerald-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-emerald-700 mb-2">
                    Upload Crop Image
                  </h2>
                  <p className="text-gray-600">
                    Take a clear photo of the affected plant or leaf for accurate analysis.
                  </p>
                </div>

                {/* Drag and Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-emerald-400 bg-emerald-50'
                      : preview
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-300 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto max-w-md">
                        <Image
                          src={preview}
                          alt="Uploaded crop image"
                          width={400}
                          height={300}
                          className="rounded-lg shadow-md w-full h-auto"
                        />
                        <button
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-green-600 font-medium">
                        ✓ Image uploaded successfully
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-6xl text-gray-400">🇺🇵🗁️</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Drag & drop your image here
                        </h3>
                        <p className="text-gray-500 mb-4">or click to browse files</p>
                        <label className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-colors inline-block">
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="text-xs text-gray-400">
                        Supported formats: JPEG, PNG, WebP (Max 5MB)
                      </div>
                    </div>
                  )}
                </div>

                {/* Language Selection */}
                <div className="mt-6">
                  <label className="block text-gray-700 font-semibold mb-3">
                    🌐 Select Language for Results:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Analyze Button */}
                <div className="mt-8">
                  <button
                    onClick={handlePredict}
                    disabled={!selectedImage || loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <span>🔍</span>
                        Detect Disease
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-emerald-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-emerald-700 mb-2">
                    Analysis Results
                  </h2>
                  <p className="text-gray-600">
                    AI-powered disease detection and treatment recommendations.
                  </p>
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
                    <div className="text-lg font-medium text-emerald-600">Analyzing your crop image...</div>
                    <div className="text-sm text-gray-500">This may take a few moments</div>
                  </div>
                )}

                {!loading && !result && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-6xl text-gray-300 mb-4">🌿</div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Ready for Analysis</h3>
                    <p className="text-gray-500">
                      Upload an image and click "Detect Disease" to get started.
                    </p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    {result.disease === 'Error' ? (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">❌</span>
                          <h3 className="text-lg font-semibold text-red-800">Analysis Failed</h3>
                        </div>
                        <p className="text-red-700">{result.remedy}</p>
                      </div>
                    ) : (
                      <>
                        {/* Disease Detection */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-emerald-100 p-3 rounded-full">
                              <span className="text-2xl">🔬</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-emerald-800">
                                Detected: {result.disease}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                                  {getConfidenceText(result.confidence)}
                                </span>
                                <span className="text-gray-600">{result.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Treatment Recommendations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <span className="text-2xl">📝</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-800">
                              Treatment Recommendations
                            </h3>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-gray-700 leading-relaxed">{result.remedy}</p>
                          </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <p className="text-yellow-800 text-sm flex items-center gap-2">
                            <span>⚠️</span>
                            <strong>Disclaimer:</strong> This AI analysis is for guidance only. For severe infestations or critical crops, please consult with agricultural experts or local extension services.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
