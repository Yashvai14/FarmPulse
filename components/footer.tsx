'use client';

import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-[#f9fafb] text-[#1a1a1a]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
        <div className="md:col-span-1 flex flex-col gap-2">
          <Image src="/logo.png" alt="Logo" width={120} height={40} className="mb-2" />
          <p className="text-sm text-gray-600">Smart farming solutions for modern agriculture.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm md:text-base">NAVIGATION</h4>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><a href="/" className="hover:text-lime-600 transition-colors">Home</a></li>
            <li><a href="/features" className="hover:text-lime-600 transition-colors">Features</a></li>
            <li><a href="/about" className="hover:text-lime-600 transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-lime-600 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm md:text-base">FEATURES</h4>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><a href="/features/crop-suggestions" className="hover:text-lime-600 transition-colors">Crop Suggestions</a></li>
            <li><a href="/features/weather" className="hover:text-lime-600 transition-colors">Weather Forecast</a></li>
            <li><a href="/features/market-price" className="hover:text-lime-600 transition-colors">Market Prices</a></li>
            <li><a href="/features/farming-calendar" className="hover:text-lime-600 transition-colors">Farming Calendar</a></li>
            <li><a href="/features/mapping" className="hover:text-lime-600 transition-colors">Geo Mapping</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm md:text-base">LEGAL</h4>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><a href="/privacy" className="hover:text-lime-600 transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-lime-600 transition-colors">Terms of Service</a></li>
            <li><a href="/support" className="hover:text-lime-600 transition-colors">Support</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm md:text-base">CONTACT</h4>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><a href="mailto:support@farmpulse.com" className="hover:text-lime-600 transition-colors">support@farmpulse.com</a></li>
            <li><a href="tel:+911234567890" className="hover:text-lime-600 transition-colors">+91 12345 67890</a></li>
            <li><a href="/contact" className="hover:text-lime-600 transition-colors">Contact Form</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-6">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">&copy; 2025 FarmPulse. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors"><FaFacebookF /></a>
            <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors"><FaLinkedinIn /></a>
            <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
