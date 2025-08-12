'use client'

import { useState } from "react";
import { Button } from "./ui/button";

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
    <section className="w-full py-16 md:py-32 bg-white px-4" id="features">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-lime-500 mb-4 text-center lg:text-left">
          Why Choose FarmPulse?
        </h2>
        <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-12 md:mb-20 max-w-2xl text-center lg:text-left">
          Tap into the pulse of your land with AI-driven insights tailored for farmers.
        </p>
        <div className="flex flex-col lg:flex-row justify-between items-start space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Feature titles */}
          <div className="flex flex-col space-y-3 md:space-y-4 w-full lg:w-auto">
            {features.map((feature, index) => (
              <Button
                key={index}
                variant={activeIndex === index ? "default" : "outline"}
                className={`p-3 md:p-5 rounded-xl text-sm md:text-lg lg:text-xl transition-all duration-300 text-left justify-start h-auto whitespace-normal ${
                  activeIndex === index
                    ? ""
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {feature.title}
              </Button>
            ))}
          </div>

          {/* Feature description */}
          <div className="bg-gray-50 p-4 md:p-6 lg:p-8 min-h-[300px] md:min-h-[400px] w-full lg:max-w-2xl rounded-xl border border-gray-200 shadow-md">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-lime-500 mb-3 md:mb-5">
              {features[activeIndex].title}
            </h3>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              {features[activeIndex].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
