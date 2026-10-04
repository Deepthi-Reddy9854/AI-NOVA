import React, { useState, useEffect } from 'react';
import { roadmapAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import { Map, CheckCircle2, Clock, Award, Loader2, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const RoadmapPage = () => {
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRoadmap = async () => {
    try {
      const res = await roadmapAPI.getRoadmap();
      if (res.data?.roadmap) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleTask = async (itemId, phaseNumber, currentStatus) => {
    setUpdatingId(itemId);
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    try {
      const res = await roadmapAPI.updateTaskStatus(itemId, {
        phaseNumber,
        status: newStatus
      });

      if (res.data?.success) {
        setRoadmap(res.data.roadmap);
        setToast({
          type: 'success',
          message: newStatus === 'completed' ? 'Task marked as Completed! Overall readiness increased.' : 'Task status updated.'
        });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update roadmap task.' });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const phases = roadmap?.phases || [];
  const careerTitle = roadmap?.careerTitle || 'AI/ML Engineer';

  // Calculate overall completed percentage
  let totalTasks = 0;
  let completedTasks = 0;
  phases.forEach(p => {
    p.items.forEach(i => {
      totalTasks++;
      if (i.status === 'completed') completedTasks++;
    });
  });
  const completedPercentage = Math.round((completedTasks / Math.max(totalTasks, 1)) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>7-Phase Structured Mastery Track</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Personalized Learning Roadmap</h1>
          <p className="text-xs text-slate-400 mt-1">
            Target Domain: <strong className="text-cyan-300">{careerTitle}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Roadmap Progress</p>
            <p className="text-2xl font-extrabold text-emerald-400">{completedPercentage}%</p>
          </div>
        </div>
      </div>

      <NotificationToast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      {/* 7 Phases Timeline Container */}
      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase.phaseNumber} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-cyan-300 font-extrabold text-sm flex items-center justify-center">
                  0{phase.phaseNumber}
                </span>
                <h3 className="text-lg font-bold text-white">{phase.phaseName}</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {phase.items.filter(i => i.status === 'completed').length} / {phase.items.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {phase.items.map((item) => {
                const isDone = item.status === 'completed';
                const isUpdating = updatingId === item._id;

                return (
                  <div
                    key={item._id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-emerald-950/15 border-emerald-500/30'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-base font-bold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                          {item.skill}
                        </h4>

                        {/* Difficulty Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          item.difficulty === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.difficulty === 'Intermediate'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.difficulty}
                        </span>

                        {/* Estimated Time */}
                        <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          <span>{item.estimatedTime}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleToggleTask(item._id, phase.phaseNumber, item.status)}
                      disabled={isUpdating}
                      className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow'
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isDone ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <span>Mark as Completed</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
