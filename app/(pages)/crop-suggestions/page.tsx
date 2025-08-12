// components/CropSuggestionForm.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Suggestion {
  cropName: string;
  profitability: string;
  marketValue: string;
  riskLevel: string;
  reasoning: string;
}

export default function CropSuggestionForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
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

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

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
    <div className="py-12 md:py-24 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full mx-auto p-4 md:p-6 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl md:text-3xl text-lime-500 font-bold mb-6 text-center">FarmPulse Crop Suggestion</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(form).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <Input
                name={key}
                placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                value={value}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Loading..." : "Get Crop Suggestions"}
            </Button>
          </div>
        </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-8 space-y-4 md:space-y-6">
          <h2 className="text-xl font-semibold">🌱 Recommended Crops:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((sug, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-lime-600 mb-2">{sug.cropName}</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Profitability:</strong> <span className={`px-2 py-1 rounded text-xs ${
                    sug.profitability === 'High' ? 'bg-green-100 text-green-800' :
                    sug.profitability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{sug.profitability}</span></p>
                  <p><strong>Market Value:</strong> {sug.marketValue}</p>
                  <p><strong>Risk Level:</strong> <span className={\`px-2 py-1 rounded text-xs ${
                    sug.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                    sug.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{sug.riskLevel}</span></p>
                  <p><strong>Reasoning:</strong> {sug.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
}
