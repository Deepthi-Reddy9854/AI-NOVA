const express = require('express');
const router = express.Router();
const { submitAssessment, getAssessment } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitAssessment);
router.get('/', protect, getAssessment);

module.exports = router;
