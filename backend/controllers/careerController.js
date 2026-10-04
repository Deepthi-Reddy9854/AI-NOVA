const Career = require('../models/Career');

// @desc Get All Careers (with optional category search)
// @route GET /api/careers
const getCareers = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } }
      ];
    }

    const careers = await Career.find(filter).sort({ title: 1 });
    res.status(200).json({ success: true, count: careers.length, careers });
  } catch (error) {
    next(error);
  }
};

// @desc Get Single Career
// @route GET /api/careers/:id
const getCareerById = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career path not found' });
    }
    res.status(200).json({ success: true, career });
  } catch (error) {
    next(error);
  }
};

// @desc Create Career (Admin Only)
// @route POST /api/careers
const createCareer = async (req, res, next) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, career });
  } catch (error) {
    next(error);
  }
};

// @desc Update Career (Admin Only)
// @route PUT /api/careers/:id
const updateCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career path not found' });
    }
    res.status(200).json({ success: true, career });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Career (Admin Only)
// @route DELETE /api/careers/:id
const deleteCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career path not found' });
    }
    res.status(200).json({ success: true, message: 'Career removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
};
