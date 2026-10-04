const mongoose = require('mongoose');

const RecommendedCareerSchema = new mongoose.Schema({
  careerTitle: { type: String, required: true },
  matchPercentage: { type: Number, required: true },
  suitabilityReason: { type: String, required: true },
  requiredSkills: [{ type: String }],
  existingSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  recommendedProjects: [{ type: String }],
  recommendedCertifications: [{ type: String }],
  jobRoles: [{ type: String }]
});

const RecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topCareer: { type: String },
  recommendedCareers: [RecommendedCareerSchema],
  aiGenerated: { type: Boolean, default: false },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
