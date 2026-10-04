const express = require('express');
const router = express.Router();
const { getAdminStats, getAllStudents } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/students', protect, adminOnly, getAllStudents);

module.exports = router;
