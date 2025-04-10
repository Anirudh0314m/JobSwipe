const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String
  },
  location: {
    type: String
  },
  about: {
    type: String
  },
  skills: {
    type: [String]
  },
  resume: {
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadDate: Date
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      startDate: {
        type: String,
        required: true
      },
      endDate: {
        type: String
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldOfStudy: {
        type: String
      },
      startDate: {
        type: String,
        required: true
      },
      endDate: {
        type: String
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);