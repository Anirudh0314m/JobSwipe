import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/jobs/JobCard';
import ParticleNetwork from '../components/layout/ParticleNetwork';
import Illustrations from '../components/layout/Illustrations';

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
  const [activeCards, setActiveCards] = useState(sampleJobs.slice(0, 3));
  const [swipingCard, setSwipingCard] = useState(null);
  const [swipingDirection, setSwipingDirection] = useState(null);
  
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
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Particle network background */}
      <ParticleNetwork />
      
      {/* Gradient overlay to add depth to particles */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 -z-4"></div>
      
      {/* Animated gradient blobs */}
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow"></div>
      <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-gradient-to-r from-yellow-300/30 to-green-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-2000"></div>
      <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-gradient-to-r from-blue-300/30 to-teal-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-4000"></div>
      
      {/* Remove the existing blob decorations or make them more subtle */}
      
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
        {/* Left side: Content */}
        <div className="md:w-1/2 text-center md:text-left z-10 backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl">
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
        
        {/* Right side: Interactive card stack with illustration */}
        <div className="md:w-1/2 mt-12 md:mt-0 relative h-[30rem]">
          {/* Add the hero illustration behind the cards */}
          <div className="absolute inset-0 z-0">
            <Illustrations type="hero" />
          </div>
          
          {/* Keep your existing card stack */}
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
      
      {/* Feature highlights with illustrations */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How JobSwipe Works</h2> 
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="backdrop-blur-md bg-white/30 p-7 rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden group">
            {/* Light refraction effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full blur-xl group-hover:translate-x-10 transition-all duration-700"></div>
            
            <div className="relative">
              <Illustrations type="upload" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">Upload Your Resume</h3>
              <p className="text-gray-700">Our AI analyzes your skills and experience to find the best matches for you.</p>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/30 p-7 rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden group">
            {/* Light refraction effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/30 rounded-full blur-xl group-hover:translate-x-10 transition-all duration-700"></div>
            
            <div className="relative">
              <Illustrations type="swipe" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">Swipe Through Jobs</h3>
              <p className="text-gray-700">Swipe right on jobs you like, left on those you don't. It's that simple and efficient.</p>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/30 p-7 rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden group">
            {/* Light refraction effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/30 rounded-full blur-xl group-hover:translate-x-10 transition-all duration-700"></div>
            
            <div className="relative">
              <Illustrations type="match" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">Get Matched</h3>
              <p className="text-gray-700">When you match with a job, we'll help tailor your application for success.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;