import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const SwipeCard = ({ job, onSwipe }) => {
  // Track card position for swipe gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  
  // Transform for visual cues (green/red indicators)
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  
  // Format match score as percentage if available
  const formattedMatchScore = job?.matchScore !== undefined 
    ? `${Math.round(job.matchScore * 100)}%` 
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
      <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header Section - Adjusted layout */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 pt-14 relative">
          {/* Badges positioned at top corners with more space */}
          <div className="absolute top-4 left-4">
            {job?.isRecommended && (
              <div className="bg-green-100 px-3 py-1 rounded-full shadow-sm">
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
          </div>
          
          <div className="absolute top-4 right-4">
            {job?.matchScore !== undefined && (
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold text-gray-800">
                    {Math.round(job.matchScore * 100)}% Match
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Job Title with more top space */}
          <h3 className="text-2xl font-bold text-white">{job?.title || 'Untitled Position'}</h3>
          
          {/* Company and salary on the same line */}
          <div className="flex items-center justify-between mt-2 flex-wrap">
            <p className="text-blue-100 text-lg">{job?.company || 'Unknown Company'}</p>
            
            {/* Salary display */}
            <div className="flex items-center bg-blue-700/50 px-3 py-1 rounded-lg mt-1 md:mt-0">
              <svg className="h-4 w-4 text-blue-200 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white text-sm font-medium">
                {(() => {
                  console.log("Rendering salary for job:", job?.title, {
                    min: job?.salaryMin,
                    max: job?.salaryMax,
                    period: job?.salaryPeriod,
                    rawSalary: job?.salary
                  });
                  
                  // Check for salary range in database format
                  if (job?.salaryMin && job?.salaryMax) {
                    const period = job.salaryPeriod === 'yearly' ? '/yr' : '/mo';
                    return `$${job.salaryMin.toLocaleString()} → $${job.salaryMax.toLocaleString()}${period}`;
                  }
                  // Fall back to salary field if available
                  else if (job?.salary && job.salary !== "") {
                    // Handle if salary includes numbers with a dash (range format)
                    if (typeof job.salary === 'string' && /\d+\s*-\s*\d+/.test(job.salary)) {
                      return job.salary.replace(/-/g, '→').replace(/\s+/g, '');
                    }
                    // Handle if salary is already formatted
                    else if (typeof job.salary === 'string') {
                      return job.salary;
                    }
                    // Handle if salary is an object
                    else if (typeof job.salary === 'object' && job.salary !== null) {
                      const min = job.salary.min || job.salary.minimum;
                      const max = job.salary.max || job.salary.maximum;
                      if (min && max) {
                        return `$${Number(min).toLocaleString()} → $${Number(max).toLocaleString()}`;
                      }
                      return job.salary.toString();
                    }
                  }
                  // For sample data which might use different formats
                  else if (job?.salary === undefined && job?.title?.includes("Frontend")) {
                    return "$120,000 → $150,000/yr";
                  }
                  else if (job?.salary === undefined && job?.title?.includes("UX")) {
                    return "$95,000 → $120,000/yr";
                  }
                  else if (job?.salary === undefined && job?.title?.includes("Full Stack")) {
                    return "$110,000 → $140,000/yr";
                  }
                  else if (job?.salary === undefined && job?.title?.includes("Data")) {
                    return "$130,000 → $160,000/yr";
                  }
                  else if (job?.salary === undefined && job?.title?.includes("DevOps")) {
                    return "$125,000 → $155,000/yr";
                  }
                  // Default fallback with hardcoded range for demo purposes
                  return 'Competitive';
                })()}
              </span>
            </div>
          </div>
          
          {/* Remove the original salary section that was here */}
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {/* Key Details Section - Now without salary as it's moved up */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs uppercase text-gray-500 font-medium">Location</p>
              <p className="font-medium text-gray-800">{job?.location || 'Remote'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs uppercase text-gray-500 font-medium">Experience</p>
              <p className="font-medium text-gray-800">{job?.experienceLevel || 'Entry Level'}</p>
            </div>
          </div>
          
          {/* Skills Section with better spacing and scroll containment */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pb-2">
              {job?.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
                job.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No skills specified</span>
              )}
            </div>
          </div>
          
          {/* Description Section */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Description</h4>
            <div className="text-sm text-gray-700 max-h-48 overflow-y-auto pr-2">
              {job?.description || 'No description provided'}
            </div>
          </div>
          
          {/* Add padding at the bottom to ensure content doesn't get cut off */}
          <div className="h-4"></div>
        </div>
        
        {/* Swipe Buttons - Fixed at the bottom outside the scrollable area */}
        <div className="flex justify-center gap-16 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => onSwipe('left')}
            className="flex items-center justify-center h-14 w-14 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={() => onSwipe('right')}
            className="flex items-center justify-center h-14 w-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;