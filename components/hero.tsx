import React from 'react'
import { Button } from './ui/button'

const hero = () => {
  return (
    <div className='flex flex-col items-center justify-center px-4'>
      <div className='flex flex-col lg:flex-row items-center justify-between py-12 md:py-24 max-w-7xl w-full gap-8'>
        <div className='flex flex-col justify-center flex-1 text-center lg:text-left'>
          <h1 className='text-lime-500 font-bold mb-6 md:mb-8 text-3xl md:text-4xl lg:text-5xl leading-tight'>
            FarmPulse – The Smart Pulse of Your Farm
          </h1>
          <h2 className='text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-6 text-gray-700'>
            Real-time crop advice, climate alerts, and native language support — tailored for every Indian farmer.
          </h2>
          <p className='text-gray-600 text-sm md:text-base mb-6 md:mb-8 max-w-2xl'>
            FarmPulse is your AI-powered farming assistant designed to guide you through every season. From personalized crop recommendations to live weather warnings and multilingual support, FarmPulse empowers farmers to grow smarter, safer, and more profitably.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
            <Button size="lg" asChild>
              <a href="/auth/signup">Get Started</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/features">Learn More</a>
            </Button>
          </div>
        </div>
        <div className='w-full max-w-sm md:max-w-md lg:max-w-lg h-64 md:h-80 lg:h-96 rounded-2xl lg:rounded-4xl bg-gradient-to-br from-lime-200 to-green-300 flex items-center justify-center'>
          <div className="text-center text-gray-600">
            <div className="text-4xl md:text-6xl mb-2">🌱</div>
            <p className="text-sm md:text-base">Smart Farming Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default hero