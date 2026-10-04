const Profile = require('../models/Profile');
const User = require('../models/User');

// Calculate completion score
const calculateCompletion = (profile) => {
  let score = 0;
  if (profile.name) score += 10;
  if (profile.college) score += 10;
  if (profile.degree) score += 10;
  if (profile.branch) score += 10;
  if (profile.cgpa) score += 10;
  if (profile.technicalSkills && profile.technicalSkills.length > 0) score += 15;
  if (profile.softSkills && profile.softSkills.length > 0) score += 10;
  if (profile.interests && profile.interests.length > 0) score += 10;
  if (profile.preferredCareer) score += 15;
  return Math.min(score, 100);
};

// @desc Get Student Profile
// @route GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      const user = await User.findById(req.user.id);
      profile = await Profile.create({
        user: req.user.id,
        name: user ? user.fullName : '',
        degree: user ? user.education : '',
        college: user ? user.college : '',
        branch: user ? user.course : '',
        graduationYear: user ? user.graduationYear : 2026,
        technicalSkills: ['Python', 'HTML', 'CSS', 'JavaScript', 'SQL'],
        softSkills: ['Problem Solving', 'Communication'],
        interests: ['Artificial Intelligence', 'Web Development'],
        preferredCareer: 'Full Stack Developer',
        profileCompletion: 70
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc Update Student Profile
// @route PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new Profile({ user: req.user.id });
    }

    const fields = [
      'name', 'age', 'college', 'degree', 'branch', 'currentYear',
      'cgpa', 'graduationYear', 'technicalSkills', 'softSkills',
      'interests', 'hobbies', 'preferredCareer', 'preferredWorkArea',
      'strengths', 'weaknesses'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    profile.profileCompletion = calculateCompletion(profile);
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
