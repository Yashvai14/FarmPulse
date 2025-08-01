// components/CropSuggestionForm.tsx
"use client";
import { useState } from "react";

interface Suggestion {
  cropName: string;
  profitability: string;
  marketValue: string;
  riskLevel: string;
  reasoning: string;
}

export default function CropSuggestionForm() {
  const [form, setForm] = useState({
    location: "",
    soil: "",
    month: "",
    waterSource: "",
    experience: "",
    budget: "",
    cropType: "",
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]);
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/openai-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data.result)) {
        setSuggestions(data.result);
      } else {
        setError("❌ Could not fetch valid suggestions.");
      }
    } catch (err) {
      setError("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">🌾 FarmPulse Crop Suggestion</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
        ))}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Loading..." : "Get Crop Suggestions"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">🌱 Recommended Crops:</h2>
          {suggestions.map((sug, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50">
              <p><strong>Crop Name:</strong> {sug.cropName}</p>
              <p><strong>Profitability:</strong> {sug.profitability}</p>
              <p><strong>Market Value:</strong> {sug.marketValue}</p>
              <p><strong>Risk Level:</strong> {sug.riskLevel}</p>
              <p><strong>Reasoning:</strong> {sug.reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
