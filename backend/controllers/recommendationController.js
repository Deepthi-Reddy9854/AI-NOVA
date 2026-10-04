const Profile = require('../models/Profile');
const Assessment = require('../models/Assessment');
const Career = require('../models/Career');
const Recommendation = require('../models/Recommendation');
const { getAIRecommendations } = require('../services/aiService');

// @desc Generate AI/Rule-based Career Recommendations
// @route POST /api/recommendations
const generateRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let profile = await Profile.findOne({ user: userId });
    let assessment = await Assessment.findOne({ user: userId }).sort({ completedAt: -1 });
    let careers = await Career.find();

    if (!profile) {
      profile = {
        name: 'Student',
        degree: 'Bachelor of Technology',
        branch: 'Computer Science',
        technicalSkills: ['Python', 'HTML', 'CSS', 'SQL', 'JavaScript'],
        interests: ['Artificial Intelligence', 'Software Development'],
        cgpa: 8.2
      };
    }

    if (careers.length === 0) {
      // Emergency default careers fallback list if database has not been seeded yet
      careers = [
        {
          title: 'Full Stack Developer',
          category: 'Engineering',
          description: 'Designs and builds both client-side and server-side web application architectures.',
          requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'REST API'],
          possibleJobRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Software Engineer'],
          recommendedProjects: ['E-Commerce Platform', 'Real-time Chat App'],
          recommendedCertifications: ['Full Stack Web Development Professional', 'Node.js Certified Developer']
        },
        {
          title: 'AI/ML Engineer',
          category: 'Artificial Intelligence',
          description: 'Creates machine learning models, neural networks, and AI algorithms for enterprise solutions.',
          requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Statistics', 'SQL', 'Deep Learning'],
          possibleJobRoles: ['ML Engineer', 'AI Solutions Architect', 'NLP Engineer'],
          recommendedProjects: ['Autonomous Agent System', 'Computer Vision Classifier'],
          recommendedCertifications: ['Google Professional Machine Learning Engineer', 'TensorFlow Developer Certificate']
        },
        {
          title: 'Data Scientist',
          category: 'Data & Analytics',
          description: 'Transforms complex unstructured data into predictive statistical insights and visual business intelligence.',
          requiredSkills: ['Python', 'R', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'Scikit-Learn'],
          possibleJobRoles: ['Data Scientist', 'Predictive Analytics Specialist', 'Lead Data Analyst'],
          recommendedProjects: ['Customer Churn Prediction Engine', 'Financial Time-Series Forecasting'],
          recommendedCertifications: ['IBM Data Science Professional Certificate', 'Microsoft Certified: Data Scientist Associate']
        },
        {
          title: 'Cloud Engineer',
          category: 'Infrastructure',
          description: 'Architects and manages cloud deployment infrastructure, serverless apps, and container orchestration.',
          requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'Python', 'Networking'],
          possibleJobRoles: ['Cloud Solutions Architect', 'DevOps Specialist', 'AWS Engineer'],
          recommendedProjects: ['Multi-Cloud Infrastructure Automation', 'Kubernetes Cluster Deployment'],
          recommendedCertifications: ['AWS Certified Solutions Architect', 'Certified Kubernetes Administrator (CKA)']
        },
        {
          title: 'Cybersecurity Analyst',
          category: 'Security',
          description: 'Protects enterprise systems, networks, and data pipelines from cyber threats and unauthorized intrusions.',
          requiredSkills: ['Network Security', 'Ethical Hacking', 'Linux', 'Python', 'SIEM', 'Cryptography', 'Risk Assessment'],
          possibleJobRoles: ['Security Operations Analyst', 'Penetration Tester', 'Cyber Risk Specialist'],
          recommendedProjects: ['Vulnerability Scanner Tool', 'Network Threat Detection Monitor'],
          recommendedCertifications: ['CompTIA Security+', 'Certified Information Systems Security Professional (CISSP)']
        }
      ];
    }

    const { recommendations, aiGenerated } = await getAIRecommendations(profile, assessment, careers);

    const topCareer = recommendations.length > 0 ? recommendations[0].careerTitle : 'Software Engineer';

    // Store in Recommendation Collection
    const savedRec = await Recommendation.create({
      user: userId,
      topCareer,
      recommendedCareers: recommendations,
      aiGenerated,
      generatedAt: Date.now()
    });

    res.status(200).json({
      success: true,
      message: aiGenerated ? 'AI dynamic recommendations generated successfully' : 'Rule-based recommendations generated successfully',
      recommendation: savedRec
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Latest Recommendations
// @route GET /api/recommendations
const getRecommendations = async (req, res, next) => {
  try {
    let recommendation = await Recommendation.findOne({ user: req.user.id }).sort({ generatedAt: -1 });

    if (!recommendation) {
      // Auto-trigger calculation if none exists yet
      return generateRecommendations(req, res, next);
    }

    res.status(200).json({
      success: true,
      recommendation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateRecommendations,
  getRecommendations
};
