import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.jpg';
import { 
  Compass, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Bot,
  LayoutDashboard
} from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 glass-nav w-full border-b border-slate-800/80">
      <div className="w-full px-3 sm:px-4 lg:px-5">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Brand Logo - Placed in the top-left corner */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && !isLandingPage && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden focus:outline-none cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={logoImg}
                alt="Nova AI Logo"
                className="w-10 h-10 rounded-xl object-contain bg-white/10 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-200"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  Nova<span className="text-cyan-400 font-black">.AI</span>
                </span>
                <span className="block text-[10px] font-medium text-slate-400 tracking-wider uppercase -mt-1">
                  Academic & Career Navigator
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Right Actions - Placed in the top-right corner */}
          <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                    location.pathname === '/dashboard'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/chatbot"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
                    location.pathname === '/chatbot'
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>AI Advisor</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="h-5 w-[1px] bg-slate-800 my-auto" />

                {/* User Profile Info & Avatar */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md group-hover:scale-105 transition-transform">
                    {user?.fullName?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-semibold text-slate-200 leading-tight group-hover:text-cyan-400 transition-colors">
                      {user?.fullName || 'Student User'}
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[140px]">
                      {user?.course || 'Computer Science'}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-glow transition-all flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-3 p-2 bg-slate-800/60 rounded-lg mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                  {user?.fullName?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.fullName}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-purple-400 hover:bg-slate-800 rounded-md text-base font-medium"
              >
                Student Profile
              </Link>
              <Link
                to="/chatbot"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-cyan-400 hover:bg-slate-800 rounded-md text-base font-medium"
              >
                AI Advisor
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-amber-400 hover:bg-slate-800 rounded-md text-base font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-md text-base font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-slate-300 bg-slate-800 rounded-lg text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

