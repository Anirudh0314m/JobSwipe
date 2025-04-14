const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getRecommendedJobs,
  recordJobMatch
} = require('../controllers/jobController');

const { protect, isJobPoster } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes for all authenticated users
router.get('/recommended/skills', protect, getRecommendedJobs); // AI-powered job recommendations
router.post('/:id/match', protect, recordJobMatch); // Record when a user matches with a job

// Protected routes for Job Posters only
router.post('/', protect, isJobPoster, createJob);
router.put('/:id', protect, isJobPoster, updateJob);
router.delete('/:id', protect, isJobPoster, deleteJob);

module.exports = router;