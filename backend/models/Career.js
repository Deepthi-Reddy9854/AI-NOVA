const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  category: { type: String, default: 'Engineering' },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  requiredTechnologies: [{ type: String }],
  possibleJobRoles: [{ type: String }],
  averageSalary: { type: String, default: '₹9,00,000 - ₹22,00,000 / year' },
  growthRate: { type: String, default: 'High (22% projected growth)' },
  suitabilityKeywords: [{ type: String }],
  recommendedCertifications: [{ type: String }],
  recommendedProjects: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Career', CareerSchema);
