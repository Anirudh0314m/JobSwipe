// src/components/layout/Parallax.js
import React, { useRef, useEffect } from 'react';
import { useMousePosition } from './MouseTracker';

const ParallaxElement = ({ depth, className, children, style }) => {
  const element = useRef(null);
  const mousePosition = useMousePosition();
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  
  useEffect(() => {
    if (!element.current) return;
    
    // Calculate movement based on mouse position and depth
    const moveX = (mousePosition.x - windowWidth / 2) * depth * 0.01;
    const moveY = (mousePosition.y - windowHeight / 2) * depth * 0.01;
    
    element.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  }, [mousePosition, depth, windowWidth, windowHeight]);
  
  return (
    <div 
      ref={element} 
      className={`transition-transform duration-200 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ParallaxElement;