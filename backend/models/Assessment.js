const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interests: [{ type: String }],
  technicalSkills: [{ type: String }],
  favoriteSubjects: [{ type: String }],
  problemSolvingRating: { type: Number, min: 1, max: 10, default: 7 },
  communicationRating: { type: Number, min: 1, max: 10, default: 7 },
  creativityRating: { type: Number, min: 1, max: 10, default: 7 },
  leadershipRating: { type: Number, min: 1, max: 10, default: 7 },
  preferredWorkType: { type: String, default: 'Hybrid' },
  careerInterests: [{ type: String }],
  calculatedScores: { type: Object, default: {} },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
