import React, { useState, useEffect } from 'react';
import { careerAPI } from '../services/api';
import { Search, Briefcase, Code, DollarSign, TrendingUp, Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerExplorerPage = () => {
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState(null);

  const categories = ['All', 'Engineering', 'Artificial Intelligence', 'Data & Analytics', 'Infrastructure', 'Security', 'Design & Product'];

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const res = await careerAPI.getCareers({
          category: selectedCategory,
          search: search.trim()
        });
        if (res.data?.careers) {
          setCareers(res.data.careers);
        }
      } catch (err) {
        console.error('Failed to load careers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, [selectedCategory, search]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Industry Career Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Career Explorer</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore top technological career tracks, skill requirements, job roles, and growth projections
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search careers, skills, technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 w-full md:w-auto custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Career Cards */}
      {loading ? (
        <div className="min-h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : careers.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No career matches found for your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <div
              key={career._id}
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {career.category}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {career.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    career.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : career.difficulty === 'Intermediate'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {career.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {career.description}
                </p>

                {/* Technologies */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1.5">Required Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills?.slice(0, 4).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700/80">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 block">Avg Salary</span>
                  <span className="font-bold text-emerald-400">{career.averageSalary?.split('/')[0]}</span>
                </div>

                <button
                  onClick={() => setSelectedCareer(career)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-8 rounded-3xl border border-slate-800 max-h-[90vh] overflow-y-auto relative space-y-6">
            <button
              onClick={() => setSelectedCareer(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {selectedCareer.category}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{selectedCareer.title}</h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{selectedCareer.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">Average Salary Range</span>
                <span className="font-bold text-emerald-400 text-sm">{selectedCareer.averageSalary}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Projected Growth</span>
                <span className="font-bold text-cyan-400 text-sm">{selectedCareer.growthRate}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">Required Core Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCareer.requiredSkills?.map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">Possible Job Roles</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCareer.possibleJobRoles?.map((r, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Link
                to="/compare"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Compare with Other Role
              </Link>
              <Link
                to="/roadmap"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow"
              >
                Start Roadmap
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerExplorerPage;
