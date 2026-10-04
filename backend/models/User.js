const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  education: {
    type: String,
    default: 'Bachelor of Technology'
  },
  college: {
    type: String,
    default: 'State University'
  },
  course: {
    type: String,
    default: 'Computer Science'
  },
  graduationYear: {
    type: Number,
    default: new Date().getFullYear() + 2
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
