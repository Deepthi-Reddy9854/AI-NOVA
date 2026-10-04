import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Briefcase,
  BrainCircuit,
  ArrowRight,
  RefreshCw,
  Loader2,
  Target,
  BookOpen
} from 'lucide-react';

const RecommendationPage = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fetchRecs = async () => {
    try {
      const res = await recommendationAPI.getRecommendations();
      if (res.data?.recommendation) {
        setRecommendation(res.data.recommendation);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleRecalculate = async () => {
    setGenerating(true);
    setToast(null);

    try {
      const res = await recommendationAPI.generateRecommendations({});
      if (res.data?.recommendation) {
        setRecommendation(res.data.recommendation);
        setToast({
          type: 'success',
          message: res.data.message || 'AI recommendations updated successfully!'
        });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error generating recommendations.' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const recList = recommendation?.recommendedCareers || [];
  const currentRec = recList[selectedIdx] || recList[0] || {
    careerTitle: 'Data Scientist',
    matchPercentage: 94,
    suitabilityReason: 'Matched based on your strengths in Python, R, SQL and explicit interest in Artificial Intelligence & Machine Learning. Up-skilling in Statistics & Pandas will boost your readiness to 98%.',
    requiredSkills: ['Python', 'R', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'Scikit-Learn', 'Hypothesis Testing'],
    existingSkills: ['Python', 'R', 'SQL'],
    missingSkills: ['Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'Scikit-Learn', 'Hypothesis Testing'],
    recommendedProjects: ['Customer Churn Prediction Model', 'Exploratory Data Analysis Dashboard'],
    recommendedCertifications: ['IBM Data Science Professional Certificate'],
    jobRoles: ['Data Scientist', 'Data Analyst', 'ML Researcher']
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Title & Engine Mode Banner */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{recommendation?.aiGenerated ? 'Powered by Gemini AI Engine' : 'Expert Rule-Based Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Career Recommendations</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalized academic-to-career analysis based on your skill matrix, academic aptitude, and career goals
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={generating}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-glow flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Re-Run AI Analysis</span>
        </button>
      </div>

      <NotificationToast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      {/* Career Options Filter Tabs (Horizontal Scrollable Bar) */}
      <div className="w-full min-w-0 overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-center gap-2.5 min-w-max">
          {recList.map((rec, index) => {
            const isSelected = selectedIdx === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedIdx(index)}
                className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-glow'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span>{rec.careerTitle}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-cyan-400'
                }`}>
                  {rec.matchPercentage}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Breakdown Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-8 min-w-0 max-w-full">
        {/* Top Match Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Target Career Path</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {currentRec.careerTitle}
            </h2>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shrink-0 w-full sm:w-auto">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="23" stroke="currentColor" strokeWidth="5" className="text-slate-800" fill="transparent" />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-cyan-400 transition-all duration-500"
                  fill="transparent"
                  strokeDasharray="145"
                  strokeDashoffset={145 - (145 * currentRec.matchPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-extrabold text-white">{currentRec.matchPercentage}%</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Suitability Index</p>
              <p className="text-sm font-bold text-cyan-300">High Match Compatibility</p>
            </div>
          </div>
        </div>

        {/* Why Recommended Reason Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Why This Career is Recommended For You</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal break-words">
            {currentRec.suitabilityReason}
          </p>
        </div>

        {/* 3-Column Skills Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full min-w-0">
          {/* All Required Skills */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 flex flex-col justify-between min-w-0 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>All Required Skills</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {currentRec.requiredSkills?.length || 0} Total
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRec.requiredSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-200 text-xs font-medium border border-slate-700/80 break-words">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Student Existing Skills */}
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between min-w-0 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Skills You Have</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {currentRec.existingSkills?.length || 0} Acquired
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRec.existingSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30 break-words">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skills to Learn */}
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex flex-col justify-between min-w-0 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Skills to Learn</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {currentRec.missingSkills?.length || 0} Gap
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRec.missingSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-300 text-xs font-semibold border border-rose-500/30 break-words">
                    + {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects & Certifications Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 w-full min-w-0">
          {/* Recommended Projects */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-3 min-w-0">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Recommended Portfolio Projects</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {currentRec.recommendedProjects?.map((proj, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span className="break-words">{proj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Certifications */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-3 min-w-0">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Industry Certifications</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {currentRec.recommendedCertifications?.map((cert, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-violet-400 font-bold shrink-0">•</span>
                  <span className="break-words">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Target Job Roles & Action CTA */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Target Job Roles You Can Apply For</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentRec.jobRoles?.map((role, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold break-words">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <Link
            to="/roadmap"
            className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-glow flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
          >
            <span>Start Step-by-Step Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;

