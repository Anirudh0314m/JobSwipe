import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/jobs/JobCard';
import ParticleNetwork from '../components/layout/ParticleNetwork';
import { MouseProvider } from '../components/layout/MouseTracker';
import ParallaxElement from '../components/layout/Parallax';
import DarkModeToggle from '../components/common/DarkModeToggle';

// Sample job data for the animation
const sampleJobs = [
  {
    title: "Frontend Developer",
    company: "Tech Innovations",
    skills: ["React", "JavaScript", "CSS"]
  },
  {
    title: "UX Designer",
    company: "Creative Solutions",
    skills: ["Figma", "UI Design", "Prototyping"]
  },
  {
    title: "Data Scientist",
    company: "Analytics Co",
    skills: ["Python", "Machine Learning", "SQL"]
  },
  {
    title: "Project Manager",
    company: "Enterprise Systems",
    skills: ["Agile", "Leadership", "Communication"]
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Services Inc",
    skills: ["AWS", "Docker", "CI/CD"]
  }
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeCards, setActiveCards] = useState(sampleJobs.slice(0, 3));
  const [swipingCard, setSwipingCard] = useState(null);
  const [swipingDirection, setSwipingDirection] = useState(null);
  
  // Redirect authenticated users to appropriate pages
  useEffect(() => {
    if (user) {
      if (user.userType === 'Job Seeker') {
        navigate('/swipe');
      } else if (user.userType === 'Job Poster') {
        navigate('/post-job');
      }
    }
  }, [user, navigate]);
  
  // Animation for periodic card swiping
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeCards.length > 0) {
        // Randomly decide swipe direction
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        // Set the top card as swiping
        setSwipingCard(0);
        setSwipingDirection(direction);
        
        // After animation completes, rotate the cards
        setTimeout(() => {
          const nextJobs = [...activeCards.slice(1)];
          // Add a new card from the sample jobs
          const nextIndex = Math.floor(Math.random() * sampleJobs.length);
          nextJobs.push(sampleJobs[nextIndex]);
          
          setActiveCards(nextJobs);
          setSwipingCard(null);
          setSwipingDirection(null);
        }, 800);
      }
    }, 5000); // Swipe every 5 seconds
    
    return () => clearInterval(interval);
  }, [activeCards]);
  
  // Add this function inside the Home component
  const handleCardClick = (index, direction) => {
    // Only allow clicking the top card
    if (index !== 0) return;
    
    // Set the swiping animation
    setSwipingCard(0);
    setSwipingDirection(direction);
    
    // After animation completes, update the card stack
    setTimeout(() => {
      const nextJobs = [...activeCards.slice(1)];
      // Add a new card from the sample jobs
      const nextIndex = Math.floor(Math.random() * sampleJobs.length);
      nextJobs.push(sampleJobs[nextIndex]);
      
      setActiveCards(nextJobs);
      setSwipingCard(null);
      setSwipingDirection(null);
    }, 800);
  };

  return (
    <MouseProvider>
      <div className="relative min-h-[80vh] overflow-hidden">
        {/* Background elements */}
        <ParticleNetwork />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-gray-800/80 dark:to-indigo-900/80 -z-4"></div>
        
        {/* Dark mode toggle */}
        <div className="absolute top-4 right-4 z-30">
          <DarkModeToggle />
        </div>
        
        {/* Parallax floating elements */}
        <ParallaxElement depth={-2} className="absolute top-[10%] right-[15%] z-0 opacity-50">
          <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg border border-white/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </ParallaxElement>
        
        <ParallaxElement depth={-4} className="absolute bottom-[15%] left-[10%] z-0 opacity-50">
          <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg border border-white/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </ParallaxElement>
        
        <ParallaxElement depth={-3} className="absolute top-[50%] right-[10%] z-0 opacity-40">
          <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full shadow-lg border border-white/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </ParallaxElement>
        
        {/* Keep your animated gradient blobs */}
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow"></div>
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-gradient-to-r from-yellow-300/30 to-green-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-gradient-to-r from-blue-300/30 to-teal-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          {/* Left side content with parallax effect */}
          <ParallaxElement depth={1} className="md:w-1/2 z-10">
            <div className="text-center md:text-left backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl transform transition-all hover:shadow-2xl duration-300">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Swipe Right for Your <span className="text-blue-600">Dream Job</span>
              </h1>
              <p className="text-xl mb-8 text-gray-700">
                JobSwipe uses AI to match you with perfect job opportunities. Simply swipe right when you like a job, left when you don't.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transform transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white/80 backdrop-blur-sm text-blue-600 font-bold rounded-full shadow border border-blue-200 hover:bg-blue-50 transform transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </ParallaxElement>
          
          {/* Right side: Interactive card stack */}
          <div className="md:w-1/2 mt-12 md:mt-0 relative h-[30rem]">
            {/* 3D Job Cards */}
            <div className="relative w-80 md:w-96 h-[24rem] mx-auto z-10">
              {activeCards.map((job, index) => (
                <div 
                  key={index}
                  className={`${
                    swipingCard === index 
                      ? swipingDirection === 'right' 
                        ? 'animate-swipe-right'
                        : 'animate-swipe-left'
                      : ''
                  }`}
                >
                  <JobCard
                    title={job.title}
                    company={job.company}
                    skills={job.skills}
                    index={index}
                    onCardClick={handleCardClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Feature highlights with 3D effects */}
        <div className="container mx-auto px-4 py-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How JobSwipe Works</h2> 
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <ParallaxElement depth={1.5} className="w-full">
              <div className="backdrop-blur-md bg-white/30 p-7 rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden group hover:translate-z-10">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full blur-xl group-hover:translate-x-10 transition-all duration-700"></div>
                
                <div className="relative">
                  <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Upload Your Resume</h3>
                  <p className="text-gray-700">Our AI analyzes your skills and experience to find the best matches for you.</p>
                </div>
              </div>
            </ParallaxElement>
            
            {/* Feature 2 */}
            <ParallaxElement depth={2} className="w-full">
              <div className="backdrop-blur-md bg-white/30 p-7 rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden group hover:translate-z-10">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/30 rounded-full blur-xl group-hover:translate-x-10 transition-all duration-700"></div>
                
                <div className="relative">
                  <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Swipe Through Jobs</h3>
                  <p className="text-gray-700">Swipe right on jobs you like, left on those you don't. It's that simple and efficient.</p>
                </div>
              </div>
            </ParallaxElement>
            
            {/* Feature 3 */}
            <ParallaxElement depth={1.5} className="w-full">
              <div className="backdrop-blur-md bg-white/30 p-7 rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden group hover:translate-z-10">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/30 rounded-full blur-xl group-hover:translate-x-10 transition-all duration-700"></div>
                
                <div className="relative">
                  <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Get Matched</h3>
                  <p className="text-gray-700">When you match with a job, we'll help tailor your application for success.</p>
                </div>
              </div>
            </ParallaxElement>
          </div>
        </div>
      </div>
    </MouseProvider>
  );
};

export default Home;