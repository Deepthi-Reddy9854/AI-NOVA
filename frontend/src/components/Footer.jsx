import React from 'react';
import { Compass, Github, Heart } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-[#090d16] border-t border-slate-800/60 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
        <div className="flex items-center space-x-2">
          <img src={logoImg} alt="Nova AI Logo" className="w-6 h-6 rounded-lg object-contain bg-white/10 p-0.5" />
          <span className="font-semibold text-slate-200">Nova AI</span>
          <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          <span>Personalized Academic-to-Career Navigation Platform</span>
        </p>

        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span>&bull;</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          <span>&bull;</span>
          <span className="hover:text-white cursor-pointer transition-colors">AI Guidelines</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
