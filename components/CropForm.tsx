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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/suggest-crop", {
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
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to fetch crop suggestion" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center  text-black ">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          🌱 Crop Suggestion Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-gray-700  font-medium capitalize mb-1">
                {key}
              </label>
              <input
                type="number"
                name={key}
                value={formData[key as keyof FormData]}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {loading ? "Loading..." : "Suggest Crop"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg">
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <>
                <p className="text-lg font-bold text-green-800">
                  Suggested Crop: {result.crop}
                </p>
                <p className="text-gray-700">{result.reason}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
