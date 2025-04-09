
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Not authorized to access this route' });
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