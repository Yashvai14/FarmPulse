import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className='w-full px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row items-center justify-between py-12 sm:py-16 lg:py-24 gap-8 lg:gap-12'>
          {/* Content Section */}
          <div className='flex flex-col justify-center text-center lg:text-left lg:w-1/2 xl:w-3/5'>
            <h1 className='text-lime-500 font-bold mb-6 lg:mb-8 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight'>
              FarmPulse – The Smart Pulse of Your Farm
            </h1>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 lg:mb-6 text-gray-700 leading-relaxed'>
              Real-time crop advice, climate alerts, and native language support — tailored for every Indian farmer.
            </h2>
            <p className='text-gray-600 text-base sm:text-lg leading-relaxed mb-6 lg:mb-8'>
              FarmPulse is your AI-powered farming assistant designed to guide you through every season. 
              From personalized crop recommendations to live weather warnings and multilingual support, 
              FarmPulse empowers farmers to grow smarter, safer, and more profitably.
            </p>
            
            {/* Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
              <Link href="/crop-suggestion">
                <button className='w-full sm:w-auto bg-lime-500 py-3 px-6 font-semibold rounded-xl hover:bg-lime-600 text-white transition-all duration-300 shadow-md hover:shadow-lg'>
                  Get Started
                </button>
              </Link>
              <Link href="/about">
                <button className='w-full sm:w-auto border border-lime-400 py-3 px-6 font-semibold rounded-xl hover:bg-lime-50 hover:text-gray-700 text-gray-500 transition-all duration-300'>
                  Learn More
                </button>
              </Link>
            </div>
          </div>
          
          {/* Image/Visual Section */}
          <div className='lg:w-1/2 xl:w-2/5 flex justify-center'>
            <div className='w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl bg-gradient-to-br from-green-100 to-lime-200 shadow-xl flex items-center justify-center'>
              {/* You can replace this with an actual image later */}
              <div className='text-center'>
                <div className='text-6xl sm:text-7xl lg:text-8xl mb-4'>🌱</div>
                <p className='text-gray-600 font-medium text-sm sm:text-base'>Smart Farming</p>
                <p className='text-gray-500 text-xs sm:text-sm'>AI-Powered Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
