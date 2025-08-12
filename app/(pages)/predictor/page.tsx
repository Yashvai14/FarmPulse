'use client';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🌿 Crop Disease Predictor</h2>
      
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />

      {preview && (
        <Image
          src={preview}
          alt="Uploaded"
          width={400}
          height={300}
          className="rounded-lg mb-4"
        />
      )}

      <div className="flex gap-4 items-center mb-4">
        <label className="font-semibold">🌐 Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="te">Telugu</option>
        </select>
      </div>

      <button
        onClick={handlePredict}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Predict Disease'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <p><strong>Disease:</strong> {result.disease}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
          <p><strong>Remedy:</strong> {result.remedy}</p>
        </div>
      )}
    </div>
  );
}
