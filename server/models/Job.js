const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add a job location'],
    trim: true
  },
  skills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  salary: {
    type: String,
    trim: true
  },
  salaryMin: {
    type: Number
  },
  salaryMax: {
    type: Number
  },
  salaryPeriod: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'yearly'
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    default: 'Full-time'
  },
  workSchedule: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  education: {
    type: String,
    enum: ['None', 'High School', 'Associate', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Professional'],
    default: 'None'
  },
  experience: {
    type: String,
    enum: ['No experience', '1-2 years', '3-5 years', '6-8 years', '9+ years'],
    default: 'No experience'
  },
  applicationInstructions: {
    type: String,
    trim: true
  },
  applicationDeadline: {
    type: Date
  },
  screeningQuestions: [{
    question: String,
    required: {
      type: Boolean,
      default: false
    }
  }],
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Track job views, matches, and applications
  stats: {
    views: {
      type: Number,
      default: 0
    },
    matches: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model('Job', JobSchema);