    'use client';

    import React from 'react';
    import NavBar from '@/components/navBar';
    import Footer from '@/components/footer';
    import { Lightbulb, CloudSun, Map, Languages, TrendingUp, CalendarCheck } from 'lucide-react';
import Cta from '@/components/Cta';
import { FaQ } from 'react-icons/fa6';
import FAQSection from '@/components/Faq';

    // Reusable Card Component
    type FeatureCardProps = {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    };

    const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
    return (
        <div className="p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition scale-x-100 bg-white">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-lime-100 text-lime-600 mb-4">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        </div>
    );
    };

    // Data Array
    const featuresData = [
  {
    title: "AI-Powered Crop Suggestions",
    description: "Get real-time recommendations on the most profitable crops based on climate, soil, and market rates.",
    icon: Lightbulb,
  },
  {
    title: "Live Weather Forecast",
    description: "Stay prepared with accurate and region-specific weather updates to protect your yield.",
    icon: CloudSun,
  },
  {
    title: "Geo-Mapping for Farmland",
    description: "Visualize your farm with map integration and track productivity zone-wise.",
    icon: Map,
  },
  {
    title: "Multilingual Support",
    description: "Use the app in your local language. We support over 10 Indian languages for easy access.",
    icon: Languages,
  },
  {
    title: "Market Price Tracker",
    description: "Get updated prices of crops from nearby mandis to make informed selling decisions.",
    icon: TrendingUp, // You can replace this with another Lucide icon like `TrendingUp` if installed
  },
  {
    title: "Farming Calendar & Reminders",
    description: "Never miss an important date. Get reminders for sowing, fertilizing, and harvesting based on crop cycle.",
    icon: CalendarCheck, // Replace with a relevant icon like `CalendarCheck` if using more Lucide icons
  },
];


    export default function Features() {
    return (
        <div>
        <NavBar />

        {/* Hero Section */}
        <div className="w-full max-w-[1200px] mx-auto">
            <div className="flex flex-col items-center justify-center py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between w-full px-4 lg:px-0">
                <div className="max-w-xl">
                <h1 className="text-5xl font-bold text-lime-500 mb-6">Let&apos;s Explore Our Features.</h1>
                <p className="text-xl text-gray-600">
                    FarmPulse brings you intelligent tools to improve productivity, save time, and increase profit.
                    Our AI-backed solutions are built to help every Indian farmer grow smartly and sustainably.
                </p>
                <div className="flex gap-4 mt-8">
                    <button className="bg-lime-500 py-3 font-semibold px-6 rounded-xl hover:bg-lime-600 text-white">
                    Get Started
                    </button>
                    <button className="border border-lime-400 py-3 font-semibold px-6 rounded-xl hover:bg-white hover:text-gray-600 text-gray-500">
                    Learn More
                    </button>
                </div>
                </div>
                <div className="h-[300px] w-[300px] mt-12 lg:mt-0 rounded-3xl bg-gray-300"></div>
            </div>
            </div>
        </div>

        {/* Feature Cards Section */}
        <div className="py-16 bg-gray-50">
            <div className="max-w-[1200px] mx-auto ">
            <h2 className="text-4xl font-bold text-center text-lime-600 mb-4">
                Powerful Features for Smart Farming
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
                Here’s how FarmPulse empowers modern farmers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuresData.map((feature, index) => (
                <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                />
                ))}
            </div>
            </div>
        </div>
        <FAQSection />
        <Cta />
        <Footer />
        </div>
    );
    }
