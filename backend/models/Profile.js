const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: { type: String, default: '' },
  age: { type: Number, default: 20 },
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  branch: { type: String, default: '' },
  currentYear: { type: String, default: '3rd Year' },
  cgpa: { type: Number, default: 8.0 },
  graduationYear: { type: Number, default: 2026 },
  technicalSkills: [{ type: String }],
  softSkills: [{ type: String }],
  interests: [{ type: String }],
  hobbies: [{ type: String }],
  preferredCareer: { type: String, default: '' },
  preferredWorkArea: { type: String, default: 'Software Development' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  profileCompletion: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);
