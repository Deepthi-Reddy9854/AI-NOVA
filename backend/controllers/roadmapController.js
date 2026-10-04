const Roadmap = require('../models/Roadmap');
const Recommendation = require('../models/Recommendation');
const Progress = require('../models/Progress');

const generateDefaultPhases = (careerTitle) => {
  const isAI = careerTitle.toLowerCase().includes('ai') || careerTitle.toLowerCase().includes('data');

  return [
    {
      phaseNumber: 1,
      phaseName: 'Phase 1: Fundamentals',
      items: [
        {
          skill: isAI ? 'Python Programming & Data Structures' : 'HTML5, CSS3 & Modern JavaScript (ES6+)',
          description: 'Master variables, data structures, OOP principles, syntax and logic flow.',
          difficulty: 'Beginner',
          estimatedTime: '2 Weeks',
          status: 'completed'
        },
        {
          skill: 'Git & GitHub Version Control',
          description: 'Learn repository management, branching, pull requests, and collaborative code reviews.',
          difficulty: 'Beginner',
          estimatedTime: '1 Week',
          status: 'completed'
        }
      ]
    },
    {
      phaseNumber: 2,
      phaseName: 'Phase 2: Core Skills',
      items: [
        {
          skill: isAI ? 'Linear Algebra, Calculus & Statistics' : 'React.js & Component-Driven UI Architecture',
          description: 'Build responsive web apps using state management, hooks, and Virtual DOM concepts.',
          difficulty: 'Intermediate',
          estimatedTime: '3 Weeks',
          status: 'in-progress'
        },
        {
          skill: isAI ? 'NumPy, Pandas & Exploratory Data Analysis' : 'Node.js & Express.js RESTful API Development',
          description: 'Architect scalable server routes, middlewares, error handlers, and authentication flow.',
          difficulty: 'Intermediate',
          estimatedTime: '3 Weeks',
          status: 'pending'
        }
      ]
    },
    {
      phaseNumber: 3,
      phaseName: 'Phase 3: Advanced Skills',
      items: [
        {
          skill: isAI ? 'Supervised & Unsupervised Machine Learning' : 'MongoDB & Database Schema Architecture',
          description: 'Design relational & Document schemas, index optimizations, and aggregation pipelines.',
          difficulty: 'Advanced',
          estimatedTime: '4 Weeks',
          status: 'pending'
        },
        {
          skill: isAI ? 'Deep Learning with PyTorch / TensorFlow' : 'State Management & Performance Optimization',
          description: 'Implement Redux/Zustand, caching strategies, lazy loading, and bundle optimization.',
          difficulty: 'Advanced',
          estimatedTime: '3 Weeks',
          status: 'pending'
        }
      ]
    },
    {
      phaseNumber: 4,
      phaseName: 'Phase 4: Projects',
      items: [
        {
          skill: isAI ? 'Build an AI Conversational Agent RAG App' : 'Full Stack Production Web Application',
          description: 'Create an end-to-end full stack application with authentication, database CRUD & dynamic state.',
          difficulty: 'Advanced',
          estimatedTime: '4 Weeks',
          status: 'pending'
        }
      ]
    },
    {
      phaseNumber: 5,
      phaseName: 'Phase 5: Certifications',
      items: [
        {
          skill: isAI ? 'Google Professional Machine Learning Engineer' : 'Meta Certified Front-End / Node.js Developer',
          description: 'Validate expertise through industry-accredited professional certification exams.',
          difficulty: 'Intermediate',
          estimatedTime: '2 Weeks',
          status: 'pending'
        }
      ]
    },
    {
      phaseNumber: 6,
      phaseName: 'Phase 6: Internship Preparation',
      items: [
        {
          skill: 'Data Structures & Algorithms (LeetCode/HackerRank)',
          description: 'Solve 100+ algorithmic problems across Arrays, Trees, Dynamic Programming, and Graphs.',
          difficulty: 'Advanced',
          estimatedTime: '4 Weeks',
          status: 'pending'
        },
        {
          skill: 'System Design & Open Source Contributions',
          description: 'Understand system scalability, API rate limiting, and contribute to public GitHub repos.',
          difficulty: 'Advanced',
          estimatedTime: '2 Weeks',
          status: 'pending'
        }
      ]
    },
    {
      phaseNumber: 7,
      phaseName: 'Phase 7: Job Preparation',
      items: [
        {
          skill: 'Technical Portfolio & Resume Optimization',
          description: 'Format ATS-compliant resume, showcase live project links, and polish LinkedIn profile.',
          difficulty: 'Beginner',
          estimatedTime: '1 Week',
          status: 'pending'
        },
        {
          skill: 'Mock Interviews & Behavioral STAR Prep',
          description: 'Practice live coding rounds, behavioral interviews, and salary negotiation techniques.',
          difficulty: 'Intermediate',
          estimatedTime: '2 Weeks',
          status: 'pending'
        }
      ]
    }
  ];
};

// @desc Get Student Personalized Roadmap
// @route GET /api/roadmap
const getRoadmap = async (req, res, next) => {
  try {
    let roadmap = await Roadmap.findOne({ user: req.user.id });

    if (!roadmap) {
      const rec = await Recommendation.findOne({ user: req.user.id }).sort({ generatedAt: -1 });
      const careerTitle = rec ? rec.topCareer : 'Full Stack Developer';

      roadmap = await Roadmap.create({
        user: req.user.id,
        careerTitle,
        phases: generateDefaultPhases(careerTitle)
      });
    }

    res.status(200).json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

// @desc Update Roadmap Task Status
// @route PUT /api/roadmap/:id
const updateRoadmapTask = async (req, res, next) => {
  try {
    const { phaseNumber, itemId, status } = req.body;
    let roadmap = await Roadmap.findOne({ user: req.user.id });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    let updatedItemSkill = '';

    roadmap.phases.forEach(phase => {
      if (!phaseNumber || phase.phaseNumber === Number(phaseNumber)) {
        phase.items.forEach(item => {
          if (item._id.toString() === req.params.id || item._id.toString() === itemId) {
            item.status = status || (item.status === 'completed' ? 'pending' : 'completed');
            if (item.status === 'completed') {
              updatedItemSkill = item.skill;
            }
          }
        });
      }
    });

    roadmap.updatedAt = Date.now();
    await roadmap.save();

    // Sync with Progress
    if (updatedItemSkill) {
      await Progress.findOneAndUpdate(
        { user: req.user.id },
        {
          $addToSet: { completedRoadmapTasks: updatedItemSkill },
          $inc: { overallPercentage: 3 }
        },
        { upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Roadmap item updated successfully',
      roadmap
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
  updateRoadmapTask
};
