const express = require('express');
const router = express.Router();
const { getRoadmap, updateRoadmapTask } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRoadmap);
router.put('/:id', protect, updateRoadmapTask);

module.exports = router;
