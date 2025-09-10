'use client';

import React, { useState, useRef } from 'react';
import NavBar from '@/components/navBar';
import { detectDisease } from '@/lib/api';
import { Upload, Camera, X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface PredictionResult {
  filename: string;
  label: string;
  confidence: number;
}

interface AnalysisResult {
  predictions: PredictionResult[];
}

export default function DiseasePredictionPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select valid image files (JPG, PNG, WEBP)');
      return;
    }

    setSelectedFiles(prev => [...prev, ...imageFiles]);
    
    // Create preview URLs
    imageFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
    
    setError('');
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeImages = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResults(null);

    // First check if backend is reachable
    try {
      console.log('Checking backend connectivity...');
      const healthResponse = await fetch('http://localhost:8000/health');
      if (!healthResponse.ok) {
        throw new Error(`Backend not accessible (${healthResponse.status})`);
      }
      const healthData = await healthResponse.json();
      console.log('Backend health:', healthData);
      
      if (!healthData.disease_model_loaded) {
        throw new Error('Disease model not loaded in backend');
      }
    } catch (healthError) {
      console.error('Backend connectivity check failed:', healthError);
      setError(`Backend connection failed: ${healthError.message}. Please ensure the backend server is running on port 8000.`);
      setIsAnalyzing(false);
      return;
    }

    try {
      console.log('Starting disease analysis...');
      console.log('Files to analyze:', selectedFiles.map(f => f.name));
      
      const result = await detectDisease(selectedFiles);
      console.log('API Response:', result);
      
      setResults(result);
      setError(''); // Clear any previous errors
    } catch (err: unknown) {
      console.error('Disease prediction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Analysis failed: ${errorMessage}. Please check if the backend is running.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setResults(null);
    setError('');
  };

  const getDiseaseInfo = (label: string) => {
    const isHealthy = label.toLowerCase().includes('healthy');
    
    if (isHealthy) {
      return {
        severity: 'healthy',
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        recommendation: 'Your plant appears healthy! Continue with regular care and monitoring.'
      };
    } else {
      return {
        severity: 'disease',
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        recommendation: 'Disease detected. Consider consulting an agricultural expert and applying appropriate treatment.'
      };
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 lg:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
                <div className="bg-green-100 p-3 lg:p-4 rounded-2xl">
                  <span className="text-3xl lg:text-4xl">🔬</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-green-600 font-bold mb-4">
                    Plant Disease Detection
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                    Upload images of your plants to detect diseases using advanced AI technology.
                    Get instant analysis and treatment recommendations.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100 mb-8">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Upload Plant Images</h2>
                
                <div 
                  className="border-2 border-dashed border-green-300 rounded-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 hover:border-green-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg text-gray-600 mb-2">
                    Click to upload or drag and drop images
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Supports JPG, PNG, WEBP files • Max 10MB per file
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold px-4 sm:px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 sm:w-5 h-4 sm:h-5" />
                    Select Images
                  </button>
                  
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 sm:px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 sm:w-5 h-4 sm:h-5" />
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Image Previews */}
              {selectedFiles.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                    Selected Images ({selectedFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {selectedFiles[index].name}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={analyzeImages}
                      disabled={isAnalyzing}
                      className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 sm:mx-auto"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Analyze Images
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {results && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  Analysis Results
                </h2>
                
                <div className="space-y-6">
                  {results.predictions.map((prediction, index) => {
                    const diseaseInfo = getDiseaseInfo(prediction.label);
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={previewUrls[index]}
                            alt={prediction.filename}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {diseaseInfo.icon}
                              <h3 className="text-lg font-semibold text-gray-800">
                                {prediction.filename}
                              </h3>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-600">Detected Condition:</p>
                                <p className="text-lg font-medium text-gray-800">
                                  {prediction.label.replace(/_/g, ' ')}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600">Confidence:</p>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        prediction.confidence > 0.7 
                                          ? 'bg-green-500' 
                                          : prediction.confidence > 0.5 
                                          ? 'bg-yellow-500' 
                                          : 'bg-red-500'
                                      }`}
                                      style={{ width: `${prediction.confidence * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {(prediction.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className={`p-4 rounded-lg ${
                                diseaseInfo.severity === 'healthy' 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-red-50 border border-red-200'
                              }`}>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Recommendation:
                                </p>
                                <p className="text-sm text-gray-600">
                                  {diseaseInfo.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600">
                    <strong>Disclaimer:</strong> This AI analysis is for reference only. 
                    For accurate diagnosis and treatment, please consult with agricultural experts 
                    or plant pathologists.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
