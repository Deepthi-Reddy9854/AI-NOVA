import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import { Compass, Mail, Lock, ArrowRight, Loader2, KeyRound, Sparkles, ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      const res = await authAPI.login(formData);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        setToast({ type: 'success', message: `Welcome back, ${res.data.user.fullName}! Loading your dashboard...` });
        setTimeout(() => {
          if (res.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 800);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid password. Please try again.';
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };
  const [resetLoading, setResetLoading] = useState(false);
  const [generatedResetUrl, setGeneratedResetUrl] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email: resetEmail });
      if (res.data.success) {
        setResetSuccess(true);
        if (res.data.resetUrl) {
          const pathOnly = res.data.resetUrl.substring(res.data.resetUrl.indexOf('/reset-password/'));
          setGeneratedResetUrl(pathOnly);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send reset link. Please check your email.';
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-3">
            <img src="/logo.jpg" alt="Nova AI Logo" className="w-14 h-14 rounded-2xl object-contain bg-white/10 p-1 shadow-glow" />
            <span className="text-3xl font-extrabold text-white">
              Nova<span className="text-cyan-400">.AI</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Student Sign In</h2>
          <p className="text-sm text-slate-400 mt-1">
            Access your AI career roadmaps and skill gap analytics
          </p>
        </div>


        <div className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <NotificationToast
            type={toast?.type}
            message={toast?.message}
            onClose={() => setToast(null)}
          />

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="alex@pathnova.ai"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-cyan-400 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-glow transition-all flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Nova AI</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Don't have a student account yet?{' '}
              <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-slate-400">Enter email to receive reset instructions</p>
              </div>
            </div>

            {resetSuccess ? (
              <div className="space-y-4">
                {generatedResetUrl ? (
                  <div className="space-y-3">
                    <Link
                      to={generatedResetUrl}
                      onClick={() => {
                        setShowForgotModal(false);
                        setResetSuccess(false);
                      }}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                      <span>Click Here to Reset Password Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 text-center">
                    Check your email inbox or backend console logs for the reset link.
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Your Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Reset Link...</span>
                    </>
                  ) : (
                    <span>Send Password Reset Link</span>
                  )}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowForgotModal(false);
                setResetSuccess(false);
              }}
              className="w-full mt-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
