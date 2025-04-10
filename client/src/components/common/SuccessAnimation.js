import React from 'react';

const SuccessAnimation = ({ message = "Success!" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-auto shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 relative mb-4">
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping-slow opacity-25"></div>
            <div className="relative flex items-center justify-center w-full h-full rounded-full bg-green-100">
              <svg className="w-12 h-12 text-green-500 animate-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
          <p className="text-gray-600 text-center">You will be redirected shortly...</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;