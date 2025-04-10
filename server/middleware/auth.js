const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if user is a Job Poster
exports.isJobPoster = (req, res, next) => {
  if (req.user && req.user.userType === 'Job Poster') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied: Only Job Posters can perform this action' });
  }
};