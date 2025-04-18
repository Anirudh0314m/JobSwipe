import React, { useState, useRef } from 'react';

const TiltCard = ({ children, className, intensity = 20 }) => {
  const [transform, setTransform] = useState('');
  const [shadow, setShadow] = useState('');
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / intensity; // Adjust divisor for tilt sensitivity
    const rotateY = -(x - centerX) / intensity; // Negative for correct direction
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setShadow(`0 20px 50px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    setShadow('0 10px 30px rgba(0, 0, 0, 0.1)');
  };

  return (
    <div 
      ref={cardRef}
      className={`transition-all duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform, 
        boxShadow: shadow,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
};

export default TiltCard;