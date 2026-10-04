const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Recommendation = require('../models/Recommendation');

// @desc Get Skill Gap Analysis
// @route GET /api/skill-gap or POST /api/skill-gap
const getSkillGapAnalysis = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let targetCareerTitle = req.body.careerTitle || req.query.careerTitle;

    const profile = await Profile.findOne({ user: userId });
    const userSkills = profile ? (profile.technicalSkills || []) : ['Python', 'HTML', 'CSS', 'SQL'];

    if (!targetCareerTitle) {
      const rec = await Recommendation.findOne({ user: userId }).sort({ generatedAt: -1 });
      targetCareerTitle = rec ? rec.topCareer : 'Full Stack Developer';
    }

    const career = await Career.findOne({ title: { $regex: new RegExp(targetCareerTitle, 'i') } });

    let requiredSkills = [
      'Python', 'Machine Learning', 'Statistics', 'TensorFlow', 'SQL',
      'HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB'
    ];

    if (career && career.requiredSkills && career.requiredSkills.length > 0) {
      requiredSkills = career.requiredSkills;
    }

    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const existingSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(skill => {
      const sLower = skill.toLowerCase();
      if (userSkillsLower.some(uSkill => uSkill.includes(sLower) || sLower.includes(uSkill))) {
        existingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const readinessPercentage = Math.round((existingSkills.length / Math.max(requiredSkills.length, 1)) * 100);

    res.status(200).json({
      success: true,
      targetCareer: targetCareerTitle,
      readinessPercentage,
      currentSkills: userSkills,
      requiredSkills,
      existingSkills,
      missingSkills,
      skillLevels: requiredSkills.map(skill => {
        const isExisting = existingSkills.includes(skill);
        return {
          skill,
          status: isExisting ? 'Acquired' : 'Missing',
          level: isExisting ? 85 : 0
        };
      })
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillGapAnalysis
};
