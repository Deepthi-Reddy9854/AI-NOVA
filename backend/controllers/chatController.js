const ChatLog = require('../models/ChatLog');
const Profile = require('../models/Profile');
const { getAIChatResponse } = require('../services/aiService');

// @desc Send Chat Message to AI Chatbot
// @route POST /api/chat
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const userId = req.user.id;
    const profile = await Profile.findOne({ user: userId });

    const botResponseText = await getAIChatResponse(message, profile);

    let chatLog = await ChatLog.findOne({ user: userId });

    if (!chatLog) {
      chatLog = new ChatLog({
        user: userId,
        messages: []
      });
    }

    chatLog.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date()
    });

    chatLog.messages.push({
      sender: 'bot',
      text: botResponseText,
      timestamp: new Date()
    });

    chatLog.updatedAt = new Date();
    await chatLog.save();

    res.status(200).json({
      success: true,
      userMessage: message,
      reply: botResponseText,
      messages: chatLog.messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Chat History
// @route GET /api/chat
const getChatHistory = async (req, res, next) => {
  try {
    const chatLog = await ChatLog.findOne({ user: req.user.id });
    res.status(200).json({
      success: true,
      messages: chatLog ? chatLog.messages : []
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChatHistory
};
