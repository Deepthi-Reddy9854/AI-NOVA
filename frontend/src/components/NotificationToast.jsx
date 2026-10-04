import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const NotificationToast = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-950/40 text-rose-200',
    warning: 'border-amber-500/30 bg-amber-950/40 text-amber-200',
    info: 'border-cyan-500/30 bg-cyan-950/40 text-cyan-200',
  };

  return (
    <div className={`p-4 rounded-xl border ${borders[type]} flex items-center justify-between shadow-lg backdrop-blur-md mb-4 animate-fade-in`}>
      <div className="flex items-center space-x-3">
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:opacity-75">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NotificationToast;
