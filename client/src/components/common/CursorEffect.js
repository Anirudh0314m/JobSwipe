import React, { useState, useEffect } from 'react';
import { useMousePosition } from '../layout/MouseTracker';

const CursorEffect = () => {
  const mousePosition = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show cursor effect after a slight delay to prevent it from showing on page load
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Handle mouse leaving the window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor effect */}
      <div 
        className="fixed pointer-events-none z-50 rounded-full mix-blend-difference"
        style={{
          height: '20px',
          width: '20px',
          backgroundColor: 'white',
          transform: `translate(${mousePosition.x - 10}px, ${mousePosition.y - 10}px)`,
          transition: 'transform 0.1s ease-out',
          boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.3)'
        }}
      />
      
      {/* Outer cursor effect with slower follow */}
      <div 
        className="fixed pointer-events-none z-50 rounded-full border-2 border-white/50"
        style={{
          height: '40px',
          width: '40px',
          transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
    </>
  );
};

export default CursorEffect;