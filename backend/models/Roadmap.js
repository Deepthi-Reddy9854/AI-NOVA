const mongoose = require('mongoose');

const RoadmapItemSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  estimatedTime: { type: String, default: '2 Weeks' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
});

const RoadmapPhaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  phaseName: { type: String, required: true },
  items: [RoadmapItemSchema]
});

const RoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  careerTitle: { type: String, required: true },
  phases: [RoadmapPhaseSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
