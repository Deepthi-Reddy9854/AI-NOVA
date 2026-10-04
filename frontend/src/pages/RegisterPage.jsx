import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import { Compass, User, Mail, Lock, GraduationCap, Building, BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    education: 'Bachelor of Technology',
    college: '',
    course: 'Computer Science & Engineering',
    graduationYear: 2026
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (formData.password !== formData.confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match!' });
      return;
    }

    if (formData.password.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.register(formData);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        setToast({ type: 'success', message: 'Registration successful! Redirecting to Dashboard...' });
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'User already exists with this email. Please try to login.';
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-3">
            <img src="/logo.jpg" alt="Nova AI Logo" className="w-14 h-14 rounded-2xl object-contain bg-white/10 p-1 shadow-glow" />
            <span className="text-3xl font-extrabold text-white">
              Nova<span className="text-cyan-400">.AI</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Student Account</h2>
          <p className="text-sm text-slate-400 mt-1">
            Start your AI-powered academic and career path discovery
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <NotificationToast
            type={toast?.type}
            message={toast?.message}
            onClose={() => setToast(null)}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Passwords grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Education & College */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Education / Degree
                </label>
                <div className="relative">
                  <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="education"
                    required
                    placeholder="B.Tech / B.E / B.Sc"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  College / University
                </label>
                <div className="relative">
                  <Building className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="college"
                    required
                    placeholder="State University"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Course & Graduation Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Branch / Course
                </label>
                <div className="relative">
                  <BookOpen className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="course"
                    required
                    placeholder="Computer Science"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Graduation Year
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    name="graduationYear"
                    required
                    placeholder="2026"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-glow transition-all flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Already have a Nova account?{' '}
              <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
