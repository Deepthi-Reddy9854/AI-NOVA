const User = require('../models/User');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Progress = require('../models/Progress');
const bcrypt = require('bcryptjs');

const careersData = [
  {
    title: 'Full Stack Developer',
    category: 'Engineering',
    description: 'Builds responsive front-end user interfaces and scalable back-end server architectures using modern web technologies.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'REST API'],
    difficulty: 'Intermediate',
    requiredTechnologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Docker', 'PostgreSQL'],
    possibleJobRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Software Engineer', 'Web Architect'],
    averageSalary: '₹8,50,000 - ₹18,50,000 / year',
    growthRate: 'High (24% projected growth)',
    recommendedProjects: [
      'Multi-vendor E-Commerce Platform with Stripe Payments',
      'Real-time Collaborative Workspace with WebSockets',
      'SaaS Dashboard with JWT Auth & Subscription Billing'
    ],
    recommendedCertifications: [
      'Meta Front-End & Back-End Developer Professional Certificate',
      'OpenJS Node.js Application Developer (JSNAD)',
      'AWS Certified Developer - Associate'
    ]
  },
  {
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    description: 'Designs, trains, and deploys intelligent machine learning algorithms, neural network models, and generative AI systems.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Statistics', 'SQL', 'Deep Learning', 'Data Preprocessing'],
    difficulty: 'Advanced',
    requiredTechnologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'NumPy', 'Pandas', 'OpenCV', 'HuggingFace Transformers'],
    possibleJobRoles: ['ML Engineer', 'AI Solutions Architect', 'NLP Engineer', 'Computer Vision Specialist'],
    averageSalary: '₹12,00,000 - ₹28,00,000 / year',
    growthRate: 'Exponential (35% projected growth)',
    recommendedProjects: [
      'Autonomous Object Detection & Tracking System',
      'Custom LLM RAG Document QA Engine',
      'Healthcare Medical Image Segmentation Model'
    ],
    recommendedCertifications: [
      'Google Professional Machine Learning Engineer',
      'AWS Certified Machine Learning - Specialty',
      'TensorFlow Developer Certificate'
    ]
  },
  {
    title: 'Data Scientist',
    category: 'Data & Analytics',
    description: 'Extracts actionable intelligence from massive structured and unstructured datasets using statistical modeling and machine learning.',
    requiredSkills: ['Python', 'R', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'Scikit-Learn', 'Hypothesis Testing'],
    difficulty: 'Advanced',
    requiredTechnologies: ['Python', 'SQL', 'Pandas', 'Matplotlib', 'Seaborn', 'Tableau', 'PowerBI', 'Apache Spark'],
    possibleJobRoles: ['Data Scientist', 'Predictive Analytics Specialist', 'Lead Quantitative Analyst', 'Research Scientist'],
    averageSalary: '₹10,50,000 - ₹24,00,000 / year',
    growthRate: 'Very High (28% projected growth)',
    recommendedProjects: [
      'Customer Churn Prediction Engine with Feature Store',
      'Stock Market Financial Forecasting Model',
      'Interactive COVID Analytics Dashboard'
    ],
    recommendedCertifications: [
      'IBM Data Science Professional Certificate',
      'Microsoft Certified: Azure Data Scientist Associate',
      'Databricks Certified Data Scientist'
    ]
  },
  {
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Cleans, transforms, and visualizes complex data to solve business problems and empower strategic decision-making.',
    requiredSkills: ['SQL', 'Excel', 'Python', 'PowerBI', 'Tableau', 'Data Cleaning', 'Statistics', 'Communication'],
    difficulty: 'Beginner',
    requiredTechnologies: ['SQL', 'Microsoft Excel', 'Tableau', 'PowerBI', 'Python', 'Google Looker'],
    possibleJobRoles: ['Data Analyst', 'Business Intelligence Analyst', 'Reporting Specialist', 'Operations Analyst'],
    averageSalary: '₹6,50,000 - ₹12,50,000 / year',
    growthRate: 'High (20% projected growth)',
    recommendedProjects: [
      'E-Commerce Sales Performance Dashboard in PowerBI',
      'Customer Segmentation Analysis using K-Means',
      'Automated ETL Pipeline using Python & SQL'
    ],
    recommendedCertifications: [
      'Google Data Analytics Professional Certificate',
      'Microsoft Certified: Power BI Data Analyst Associate',
      'Tableau Desktop Specialist'
    ]
  },
  {
    title: 'Cloud Engineer',
    category: 'Infrastructure',
    description: 'Architects, deploys, and maintains enterprise cloud computing infrastructure, serverless pipelines, and container orchestration.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'Python', 'Networking', 'Cloud Architecture'],
    difficulty: 'Intermediate',
    requiredTechnologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Bash'],
    possibleJobRoles: ['Cloud Architect', 'DevOps Infrastructure Specialist', 'AWS Engineer', 'Cloud Operations Lead'],
    averageSalary: '₹9,50,000 - ₹22,00,000 / year',
    growthRate: 'Very High (25% projected growth)',
    recommendedProjects: [
      'Multi-Region Automated Infrastructure with Terraform & AWS',
      'High-Availability Microservices Cluster on Kubernetes',
      'Serverless Video Transcoding Pipeline with AWS Lambda'
    ],
    recommendedCertifications: [
      'AWS Certified Solutions Architect - Associate',
      'Certified Kubernetes Administrator (CKA)',
      'Google Cloud Associate Cloud Engineer'
    ]
  },
  {
    title: 'Cybersecurity Analyst',
    category: 'Security',
    description: 'Protects enterprise networks, cloud assets, and software databases against cyberattacks, security breaches, and malware intrusion.',
    requiredSkills: ['Network Security', 'Ethical Hacking', 'Linux', 'Python', 'SIEM', 'Cryptography', 'Risk Assessment', 'Firewalls'],
    difficulty: 'Intermediate',
    requiredTechnologies: ['Wireshark', 'Metasploit', 'Nmap', 'Splunk', 'Linux Kali', 'Python', 'Snort'],
    possibleJobRoles: ['Security Operations Center (SOC) Analyst', 'Penetration Tester', 'Cyber Incident Responder', 'Information Security Specialist'],
    averageSalary: '₹9,00,000 - ₹20,00,000 / year',
    growthRate: 'Critical (33% projected growth)',
    recommendedProjects: [
      'Automated Vulnerability Scanning Script in Python',
      'Enterprise Network IDS/IPS Log Monitoring Dashboard',
      'Password Hash Cracker & Cryptography Tool'
    ],
    recommendedCertifications: [
      'CompTIA Security+',
      'Certified Ethical Hacker (CEH)',
      'Certified Information Systems Security Professional (CISSP)'
    ]
  },
  {
    title: 'DevOps Engineer',
    category: 'Infrastructure',
    description: 'Bridges continuous software integration (CI) and deployment (CD) through automated builds, infrastructure monitoring, and testing pipelines.',
    requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux', 'Python', 'Bash', 'Ansible', 'Terraform'],
    difficulty: 'Advanced',
    requiredTechnologies: ['GitHub Actions', 'Jenkins', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana', 'Ansible', 'ArgoCD'],
    possibleJobRoles: ['DevOps Lead', 'Site Reliability Engineer (SRE)', 'Build & Release Manager', 'Platform Engineer'],
    averageSalary: '₹11,00,000 - ₹25,00,000 / year',
    growthRate: 'Very High (27% projected growth)',
    recommendedProjects: [
      'Automated Zero-Downtime Deployment Pipeline via GitHub Actions & Docker',
      'Infrastructure Monitoring Stack using Prometheus & Grafana',
      'GitOps Continuous Delivery Pipeline with ArgoCD'
    ],
    recommendedCertifications: [
      'AWS Certified DevOps Engineer - Professional',
      'Certified Kubernetes Application Developer (CKAD)',
      'HashiCorp Certified: Terraform Associate'
    ]
  },
  {
    title: 'UI/UX Designer',
    category: 'Design & Product',
    description: 'Crafts intuitive visual user experiences, interactive wireframes, and accessible design systems for mobile and web applications.',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems', 'Usability Testing', 'HTML/CSS'],
    difficulty: 'Beginner',
    requiredTechnologies: ['Figma', 'Adobe XD', 'Sketch', 'Miro', 'Balsamiq', 'Lottie', 'Principle'],
    possibleJobRoles: ['UI Designer', 'UX Researcher', 'Product Designer', 'Interaction Designer'],
    averageSalary: '₹7,50,000 - ₹16,00,000 / year',
    growthRate: 'High (18% projected growth)',
    recommendedProjects: [
      'Mobile Banking App Redesign with High-Fidelity Prototype',
      'Comprehensive Design System Component Library in Figma',
      'Usability Research Case Study for E-Commerce Checkout'
    ],
    recommendedCertifications: [
      'Google UX Design Professional Certificate',
      'Nielsen Norman Group UX Master Certification',
      'Figma Certified Creator'
    ]
  },
  {
    title: 'Mobile App Developer',
    category: 'Engineering',
    description: 'Engineers cross-platform mobile apps for iOS and Android devices using native or hybrid framework ecosystems.',
    requiredSkills: ['React Native', 'Flutter', 'Dart', 'Swift', 'Kotlin', 'Mobile UI', 'REST API', 'App Store Deployment'],
    difficulty: 'Intermediate',
    requiredTechnologies: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'SQLite', 'GraphQL'],
    possibleJobRoles: ['iOS Developer', 'Android Developer', 'Cross-Platform Mobile Developer', 'Mobile Architect'],
    averageSalary: '₹8,50,000 - ₹19,00,000 / year',
    growthRate: 'High (21% projected growth)',
    recommendedProjects: [
      'Cross-Platform Fitness Tracking App with Geo-Location',
      'Food Delivery App with Live Driver Tracking & Push Notifications',
      'Offline-First Expense Tracker with Local Encryption'
    ],
    recommendedCertifications: [
      'Meta Android Developer Professional Certificate',
      'Google Associate Android Developer',
      'Flutter & Dart Application Master Certification'
    ]
  },
  {
    title: 'Software Engineer',
    category: 'Engineering',
    description: 'Solves computational problems by designing robust software applications, algorithms, microservices, and database systems.',
    requiredSkills: ['Data Structures', 'Algorithms', 'Java', 'C++', 'System Design', 'OOP', 'SQL', 'Git', 'Software Architecture'],
    difficulty: 'Intermediate',
    requiredTechnologies: ['Java', 'C++', 'Spring Boot', 'Python', 'SQL', 'Git', 'Docker', 'JUnit'],
    possibleJobRoles: ['Software Engineer', 'Backend Developer', 'Systems Engineer', 'Core Platform Engineer'],
    averageSalary: '₹9,00,000 - ₹22,00,000 / year',
    growthRate: 'High (22% projected growth)',
    recommendedProjects: [
      'High-Throughput Distributed Rate Limiter in Java',
      'Custom In-Memory Key-Value Database in C++',
      'Microservices Banking Backend with Spring Boot'
    ],
    recommendedCertifications: [
      'Oracle Certified Professional: Java SE Developer',
      'AWS Certified Developer - Associate',
      'Meta Software Engineer Certificate'
    ]
  }
];

