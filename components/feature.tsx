'use client'

import { useState } from "react";
import Link from "next/link";

type Feature = {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: string;
  color: string;
  link: string;
  benefits: string[];
};

const features: Feature[] = [
  {
    id: "weather",
    title: "Hyperlocal Weather Intelligence",
    description: "Get real-time weather updates, rain forecasts, and agricultural alerts based on your exact farm location.",
    detailedDescription: "Our advanced weather system provides hyperlocal forecasts, agricultural advisories, and climate alerts tailored specifically for farming operations. Never be caught off guard by weather changes again.",
    icon: "🌤️",
    color: "from-blue-400 to-cyan-500",
    link: "/weather",
    benefits: ["Real-time weather data", "Agricultural advisories", "Climate alerts", "5-day forecasts"]
  },
  {
    id: "crop-suggestion",
    title: "AI Crop Recommendations",
    description: "Discover the most profitable crops to grow based on your soil, climate, and market trends — all AI-powered.",
    detailedDescription: "Our machine learning algorithms analyze your soil conditions, local climate patterns, and market prices to recommend the most profitable crops for your specific situation.",
    icon: "🌱",
    color: "from-green-400 to-lime-500",
    link: "/crop-suggestion",
    benefits: ["Soil-based analysis", "Market price integration", "Profit optimization", "Scientific recommendations"]
  },
  {
    id: "disease-predictor",
    title: "Disease Detection System",
    description: "Upload crop images to get instant AI-powered disease detection and treatment recommendations in multiple languages.",
    detailedDescription: "Advanced computer vision technology analyzes crop images to detect diseases early, providing treatment recommendations in your preferred language for quick action.",
    icon: "🔬",
    color: "from-emerald-400 to-teal-500",
    link: "/predictor",
    benefits: ["Image-based detection", "Multilingual support", "Treatment recommendations", "Early diagnosis"]
  },
  {
    id: "market-prices",
    title: "Real-time Market Prices",
    description: "Access live commodity prices from mandis across India to make informed selling decisions and maximize profits.",
    detailedDescription: "Stay updated with real-time market prices from agricultural mandis across India, track price trends, and identify the best time and place to sell your produce.",
    icon: "📈",
    color: "from-orange-400 to-red-500",
    link: "/market-price",
    benefits: ["Live mandi prices", "Price trends", "Market analysis", "Profit maximization"]
  },
  {
    id: "dashboard",
    title: "Personalized Farm Dashboard",
    description: "Track your crop cycles, tasks, weather patterns, and AI suggestions all from one comprehensive dashboard.",
    detailedDescription: "Your central command center for farm management. Monitor all your agricultural activities, track progress, manage tasks, and access AI insights in one integrated platform.",
    icon: "📊",
    color: "from-purple-400 to-pink-500",
    link: "/dashboard",
    benefits: ["Task management", "Progress tracking", "Analytics", "Centralized control"]
  },
  {
    id: "mapping",
    title: "Environmental Mapping",
    description: "Visualize your farm location with real-time environmental data including weather, soil conditions, and insights.",
    detailedDescription: "Interactive mapping system that combines your farm's geographic data with real-time environmental information to provide location-specific agricultural insights.",
    icon: "🗺️",
    color: "from-teal-400 to-green-500",
    link: "/mapping",
    benefits: ["Interactive maps", "Environmental data", "Location insights", "Geospatial analysis"]
  }
];

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeFeature = features[activeIndex];

  return (
    <section className="w-full py-32 bg-gradient-to-br from-gray-50 to-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
            <div className="bg-lime-100 p-3 lg:p-4 rounded-2xl">
              <span className="text-3xl lg:text-4xl">✨</span>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-lime-600 mb-2 lg:mb-4">
                Why Choose FarmPulse?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Tap into the pulse of your land with AI-driven insights, real-time data, and smart farming solutions tailored for modern agriculture.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Features Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Feature Navigation */}
          <div className="lg:col-span-4 space-y-3">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border-2 group ${
                  activeIndex === index
                    ? `bg-gradient-to-r ${feature.color} text-white border-transparent shadow-lg transform scale-105`
                    : "bg-white text-gray-800 border-gray-200 hover:border-lime-300 hover:shadow-md"
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-3xl transition-transform duration-300 ${
                    activeIndex === index || hoveredIndex === index ? 'scale-110' : ''
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-lime-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      activeIndex === index ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      Click to explore
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Feature Details */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${activeFeature.color} text-white`}>
                  <span className="text-4xl">{activeFeature.icon}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {activeFeature.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {activeFeature.description}
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {activeFeature.detailedDescription}
                </p>
              </div>

              {/* Key Benefits */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✅</span>
                  Key Benefits:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeFeature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeFeature.color}`}></div>
                      <span className="text-sm sm:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-100 gap-4">
                <div className="text-sm text-gray-500 text-center sm:text-left">
                  Ready to experience this feature?
                </div>
                <Link 
                  href={activeFeature.link}
                  className={`bg-gradient-to-r ${activeFeature.color} hover:shadow-lg text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto`}
                >
                  Try {activeFeature.title.split(' ')[0]} Now
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-lime-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              <Link 
                href={feature.link}
                className="inline-flex items-center gap-2 text-lime-600 hover:text-lime-700 font-medium group-hover:gap-3 transition-all"
              >
                Explore Feature
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
