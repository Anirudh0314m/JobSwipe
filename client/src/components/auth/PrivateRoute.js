import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ element, userType }) => {
  const { user, loading } = useContext(AuthContext);
  
  // If auth is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If userType is specified and doesn't match, redirect to appropriate page
  if (userType && user.userType !== userType) {
    return user.userType === 'Job Seeker' 
      ? <Navigate to="/swipe" />
      : <Navigate to="/post-job" />;
  }
  
  // Render the protected component
  return element;
};

export default PrivateRoute;