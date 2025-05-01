// src/components/jobs/JobCard.js
import React, { useState } from 'react';
import { useMousePosition } from '../layout/MouseTracker';

const JobCard = ({ title, company, location, salary, description, skills, index, onCardClick, matchPercentage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const mousePosition = useMousePosition();
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const handleMouseMove = (e) => {
    if (!isHovered) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Calculate the center of the card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate how far the mouse is from the center
    const x = (mousePosition.x - centerX) / (rect.width / 2);
    const y = (mousePosition.y - centerY) / (rect.height / 2);
    
    // Calculate rotation (max 15 degrees)
    const rotateX = y * -10; 
    const rotateY = x * 10;
    
    // Apply transform
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)
      translateZ(0)
      translateX(${offsetX}px)
    `;
    
    // Dynamic shadow based on rotation
    const shadowX = x * 15;
    const shadowY = y * 15;
    card.style.boxShadow = `
      ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.15),
      0 4px 8px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1)
    `;
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
  
  // Add touch/swipe handling
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
    
    // Set visual swipe direction indicator
    if (diff > 50) {
      setSwipeDirection('right');
    } else if (diff < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };
  
  const handleTouchEnd = () => {
    if (offsetX > 100 && onCardClick) {
      onCardClick(index, 'right');
    } else if (offsetX < -100 && onCardClick) {
      onCardClick(index, 'left');
    }
    
    // Reset
    setOffsetX(0);
    setSwipeDirection(null);
  };
  
  // Calculate card transform styles including swipe offset
  const getCardStyle = () => {
    const baseStyle = {
      top: `${15 + index * 8}px`, 
      left: `${15 + index * 8}px`,
      animationDelay: `${index * 0.5}s`,
      zIndex: 10 - index,
      transform: isHovered ? 
        `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1.05, 1.05, 1) translateZ(0) translateX(${offsetX}px)` : 
        `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0) translateX(${offsetX}px)`
    };
    
    // Add swipe indication styles
    if (swipeDirection === 'right') {
      baseStyle.boxShadow = '5px 0 15px rgba(0, 255, 0, 0.2)';
      baseStyle.borderRight = '2px solid rgba(0, 255, 0, 0.5)';
    } else if (swipeDirection === 'left') {
      baseStyle.boxShadow = '-5px 0 15px rgba(255, 0, 0, 0.2)';
      baseStyle.borderLeft = '2px solid rgba(255, 0, 0, 0.5)';
    }
    
    return baseStyle;
  };
  
  return (
    <div 
      className={`absolute w-80 md:w-96 backdrop-blur-md bg-white/90 rounded-xl p-6 transition-all duration-200 transform cursor-pointer animate-float border border-white/50 will-change-transform ${swipeDirection === 'right' ? 'border-r-green-400' : swipeDirection === 'left' ? 'border-l-red-400' : ''}`}
      style={getCardStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Match percentage badge */}
      {matchPercentage && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg">
          {matchPercentage}% Match
        </div>
      )}
    
      {/* Light refraction effect */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Company logo with 3D effect */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg transform transition-transform duration-200" 
             style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)' }}>
          {company.charAt(0)}
        </div>
        <div style={{ transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)', transition: 'transform 0.2s ease-out' }}>
          <div className="text-sm font-semibold text-blue-600">{company}</div>
          <div className="text-xs text-gray-500">Posted 2 days ago</div>
        </div>
      </div>
      
      {/* Job title with 3D effect */}
      <h3 className="text-xl font-bold mb-3 text-gray-800 transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)' }}>
        {title}
      </h3>
      
      {/* Job details with subtle 3D effect */}
      <div className="mb-4 text-gray-600 text-sm transition-transform duration-200"
           style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)' }}>
        <div className="flex items-center mb-1">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location || "Remote, USA"}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {salary || "$90K - $120K"}
        </div>
      </div>
      
      {/* Description preview - new section */}
      {description && (
        <div className="mb-4 text-sm text-gray-700 transition-transform duration-200 max-h-20 overflow-hidden relative"
             style={{ transform: isHovered ? 'translateZ(12px)' : 'translateZ(0)' }}>
          <p className="line-clamp-3">{description}</p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent"></div>
        </div>
      )}
      
      {/* Skills tags with staggered 3D effect */}
      <div className="flex flex-wrap gap-1 mt-2 transition-transform duration-200"
           style={{ transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)' }}>
        {skills.map((skill, i) => (
          <span 
            key={i}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded transition-transform duration-200"
            style={{ transform: isHovered ? `translateZ(${15 + i * 2}px)` : 'translateZ(0)' }}
          >
            {skill}
          </span>
        ))}
      </div>
      
      {/* Swipe indicators */}
      <div className={`absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-red-500/20 to-transparent rounded-l-xl opacity-0 transition-opacity duration-300 flex items-center justify-center ${swipeDirection === 'left' ? 'opacity-100' : ''}`}>
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <div className={`absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-green-500/20 to-transparent rounded-r-xl opacity-0 transition-opacity duration-300 flex items-center justify-center ${swipeDirection === 'right' ? 'opacity-100' : ''}`}>
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
};

export default JobCard;