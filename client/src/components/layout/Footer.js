import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">JobSwipe</h3>
            <p className="text-gray-400">Find your perfect match</p>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} JobSwipe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;