# PathNova AI: Intelligent Academic-to-Career Navigation for Personalized Future Pathways

> **"Navigate Your Future. Discover Your Path."**

PathNova AI is an AI-powered academic and career guidance web platform designed for college students. It analyzes a student's education, academic performance (CGPA), technical skills, soft skills, interests, strengths, weaknesses, and career goals to generate personalized career recommendations, skill gap analysis, and interactive 7-phase learning roadmaps.

---

## 🌟 Project Features

- **Dual Recommendation Engine**: Combines **Google Gemini AI API** integration with an **expert rule-based recommendation fallback engine**, ensuring 100% functionality out of the box even without an API key!
- **Interactive Aptitude Assessment**: 10-question evaluation measuring technical skills, problem-solving, communication, leadership, and work environment preferences.
- **AI Career Recommendations**: Match suitability percentages, custom fit rationale, required vs existing vs missing skills, recommended portfolio projects, certifications, and target job roles.
- **Skill Gap Matrix**: Side-by-side comparison of current student skills vs industry benchmark tech stacks with visual progress meters.
- **7-Phase Personalized Roadmap**: Step-by-step learning timeline (Fundamentals -> Core Skills -> Advanced Skills -> Projects -> Certifications -> Internship Prep -> Job Prep) with completion toggles and time estimates.
- **Career Explorer & Side-by-Side Comparison**: Search and filter through tech domains, compare salary ranges, learning difficulty, technologies, and job growth.
- **24/7 AI Career Chatbot**: Instant answers for resume building, interview prep, project ideas, and career guidance.
- **Progress Tracker & Portfolio**: Track completed roadmap tasks, verified skills, portfolio projects, and certifications.
- **Admin Dashboard**: Comprehensive admin control center to manage careers, track student profiles, and monitor recommendation statistics.
- **Zero-Friction In-Memory Database Fallback**: If local MongoDB is offline, PathNova AI automatically initializes an in-memory database server for seamless local testing.

---

## 📂 Project Structure

```
pathnova-ai/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with MongoMemoryServer fallback
│   ├── controllers/              # Express request handlers
│   │   ├── adminController.js
│   │   ├── assessmentController.js
│   │   ├── authController.js
│   │   ├── careerController.js
│   │   ├── chatController.js
│   │   ├── profileController.js
│   │   ├── progressController.js
│   │   ├── recommendationController.js
│   │   ├── roadmapController.js
│   │   └── skillGapController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js    # Admin role authorization
│   │   ├── authMiddleware.js     # JWT token verification
│   │   └── errorHandler.js       # Global error handler
│   ├── models/                   # Mongoose database schemas
│   │   ├── Assessment.js
│   │   ├── Career.js
│   │   ├── ChatLog.js
│   │   ├── Profile.js
│   │   ├── Progress.js
│   │   ├── Recommendation.js
│   │   ├── Roadmap.js
│   │   └── User.js
│   ├── routes/                   # Express REST API routes
│   │   ├── adminRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── careerRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── recommendationRoutes.js
│   │   ├── roadmapRoutes.js
│   │   └── skillGapRoutes.js
│   ├── seed/
│   │   └── seedData.js           # Database seed script with 10 careers & demo accounts
│   ├── services/
│   │   └── aiService.js          # Gemini AI API integration & Rule-based fallback engine
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/           # UI components (Navbar, Sidebar, Footer, Toasts)
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Persistent JWT auth context
│   │   ├── pages/                # 14 Full-stack React pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AssessmentPage.jsx
│   │   │   ├── CareerComparisonPage.jsx
│   │   │   ├── CareerExplorerPage.jsx
│   │   │   ├── ChatbotPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProgressPage.jsx
│   │   │   ├── RecommendationPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── RoadmapPage.jsx
│   │   │   ├── SkillGapPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── StudentProfile.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios API wrapper with request interceptors
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS + Custom Futuristic Dark Theme Glassmorphism
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js REST API
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **Database**: MongoDB & Mongoose (with `mongodb-memory-server` auto-fallback)

---

## 🔑 Quick Start & Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Step 1: Clone or Navigate to Project Root
```bash
cd pathnova-ai
```

### Step 2: Setup & Run Backend
```bash
cd backend
npm install
```

#### Seed Initial Data & Demo Accounts:
```bash
npm run seed
```

#### Start Backend Server:
```bash
npm start
# Server runs on http://localhost:5000
```

---

### Step 3: Setup & Run Frontend
Open a new terminal window:
```bash
cd pathnova-ai/frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🔐 Built-in Demo Credentials

You can use the **Quick Demo Login** buttons on the Login page, or enter these credentials manually:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `alex@pathnova.ai` | `Student@123` | Student |
| **Demo Admin** | `admin@pathnova.ai` | `Admin@123` | Administrator |

---

## ⚙️ Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pathnova_db
JWT_SECRET=pathnova_super_secret_jwt_token_key_2026_xyz
AI_API_KEY=
```

> **Note on `AI_API_KEY`**:
> - To enable dynamic Gemini AI content generation, insert your **Google Gemini API Key** (or OpenAI API Key) into `AI_API_KEY`.
> - If `AI_API_KEY` is left blank, PathNova AI automatically activates its high-precision **Rule-Based Expert Engine** for recommendations and chatbot responses.

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 MongoDB Atlas Setup Guide

If you wish to use a cloud hosted **MongoDB Atlas** database instead of local/in-memory MongoDB:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User (username & password).
3. Under Network Access, whitelist your IP address (or `0.0.0.0/0` for development).
4. Copy your Connection String (e.g. `mongodb+srv://username:password@cluster.mongodb.net/pathnova_db?retryWrites=true&w=majority`).
5. Update `MONGODB_URI` in `backend/.env`.

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new student account |
| `/api/auth/login` | `POST` | Public | Sign in user & return JWT token |
| `/api/auth/me` | `GET` | Protected | Fetch current logged-in user profile |
| `/api/profile` | `GET` / `PUT` | Protected | Fetch & update student profile |
| `/api/assessment` | `POST` / `GET` | Protected | Submit career aptitude assessment |
| `/api/careers` | `GET` | Public | List all careers (with search & filter) |
| `/api/careers` | `POST` / `PUT` / `DELETE` | Admin | Manage career records |
| `/api/recommendations` | `POST` / `GET` | Protected | Generate AI/Rule career recommendations |
| `/api/skill-gap` | `GET` / `POST` | Protected | Compute skill gap matrix & readiness |
| `/api/roadmap` | `GET` / `PUT` | Protected | Fetch & update 7-phase learning roadmap |
| `/api/progress` | `GET` / `PUT` | Protected | Fetch & update portfolio progress |
| `/api/chat` | `POST` / `GET` | Protected | Send query to AI Career Chatbot |
| `/api/admin/stats` | `GET` | Admin | Fetch system statistics |
| `/api/admin/students` | `GET` | Admin | List registered student accounts |

---

## 📄 License
This project is licensed under the MIT License.
