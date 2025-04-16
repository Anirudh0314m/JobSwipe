const Job = require('../models/Job');
const User = require('../models/User');
const Profile = require('../models/Profile');
const aiService = require('../utils/aiService');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Job Poster only)
exports.createJob = async (req, res) => {
  try {
    // Add user to req.body
    req.body.poster = req.user.id;
    
    // Normalize skills (trim, lowercase for better matching)
    if (req.body.skills && Array.isArray(req.body.skills)) {
      req.body.skills = req.body.skills
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
    
    const job = await Job.create(req.body);
    
    res.status(201).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err);
    
    // Validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate({
      path: 'poster',
      select: 'email'
    });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'poster',
      select: 'email'
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Update view count
    await Job.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.views': 1 }
    });
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job Poster only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Make sure user is job owner
    if (job.poster.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this job'
      });
    }
    
    // Normalize skills if provided
    if (req.body.skills && Array.isArray(req.body.skills)) {
      req.body.skills = req.body.skills
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
    
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job Poster only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Make sure user is job owner
    if (job.poster.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this job'
      });
    }
    
    await job.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get AI-recommended jobs based on user skills
// @route   GET /api/jobs/recommended/skills
// @access  Private
exports.getRecommendedJobs = async (req, res) => {
  try {
    // Get the current user profile
    let profile;
    try {
      profile = await Profile.findOne({ user: req.user.id });
    } catch (err) {
      console.log('No profile found, trying with user model');
    }
    
    // Get the current user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get user skills from profile or resume
    let userSkills = [];
    
    // First priority: Skills from profile
    if (profile && profile.skills && profile.skills.length > 0) {
      userSkills = profile.skills;
    }
    // Second priority: Skills extracted from resume
    else if (user.resume && user.resume.extractedSkills && user.resume.extractedSkills.length > 0) {
      userSkills = user.resume.extractedSkills;
    }
    // Third priority: Any skills set on user 
    else if (user.skills && user.skills.length > 0) {
      userSkills = user.skills;
    }
    
    // If no skills found, return regular jobs
    if (userSkills.length === 0) {
      const jobs = await Job.find()
        .sort({ 'createdAt': -1 })
        .populate({
          path: 'poster',
          select: 'name'
        });
      
      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
        message: 'No skills found in your profile. Please add skills or upload a resume for personalized recommendations.'
      });
    }
    
    console.log(`Finding job matches for skills: ${userSkills.join(', ')}`);
    
    // Get all jobs
    const allJobs = await Job.find()
      .sort({ 'createdAt': -1 })
      .populate({
        path: 'poster',
        select: 'name'
      });
    
    // Use AI service to rank jobs by skill match
    const rankedJobs = aiService.rankJobsBySkillMatch(userSkills, allJobs);
    
    // Return the ranked jobs with match scores
    res.status(200).json({
      success: true,
      count: rankedJobs.length,
      data: rankedJobs,
      userSkills
    });
  } catch (err) {
    console.error('Error getting recommended jobs:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Record a job match (when a user swipes right)
// @route   POST /api/jobs/:id/match
// @access  Private
exports.recordJobMatch = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Update match count
    await Job.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.matches': 1 }
    });
    
    // Create a match record (could be stored in a separate collection)
    // This would typically involve creating a Match document in a real app
    
    res.status(200).json({
      success: true,
      message: 'Match recorded successfully'
    });
  } catch (err) {
    console.error('Error recording match:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get jobs posted by the current user
// @route   GET /api/jobs/user/me
// @access  Private (Job Poster only)
exports.getUserJobs = async (req, res) => {
  try {
    // Find jobs where the poster matches the current user ID
    const userJobs = await Job.find({ poster: req.user.id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .populate({
        path: 'poster',
        select: 'email'
      });
    
    res.status(200).json({
      success: true,
      count: userJobs.length,
      data: userJobs
    });
  } catch (err) {
    console.error('Error fetching user jobs:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};