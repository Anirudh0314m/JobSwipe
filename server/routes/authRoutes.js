const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Add a route to reset a test user's password - this is for development purposes only
// You should remove this code in production
router.post('/reset-test-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save the user with the new password
    await user.save();
    
    res.status(200).json({ success: true, msg: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;