import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ParticleNetwork from '../../components/layout/ParticleNetwork';
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Confetti from 'react-confetti';
import SuccessAnimation from '../common/SuccessAnimation';
import { MouseProvider } from '../layout/MouseTracker';
import CursorEffect from '../common/CursorEffect';
import TiltCard from '../common/TiltCard'; 
import ParallaxElement from '../layout/Parallax';

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
  const [animate, setAnimate] = useState(false);
  
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

  // Component mount animation
  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
    <MouseProvider>
      <div className="min-h-screen relative overflow-hidden dark:bg-gray-900">
        {/* Cursor effect */}
        <CursorEffect />
        
        {/* Removing the Dark mode toggle since it's now only on Home page */}
        
        {/* Background elements */}
        <ParticleNetwork />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-gray-800/80 dark:to-indigo-900/80 -z-4"></div>
        
        {/* New Parallax floating elements - Similar to Login page */}
        <ParallaxElement depth={-2} className="absolute top-[10%] right-[15%] z-0 opacity-50">
          <div className="w-20 h-20 bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </ParallaxElement>
        
        <ParallaxElement depth={-4} className="absolute bottom-[15%] left-[10%] z-0 opacity-50">
          <div className="w-16 h-16 bg-white/30 dark:bg.white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </ParallaxElement>
        
        <ParallaxElement depth={-3} className="absolute top-[50%] right-[10%] z-0 opacity-40">
          <div className="w-24 h-24 bg-white/30 dark:bg.white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </ParallaxElement>

        <ParallaxElement depth={-5} className="absolute bottom-[30%] right-[30%] z-0 opacity-30">
          <div className="w-14 h-14 bg-white/30 dark:bg.white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/40 rotate-45 flex items-center justify-center">
            <FiBriefcase className="h-7 w-7 text-indigo-500 -rotate-45" />
          </div>
        </ParallaxElement>

        <ParallaxElement depth={-6} className="absolute top-[30%] left-[20%] z-0 opacity-30">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500/30 to-purple-500/30 dark:from-pink-500/20 dark:to-purple-500/20 backdrop-blur-sm rounded-full shadow-lg border border-white/40 flex items-center justify-center">
            <FiUser className="h-6 w-6 text-white" />
          </div>
        </ParallaxElement>
        
        {/* Animated gradient blobs */}
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-gradient-to-r from-pink-300/30 to-purple-300/30 dark:from-pink-500/10 dark:to-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow"></div>
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-gradient-to-r from-yellow-300/30 to-green-300/30 dark:from-yellow-500/10 dark:to-green-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-gradient-to-r from-blue-300/30 to-teal-300/30 dark:from-blue-500/10 dark:to-teal-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob-slow animation-delay-4000"></div>
        
        {/* Decorative dots pattern - top right */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 hidden md:block">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className="h-3 w-3 rounded-full bg-indigo-400/30 dark:bg-indigo-300/20 backdrop-blur-sm"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Decorative lines pattern - bottom left */}
        <div className="absolute bottom-10 left-10 transform rotate-45 hidden md:block">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="h-px w-16 bg-blue-400/50 dark:bg-blue-300/30 my-3"
              style={{ width: `${64 + i * 16}px` }}
            ></div>
          ))}
        </div>

        {/* Floating cards in the background */}
        <div className="hidden md:block absolute top-[15%] right-[10%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform -rotate-12 animate-float shadow-lg"></div>
        <div className="hidden md:block absolute bottom-[20%] left-[8%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform rotate-12 animate-float-delayed shadow-lg"></div>
        
        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
          <TiltCard className="w-full max-w-md space-y-8 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-8 rounded-2xl border border-white/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
            {/* Progress bar */}
            <div className={`relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out ${getProgressWidth()}`}></div>
            </div>
            
            <div className={`flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1 transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className={step >= 1 ? "font-semibold text-blue-600 dark:text-blue-400" : ""}>Account Info</div>
              <div className={step >= 2 ? "font-semibold text-blue-600 dark:text-blue-400" : ""}>Security</div>
            </div>
            
            {/* Logo or app icon */}
            <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md transform transition-all duration-500 hover:scale-110 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            
            <div className={`text-center transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {step === 1 ? "Create an Account" : "Set Up Security"}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                {step === 1 ? "Join JobSwipe to find your dream job" : "Just a few more steps to secure your account"}
              </p>
            </div>
            
            {error && (
              <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/30 p-4 border-l-4 border-red-400 animate-shake">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
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
                        className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:scale-105 focus:translate-x-1 bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm sm:text-sm ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: '100ms' }}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                  </div>
                  
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
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
                        className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:scale-105 focus:translate-x-1 bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm sm:text-sm ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: '200ms' }}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>
                  
                  <div className="group">
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                      I am a
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiBriefcase className="text-gray-400 group-focus-within:text-blue-500" />
                      </div>
                      <select
                        id="userType"
                        name="userType"
                        className={`appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm sm:text-sm ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: '300ms' }}
                        value={formData.userType}
                        onChange={handleChange}
                      >
                        <option value="Job Seeker">Job Seeker</option>
                        <option value="Job Poster">Job Poster</option>
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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
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
                        className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:scale-105 focus:translate-x-1 bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm sm:text-sm ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: '100ms' }}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                  </div>
                  
                  {formData.password && (
                    <div className={`mt-1 transition-all duration-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '150ms' }}>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg.gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getPasswordStrength(formData.password).colorClass} transition-all duration-300`} 
                          style={{ width: `${getPasswordStrength(formData.password).percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Password strength: <span className={`font-medium ${getPasswordStrength(formData.password).colorClass.replace('bg-', 'text-')}`}>
                          {getPasswordStrength(formData.password).label}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <div className="group">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
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
                        className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all transform focus:scale-105 focus:translate-x-1 bg-white/80 dark:bg.gray-700/80 dark:text-white backdrop-blur-sm sm:text-sm ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: '200ms' }}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                  </div>
                  
                  <div className={`flex items-center transition-all duration-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline">Terms</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              )}
              
              <div className={`${step === 1 ? '' : 'flex space-x-3'} transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                {step === 2 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 transform hover:-translate-y-1"
                  >
                    Back
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`${step === 2 ? 'flex-1' : 'w-full'} group relative flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform hover:-translate-y-1 shadow-lg dark:shadow-blue-500/20`}
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
            
            <div className={`mt-6 transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-500 dark:text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2.5 px-4 border border-blue-300 dark:border-blue-700 rounded-lg shadow-sm text-sm font-medium text-blue-600 dark:text-blue-400 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 transform hover:-translate-y-1"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </TiltCard>
        </div>

        {showSuccess && (
          <>
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <SuccessAnimation message="Registration Successful!" />
            </div>
          </>
        )}
      </div>
    </MouseProvider>
  );
};

export default Register;