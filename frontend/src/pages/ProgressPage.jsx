import React, { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import { CheckCircle2, Award, FolderGit2, Sparkles, Plus, Loader2, TrendingUp } from 'lucide-react';

const ProgressPage = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [toast, setToast] = useState(null);

  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');

  const fetchProgress = async () => {
    try {
      const res = await progressAPI.getProgress();
      if (res.data?.progress) {
        setProgress(res.data.progress);
      }
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await progressAPI.updateProgress({ newSkill: newSkill.trim() });
      if (res.data?.progress) {
        setProgress(res.data.progress);
        setNewSkill('');
        setToast({ type: 'success', message: 'Skill added to portfolio!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error adding skill.' });
    }
  };

  const handleAddProject = async () => {
    if (!newProject.trim()) return;
    try {
      const res = await progressAPI.updateProgress({ newProject: newProject.trim() });
      if (res.data?.progress) {
        setProgress(res.data.progress);
        setNewProject('');
        setToast({ type: 'success', message: 'Project added to completed list!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error adding project.' });
    }
  };

  const handleAddCert = async () => {
    if (!newCertTitle.trim()) return;
    try {
      const res = await progressAPI.updateProgress({
        newCertification: {
          title: newCertTitle.trim(),
          issuer: newCertIssuer.trim() || 'Coursera / Udemy',
          date: new Date().getFullYear().toString()
        }
      });
      if (res.data?.progress) {
        setProgress(res.data.progress);
        setNewCertTitle('');
        setNewCertIssuer('');
        setToast({ type: 'success', message: 'Certification logged successfully!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error logging certification.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const overallPercentage = progress?.overallPercentage ?? 0;
  const completedSkills = progress?.completedSkills || [];
  const completedTasks = progress?.completedRoadmapTasks || [];
  const completedProjects = progress?.completedProjects || [];
  const certifications = progress?.certifications || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Career Portfolio Readiness</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Student Progress Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your verified skills, completed roadmap tasks, portfolio projects, and certifications
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/80 px-6 py-4 rounded-2xl border border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Overall Preparation</p>
            <p className="text-3xl font-extrabold text-emerald-400">{overallPercentage}%</p>
          </div>
        </div>
      </div>

      <NotificationToast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      {/* Grid of 4 Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Skills */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Completed Skills ({completedSkills.length})</span>
            </h3>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add newly acquired skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
            <button
              onClick={handleAddSkill}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {completedSkills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                ✓ {s}
              </span>
            ))}
          </div>
        </div>

        {/* Completed Projects */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
              <span>Portfolio Projects ({completedProjects.length})</span>
            </h3>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add project title"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
            <button
              onClick={handleAddProject}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {completedProjects.map((p, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-semibold flex items-center space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Roadmap Tasks */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Completed Roadmap Items ({completedTasks.length})</span>
          </h3>

          <div className="space-y-2">
            {completedTasks.map((task, i) => (
              <div key={i} className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Earned */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Award className="w-5 h-5 text-violet-400" />
            <span>Certifications ({certifications.length})</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Cert Title"
              value={newCertTitle}
              onChange={(e) => setNewCertTitle(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Issuer (e.g. Coursera)"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <button
                onClick={handleAddCert}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {certifications.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{c.title}</p>
                  <p className="text-[10px] text-slate-400">{c.issuer}</p>
                </div>
                <span className="text-[10px] text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded font-bold">{c.date || '2024'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
