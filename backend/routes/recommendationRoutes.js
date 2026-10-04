const express = require('express');
const router = express.Router();
const { generateRecommendations, getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, generateRecommendations);
router.get('/', protect, getRecommendations);

module.exports = router;
