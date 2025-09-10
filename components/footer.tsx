'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="block mb-4">
              <Image 
                src="/logo.png" 
                alt="FarmPulse Logo" 
                width={120} 
                height={40}
                className="w-auto h-10 sm:h-12"
              />
            </Link>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Your AI-powered farming assistant. Empowering farmers with smart insights, real-time data, and precision agriculture solutions.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-lime-600 transition-colors p-2 rounded-full hover:bg-lime-50">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-lime-600 transition-colors p-2 rounded-full hover:bg-lime-50">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-lime-600 transition-colors p-2 rounded-full hover:bg-lime-50">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-lime-600 transition-colors p-2 rounded-full hover:bg-lime-50">
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-lime-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/crop-suggestion" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Crop Suggestions
                </Link>
              </li>
              <li>
                <Link href="/disease-prediction" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Disease Detection
                </Link>
              </li>
              <li>
                <Link href="/weather" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Weather Forecast
                </Link>
              </li>
              <li>
                <Link href="/market-price" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Market Prices
                </Link>
              </li>
              <li>
                <Link href="/mapping" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Farm Mapping
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-lime-600" />
                <span>support@farmpulse.in</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-lime-600" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-lime-600" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-medium text-gray-800 mb-2 text-sm">Support Hours</h5>
              <p className="text-xs text-gray-600">
                Mon-Sat: 9:00 AM - 6:00 PM IST<br />
                24/7 Emergency Support
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-300 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              &copy; 2025 FarmPulse. All Rights Reserved. | Empowering Agriculture with AI
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-xs">
              <Link href="/privacy" className="text-gray-500 hover:text-lime-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-lime-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/help" className="text-gray-500 hover:text-lime-600 transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
