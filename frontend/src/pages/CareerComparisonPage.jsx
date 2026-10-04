import React, { useState, useEffect } from 'react';
import { careerAPI } from '../services/api';
import { GitCompare, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const CareerComparisonPage = () => {
  const [loading, setLoading] = useState(true);
  const [allCareers, setAllCareers] = useState([]);
  const [careerAId, setCareerAId] = useState('');
  const [careerBId, setCareerBId] = useState('');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await careerAPI.getCareers({});
        if (res.data?.careers) {
          setAllCareers(res.data.careers);
          if (res.data.careers.length >= 2) {
            setCareerAId(res.data.careers[0]._id);
            setCareerBId(res.data.careers[1]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load careers for comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const careerA = allCareers.find((c) => c._id === careerAId) || allCareers[0];
  const careerB = allCareers.find((c) => c._id === careerBId) || allCareers[1];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <GitCompare className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Side-by-Side Career Comparison</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
          Select two technology domains to compare required skills, learning difficulty, job growth, and student compatibility.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400">Select First Career (Domain A)</label>
          <select
            value={careerAId}
            onChange={(e) => setCareerAId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm"
          >
            {allCareers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400">Select Second Career (Domain B)</label>
          <select
            value={careerBId}
            onChange={(e) => setCareerBId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm"
          >
            {allCareers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid Table */}
      {careerA && careerB && (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-800 font-bold text-sm">
            <span className="text-slate-400 uppercase text-xs">Comparison Metric</span>
            <span className="text-indigo-400 text-center">{careerA.title}</span>
            <span className="text-cyan-400 text-center">{careerB.title}</span>
          </div>

          {/* Category */}
          <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-slate-800/60 text-xs">
            <span className="font-semibold text-slate-300">Category / Domain</span>
            <span className="text-center font-bold text-white">{careerA.category}</span>
            <span className="text-center font-bold text-white">{careerB.category}</span>
          </div>

          {/* Difficulty */}
          <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-slate-800/60 text-xs">
            <span className="font-semibold text-slate-300">Learning Difficulty</span>
            <div className="text-center">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-bold">{careerA.difficulty}</span>
            </div>
            <div className="text-center">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-bold">{careerB.difficulty}</span>
            </div>
          </div>

          {/* Average Salary */}
          <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-slate-800/60 text-xs">
            <span className="font-semibold text-slate-300">Average Salary Range</span>
            <span className="text-center font-bold text-emerald-400">{careerA.averageSalary}</span>
            <span className="text-center font-bold text-emerald-400">{careerB.averageSalary}</span>
          </div>

          {/* Growth Projections */}
          <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-slate-800/60 text-xs">
            <span className="font-semibold text-slate-300">Projected Industry Growth</span>
            <span className="text-center font-bold text-slate-200">{careerA.growthRate}</span>
            <span className="text-center font-bold text-slate-200">{careerB.growthRate}</span>
          </div>

          {/* Required Skills */}
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-slate-800/60 text-xs">
            <span className="font-semibold text-slate-300">Required Key Skills</span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {careerA.requiredSkills?.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {careerB.requiredSkills?.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Possible Roles */}
          <div className="grid grid-cols-3 gap-4 py-4 text-xs">
            <span className="font-semibold text-slate-300">Job Title Roles</span>
            <div className="text-center space-y-1 text-slate-300 font-medium">
              {careerA.possibleJobRoles?.map((r, i) => (
                <div key={i}>• {r}</div>
              ))}
            </div>
            <div className="text-center space-y-1 text-slate-300 font-medium">
              {careerB.possibleJobRoles?.map((r, i) => (
                <div key={i}>• {r}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerComparisonPage;
