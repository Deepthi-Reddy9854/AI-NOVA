const Progress = require('../models/Progress');
const Profile = require('../models/Profile');
const Roadmap = require('../models/Roadmap');

// @desc Get Student Overall Progress
// @route GET /api/progress
const getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        completedSkills: [],
        completedRoadmapTasks: [],
        completedProjects: [],
        certifications: [],
        overallPercentage: 0
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
      progress = new Progress({
        user: req.user.id,
        completedSkills: [],
        completedRoadmapTasks: [],
        completedProjects: [],
        certifications: [],
        overallPercentage: 0
      });
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
      progress.overallPercentage = Math.min(Math.max(overallPercentage, 0), 100);
    } else {
      // Dynamic score starting at 0%: 5% per task, 4% per skill, 10% per project, 5% per cert
      const tasksScore = progress.completedRoadmapTasks.length * 5;
      const skillsScore = progress.completedSkills.length * 4;
      const projectsScore = progress.completedProjects.length * 10;
      const certsScore = progress.certifications.length * 5;
      progress.overallPercentage = Math.min(tasksScore + skillsScore + projectsScore + certsScore, 100);
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
