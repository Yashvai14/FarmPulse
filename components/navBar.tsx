import { useState } from 'react'
import React from 'react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuItem } from './ui/dropdown-menu'
import MobileMenu from './MobileMenu'
import { Button } from './ui/button'

const NavBar = () => {
  return (
    <nav className='flex justify-center items-center py-4 md:py-8 px-4'>
        <div className='flex justify-between shadow-xl py-4 px-4 md:px-6 rounded-2xl md:rounded-4xl bg-white items-center w-full max-w-7xl'>
        <div>
            <a href="/">
              <Image src="/logo.png" alt="Logo" width={100} height={40} className="md:w-[120px] md:h-[50px]" />
            </a>
        </div>
        
        {/* Desktop Navigation */}
        <ul className='hidden md:flex space-x-6 text-[16px] font-semibold'>
            <li>
              <DropdownMenu trigger="Features">
                <DropdownMenuItem href="/features/crop-suggestions">
                  🌱 Crop Suggestions
                </DropdownMenuItem>
                <DropdownMenuItem href="/features/weather">
                  🌤️ Weather Forecast
                </DropdownMenuItem>
                <DropdownMenuItem href="/features/market-price">
                  💰 Market Prices
                </DropdownMenuItem>
                <DropdownMenuItem href="/features/farming-calendar">
                  📅 Farming Calendar
                </DropdownMenuItem>
                <DropdownMenuItem href="/features/mapping">
                  🗺️ Geo Mapping
                </DropdownMenuItem>
                <DropdownMenuItem href="/features/predictor">
                  🔬 Disease Predictor
                </DropdownMenuItem>
              </DropdownMenu>
            </li>
            <li>
              <a href="/about" className="hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300">
                Contact
              </a>
            </li>
        </ul>
        
        {/* Desktop Login Button */}
        <div className="hidden md:block">
            <Button asChild>
              <a href="/auth/signin">Login</a>
            </Button>
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu>
          <a href="/features" className="text-gray-600 hover:text-lime-600">Features</a>
          <a href="/about" className="text-gray-600 hover:text-lime-600">About</a>
          <a href="/contact" className="text-gray-600 hover:text-lime-600">Contact</a>
          <Button asChild className="mt-4">
            <a href="/auth/signin">Login</a>
          </Button>
        </MobileMenu>
        </div>
        </div>
    </nav>
  )
}

export default NavBar