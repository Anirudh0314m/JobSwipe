import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            JobSwipe
          </Link>
          
          <div className="flex space-x-4">
            {user ? (
              <>
                {user.userType === 'Job Poster' ? (
                  <Link to="/post-job" className="hover:text-blue-200">
                    Post Job
                  </Link>
                ) : (
                  <Link to="/swipe" className="hover:text-blue-200">
                    Swipe Jobs
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;