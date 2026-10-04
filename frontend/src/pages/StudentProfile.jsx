import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import { User, GraduationCap, Code, Heart, Target, Save, Loader2, Plus, X, Award } from 'lucide-react';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState({
    name: '',
    age: 20,
    college: '',
    degree: '',
    branch: '',
    currentYear: '3rd Year',
    cgpa: 8.0,
    graduationYear: 2026,
    technicalSkills: [],
    softSkills: [],
    interests: [],
    hobbies: [],
    preferredCareer: '',
    preferredWorkArea: '',
    strengths: [],
    weaknesses: []
  });

  const [newTechSkill, setNewTechSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newStrength, setNewStrength] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        if (res.data?.profile) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const addItem = (field, itemValue, setInput) => {
    if (!itemValue.trim()) return;
    if (!profile[field].includes(itemValue.trim())) {
      setProfile({ ...profile, [field]: [...profile[field], itemValue.trim()] });
    }
    setInput('');
  };

  const removeItem = (field, index) => {
    const updated = [...profile[field]];
    updated.splice(index, 1);
    setProfile({ ...profile, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await profileAPI.updateProfile(profile);
      if (res.data?.success) {
        setProfile(res.data.profile);
        setToast({ type: 'success', message: 'Student Profile updated successfully! Career fit recalculating...' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <User className="w-6 h-6 text-cyan-400" />
            <span>Student Academic & Skill Profile</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep your profile up-to-date to get accurate AI career suitability matches
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold uppercase text-slate-400">Profile Meter</span>
          <p className="text-2xl font-extrabold text-emerald-400">{profile.profileCompletion || 75}%</p>
        </div>
      </div>

      <NotificationToast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Academic & Personal Info */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>1. Personal & Academic Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age || 20}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">College / University</label>
              <input
                type="text"
                name="college"
                value={profile.college || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                placeholder="B.Tech / B.E"
                value={profile.degree || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Branch / Major</label>
              <input
                type="text"
                name="branch"
                placeholder="Computer Science"
                value={profile.branch || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Current Academic Year</label>
              <select
                name="currentYear"
                value={profile.currentYear || '3rd Year'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">CGPA / Percentage</label>
              <input
                type="number"
                step="0.1"
                name="cgpa"
                placeholder="8.5"
                value={profile.cgpa || 8.0}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                value={profile.graduationYear || 2026}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical & Soft Skills */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Code className="w-5 h-5 text-cyan-400" />
            <span>2. Technical & Soft Skills</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Skills */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Technical Skills</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Python, React.js, SQL"
                  value={newTechSkill}
                  onChange={(e) => setNewTechSkill(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => addItem('technicalSkills', newTechSkill, setNewTechSkill)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.technicalSkills?.map((skill, index) => (
                  <span key={index} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeItem('technicalSkills', index)} className="hover:text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Soft Skills</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Leadership, Communication"
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => addItem('softSkills', newSoftSkill, setNewSoftSkill)}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.softSkills?.map((skill, index) => (
                  <span key={index} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeItem('softSkills', index)} className="hover:text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Interests, Career Goals, Strengths */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Target className="w-5 h-5 text-violet-400" />
            <span>3. Career Preferences & Strengths</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Preferred Career Goal</label>
              <select
                name="preferredCareer"
                value={profile.preferredCareer || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              >
                <option value="">Select Preferred Target Role</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Mobile App Developer">Mobile App Developer</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Preferred Work Area</label>
              <input
                type="text"
                name="preferredWorkArea"
                placeholder="e.g. Artificial Intelligence & Web Dev"
                value={profile.preferredWorkArea || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Key Interests</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Robotics, Machine Learning"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => addItem('interests', newInterest, setNewInterest)}
                  className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((item, index) => (
                  <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold">
                    <span>{item}</span>
                    <button type="button" onClick={() => removeItem('interests', index)} className="hover:text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Strengths</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. Mathematical Aptitude, Analytical Thinking"
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => addItem('strengths', newStrength, setNewStrength)}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.strengths?.map((item, index) => (
                  <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <span>{item}</span>
                    <button type="button" onClick={() => removeItem('strengths', index)} className="hover:text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-glow flex items-center space-x-2 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Student Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
