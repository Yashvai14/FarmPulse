// components/CropSuggestionForm.tsx
"use client";
import { useState } from "react";
import NavBar from "@/components/navBar";

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
    <>
    <NavBar />
    <div className=" py-24 flex items-center justify-center" >
    <div className="max-w-6xl w-full  mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl text-lime-500 font-bold mb-6 text-center">FarmPulse Crop Suggestion</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center items-center">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)} style={{width: "50%"}}
            value={value}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
        ))}
        <div>
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600"
        >
          {loading ? "Loading..." : "Get Crop Suggestions"}
        </button>
        </div>
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
    </div>
    </>
  );
}
