import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ParticleNetwork from '../../components/layout/ParticleNetwork';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login, user, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
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
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
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
      
      {/* Decorative dots pattern - top right */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 hidden md:block">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="h-3 w-3 rounded-full bg-indigo-400/30 backdrop-blur-sm"
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
            className="h-px w-16 bg-blue-400/50 my-3"
            style={{ width: `${64 + i * 16}px` }}
          ></div>
        ))}
      </div>

      {/* Floating cards in the background */}
      <div className="hidden md:block absolute top-[20%] left-[10%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform -rotate-12 animate-float shadow-lg"></div>
      <div className="hidden md:block absolute bottom-[15%] right-[12%] w-64 h-40 bg-white/10 backdrop-blur-sm rounded-xl transform rotate-12 animate-float-delayed shadow-lg"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 backdrop-blur-md bg-white/70 p-8 rounded-2xl shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
          {/* Logo or app icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Welcome to JobSwipe
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to continue your job search journey
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
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
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
                      border border-gray-300 rounded-md shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-blue-500 
                      focus:border-blue-500 transition-all duration-300 
                      bg-white/80 backdrop-blur-sm sm:text-sm
                      transform focus:scale-105 focus:translate-x-1
                    `}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
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
                      appearance-none block w-full pl-10 pr-3 py-2 
                      border border-gray-300 rounded-md shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-blue-500 
                      focus:border-blue-500 transition-all duration-300 
                      bg-white/80 backdrop-blur-sm sm:text-sm
                      transform focus:scale-105 focus:translate-x-1
                    `}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform hover:-translate-y-1 shadow-lg"
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
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/70 backdrop-blur-sm text-gray-500">
                  New to JobSwipe?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2.5 px-4 border border-blue-300 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white/80 backdrop-blur-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 transform hover:-translate-y-1"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;