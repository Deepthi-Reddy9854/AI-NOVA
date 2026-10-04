import React, { useState, useEffect } from 'react';
import { skillGapAPI } from '../services/api';
import { BarChart2, CheckCircle2, AlertCircle, Target, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkillGapPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const res = await skillGapAPI.getSkillGap({});
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load skill gap data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const targetCareer = data?.targetCareer || 'AI/ML Engineer';
  const readiness = data?.readinessPercentage || 65;
  const currentSkills = data?.currentSkills || ['Python', 'HTML', 'CSS', 'SQL'];
  const requiredSkills = data?.requiredSkills || ['Python', 'Machine Learning', 'Statistics', 'TensorFlow', 'SQL'];
  const missingSkills = data?.missingSkills || ['Machine Learning', 'Statistics', 'TensorFlow'];
  const skillLevels = data?.skillLevels || [
    { skill: 'Python', status: 'Acquired', level: 90 },
    { skill: 'SQL', status: 'Acquired', level: 85 },
    { skill: 'HTML & CSS', status: 'Acquired', level: 88 },
    { skill: 'Machine Learning', status: 'Missing', level: 20 },
    { skill: 'Statistics', status: 'Missing', level: 30 },
    { skill: 'TensorFlow', status: 'Missing', level: 10 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Target Role Matrix</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Skill Gap Analysis: {targetCareer}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare your acquired tech stack with industry standards to unlock custom learning tasks
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Role Readiness</p>
            <p className="text-2xl font-extrabold text-cyan-400">{readiness}%</p>
          </div>
        </div>
      </div>

      {/* 3 Main Skill Matrix Boxes (Current, Required, Missing) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CURRENT SKILLS */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 pb-3 border-b border-slate-800">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">CURRENT SKILLS</h3>
          </div>
          <p className="text-xs text-slate-400">Skills already present in your active student profile:</p>
          <div className="space-y-2">
            {currentSkills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs font-bold text-emerald-300">
                <span>{skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Proficient</span>
              </div>
            ))}
          </div>
        </div>

        {/* REQUIRED SKILLS */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 pb-3 border-b border-slate-800">
            <Target className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">REQUIRED SKILLS</h3>
          </div>
          <p className="text-xs text-slate-400">Industry benchmark tech stack for {targetCareer}:</p>
          <div className="space-y-2">
            {requiredSkills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs font-bold text-indigo-300">
                <span>{skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Required</span>
              </div>
            ))}
          </div>
        </div>

        {/* MISSING SKILLS */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 pb-3 border-b border-slate-800">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">MISSING SKILLS</h3>
          </div>
          <p className="text-xs text-slate-400">Critical skill gaps to bridge for 100% readiness:</p>
          <div className="space-y-2">
            {missingSkills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs font-bold text-rose-300">
                <span>{skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">To Learn</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bars / Visual Meters */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          <span>Interactive Skill Competency Meters</span>
        </h2>

        <div className="space-y-5">
          {skillLevels.map((item, idx) => {
            const isAcquired = item.status === 'Acquired';
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white font-bold">{item.skill}</span>
                  <span className={isAcquired ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {item.status} ({item.level}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isAcquired
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500'
                    }`}
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 text-right">
          <Link
            to="/roadmap"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-glow transition-all"
          >
            <span>Generate Roadmap For Missing Skills</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SkillGapPage;
