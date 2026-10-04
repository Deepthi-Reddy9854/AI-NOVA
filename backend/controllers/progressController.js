const Progress = require('../models/Progress');
const Profile = require('../models/Profile');
const Roadmap = require('../models/Roadmap');

// @desc Get Student Overall Progress
// @route GET /api/progress
const getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      const profile = await Profile.findOne({ user: req.user.id });
      progress = await Progress.create({
        user: req.user.id,
        completedSkills: profile ? (profile.technicalSkills || []).slice(0, 3) : ['HTML', 'CSS', 'JavaScript'],
        completedRoadmapTasks: ['Git & GitHub Version Control', 'Frontend UI Architecture'],
        completedProjects: ['Portfolio Website', 'Task Management App'],
        certifications: [
          { title: 'Full Stack Development Certificate', issuer: 'Coursera', date: '2024' }
        ],
        overallPercentage: 42
      });
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc Update Progress
// @route PUT /api/progress
const updateProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = new Progress({ user: req.user.id });
    }

    const { newSkill, newProject, newCertification, overallPercentage } = req.body;

    if (newSkill && !progress.completedSkills.includes(newSkill)) {
      progress.completedSkills.push(newSkill);
    }

    if (newProject && !progress.completedProjects.includes(newProject)) {
      progress.completedProjects.push(newProject);
    }

    if (newCertification) {
      progress.certifications.push(newCertification);
    }

    if (overallPercentage !== undefined) {
      progress.overallPercentage = overallPercentage;
    } else {
      // Calculate dynamic progress score
      const skillsScore = progress.completedSkills.length * 8;
      const projectsScore = progress.completedProjects.length * 15;
      const certsScore = progress.certifications.length * 10;
      progress.overallPercentage = Math.min(skillsScore + projectsScore + certsScore + 20, 100);
    }

    progress.updatedAt = Date.now();
    await progress.save();

    res.status(200).json({ success: true, message: 'Progress updated successfully', progress });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgress,
  updateProgress
};
