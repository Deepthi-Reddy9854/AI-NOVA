const Assessment = require('../models/Assessment');

// @desc Submit Career Assessment
// @route POST /api/assessment
const submitAssessment = async (req, res, next) => {
  try {
    const {
      interests,
      technicalSkills,
      favoriteSubjects,
      problemSolvingRating,
      communicationRating,
      creativityRating,
      leadershipRating,
      preferredWorkType,
      careerInterests
    } = req.body;

    // Calculate aptitude scores
    const techScore = (technicalSkills ? technicalSkills.length : 0) * 10 + (problemSolvingRating || 5) * 5;
    const creativeScore = (creativityRating || 5) * 10;
    const leadershipScore = (leadershipRating || 5) * 10 + (communicationRating || 5) * 5;

    const assessment = await Assessment.create({
      user: req.user.id,
      interests: interests || [],
      technicalSkills: technicalSkills || [],
      favoriteSubjects: favoriteSubjects || [],
      problemSolvingRating: Number(problemSolvingRating) || 7,
      communicationRating: Number(communicationRating) || 7,
      creativityRating: Number(creativityRating) || 7,
      leadershipRating: Number(leadershipRating) || 7,
      preferredWorkType: preferredWorkType || 'Hybrid',
      careerInterests: careerInterests || [],
      calculatedScores: {
        technicalAptitude: Math.min(techScore, 100),
        creativityIndex: Math.min(creativeScore, 100),
        leadershipSuitability: Math.min(leadershipScore, 100)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get User Assessment History
// @route GET /api/assessment
const getAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ user: req.user.id }).sort({ completedAt: -1 });
    res.status(200).json({
      success: true,
      assessment: assessment || null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAssessment,
  getAssessment
};
