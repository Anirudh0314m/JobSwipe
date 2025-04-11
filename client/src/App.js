import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JobPost from './pages/JobPost';
import SwipePage from './pages/SwipePage';
import PrivateRoute from './components/auth/PrivateRoute';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/swipe" element={<PrivateRoute element={<SwipePage />} userType="Job Seeker" />} />
              <Route path="/post-job" element={<PrivateRoute element={<JobPost />} userType="Job Poster" />} />
              <Route path="/matches" element={<PrivateRoute element={<MatchesPage />} userType="Job Seeker" />} />
              <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;