const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Import the named export
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads/resumes';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  }
});

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Just return the user data with profile fields
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Update user profile
// @access  Private
router.post('/', protect, async (req, res) => {
  const {
    name,
    title,
    location,
    dateOfBirth,
    about,
    skills
  } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (title) user.title = title;
    if (location) user.location = location;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (about) user.about = about;
    if (skills) user.skills = skills;
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/resume
// @desc    Upload resume
// @access  Private
router.post('/resume', [protect, upload.single('resume')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if old resume exists before attempting to delete
    if (user.resume && user.resume.path && fs.existsSync(user.resume.path)) {
      try {
        fs.unlinkSync(user.resume.path);
      } catch (err) {
        console.error('Error deleting old resume:', err);
      }
    }
    
    // Update user with new resume - ensure path is always a string
    user.resume = {
      filename: req.file.originalname,
      path: req.file.path || '', // Ensure path is never undefined
      mimeType: req.file.mimetype,
      uploadDate: Date.now()
    };
    
    await user.save();
    
    res.json({
      message: 'Resume uploaded successfully',
      resume: {
        filename: user.resume.filename,
        uploadDate: user.resume.uploadDate
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/resume
// @desc    Get user's resume info
// @access  Private
router.get('/resume', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    res.json({
      filename: user.resume.filename,
      uploadDate: user.resume.uploadDate,
      url: `/uploads/resumes/${path.basename(user.resume.path)}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add this route to serve resume files
router.get('/resume/:filename', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if the user has a resume with a valid path
    if (!user.resume || !user.resume.path) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    // Safety check to ensure path exists
    if (!fs.existsSync(user.resume.path)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }
    
    // Serve the file with a resolved path
    res.sendFile(path.resolve(user.resume.path));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;