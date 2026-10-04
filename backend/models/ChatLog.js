const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [
    {
      sender: { type: String, enum: ['user', 'bot'], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', ChatLogSchema);
