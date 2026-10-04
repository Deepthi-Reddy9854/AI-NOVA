import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import AssessmentPage from './pages/AssessmentPage';
import RecommendationPage from './pages/RecommendationPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import CareerComparisonPage from './pages/CareerComparisonPage';
import ChatbotPage from './pages/ChatbotPage';
import ProgressPage from './pages/ProgressPage';
import AdminDashboard from './pages/AdminDashboard';
import ResetPasswordPage from './pages/ResetPasswordPage';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/reset-password');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex relative">
        {!isPublicPage && (
          <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 min-w-0 max-w-full p-4 sm:p-6 lg:p-8 transition-all overflow-x-hidden ${!isPublicPage ? 'lg:ml-64' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Student Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} />
            <Route path="/skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
            <Route path="/careers" element={<ProtectedRoute><CareerExplorerPage /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><CareerComparisonPage /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />

            {/* Admin Protected Route */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;


