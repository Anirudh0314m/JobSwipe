// src/components/jobs/JobCard.js
// Enhanced JobCard.js with mouse interaction
import React, { useState } from 'react';

const JobCard = ({ title, company, skills, index, onCardClick }) => {
  const [tiltData, setTiltData] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setTiltData({ x: x / 25, y: y / -25 });
  };
  
  const handleMouseLeave = () => {
    setTiltData({ x: 0, y: 0 });
  };
  
  const handleClick = (e) => {
    if (!onCardClick) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    
    // Determine if click was on left or right side of card
    const direction = clickX < rect.width / 2 ? 'left' : 'right';
    onCardClick(index, direction);
  };
  
  return (
    <div 
      className="absolute w-80 md:w-96 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform cursor-pointer animate-float"
      style={{ 
        top: `${15 + index * 8}px`, 
        left: `${15 + index * 8}px`,
        animationDelay: `${index * 0.5}s`,
        zIndex: 10 - index,
        transform: `perspective(1000px) rotateX(${tiltData.y}deg) rotateY(${tiltData.x}deg) scale(${index === 0 ? 1 : 0.95 - index * 0.05})`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Company logo placeholder */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
          {company.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-blue-600">{company}</div>
          <div className="text-xs text-gray-500">Posted 2 days ago</div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      
      {/* Add more job details */}
      <div className="mb-4 text-gray-600 text-sm">
        <div className="flex items-center mb-1">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Remote, USA
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          $90K - $120K
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {skills.map((skill, i) => (
          <span 
            key={i}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
      
      {/* Swipe indicators - only visible on the top card */}

    </div>
  );
};

export default JobCard;