import React from 'react'

const hero = () => {
  return (
    <div className='flex flex-col items-center justify-center' >
    <div className='flex items-center justify-between py-24' style={{width: "1200px"}}>
        <div className='flex flex-col justify-center ' style={{width:"600px"}}>
            <h1 className='text-lime-500 font-bold mb-8 text-5xl'>FarmPulse – The Smart Pulse of Your Farm</h1>
            <h2 className='text-2xl font-semibold mb-6 text-gray-700'>Real-time crop advice, climate alerts, and native language support — tailored for every Indian farmer.</h2>
            <p className='text-gray-600'>FarmPulse is your AI-powered farming assistant designed to guide you through every season. From personalized crop recommendations to live weather warnings and multilingual support, FarmPulse empowers farmers to grow smarter, safer, and more profitably</p>
        <div className='flex gap-4 mt-8'>
            <button className='bg-lime-500 py-3 font-semibold px-6 rounded-xl hover:bg-lime-600 text-white'>
                Get Started
            </button>
            <button className='border border-lime-400 py-3 font-semibold px-6 rounded-xl hover:bg-white hover:text-gray-600 text-gray-500'>
                Learn More
            </button>
        </div>
        </div>
        <div className='w-[400px] h-[400px] rounded-4xl bg-gray-300'>

        </div>
    </div>
    </div>
  )
}

export default hero