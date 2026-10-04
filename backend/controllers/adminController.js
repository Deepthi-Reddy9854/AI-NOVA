const User = require('../models/User');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Recommendation = require('../models/Recommendation');

// @desc Get Admin Dashboard Statistics
// @route GET /api/admin/stats
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCareers = await Career.countDocuments();
    const totalRecommendations = await Recommendation.countDocuments();

    const categories = await Career.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const recentStudents = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCareers,
        totalRecommendations,
        categories,
        recentStudents
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get All Registered Students with Profiles
// @route GET /api/admin/students
const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    const studentIds = students.map(s => s._id);
    const profiles = await Profile.find({ user: { $in: studentIds } });

    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.user.toString()] = p;
    });

    const studentsWithProfiles = students.map(s => ({
      _id: s._id,
      fullName: s.fullName,
      email: s.email,
      education: s.education,
      college: s.college,
      course: s.course,
      graduationYear: s.graduationYear,
      createdAt: s.createdAt,
      profile: profileMap[s._id.toString()] || null
    }));

    res.status(200).json({
      success: true,
      students: studentsWithProfiles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllStudents
};
