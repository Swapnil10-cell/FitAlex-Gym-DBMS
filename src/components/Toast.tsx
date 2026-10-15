import React from 'react';
import { useGym, ToastMessage } from '../context/GymContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatTimeWithSeconds } from '../utils/dateUtils';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useGym();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-[#D4FF00] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-auto bg-[#181C24] border border-[#252B38] shadow-2xl rounded-2xl p-4 flex items-start gap-3.5 backdrop-blur-md"
    >
      <div className="pt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-white tracking-wide">{toast.title}</p>
          <span className="font-mono-tabular text-[11px] text-slate-400">
            {formatTimeWithSeconds(toast.timestamp)}
          </span>
        </div>
        {toast.description && (
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
