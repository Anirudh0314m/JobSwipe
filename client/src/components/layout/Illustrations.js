// src/components/layout/Illustrations.js
import React from 'react';

const Illustrations = ({ type }) => {
  // We'll return different illustrations based on the type prop
  switch (type) {
    case 'hero':
      return (
        <div className="relative w-full h-full">
          {/* Main character - job seeker */}
          <div className="absolute transform animate-float-slow">
            <svg width="240" height="240" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
              {/* This is a simplified person SVG - you would replace with actual illustrations */}
              <circle cx="300" cy="160" r="80" fill="#4F46E5" />
              <rect x="260" y="240" width="80" height="200" fill="#4F46E5" />
              <rect x="200" y="260" width="60" height="140" fill="#4F46E5" transform="rotate(-20 200 260)" />
              <rect x="340" y="260" width="60" height="140" fill="#4F46E5" transform="rotate(20 340 260)" />
              <rect x="260" y="440" width="40" height="140" fill="#4F46E5" />
              <rect x="300" y="440" width="40" height="140" fill="#4F46E5" />
            </svg>
          </div>
          
          {/* Job cards floating around */}
          <div className="absolute top-10 right-10 transform animate-float animation-delay-1000">
            <div className="bg-white rounded-lg shadow-lg p-3 w-32">
              <div className="w-full h-3 bg-blue-500 rounded mb-2"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded mb-2"></div>
              <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
          
          <div className="absolute bottom-20 left-10 transform animate-float animation-delay-2000">
            <div className="bg-white rounded-lg shadow-lg p-3 w-32 rotate-6">
              <div className="w-full h-3 bg-green-500 rounded mb-2"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded mb-2"></div>
              <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
          
          <div className="absolute bottom-40 right-20 transform animate-float animation-delay-3000">
            <div className="bg-white rounded-lg shadow-lg p-3 w-32 -rotate-12">
              <div className="w-full h-3 bg-purple-500 rounded mb-2"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded mb-2"></div>
              <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      );
      
    case 'upload':
      return (
        <div className="h-32 flex items-center justify-center">
          <div className="relative">
            <svg width="80" height="80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow">
              <rect x="40" y="40" width="120" height="140" rx="10" fill="#EBF4FF" stroke="#3B82F6" strokeWidth="4" />
              <path d="M70 80L130 80" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
              <path d="M70 100L130 100" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
              <path d="M70 120L100 120" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
              <path d="M100 40V10M100 10L80 30M100 10L120 30" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-blue-500/20"></div>
            </div>
          </div>
        </div>
      );
      
    case 'swipe':
      return (
        <div className="h-32 flex items-center justify-center">
          <div className="relative">
            <div className="absolute top-2 left-2 w-16 h-20 bg-purple-100 rounded-lg transform rotate-6"></div>
            <div className="w-16 h-20 bg-blue-100 rounded-lg border-2 border-blue-500 relative z-10 animate-swipe-demo">
              <div className="w-full h-3 bg-blue-500 rounded-t-md"></div>
              <div className="p-1">
                <div className="w-full h-1.5 bg-gray-300 rounded my-1"></div>
                <div className="w-3/4 h-1.5 bg-gray-300 rounded my-1"></div>
                <div className="w-1/2 h-1.5 bg-gray-300 rounded my-1"></div>
              </div>
            </div>
          </div>
        </div>
      );
      
    case 'match':
      return (
        <div className="h-32 flex items-center justify-center">
          <div className="relative">
            <svg width="80" height="80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow">
              <circle cx="100" cy="100" r="80" fill="#ECFDF5" stroke="#10B981" strokeWidth="4" />
              <path d="M70 100L90 120L130 80" stroke="#10B981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-check" />
            </svg>
            <div className="absolute -top-4 -right-4">
              <div className="animate-ping-slow absolute h-8 w-8 rounded-full bg-green-400 opacity-75"></div>
              <div className="relative rounded-full h-6 w-6 bg-green-500"></div>
            </div>
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

export default Illustrations;