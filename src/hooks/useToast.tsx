import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', title?: string, duration = 3500) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 toasts

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((t) => {
          const config = {
            success: {
              icon: CheckCircle2,
              color: 'text-emerald-500',
              bg: 'bg-slate-900/95 border-emerald-500/30 text-white',
              glow: 'shadow-emerald-500/10',
            },
            error: {
              icon: AlertCircle,
              color: 'text-red-500',
              bg: 'bg-slate-900/95 border-red-500/30 text-white',
              glow: 'shadow-red-500/10',
            },
            warning: {
              icon: AlertTriangle,
              color: 'text-amber-500',
              bg: 'bg-slate-900/95 border-amber-500/30 text-white',
              glow: 'shadow-amber-500/10',
            },
            info: {
              icon: Info,
              color: 'text-blue-500',
              bg: 'bg-slate-900/95 border-blue-500/30 text-white',
              glow: 'shadow-blue-500/10',
            },
          }[t.type];

          const IconComponent = config.icon;

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md shadow-xl ${config.bg} ${config.glow} transition-all animate-in slide-in-from-top-3 fade-in duration-200`}
            >
              <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${config.color}`} />
              <div className="flex-1 min-w-0">
                {t.title && (
                  <h5 className="font-extrabold text-xs text-white leading-tight mb-0.5">
                    {t.title}
                  </h5>
                )}
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