const autoSeed = async () => {
  try {
    const careerCount = await Career.countDocuments();
    if (careerCount === 0) {
      console.log('[AutoSeed] Populating 10 core career records...');
      await Career.insertMany(careersData);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Creating demo admin and student accounts...');
      const salt = await bcrypt.genSalt(10);

      // Admin Account
      const adminPassword = await bcrypt.hash('Admin@123', salt);
      await User.create({
        fullName: 'Nova Admin',
        email: 'admin@pathnova.ai',
        password: adminPassword,
        role: 'admin',
        education: 'Master of Technology',
        college: 'Nova Institute of Technology',
        course: 'Computer Science',
        graduationYear: 2024
      });

      // Demo Student Account
      const studentPassword = await bcrypt.hash('Student@123', salt);
      const student = await User.create({
        fullName: 'Alex Morgan',
        email: 'alex@pathnova.ai',
        password: studentPassword,
        role: 'student',
        education: 'Bachelor of Technology',
        college: 'Stanford Tech Institute',
        course: 'Computer Science Engineering',
        graduationYear: 2026
      });

      // Demo Profile
      await Profile.create({
        user: student._id,
        name: 'Alex Morgan',
        age: 21,
        college: 'Stanford Tech Institute',
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        currentYear: '3rd Year',
        cgpa: 8.8,
        graduationYear: 2026,
        technicalSkills: ['Python', 'HTML', 'CSS', 'JavaScript', 'SQL', 'React.js'],
        softSkills: ['Problem Solving', 'Communication', 'Team Leadership'],
        interests: ['Artificial Intelligence', 'Web Development', 'Machine Learning'],
        hobbies: ['Chess', 'Blogging', 'Coding Hackathons'],
        preferredCareer: 'AI/ML Engineer',
        preferredWorkArea: 'Artificial Intelligence & Machine Learning',
        strengths: ['Analytical Thinking', 'Fast Learner', 'Mathematical Aptitude'],
        weaknesses: ['Public Speaking', 'Delegation'],
        profileCompletion: 90
      });

      // Demo Progress
      await Progress.create({
        user: student._id,
        completedSkills: ['Python', 'HTML', 'CSS', 'JavaScript', 'SQL'],
        completedRoadmapTasks: ['Python Programming & Data Structures', 'Git & GitHub Version Control'],
        completedProjects: ['Personal Developer Portfolio', 'Weather Forecast API App'],
        certifications: [
          { title: 'Python for Data Science', issuer: 'Coursera', date: '2024' },
          { title: 'Responsive Web Design', issuer: 'freeCodeCamp', date: '2024' }
        ],
        overallPercentage: 58
      });

      console.log('[AutoSeed] Database auto-seeded successfully!');
      console.log('[AutoSeed] Demo Student: alex@pathnova.ai / Student@123');
      console.log('[AutoSeed] Demo Admin:   admin@pathnova.ai / Admin@123');
    }
  } catch (err) {
    console.error('[AutoSeed Error]', err.message);
  }
};

module.exports = autoSeed;
