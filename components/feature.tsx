'use client'

import { useState } from "react";

const features = [
  {
    title: " Hyperlocal Weather Intelligence",
    description: "Get real-time weather updates, rain forecasts, and alerts based on your exact farm location to help you make better decisions.",
  },
  {
    title: " Profit-Based Crop Suggestions",
    description: "Discover the most profitable crops to grow based on your soil, climate, and market trends — all AI-powered.",
  },
  {
    title: " Multilingual Chat Assistant",
    description: "Talk to FarmPulse in your native language — Hindi, Marathi, Telugu, Tamil, and more — powered by ChatGPT.",
  },
  {
    title: " Instant Climate Warnings",
    description: "Receive automated alerts for extreme weather events like floods, droughts, or storms — before they happen.",
  },
  {
    title: " Personalized Farm Dashboard",
    description: "Track your crop cycles, rainfall history, tasks, and AI suggestions all from one simple dashboard.",
  },
];

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full py-32 bg-white" id="features">
      <div className="max-w-[1200px] mx-auto" style={{ width: "1200px" }}>
        <h2 className="text-6xl font-bold text-lime-500 mb-4">Why Choose FarmPulse?</h2>
        <p className="text-gray-600 text-xl mb-20 max-w-2xl">
          Tap into the pulse of your land with AI-driven insights tailored for farmers.
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Feature titles */}
          <div className="flex flex-col space-y-4">
            {features.map((feature, index) => (
              <button
                key={index}
                className={` p-5   rounded-xl text-xl transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-lime-500 text-white  border-lime-500"
                    : "bg-gray-100 text-gray-800  hover:bg-gray-200"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {feature.title}
              </button>
            ))}
          </div>

          {/* Feature description */}
          <div className="bg-gray-50 p-8 h-[400px] w-[800px] rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-3xl font-semibold text-lime-500 mb-5">
              {features[activeIndex].title}
            </h3>
            <p className="text-gray-700 text-base">{features[activeIndex].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
