'use client';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import NavBar from '@/components/navBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PredictorPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('language', language);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      setResult(response.data);
    } catch (error) {
      alert('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl text-lime-500 font-bold mb-6 text-center">🌿 Crop Disease Predictor</h2>
      
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Plant Image
            </label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="w-full"
            />
          </div>

          {preview && (
            <div className="mb-6 flex justify-center">
              <Image
                src={preview}
                alt="Uploaded"
                width={400}
                height={300}
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <label className="font-semibold text-sm md:text-base">🌐 Select Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border px-3 py-2 rounded-md w-full md:w-auto"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="te">Telugu</option>
            </select>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              onClick={handlePredict}
              disabled={loading || !selectedImage}
              className="w-full md:w-auto"
            >
              {loading ? 'Analyzing...' : 'Predict Disease'}
            </Button>
          </div>

          {result && (
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Analysis Results</h3>
              <div className="space-y-2">
                <p><strong>Disease:</strong> <span className="text-red-600">{result.disease}</span></p>
                <p><strong>Confidence:</strong> <span className="text-blue-600">{result.confidence}%</span></p>
                <p><strong>Remedy:</strong> <span className="text-green-600">{result.remedy}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
