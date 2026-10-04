const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
} = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getCareers);
router.get('/:id', getCareerById);
router.post('/', protect, adminOnly, createCareer);
router.put('/:id', protect, adminOnly, updateCareer);
router.delete('/:id', protect, adminOnly, deleteCareer);

module.exports = router;
