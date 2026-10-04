const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const careerRoutes = require('./routes/careerRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const progressRoutes = require('./routes/progressRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');

const autoSeed = require('./config/autoSeed');

const app = express();

// Connect Database & Auto-Seed Demo Records
connectDB().then(() => {
  autoSeed();
});

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Nova AI API Server',
    timestamp: new Date().toISOString(),
    aiKeyConfigured: !!process.env.AI_API_KEY
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Nova AI Backend running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
