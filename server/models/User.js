const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  userType: {
    type: String,
    enum: ['Job Seeker', 'Employer', 'Job Poster'],
    required: [true, 'Please specify user type']
  },
  // New profile fields
  title: {
    type: String
  },
  location: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  about: {
    type: String
  },
  skills: {
    type: [String]
  },
  // Resume data
  resume: {
    filename: String,
    path: String,
    mimeType: String,
    uploadDate: Date
  }, 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  // TEMPORARILY DISABLED - this was causing double hashing
  // Just pass through to avoid double hashing the password
  next();
  return;

  // if (!this.isModified('password')) {
  //   next();
  //   return;
  // }

  // const salt = await bcrypt.genSalt(10);
  // this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);