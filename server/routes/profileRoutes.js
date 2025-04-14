const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Import the named export
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const aiService = require('../utils/aiService'); // Import the AI service

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
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    console.log('Resume upload request received');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete old resume if it exists
    if (user.resume && user.resume.path && typeof user.resume.path === 'string') {
      const fullPath = path.resolve(user.resume.path);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log('Old resume deleted');
        } catch (err) {
          console.error('Error deleting old resume:', err);
        }
      }
    }
    
    // Update user with new resume
    user.resume = {
      filename: req.file.originalname,
      path: req.file.path,
      mimeType: req.file.mimetype,
      uploadDate: Date.now()
    };
    
    let extractedSkills = [];
    
    // Extract text and skills from the resume using AI service
    try {
      // Extract text from the resume
      const resumeText = await aiService.extractResumeText(req.file.path);
      
      // Extract skills from the resume text
      extractedSkills = aiService.extractSkills(resumeText);
      
      console.log('AI extracted skills:', extractedSkills);
      
      // FIXED: Initialize skills array if it doesn't exist
      if (!user.skills) {
        user.skills = [];
      }
      
      // FIXED: Ensure skills is treated as an array
      const currentSkills = Array.isArray(user.skills) ? user.skills : [];
      
      // Create a set of lowercase existing skills for comparison
      const existingSkillsSet = new Set(currentSkills.map(skill => skill.toLowerCase()));
      
      // Add new skills if they're not duplicates
      if (extractedSkills && Array.isArray(extractedSkills)) {
        extractedSkills.forEach(skill => {
          if (!existingSkillsSet.has(skill.toLowerCase())) {
            currentSkills.push(skill);
          }
        });
      }
      
      // Update the user's skills array
      user.skills = currentSkills;
      
      console.log('Updated user skills:', user.skills);
      
      // Store the extracted skills in the user's resume object for future reference
      user.resume.extractedSkills = extractedSkills;
    } catch (error) {
      console.error('Error extracting skills from resume:', error);
      // Continue without skills extraction if there's an error
    }
    
    console.log('Saving user with resume:', user.resume);
    console.log('Skills to be saved:', user.skills);
    
    // Explicitly set skills in case the array is not being recognized
    await User.findByIdAndUpdate(
      user._id,
      { 
        resume: user.resume,
        skills: user.skills
      },
      { new: true }
    );
    
    console.log('User saved successfully');
    
    // Return response with filename, uploadDate, and extracted skills
    res.json({
      message: 'Resume uploaded successfully',
      resume: {
        filename: user.resume.filename,
        uploadDate: user.resume.uploadDate,
        extractedSkills: extractedSkills || []
      }
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET api/profile/resume
// @desc    Get user's resume info
// @access  Private
router.get('/resume', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has a resume
    if (!user.resume || !user.resume.filename) {
      return res.status(404).json({ message: 'No resume found for this user' });
    }
    
    // Ensure we have a path to work with
    const resumePath = user.resume.path || '';
    const filename = path.basename(resumePath);
    
    res.json({
      filename: user.resume.filename,
      uploadDate: user.resume.uploadDate,
      url: `/uploads/resumes/${filename}`
    });
  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add this route to serve resume files
router.get('/resume/:filename', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    // Check if the requested file belongs to the user
    const resumeFileName = path.basename(user.resume.path || '');
    if (resumeFileName !== req.params.filename) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get the full path to the file
    const resumePath = path.resolve(user.resume.path);
    
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }
    
    // Serve the file
    res.sendFile(resumePath);
  } catch (err) {
    console.error('Error serving resume file:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;