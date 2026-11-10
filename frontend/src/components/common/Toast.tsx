import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  durationMs?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (toast.type === 'error') return; // Error toast stays until dismissed (Section 2.2)
    if (isPaused) return;

    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.durationMs || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.type, toast.durationMs, isPaused, onDismiss]);

  const borderBg =
    toast.type === 'success'
      ? 'border-emerald-200 bg-white text-ink'
      : toast.type === 'error'
      ? 'border-red-300 bg-white text-ink'
      : 'border-divider bg-white text-ink';

  const icon =
    toast.type === 'success' ? (
      <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
    ) : toast.type === 'error' ? (
      <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
    ) : (
      <Info size={16} className="text-[#D14509] flex-shrink-0 mt-0.5" />
    );

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto p-3.5 rounded-[6px] border ${borderBg} shadow-lg flex items-start justify-between space-x-3 transition-all duration-200 animate-fade-in font-sans`}
      role="alert"
    >
      <div className="flex items-start space-x-2.5">
        {icon}
        <div className="text-[13px] leading-snug">
          {toast.title && <div className="font-semibold text-ink">{toast.title}</div>}
          <div className="text-muted mt-0.5">{toast.message}</div>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-muted hover:text-ink text-[12px] p-0.5 rounded transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
};

