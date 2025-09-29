'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sprout, 
  Sun, 
  Map, 
  TrendingUp, 
  Calendar, 
  Microscope, 
  Menu, 
  X, 
  ChevronDown,
  ChevronUp 
} from 'lucide-react';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setIsMobileFeaturesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setIsMobileFeaturesOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileFeaturesOpen(false);
  };

  const toggleMobileFeatures = () => {
    setIsMobileFeaturesOpen(!isMobileFeaturesOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileFeaturesOpen(false);
  };

  const features = [
    {
      href: "/crop-suggestion",
      icon: <Sprout className="w-5 h-5 text-green-600" />,
      title: "AI-Powered Crop Suggestions"
    },
    {
      href: "/weather",
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
      title: "Live Weather Forecast"
    },
    {
      href: "/mapping",
      icon: <Map className="w-5 h-5 text-blue-600" />,
      title: "Geo-Mapping for Farmland"
    },
    {
      href: "/market-price",
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      title: "Market Price Tracker"
    },
    
    {
      href: "/disease-prediction",
      icon: <Microscope className="w-5 h-5 text-orange-500" />,
      title: "Plant Disease Detection"
    },
  ];

  return (
    <nav className="w-full py-4 px-4 lg:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center bg-white shadow-xl py-4 px-4 lg:px-6 rounded-2xl lg:rounded-4xl">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="FarmPulse Logo"
                width={80}
                height={80}
                className="cursor-pointer lg:w-[120px] lg:h-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-6 text-[16px] font-semibold">
              
              {/* Features Dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-1 cursor-pointer hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300 py-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  Features
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {/* Desktop Dropdown */}
                {isDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-xl py-2 w-72 z-50 border border-gray-100"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {features.map((feature, index) => (
                      <Link
                        key={index}
                        href={feature.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {feature.icon}
                        <span className="text-gray-700">{feature.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* Other Desktop Links */}
              <li>
                <Link
                  href="/about"
                  className="hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Dashboard Button */}
            <Link href="/dashboard">
              <button className="py-2 px-6 text-gray-800 font-bold cursor-pointer bg-lime-400 rounded-3xl hover:bg-lime-500 transition-all duration-300">
                Dashboard
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="py-2">
              
              {/* Mobile Features Dropdown */}
              <div>
                <button
                  onClick={toggleMobileFeatures}
                  className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span>Features</span>
                  {isMobileFeaturesOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {/* Mobile Features Submenu */}
                {isMobileFeaturesOpen && (
                  <div className="bg-gray-50">
                    {features.map((feature, index) => (
                      <Link
                        key={index}
                        href={feature.href}
                        className="flex items-center gap-3 px-8 py-3 text-sm hover:bg-gray-100 transition-colors duration-200"
                        onClick={closeMobileMenu}
                      >
                        {feature.icon}
                        <span className="text-gray-700">{feature.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Other Links */}
              <Link
                href="/about"
                className="block px-4 py-3 text-gray-600 font-semibold hover:bg-gray-50 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              
              <Link
                href="/contact"
                className="block px-4 py-3 text-gray-600 font-semibold hover:bg-gray-50 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>

              {/* Mobile Dashboard Button */}
              <div className="px-4 py-3">
                <Link href="/dashboard">
                  <button 
                    className="w-full py-3 px-6 text-gray-800 font-bold bg-lime-400 rounded-2xl hover:bg-lime-500 transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
