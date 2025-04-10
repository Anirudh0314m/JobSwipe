import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MatchesPage = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch from API
    // For now, use sample data
    const sampleMatches = [
      {
        id: 2,
        title: "UX Designer",
        company: "Creative Solutions",
        description: "Design beautiful and intuitive user experiences for web and mobile apps.",
        location: "New York, NY",
        salary: "95,000 - 120,000",
        skills: ["Figma", "UI Design", "User Research"],
        matchedOn: "2023-08-15T12:00:00Z",
        status: "new"
      },
      {
        id: 5,
        title: "DevOps Engineer",
        company: "CloudTech",
        description: "Build and maintain our cloud infrastructure and CI/CD pipelines.",
        location: "Seattle, WA",
        salary: "125,000 - 155,000",
        skills: ["AWS", "Docker", "Kubernetes"],
        matchedOn: "2023-08-12T15:30:00Z",
        status: "applied"
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setMatches(sampleMatches);
      setLoading(false);
    }, 800);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Your Matches
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Jobs you've matched with. You can now apply to these positions.
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-6">
            {matches.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:shadow-lg hover:-translate-y-1"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 md:w-48 h-32 md:h-auto flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                      <p className="font-bold text-lg">{job.company.charAt(0)}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 md:flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      
                      {job.status === 'new' ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          New Match
                        </span>
                      ) : job.status === 'applied' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Applied
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Viewed
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{job.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{job.salary}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Matched on {new Date(job.matchedOn).toLocaleDateString()}
                      </p>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Details
                        </button>
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No matches yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start swiping on jobs to find your matches!</p>
            <Link
              to="/swipe"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Find Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;