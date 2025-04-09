const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

const { protect, isJobPoster } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes for Job Posters only
router.post('/', protect, isJobPoster, createJob);
router.put('/:id', protect, isJobPoster, updateJob);
router.delete('/:id', protect, isJobPoster, deleteJob);

module.exports = router;