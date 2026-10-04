import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import { Lock, KeyRound, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match!' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.resetPassword(token, { newPassword });
      if (res.data.success) {
        setSuccess(true);
        setToast({ type: 'success', message: 'Password reset successful! Redirecting to Sign In...' });
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired password reset link. Please request a new link.';
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Set New Password</h2>
          <p className="text-sm text-slate-400 mt-1">
            Choose a strong new password for your Nova AI account
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <NotificationToast
            type={toast?.type}
            message={toast?.message}
            onClose={() => setToast(null)}
          />

          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Password Updated Successfully!</h3>
              <p className="text-sm text-slate-400">
                Your password has been changed. You will now be redirected to sign in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-glow mt-2"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-glow transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Save Password</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
