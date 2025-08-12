import React from 'react'
import { Button } from './ui/button'

const Cta = () => {
  return (
    <div className="py-12 md:py-18 px-4">
      <div className='flex flex-col items-center justify-center max-w-4xl mx-auto text-center'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl text-lime-500 font-bold mb-6 md:mb-10'>
          Try FarmPulse your Farming Buddy!!!
        </h1>
        <p className='text-center text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl'>
          FarmPulse is your ultimate farming companion, providing real-time insights and personalized recommendations to help you optimize your agricultural practices.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 mt-6 md:mt-8'>
          <Button size="lg" asChild>
            <a href="/auth/signup">Get Started</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/features">Learn More</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Cta