import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.jpg';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  BrainCircuit,
  Map,
  BarChart3,
  Bot,
  CheckCircle2,
  Users,
  Award,
  BookOpen
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-8 animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Generation Academic-to-Career AI</span>
        </div>

        <div className="flex justify-center mb-6">
          <img
            src={logoImg}
            alt="Nova AI Brand Logo"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-contain shadow-glow border border-indigo-500/30 p-1.5 bg-slate-900/80 hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
          Nova<span className="text-cyan-400 font-black"> AI</span>
        </h1>

        <p className="text-xl sm:text-2xl font-medium text-cyan-300/90 mb-4 max-w-3xl mx-auto">
          "Navigate Your Future. Discover Your Path."
        </p>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          An intelligent academic and career guidance platform for college students. Analyze your education, skills, strengths, and goals to generate personalized career recommendations and step-by-step learning roadmaps.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold text-lg shadow-glow hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Go to Your Student Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold text-lg shadow-glow hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Get Started Free</span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Student Login</span>
              </Link>
            </>
          )}
        </div>

        {/* Hero Interactive Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Career Assessment</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calculates precise career compatibility scores based on your CGPA, technical skills, interests, and problem-solving aptitude.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">7-Phase Personal Roadmap</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Structured learning path from Fundamentals to Job Readiness with completion tracking, time estimates, and projects.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-violet-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Advisor Chatbot</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              24/7 personalized guidance for resume building, internship preparation, project ideas, and interview strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Purpose & Value Proposition */}
      <section className="py-20 bg-[#0e1424] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Why College Students Choose Nova AI
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Empowering students to bridge the gap between academic education and modern high-impact industry careers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <BarChart3 className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Skill Gap Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instantly compare your current technical toolkit against target industry requirements to pinpoint missing skills.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Target className="w-8 h-8 text-cyan-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Career Comparison</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare salary ranges, learning difficulty, technologies, and suitability between multiple technical domains.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Award className="w-8 h-8 text-violet-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Projects & Certifications</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get hand-picked portfolio project suggestions and accredited professional certifications tailored to your goal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <BookOpen className="w-8 h-8 text-emerald-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Rule + AI Dual Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guaranteed high-accuracy output with optional Gemini AI key integration or built-in deterministic expert rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Careers Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">Explore Supported Career Domains</h2>
        <p className="text-slate-400 text-sm mb-12 max-w-2xl mx-auto">
          From Artificial Intelligence to Cybersecurity, Nova AI generates tailored roadmaps for top technology roles.
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {[
            'Full Stack Developer', 'AI/ML Engineer', 'Data Scientist', 'Data Analyst',
            'Cloud Engineer', 'Cybersecurity Analyst', 'DevOps Engineer', 'UI/UX Designer',
            'Mobile App Developer', 'Software Engineer'
          ].map((role, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 text-sm font-semibold hover:border-indigo-500 hover:text-white transition-all"
            >
              {role}
            </span>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-900/50 via-slate-900 to-violet-900/50 border-t border-slate-800 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Unlock Your AI-Guided Career Roadmap?</h2>
          <p className="text-slate-300 text-base mb-8">
            Join thousands of college students discovering their ideal career trajectory today.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-lg shadow-cyan-glow transition-all"
            >
              <span>Go to Your Student Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-lg shadow-cyan-glow transition-all"
            >
              <span>Create Your Free Student Profile</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
