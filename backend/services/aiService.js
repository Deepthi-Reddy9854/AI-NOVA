const https = require('https');

// Helper to perform HTTP request to Google Gemini API or standard REST
const callGeminiAPI = (apiKey, prompt) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.candidates && parsed.candidates[0]?.content?.parts[0]?.text) {
            resolve(parsed.candidates[0].content.parts[0].text);
          } else {
            reject(new Error(parsed.error?.message || 'Invalid AI response structure'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('AI API request timed out'));
    });
    req.write(data);
    req.end();
  });
};

// Fallback Rule-Based Recommendation Logic
const calculateRuleBasedRecommendations = (profile, assessment, careersList) => {
  const userTechSkills = (profile.technicalSkills || []).map(s => s.toLowerCase());
  const userInterests = [...(profile.interests || []), ...(assessment?.interests || [])].map(i => i.toLowerCase());
  const userBranch = (profile.branch || profile.degree || '').toLowerCase();
  const cgpa = profile.cgpa || 7.5;
  const problemSolving = assessment?.problemSolvingRating || 7;

  return careersList.map(career => {
    let score = 50; // Base score
    const requiredSkills = career.requiredSkills || [];
    const missingSkills = [];
    const existingSkills = [];

    // 1. Skill Match Calculation
    requiredSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (userTechSkills.some(userSkill => userSkill.includes(skillLower) || skillLower.includes(userSkill))) {
        score += 8;
        existingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // 2. Interest Alignment
    const careerTitleLower = career.title.toLowerCase();
    userInterests.forEach(interest => {
      if (careerTitleLower.includes(interest) || (career.description && career.description.toLowerCase().includes(interest))) {
        score += 10;
      }
    });

    // 3. Branch / Degree Suitability
    if (userBranch.includes('computer') || userBranch.includes('it') || userBranch.includes('ai') || userBranch.includes('data')) {
      score += 5;
    }

    // 4. Problem Solving & Academic Bonus
    if (problemSolving >= 8) score += 5;
    if (cgpa >= 8.5) score += 5;

    // Cap between 60% and 98%
    const matchPercentage = Math.min(Math.max(Math.round(score), 62), 98);

    // Dynamic suitability reason generator
    let suitabilityReason = `Matched based on your strengths in ${existingSkills.join(', ') || 'technical fundamentals'} and explicit interest in ${profile.preferredWorkArea || career.category}.`;
    if (missingSkills.length > 0) {
      suitabilityReason += ` Up-skilling in ${missingSkills.slice(0, 2).join(' & ')} will boost your readiness to 95%+.`;
    }

    return {
      careerTitle: career.title,
      matchPercentage,
      suitabilityReason,
      requiredSkills,
      existingSkills,
      missingSkills,
      recommendedProjects: career.recommendedProjects || [
        `Build an end-to-end ${career.title} Portfolio Project`,
        `Create a production deployment using modern dev tools`
      ],
      recommendedCertifications: career.recommendedCertifications || [
        `Professional ${career.title} Certification`,
        `Industry Standard Mastery Track`
      ],
      jobRoles: career.possibleJobRoles || [career.title, `Junior ${career.title}`, `Lead ${career.title}`]
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// Fallback Rule-Based Chatbot Logic
const generateFallbackChatResponse = (query, profile) => {
  const q = query.toLowerCase();
  const userName = profile?.name || 'Student';

  if (q.includes('html') || q.includes('css') || q.includes('web') || q.includes('frontend') || q.includes('react') || q.includes('javascript') || q.includes('js')) {
    return `Hello ${userName}! Here is your structured guide for **HTML, CSS & Frontend Web Development**:\n\n` +
      `1. **HTML5 Essentials**: Semantic tags (<header>, <nav>, <section>, <article>, <footer>), Forms & Validations, Accessibility (ARIA), and SEO Meta Tags.\n` +
      `2. **CSS3 & Styling**: Flexbox, CSS Grid, Responsive Media Queries, CSS Variables, and Tailwind CSS.\n` +
      `3. **Modern JavaScript (ES6+)**: DOM Manipulation, Async/Await, Fetch API, Arrow Functions, Array Methods (map, filter, reduce), and Event Delegation.\n` +
      `4. **Frontend Framework (React.js)**: Component Lifecycle, Hooks (useState, useEffect, useContext), React Router, State Management, and Vite build tool.\n` +
      `5. **Recommended Projects**: Build a Responsive Portfolio, an Interactive Quiz App, or an E-Commerce Frontend with Shopping Cart state.`;
  }

  if (q.includes('python') || q.includes('ai') || q.includes('machine learning') || q.includes('data science') || q.includes('deep learning')) {
    return `Hello ${userName}! For a career in **Python, AI/ML & Data Science**, focus on this roadmap:\n\n` +
      `1. **Core Fundamentals**: Python Programming, Mathematics (Linear Algebra, Calculus), Probability & Statistics.\n` +
      `2. **Data & Analytics**: NumPy, Pandas, Matplotlib, Seaborn, and SQL Data Querying.\n` +
      `3. **Machine Learning**: Scikit-Learn (Linear Regression, Decision Trees, Random Forests, K-Means).\n` +
      `4. **Deep Learning & GenAI**: PyTorch or TensorFlow, Convolutional Neural Networks, Hugging Face Transformers, RAG Architecture, and Prompt Engineering.\n` +
      `5. **Recommended Projects**: Build a Sentiment Analysis Tool, an Autonomous Image Classifier, or an AI Document QA Engine.`;
  }

  if (q.includes('node') || q.includes('express') || q.includes('sql') || q.includes('mongodb') || q.includes('backend') || q.includes('database') || q.includes('api')) {
    return `Hi ${userName}! To master **Backend Development & Databases**:\n\n` +
      `1. **Node.js & Express.js**: Asynchronous I/O, Event Loop, REST API Design, Express Middleware, Error Handling.\n` +
      `2. **Database Management**: Relational (PostgreSQL, MySQL) & NoSQL (MongoDB with Mongoose).\n` +
      `3. **Security & Authentication**: JWT (JSON Web Tokens), Password Hashing (Bcrypt), CORS, Role-Based Access Control.\n` +
      `4. **API Testing & Tools**: Postman, Insomnia, Swagger/OpenAPI documentation.\n` +
      `5. **Key Advice**: Focus on building secure microservices with clean error logging and structured database indexing!`;
  }

  if (q.includes('java') || q.includes('c++') || q.includes('cpp') || q.includes('dsa') || q.includes('algorithm') || q.includes('coding')) {
    return `Hi ${userName}! To excel in **Data Structures & Algorithms (DSA)**:\n\n` +
      `1. **Language Mastery**: Object-Oriented Programming (OOP) in Java or C++.\n` +
      `2. **Core DSA**: Arrays, Linked Lists, Stacks, Queues, Hash Tables, Trees, Graphs, Sorting & Searching.\n` +
      `3. **Advanced Techniques**: Recursion, Dynamic Programming, Two-Pointers, Sliding Window, Greedy Algorithms.\n` +
      `4. **Practice Platforms**: Solve 150+ categorized problems on LeetCode, HackerRank, or GeeksforGeeks.\n` +
      `5. **Interview Goal**: Master Time & Space Complexity analysis (Big-O notation) for tech coding rounds!`;
  }

  if (q.includes('devops') || q.includes('cloud') || q.includes('aws') || q.includes('docker') || q.includes('kubernetes') || q.includes('linux') || q.includes('git')) {
    return `Hello ${userName}! For a career in **DevOps & Cloud Engineering**:\n\n` +
      `1. **Linux & Scripting**: Linux Command Line, Shell/Bash Scripting, File System Administration.\n` +
      `2. **Version Control**: Git branching strategies, GitHub Actions, Automated CI/CD Pipelines.\n` +
      `3. **Containerization**: Docker Container Creation, Docker Compose, Kubernetes Cluster Orchestration.\n` +
      `4. **Cloud Infrastructure**: AWS (EC2, S3, RDS, Lambda) or Azure, Terraform Infrastructure as Code.\n` +
      `5. **Monitoring**: Prometheus, Grafana, and Log Management.`;
  }

  if (q.includes('security') || q.includes('cyber') || q.includes('hacking')) {
    return `Hello ${userName}! For **Cybersecurity & Ethical Hacking**:\n\n` +
      `1. **Network Security**: TCP/IP protocols, OSI Model, Subnetting, Wireshark packet analysis.\n` +
      `2. **Linux & Tools**: Kali Linux, Nmap, Metasploit, Burp Suite.\n` +
      `3. **Web Security**: OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, Authentication Bypasses).\n` +
      `4. **Certifications**: CompTIA Security+, Certified Ethical Hacker (CEH).\n` +
      `5. **Hands-On Practice**: TryHackMe and HackTheBox labs.`;
  }

  if (q.includes('full stack') || q.includes('software engineer')) {
    return `Hi ${userName}! To become a **Full Stack Software Engineer**:\n\n` +
      `1. **Frontend**: React.js / Next.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS.\n` +
      `2. **Backend**: Node.js, Express.js, RESTful API design.\n` +
      `3. **Databases**: MongoDB, PostgreSQL, Redis caching.\n` +
      `4. **DevOps Basics**: Docker, Git/GitHub, CI/CD, AWS or Vercel Deployment.\n` +
      `5. **Key Advice**: Focus on building clean full-stack applications with authentication and real-time state management!`;
  }

  if (q.includes('resume') || q.includes('cv') || q.includes('portfolio')) {
    return `Great question, ${userName}! Here are top tips to optimize your **Resume & Portfolio**:\n\n` +
      `- **Quantify Impact**: Use action verbs and metrics (e.g. "Optimized API speed by 40% using Redis").\n` +
      `- **Project Links**: Include live deployment URLs and clean GitHub repositories with structured READMEs.\n` +
      `- **Skill Hierarchy**: Categorize skills clearly into Languages, Frameworks, Tools, and Databases.\n` +
      `- **Tailor for ATS**: Align keywords with job descriptions you are targeting.`;
  }

  if (q.includes('internship') || q.includes('job') || q.includes('interview')) {
    return `To prepare for **Internships & Full-Time Tech Roles**:\n\n` +
      `1. **Data Structures & Algorithms**: Master arrays, trees, graphs, dynamic programming on LeetCode/HackerRank.\n` +
      `2. **System Design**: Understand HTTP requests, database indexing, REST vs gRPC, microservices basics.\n` +
      `3. **Behavioral Prep**: Practice STAR method (Situation, Task, Action, Result) for leadership & team questions.\n` +
      `4. **Networking**: Engage with tech professionals on LinkedIn, participate in hackathons, and contribute to open source.`;
  }

  return `Hello ${userName}! As your Nova AI career guide, I can help you with:\n\n` +
    `- Technical roadmaps for **HTML/CSS/Web Dev**, **AI/ML**, **Full Stack**, **Cloud/DevOps**, **DSA**, & **Cybersecurity**\n` +
    `- Resume optimization, portfolio project ideas, and internship prep\n\n` +
    `Ask any specific topic (e.g. "HTML roadmap", "AI engineering", "Resume tips", or "DSA guide")!`;
};

// Main Exported Functions
const getAIRecommendations = async (profile, assessment, careersList) => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    console.log('[AI Service] No AI_API_KEY found. Utilizing Expert Rule-Based Engine.');
    return {
      recommendations: calculateRuleBasedRecommendations(profile, assessment, careersList),
      aiGenerated: false
    };
  }

  try {
    const prompt = `You are Nova AI's Senior Career Advisor.
Analyze this student profile and calculate top recommended careers from the provided list.

Student Profile:
- Degree: ${profile.degree || 'B.Tech'} (${profile.branch || 'CSE'})
- CGPA: ${profile.cgpa || '8.0'}
- Current Technical Skills: ${(profile.technicalSkills || []).join(', ')}
- Interests: ${(profile.interests || []).join(', ')}
- Strengths: ${(profile.strengths || []).join(', ')}
- Preferred Work Area: ${profile.preferredWorkArea || 'Software'}

Available Careers List: ${JSON.stringify(careersList.map(c => ({ title: c.title, requiredSkills: c.requiredSkills })))}

Return a strict valid JSON array containing top 5 career recommendations in this JSON structure:
[
  {
    "careerTitle": "Career Name",
    "matchPercentage": 92,
    "suitabilityReason": "Detailed match reasoning...",
    "requiredSkills": ["skill1", "skill2"],
    "existingSkills": ["matching user skill"],
    "missingSkills": ["missing skill"],
    "recommendedProjects": ["project1", "project2"],
    "recommendedCertifications": ["cert1"],
    "jobRoles": ["role1", "role2"]
  }
]`;

    const responseText = await callGeminiAPI(apiKey, prompt);
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const recommendations = JSON.parse(cleanedText);

    return {
      recommendations,
      aiGenerated: true
    };
  } catch (err) {
    console.warn('[AI Service] Gemini API call failed or formatted incorrectly. Falling back to Rule-Based Engine:', err.message);
    return {
      recommendations: calculateRuleBasedRecommendations(profile, assessment, careersList),
      aiGenerated: false
    };
  }
};

const getAIChatResponse = async (userMessage, profile) => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return generateFallbackChatResponse(userMessage, profile);
  }

  try {
    const prompt = `You are Nova AI Career Guide assistant. Answer student ${profile?.name || 'Student'}'s career query thoughtfully.
Student Context: Degree: ${profile?.degree || 'Engineering'}, Branch: ${profile?.branch || 'CS'}, Technical Skills: ${(profile?.technicalSkills || []).join(', ')}.

Student Query: "${userMessage}"
Keep the output encouraging, formatted with clean bullet points, bold headers, and actionable steps.`;

    const responseText = await callGeminiAPI(apiKey, prompt);
    return responseText;
  } catch (err) {
    console.warn('[AI Service] Chatbot AI API error. Falling back to rule-based response:', err.message);
    return generateFallbackChatResponse(userMessage, profile);
  }
};

module.exports = {
  getAIRecommendations,
  getAIChatResponse
};
