import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  Sparkles,
  BarChart2,
  Map,
  Search,
  GitCompare,
  Bot,
  CheckCircle2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Student Profile', path: '/profile', icon: User },
    { name: 'Career Assessment', path: '/assessment', icon: ClipboardCheck },
    { name: 'AI Recommendations', path: '/recommendations', icon: Sparkles, highlight: true },
    { name: 'Skill Gap Analysis', path: '/skill-gap', icon: BarChart2 },
    { name: 'Personalized Roadmap', path: '/roadmap', icon: Map },
    { name: 'Career Explorer', path: '/careers', icon: Search },
    { name: 'Career Comparison', path: '/compare', icon: GitCompare },
    { name: 'AI Career Chatbot', path: '/chatbot', icon: Bot, badge: 'AI' },
    { name: 'Progress Tracker', path: '/progress', icon: CheckCircle2 },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: ShieldCheck, admin: true });
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#0d1322] border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto custom-scrollbar`}
      >
        <div className="py-5 px-3 space-y-1">
          <div className="px-3 pb-3 mb-2 border-b border-slate-800/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                      : item.admin
                      ? 'text-amber-400 hover:bg-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-indigo-400 group-hover:scale-110 transition-transform'
                            : item.admin
                            ? 'text-amber-400'
                            : 'text-slate-400 group-hover:text-cyan-400 transition-colors'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}

                    {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom AI Status Banner */}
        <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nova Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI + Rule-Based Dual Recommendation Engine active.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
