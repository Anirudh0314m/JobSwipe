import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/jobs/SwipeCard';
import api from '../utils/api';

const SwipePage = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [noSkillsMessage, setNoSkillsMessage] = useState('');
  
  // Track direction for animation
  const [direction, setDirection] = useState(null);
  
  // Add state for toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      setLoading(true);
      try {
        // Get AI-recommended jobs based on user's skills/resume
        const response = await api.get('/api/jobs/recommended/skills');
        
        if (response.data.message) {
          // Show message if no skills found
          setNoSkillsMessage(response.data.message);
        }
        
        // Set user skills from API response
        if (response.data.userSkills) {
          setUserSkills(response.data.userSkills);
        }
        
        // Set jobs from API, sorted by match score
        const recommendedJobs = response.data.data;
        setJobs(recommendedJobs);
        
        // Show a welcome toast if we have skills and recommendations
        if (response.data.userSkills && response.data.userSkills.length > 0) {
          setToastMessage(`Found ${recommendedJobs.length} jobs matching your skills!`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        // Fall back to sample data if API call fails
        const sampleJobs = [
          {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Innovations",
            description: "Join our team to build amazing user interfaces with React and modern JavaScript.",
            location: "San Francisco, CA",
            salary: "120,000 - 150,000",
            skills: ["React", "JavaScript", "CSS"]
          },
          {
            id: 2,
            title: "UX Designer",
            company: "Creative Solutions",
            description: "Design beautiful and intuitive user experiences for web and mobile apps.",
            location: "New York, NY",
            salary: "95,000 - 120,000",
            skills: ["Figma", "UI Design", "User Research"]
          },
          {
            id: 3,
            title: "Full Stack Developer",
            company: "StartupXYZ",
            description: "Build and maintain our web applications from frontend to backend.",
            location: "Remote",
            salary: "110,000 - 140,000",
            skills: ["React", "Node.js", "MongoDB"]
          },
          {
            id: 4,
            title: "Data Scientist",
            company: "Analytics Co",
            description: "Analyze complex data and build machine learning models to drive business decisions.",
            location: "Boston, MA",
            salary: "130,000 - 160,000",
            skills: ["Python", "Machine Learning", "SQL"]
          },
          {
            id: 5,
            title: "DevOps Engineer",
            company: "CloudTech",
            description: "Build and maintain our cloud infrastructure and CI/CD pipelines.",
            location: "Seattle, WA",
            salary: "125,000 - 155,000",
            skills: ["AWS", "Docker", "Kubernetes"]
          }
        ];
        setJobs(sampleJobs);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendedJobs();
  }, []);
  
  const handleSwipe = (swipeDirection) => {
    if (currentIndex >= jobs.length) return;
    
    // Save swipe direction for animation
    setDirection(swipeDirection);
    
    const currentJob = jobs[currentIndex];
    
    // If swiped right, add to matches
    if (swipeDirection === 'right') {
      // In a real app, you would send this to your API
      console.log(`Matched with job: ${currentJob.id}`);
      setMatches(prev => [...prev, {
        ...currentJob,
        matchedOn: new Date().toISOString(),
        status: 'new'
      }]);
      
      // Show toast notification
      setToastMessage(`Matched with ${currentJob.title} at ${currentJob.company}!`);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    
    // Log the swipe action (would send to API in real app)
    console.log(`Swiped ${swipeDirection} on job ${currentJob.id}`);
    
    // Move to next card
    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setDirection(null);
    }, 300);
  };
  
  // Variants for the card animations
  const variants = {
    enter: direction => ({
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10
    },
    exit: direction => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      zIndex: 1,
      transition: { duration: 0.3 }
    })
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Find Your Next Job
        </h1>
        
        {userSkills && userSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-center text-gray-600 mb-2">
              Recommendations based on your skills:
            </p>
            <div className="flex flex-wrap justify-center gap-1">
              {userSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {noSkillsMessage && (
          <div className="mb-4 px-4 py-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-700">{noSkillsMessage}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : currentIndex < jobs.length ? (
          <div className="relative h-[60vh] w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Card stack - show current and next card */}
              <div className="relative w-full max-w-sm h-[500px]">
                {/* Show next card behind */}
                {currentIndex + 1 < jobs.length && (
                  <div className="absolute inset-0 transform scale-[0.92] -translate-y-2 rounded-xl overflow-hidden shadow-lg bg-white opacity-70 z-0" />
                )}
                
                {/* Current card */}
                {currentIndex < jobs.length && (
                  <SwipeCard 
                    job={jobs[currentIndex]} 
                    onSwipe={handleSwipe}
                    matchScore={jobs[currentIndex].matchScore}
                    isRecommended={jobs[currentIndex].isRecommended}
                  />
                )}
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {jobs.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full ${
                    index < currentIndex ? 'w-6 bg-blue-500' : 
                    index === currentIndex ? 'w-8 bg-blue-500' : 
                    'w-6 bg-gray-300'
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No more jobs to show</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities!</p>
            <button 
              onClick={() => setCurrentIndex(0)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Over
            </button>
          </div>
        )}
        
        {/* Stats row */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-600">{currentIndex}</p>
            <p className="text-xs text-gray-500">Jobs Viewed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-600">{matches.length}</p>
            <p className="text-xs text-gray-500">Matches</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-purple-600">0</p>
            <p className="text-xs text-gray-500">Applications</p>
          </div>
        </div>
      </div>
      
      {showToast && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-4">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipePage;