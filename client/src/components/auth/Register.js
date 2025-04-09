import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'Job Seeker' // Default value
  });
  
  const [passwordError, setPasswordError] = useState('');
  const { register, user, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect
    if (user) {
      if (user.userType === 'Job Seeker') {
        navigate('/swipe');
      } else {
        navigate('/post-job');
      }
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear password error when user types in either password field
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Send only the data needed for registration (exclude confirmPassword)
    const { confirmPassword, ...registrationData } = formData;
    await register(registrationData);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            placeholder="******************"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              passwordError ? 'border-red-500' : ''
            }`}
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="******************"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-xs italic">{passwordError}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
            I am a:
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="Job Seeker"
                checked={formData.userType === 'Job Seeker'}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Job Seeker</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="Job Poster"
                checked={formData.userType === 'Job Poster'}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Job Poster</span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;