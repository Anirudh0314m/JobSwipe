import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ParticleNetwork from '../../components/layout/ParticleNetwork';
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Confetti from 'react-confetti';
import SuccessAnimation from '../common/SuccessAnimation';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'Job Seeker' // Default value
  });
  
  const [errors, setErrors] = useState({});
  const { register, user, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    if (user) {
      navigate('/swipe');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };
  
  const prevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      nextStep();
      return;
    }
    
    if (validateStep2()) {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      
      // Show success animation if registration was successful
      if (success) {
        setShowSuccess(true);
        // Navigate after a delay
        setTimeout(() => navigate('/login'), 3000);
      }
    }
  };
  
  const getProgressWidth = () => {
    return step === 1 ? 'w-1/2' : 'w-full';
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'Empty' };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    let label = '';
    let colorClass = '';
    
    switch (strength) {
      case 0:
      case 1:
        label = 'Weak';
        colorClass = 'bg-red-500';
        break;
      case 2:
      case 3:
        label = 'Medium';
        colorClass = 'bg-yellow-500';
        break;
      case 4:
        label = 'Strong';
        colorClass = 'bg-green-500';
        break;
      case 5:
        label = 'Very Strong';
        colorClass = 'bg-green-600';
        break;
      default:
        label = 'Weak';
        colorClass = 'bg-red-500';
    }
    
    return { strength, percentage: (strength / 5) * 100, label, colorClass };
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <ParticleNetwork />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 -z-4"></div>
      
      {/* Animated gradient blobs */}
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow"></div>
      <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-gradient-to-r from-yellow-300/30 to-green-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-2000"></div>
      <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-gradient-to-r from-blue-300/30 to-teal-300/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-4000"></div>
      
      {/* Floating cards in the background */}
      <div className="hidden md:block absolute top-[15%] right-[10%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform -rotate-12 animate-float shadow-lg"></div>
      <div className="hidden md:block absolute bottom-[20%] left-[8%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform rotate-12 animate-float-delayed shadow-lg"></div>
      
      {/* Floating icons */}
      <div className="hidden md:flex absolute top-1/4 left-1/5 h-16 w-16 bg-gradient-to-br from-purple-500/40 to-blue-500/40 backdrop-blur-md rounded-xl items-center justify-center animate-float shadow-lg">
        <FiBriefcase className="text-white text-2xl" />
      </div>
      <div className="hidden md:flex absolute bottom-1/4 right-1/5 h-16 w-16 bg-gradient-to-br from-blue-500/40 to-indigo-500/40 backdrop-blur-md rounded-xl items-center justify-center animate-float-delayed shadow-lg">
        <FiCheckCircle className="text-white text-2xl" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 backdrop-blur-md bg-white/70 p-8 rounded-2xl shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
          {/* Progress bar */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out ${getProgressWidth()}`}></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <div className={step >= 1 ? "font-semibold text-blue-600" : ""}>Account Info</div>
            <div className={step >= 2 ? "font-semibold text-blue-600" : ""}>Security</div>
          </div>
          
          {/* Logo or app icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {step === 1 ? "Create an Account" : "Set Up Security"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {step === 1 ? "Join JobSwipe to find your dream job" : "Just a few more steps to secure your account"}
            </p>
          </div>
          
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 border-l-4 border-red-400 animate-shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:translate-x-1 bg-white/80 backdrop-blur-sm sm:text-sm`}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:translate-x-1 bg-white/80 backdrop-blur-sm sm:text-sm`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div className="group">
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
                    I am a
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <select
                      id="userType"
                      name="userType"
                      className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm sm:text-sm"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="Job Seeker">Job Seeker</option>
                      <option value="Employer">Employer</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:translate-x-1 bg-white/80 backdrop-blur-sm sm:text-sm`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                
                {formData.password && (
                  <div className="mt-1">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrength(formData.password).colorClass} transition-all duration-300`} 
                        style={{ width: `${getPasswordStrength(formData.password).percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password strength: <span className={`font-medium ${getPasswordStrength(formData.password).colorClass.replace('bg-', 'text-')}`}>
                        {getPasswordStrength(formData.password).label}
                      </span>
                    </p>
                  </div>
                )}
                
                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:translate-x-1 bg-white/80 backdrop-blur-sm sm:text-sm`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-500 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:text-blue-500 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
            )}
            
            <div className={step === 1 ? '' : 'flex space-x-3'}>
              {step === 2 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`${step === 2 ? 'flex-1' : 'w-full'} group relative flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform hover:-translate-y-1 shadow-lg`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {step === 1 ? 'Checking...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {step === 1 ? 'Continue' : 'Create Account'}
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/70 backdrop-blur-sm text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-blue-300 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white/80 backdrop-blur-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 transform hover:-translate-y-1"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
          <SuccessAnimation message="Registration Successful!" />
        </>
      )}
    </div>
  );
};

export default Register;