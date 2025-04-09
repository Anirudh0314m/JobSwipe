import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If userType is specified, check if user has that type
  if (userType && user.userType !== userType) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;