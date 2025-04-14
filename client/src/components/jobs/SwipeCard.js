import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const SwipeCard = ({ job, onSwipe, matchScore, isRecommended }) => {
  // Track card position for swipe gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  
  // Transform for visual cues (green/red indicators)
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  
  // Format match score as percentage if available
  const formattedMatchScore = matchScore !== undefined 
    ? `${Math.round(matchScore * 100)}%` 
    : null;
  
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
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-end p-4 relative">
          {/* AI Match Score Badge */}
          {formattedMatchScore && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-gray-800">
                  {formattedMatchScore} Match
                </span>
              </div>
            </div>
          )}
          
          {/* AI Recommendation Badge */}
          {isRecommended && (
            <div className="absolute top-3 left-3 bg-green-100 px-3 py-1 rounded-full shadow-md">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold text-green-800">
                  AI Recommended
                </span>
              </div>
            </div>
          )}
          
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg inline-block z-10">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
        </div>
        
        <div className="p-5">
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills && job.skills.map((skill, i) => (
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