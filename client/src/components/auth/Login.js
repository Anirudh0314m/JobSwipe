import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ParticleNetwork from '../../components/layout/ParticleNetwork';
import TiltCard from '../common/TiltCard';
import TypewriterEffect from '../common/TypewriterEffect';
import { MouseProvider } from '../layout/MouseTracker';
import SuccessAnimation from '../common/SuccessAnimation';
import ParallaxElement from '../layout/Parallax';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Add state for remember me checkbox (default to true)
  const [rememberMe, setRememberMe] = useState(true);
  
  const { login, user, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Add animation states for form fields
  const [animate, setAnimate] = useState(false);
  
  // Component mount animation
  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Update navigation logic to match the database values
  useEffect(() => {
    if (user) {
      // Show success animation before redirecting
      setLoginSuccess(true);
      
      // Delay navigation to show success animation
      const timer = setTimeout(() => {
        if (user.userType === 'Job Seeker') {
          navigate('/swipe');
        } else if (user.userType === 'Job Poster') {
          navigate('/post-job');
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  // Add handler for remember me checkbox
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pass rememberMe state to login function
    await login(formData, rememberMe);
  };
  
  return (
    <MouseProvider>
      <div className="min-h-screen relative overflow-hidden dark:bg-gray-900">
        
        {/* Background elements */}
        <ParticleNetwork />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-gray-800/80 dark:to-indigo-900/80 -z-4"></div>

        {/* Parallax floating elements - New additions from Home page */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-500 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </ParallaxElement>

        <ParallaxElement depth={-6} className="absolute top-[30%] left-[20%] z-0 opacity-30">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500/30 to-purple-500/30 dark:from-pink-500/20 dark:to-purple-500/20 backdrop-blur-sm rounded-full shadow-lg border border-white/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
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
        <div className="hidden md:block absolute top-[20%] left-[10%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform -rotate-12 animate-float shadow-lg"></div>
        <div className="hidden md:block absolute bottom-[15%] right-[12%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform rotate-12 animate-float-delayed shadow-lg"></div>
        
        {/* Success animation overlay */}
        {loginSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <SuccessAnimation />
          </div>
        )}
        
        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
          <TiltCard className="w-full max-w-md space-y-8 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-8 rounded-2xl border border-white/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
            {/* Logo or app icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md transform transition-transform duration-500 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="text-center">
              <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                <TypewriterEffect text="Welcome to JobSwipe" />
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">{getGreeting()}</span> - Sign in to continue your job search journey
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
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`
                        appearance-none block w-full pl-10 pr-3 py-2 
                        border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 
                        focus:border-blue-500 transition-all duration-300 
                        bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm sm:text-sm
                        transform focus:scale-105 focus:translate-x-1
                        ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                      `}
                      style={{ transitionDelay: '100ms' }}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className={`
                        appearance-none block w-full pl-10 pr-10 py-2 
                        border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-blue-500 
                        focus:border-blue-500 transition-all duration-300 
                        bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm sm:text-sm
                        transform focus:scale-105 focus:translate-x-1
                        ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                      `}
                      style={{ transitionDelay: '200ms' }}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
                   style={{ transitionDelay: '300ms' }}>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline transition-all">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Social login options */}
              <div className={`grid grid-cols-3 gap-3 transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                   style={{ transitionDelay: '400ms' }}>
                <button
                  type="button"
                  className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg.gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg.gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                  </svg>
                </button>
              </div>

              <div className={`transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                   style={{ transitionDelay: '500ms' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform hover:-translate-y-1 shadow-lg dark:shadow-blue-500/20"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className={`mt-6 transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                 style={{ transitionDelay: '600ms' }}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-500 dark:text-gray-400">
                    New to JobSwipe?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2.5 px-4 border border-blue-300 dark:border-blue-700 rounded-lg shadow-sm text-sm font-medium text-blue-600 dark:text-blue-400 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 transform hover:-translate-y-1"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </MouseProvider>
  );
};

export default Login;