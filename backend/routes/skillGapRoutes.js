const express = require('express');
const router = express.Router();
const { getSkillGapAnalysis } = require('../controllers/skillGapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSkillGapAnalysis);
router.post('/', protect, getSkillGapAnalysis);

module.exports = router;
