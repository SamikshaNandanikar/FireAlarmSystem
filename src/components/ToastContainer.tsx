import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToastItem } from '../types/dfa';
import { ShieldCheck, Wind, AlertTriangle, Flame, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  const getToastIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <Wind className="w-5 h-5 text-yellow-400" />;
      case 'error': return <Flame className="w-5 h-5 text-red-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-sky-400" />;
    }
  };

  const getToastStyle = (type: ToastItem['type']) => {
    switch (type) {
      case 'success': return 'bg-slate-900/95 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'warning': return 'bg-slate-900/95 border-yellow-500/50 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
      case 'error': return 'bg-slate-900/95 border-red-500/60 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      default: return 'bg-slate-900/95 border-sky-500/50 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.2)]';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`p-4 rounded-xl border backdrop-blur-md flex items-start justify-between gap-3 shadow-xl pointer-events-auto ${getToastStyle(
              toast.type
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getToastIcon(toast.type)}</div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold font-heading tracking-wide">{toast.title}</span>
                <span className="text-[11px] text-slate-300 leading-tight">{toast.message}</span>
              </div>
            </div>

            <button
              onClick={() => onRemoveToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
