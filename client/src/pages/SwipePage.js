import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/jobs/SwipeCard';
import api from '../utils/api';
import { Link } from 'react-router-dom';

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
  
  // Add state for debugging
  const [debugMessage, setDebugMessage] = useState('');
  
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      setLoading(true);
      try {
        // Get AI-recommended jobs based on user's skills/resume
        const response = await api.get('/api/jobs/recommended/skills');
        console.log('API response:', response.data);
        
        if (response.data.message) {
          // Show message if no skills found
          setNoSkillsMessage(response.data.message);
        }
        
        // Set user skills from API response
        if (response.data.userSkills) {
          setUserSkills(response.data.userSkills);
        }
        
        // Process jobs from API to ensure they have all required fields
        let recommendedJobs = [];
        if (response.data.data && response.data.data.length > 0) {
          // Debug the first job to understand structure
          const firstJob = response.data.data[0];
          setDebugMessage(`First job structure: ${JSON.stringify(firstJob)}`);
          console.log('First job:', firstJob);
          
          recommendedJobs = response.data.data.map(job => {
            // Extract job data from _doc if it exists (common with Mongoose documents)
            // This handles both Mongoose document format and regular JSON objects
            const jobData = job._doc || job;
            
            // Debug: Log salary fields to see what's available
            console.log('Job salary data:', {
              salary: jobData.salary,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
              salaryPeriod: jobData.salaryPeriod
            });
            
            // Extract salary from MongoDB nested fields if necessary
            // Sometimes Mongoose returns nested objects with salary fields
            let salaryMin = undefined;
            let salaryMax = undefined;
            let salaryPeriod = 'yearly';
            
            // Check the schema structure for salary info
            if (jobData.salary && typeof jobData.salary === 'object') {
              // If salary is an object with min/max properties
              salaryMin = jobData.salary.min;
              salaryMax = jobData.salary.max;
              salaryPeriod = jobData.salary.period || 'yearly';
            } else {
              // Direct fields
              salaryMin = jobData.salaryMin;
              salaryMax = jobData.salaryMax;
              salaryPeriod = jobData.salaryPeriod || 'yearly';
            }
            
            // Use extracted data with fallbacks for missing fields
            return {
              id: jobData._id || jobData.id,
              title: jobData.title || 'Untitled Position',
              company: jobData.company || 'Unknown Company',
              description: jobData.description || 'No description provided',
              location: jobData.location || 'Remote/Flexible',
              // Include both formats of salary data to ensure compatibility
              salary: jobData.salary || '',
              salaryMin: salaryMin !== undefined ? Number(salaryMin) : undefined,
              salaryMax: salaryMax !== undefined ? Number(salaryMax) : undefined,
              salaryPeriod: salaryPeriod,
              skills: Array.isArray(jobData.skills) ? jobData.skills : [],
              matchScore: job.matchScore || 0,
              isRecommended: job.isRecommended === true,
              experienceLevel: jobData.experienceLevel || 'Entry Level',
              poster: jobData.poster
            };
          });

          // Debug: Log the first job after processing to verify fields
          if (recommendedJobs.length > 0) {
            console.log('First processed job:', recommendedJobs[0]);
          }
          
        }
        
        setJobs(recommendedJobs);
        
        // Show a welcome toast if we have skills and recommendations
        if (response.data.userSkills && response.data.userSkills.length > 0) {
          setToastMessage(`Found ${recommendedJobs.length} jobs matching your skills!`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        setDebugMessage(`Error: ${error.message}`);
        
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
      // Create new match object with timestamp
      const newMatch = {
        ...currentJob,
        matchedOn: new Date().toISOString(),
        status: 'new'
      };
      
      // Update local state
      setMatches(prev => [...prev, newMatch]);
      
      // Persist matches to localStorage
      try {
        // Get existing matches from localStorage
        const existingMatches = localStorage.getItem('jobMatches');
        let updatedMatches = [];
        
        if (existingMatches) {
          updatedMatches = JSON.parse(existingMatches);
          // Avoid duplicates
          if (!updatedMatches.some(match => match.id === newMatch.id)) {
            updatedMatches.push(newMatch);
          }
        } else {
          updatedMatches = [newMatch];
        }
        
        // Save back to localStorage
        localStorage.setItem('jobMatches', JSON.stringify(updatedMatches));
        
        console.log(`Matched with job: ${currentJob.id} and saved to localStorage`);
      } catch (error) {
        console.error('Error saving match to localStorage:', error);
      }
      
      // In a real app, you would also send this to your API
      // try {
      //   await api.post('/api/matches', newMatch);
      // } catch (err) {
      //   console.error('Error saving match to API:', err);
      // }
      
      // Show toast notification
      setToastMessage(`Matched with ${currentJob.title} at ${currentJob.company}!`);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    
    // Log the swipe action
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
      <div className="max-w-5xl mx-auto"> {/* Increased max-width for two-column layout */}
        
        {/* Add navigation to matches page */}
        <div className="flex justify-end mb-4">
          <Link 
            to="/matches"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-50 transition-colors flex items-center gap-1"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Your Matches {matches.length > 0 && <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">{matches.length}</span>}
          </Link>
        </div>
        
        {/* Two-column layout container */}
        <div className="flex flex-col md:flex-row md:gap-8">
          
          {/* Left column - Header content */}
          <div className="md:w-1/3 md:py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Find Your Next Job
            </h1>
            
            {userSkills && userSkills.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-600 mb-3">
                  Recommendations based on your skills:
                </p>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {noSkillsMessage && (
              <div className="mb-6 px-4 py-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-700">{noSkillsMessage}</p>
              </div>
            )}
            
            {/* Job browsing tips */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Swipe right or tap the checkmark for jobs you're interested in</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Swipe left or tap the X for jobs you want to pass</span>
                </li>
              </ul>
            </div>
            
            {/* Stats cards on smaller screens */}
            <div className="md:hidden grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <p className="text-xl font-bold text-blue-600">{currentIndex}</p>
                <p className="text-xs text-gray-500">Viewed</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <p className="text-xl font-bold text-green-600">{matches.length}</p>
                <p className="text-xs text-gray-500">Matches</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <p className="text-xl font-bold text-purple-600">0</p>
                <p className="text-xs text-gray-500">Applied</p>
              </div>
            </div>
          </div>
          
          {/* Right column - Job card */}
          <div className="md:w-2/3 flex flex-col justify-between">
            {loading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : currentIndex < jobs.length ? (
              <div className="relative h-[70vh] w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Card stack - show current and next card */}
                  <div className="relative w-full h-full max-w-md">
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
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
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
          </div>
        </div>
        
        {/* Stats row for larger screens */}
        <div className="hidden md:grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{currentIndex}</p>
            <p className="text-sm text-gray-500">Jobs Viewed</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <p className="text-3xl font-bold text-green-600">{matches.length}</p>
            <p className="text-sm text-gray-500">Matches</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-500">Applications</p>
          </div>
        </div>
      </div>
      
      {/* Toast notifications remain unchanged */}
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