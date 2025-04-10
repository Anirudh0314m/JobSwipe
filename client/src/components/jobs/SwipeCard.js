import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const SwipeCard = ({ job, onSwipe }) => {
  // Track card position for swipe gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  
  // Transform for visual cues (green/red indicators)
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  
  // Handle drag end
  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };
  
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
    >
      {/* Swipe indicators */}
      <motion.div 
        className="absolute top-10 right-10 bg-green-100 text-green-600 rounded-full p-4 shadow-lg z-10"
        style={{ opacity: rightOpacity }}
      >
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-10 left-10 bg-red-100 text-red-600 rounded-full p-4 shadow-lg z-10"
        style={{ opacity: leftOpacity }}
      >
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.div>
      
      {/* Card content */}
      <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-end p-4">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg inline-block">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
        </div>
        
        <div className="p-5">
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="mt-4">
            <p className="text-gray-700">{job.description}</p>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-500">{job.location}</p>
            <p className="font-semibold text-gray-800">{job.salary}</p>
          </div>
          
          <div className="mt-6 flex justify-center gap-8">
            <button
              onClick={() => onSwipe('left')}
              className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button
              onClick={() => onSwipe('right')}
              className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;