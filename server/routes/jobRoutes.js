const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getRecommendedJobs,
  recordJobMatch,
  getUserJobs
} = require('../controllers/jobController');

const { protect, isJobPoster } = require('../middleware/auth');

const router = express.Router();

// Protected routes for Job Posters only - specific routes first
router.get('/user/me', protect, isJobPoster, getUserJobs); // Get jobs posted by current user
router.get('/recommended/skills', protect, getRecommendedJobs); // AI-powered job recommendations
router.post('/:id/match', protect, recordJobMatch); // Record when a user matches with a job

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes for Job Posters only - general routes
router.post('/', protect, isJobPoster, createJob);
router.put('/:id', protect, isJobPoster, updateJob);
router.delete('/:id', protect, isJobPoster, deleteJob);

module.exports = router;