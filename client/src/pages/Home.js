import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <div className="py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to JobSwipe</h1>
        <p className="text-xl mb-8">Find your perfect job match with AI-powered assistance</p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-gray-100 text-blue-500 border border-blue-500 font-bold py-2 px-6 rounded-full"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;