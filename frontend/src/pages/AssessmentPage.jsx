import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI, recommendationAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import { ClipboardCheck, Sparkles, BrainCircuit, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    interests: ['Artificial Intelligence', 'Web Development'],
    technicalSkills: ['Python', 'JavaScript', 'SQL'],
    favoriteSubjects: ['Data Structures', 'Database Systems', 'Linear Algebra'],
    problemSolvingRating: 8,
    communicationRating: 7,
    creativityRating: 7,
    leadershipRating: 6,
    preferredWorkType: 'Hybrid',
    careerInterests: ['AI/ML Engineer', 'Full Stack Developer']
  });

  const handleRatingChange = (field, val) => {
    setFormData({ ...formData, [field]: Number(val) });
  };

  const handleCheckboxToggle = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(item => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    try {
      await assessmentAPI.submitAssessment(formData);
      // Trigger AI recommendation generation immediately
      await recommendationAPI.generateRecommendations({});

      setToast({ type: 'success', message: 'Assessment completed! Generating AI Career Suitability Analysis...' });
      setTimeout(() => navigate('/recommendations'), 1200);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to record assessment answers. Please try again.' });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <ClipboardCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Student Career Aptitude Assessment</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
          Answer the following self-assessment questionnaire to measure your technical aptitude, soft skills, and domain preferences.
        </p>
      </div>

      <NotificationToast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Aptitude Ratings (1 - 10) */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <span>1. Core Skill & Aptitude Ratings (1 - 10)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Problem Solving */}
            <div>
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300 mb-2">
                <span>Problem Solving Ability</span>
                <span className="text-cyan-400 font-extrabold">{formData.problemSolvingRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.problemSolvingRating}
                onChange={(e) => handleRatingChange('problemSolvingRating', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Communication */}
            <div>
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300 mb-2">
                <span>Communication Skills</span>
                <span className="text-indigo-400 font-extrabold">{formData.communicationRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.communicationRating}
                onChange={(e) => handleRatingChange('communicationRating', e.target.value)}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            {/* Creativity */}
            <div>
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300 mb-2">
                <span>Creativity & Innovation</span>
                <span className="text-violet-400 font-extrabold">{formData.creativityRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.creativityRating}
                onChange={(e) => handleRatingChange('creativityRating', e.target.value)}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            {/* Leadership */}
            <div>
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300 mb-2">
                <span>Leadership & Initiative</span>
                <span className="text-emerald-400 font-extrabold">{formData.leadershipRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.leadershipRating}
                onChange={(e) => handleRatingChange('leadershipRating', e.target.value)}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Preferred Work Environment */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white pb-2 border-b border-slate-800">
            2. Preferred Work Environment Type
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {['Hybrid', 'Remote', 'On-site'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, preferredWorkType: type })}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                  formData.preferredWorkType === type
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-400 shadow-glow'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Technical Skills Checklist */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white pb-2 border-b border-slate-800">
            3. Select Tech Stacks You Have Familiarity With
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              'Python', 'JavaScript', 'HTML/CSS', 'SQL', 'React.js',
              'Node.js', 'Machine Learning', 'AWS', 'Docker', 'Git',
              'Java', 'C++', 'TensorFlow', 'Linux'
            ].map((skill) => {
              const selected = formData.technicalSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleCheckboxToggle('technicalSkills', skill)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-indigo-600/30 text-cyan-300 border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{skill}</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Assessment Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-glow flex items-center justify-center space-x-2 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Evaluating Career Suitability...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Submit Assessment & Generate AI Recommendations</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentPage;
