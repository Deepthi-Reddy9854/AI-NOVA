const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  completedSkills: [{ type: String }],
  completedRoadmapTasks: [{ type: String }],
  completedProjects: [{ type: String }],
  certifications: [
    {
      title: { type: String },
      issuer: { type: String },
      date: { type: String }
    }
  ],
  overallPercentage: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);
