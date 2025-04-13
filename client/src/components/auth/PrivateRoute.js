import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ element, userType }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Effect to handle redirection based on user type when component mounts or updates
  useEffect(() => {
    // Only run this logic when we have a user loaded and we're not in a loading state
    if (!loading && user) {
      // Use different redirection strategy based on route requirements and user type
      if (userType && user.userType !== userType) {
        // Debug log to see when redirects happen
        console.log(`User type mismatch - Required: ${userType}, User is: ${user.userType}`);
        
        // Determine the home route for this user type
        const homeRoute = user.userType === 'Job Seeker' ? '/swipe' : '/post-job';
        
        // Navigate programmatically to avoid refresh
        navigate(homeRoute, { replace: true });
      }
    }
  }, [user, loading, userType, navigate, location.pathname]);
  
  // Show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If no specific userType is required or the userType matches, render the component
  if (!userType || user.userType === userType) {
    return element;
  }
  
  // This is a fallback - the useEffect should handle the redirection before we get here
  // But just to be safe, we'll return null to avoid rendering the wrong component
  return null;
}

export default PrivateRoute;