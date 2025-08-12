    'use client';

    import React from 'react';
    import NavBar from '@/components/navBar';
    import Footer from '@/components/footer';
    import { Lightbulb, CloudSun, Map, Languages, TrendingUp, CalendarCheck } from 'lucide-react';
    import Cta from '@/components/Cta';
    import FAQSection from '@/components/Faq';
    import { Button } from '@/components/ui/button';

    // Reusable Card Component
    type FeatureCardProps = {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    };

    const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
    return (
        <div className="p-4 md:p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
        <div className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-lime-100 text-lime-600 mb-4">
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
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
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-12 md:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8">
                <div className="max-w-xl text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-lime-500 mb-6">
                  Let&apos;s Explore Our Features.
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6">
                    FarmPulse brings you intelligent tools to improve productivity, save time, and increase profit.
                    Our AI-backed solutions are built to help every Indian farmer grow smartly and sustainably.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button size="lg" asChild>
                      <a href="/auth/signup">Get Started</a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href="/contact">Learn More</a>
                    </Button>
                </div>
                </div>
                <div className="h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 rounded-3xl bg-gradient-to-br from-lime-200 to-green-300 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-4xl md:text-6xl mb-2">🚀</div>
                    <p className="text-sm md:text-base">Feature Overview</p>
                  </div>
                </div>
            </div>
            </div>
        </div>

        {/* Feature Cards Section */}
        <div className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-lime-600 mb-4">
                Powerful Features for Smart Farming
            </h2>
            <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm md:text-base lg:text-lg max-w-3xl mx-auto">
                Here’s how FarmPulse empowers modern farmers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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
