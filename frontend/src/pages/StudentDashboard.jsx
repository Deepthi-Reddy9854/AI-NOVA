import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI, recommendationAPI, progressAPI, roadmapAPI } from '../services/api';
import {
  Sparkles,
  User,
  GraduationCap,
  Target,
  BarChart2,
  Map,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Clock,
  BookOpen,
  Loader2,
  Award
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [progress, setProgress] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profRes, recRes, progRes, roadRes] = await Promise.all([
          profileAPI.getProfile().catch(() => ({ data: { profile: null } })),
          recommendationAPI.getRecommendations().catch(() => ({ data: { recommendation: null } })),
          progressAPI.getProgress().catch(() => ({ data: { progress: null } })),
          roadmapAPI.getRoadmap().catch(() => ({ data: { roadmap: null } }))
        ]);

        if (profRes.data?.profile) setProfile(profRes.data.profile);
        if (recRes.data?.recommendation) setRecommendations(recRes.data.recommendation);
        if (progRes.data?.progress) setProgress(progRes.data.progress);
        if (roadRes.data?.roadmap) setRoadmap(roadRes.data.roadmap);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-sm font-medium text-slate-400">Loading Student Dashboard...</span>
        </div>
      </div>
    );
  }

  const profileScore = profile?.profileCompletion || 75;
  const topCareer = recommendations?.topCareer || profile?.preferredCareer || 'AI/ML Engineer';
  const recList = recommendations?.recommendedCareers || [];
  const techSkills = profile?.technicalSkills || ['Python', 'HTML', 'CSS', 'JavaScript', 'SQL'];
  const overallProg = progress?.overallPercentage || 45;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900 p-8 border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Path Guidance Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.fullName || 'Alex Morgan'}! 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Track your academic progress, bridge technical skill gaps, and explore AI-recommended roadmaps for your target career in <strong className="text-cyan-300">{topCareer}</strong>.
            </p>
          </div>


        </div>
      </div>

      {/* Top 4 Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Profile Completion */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Completion</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{profileScore}%</h3>
            <div className="w-32 bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${profileScore}%` }} />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>

        {/* Current Academic Track */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academic Degree</p>
            <h3 className="text-lg font-bold text-white mt-1 truncate max-w-[140px]">
              {profile?.branch || user?.course || 'CS & Engineering'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Graduation: {user?.graduationYear || 2026}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Target Career Goal */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Goal</p>
            <h3 className="text-lg font-bold text-cyan-300 mt-1 truncate max-w-[140px]">{topCareer}</h3>
            <p className="text-xs text-emerald-400 font-semibold mt-1">Match Fit: 92%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Overall Progress */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{overallProg}%</h3>
            <p className="text-xs text-slate-400 mt-1">Phase 3 of 7 in progress</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Recommended Careers & Skill Gap Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Careers Preview */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Top Recommended Career Paths</h2>
              </div>
              <Link to="/recommendations" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center space-x-1">
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {(recList.length > 0 ? recList.slice(0, 3) : [
                {
                  careerTitle: 'AI/ML Engineer',
                  matchPercentage: 92,
                  suitabilityReason: 'Matched based on high math & problem solving scores + Python mastery.',
                  missingSkills: ['TensorFlow', 'PyTorch', 'Deep Learning']
                },
                {
                  careerTitle: 'Full Stack Developer',
                  matchPercentage: 88,
                  suitabilityReason: 'Strong foundation in HTML, CSS, JavaScript, and Node.js REST APIs.',
                  missingSkills: ['React.js', 'MongoDB', 'Docker']
                },
                {
                  careerTitle: 'Data Scientist',
                  matchPercentage: 82,
                  suitabilityReason: 'Excellent analytical skills and database familiarity.',
                  missingSkills: ['Statistics', 'Pandas', 'Scikit-Learn']
                }
              ]).map((rec, index) => (
                <div key={index} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-base font-bold text-white">{rec.careerTitle}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        {rec.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{rec.suitabilityReason}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rec.missingSkills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-medium border border-rose-500/20">
                          Missing: {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/roadmap"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 transition-colors"
                  >
                    View Roadmap
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gap & Acquired Skills */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Your Skill Matrix Summary</h2>
              </div>
              <Link to="/skill-gap" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center space-x-1">
                <span>Detailed Skill Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Current Acquired Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techSkills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Target Missing Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning', 'TensorFlow', 'Deep Learning', 'PyTorch'].map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-xs font-semibold border border-rose-500/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Roadmap Progress Wheel & Activity Stream */}
        <div className="space-y-8">
          {/* Roadmap Progress Widget */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto mb-3">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Learning Roadmap Status</h3>
            <p className="text-xs text-slate-400 mb-4">Target: {topCareer}</p>

            <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" stroke="currentColor" strokeWidth="12" className="text-slate-800" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-indigo-500"
                  fill="transparent"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * 42) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-white">42%</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed</span>
              </div>
            </div>

            <Link
              to="/roadmap"
              className="block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
            >
              Continue 7-Phase Roadmap
            </Link>
          </div>

          {/* Recent Activity Feed */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Activity Stream</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Completed "Python & Data Structures" phase item</p>
                  <span className="text-[10px] text-slate-500">2 hours ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Generated AI Career Recommendations for AI/ML Engineer</p>
                  <span className="text-[10px] text-slate-500">Yesterday</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Submitted Student Career Assessment Test</p>
                  <span className="text-[10px] text-slate-500">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
