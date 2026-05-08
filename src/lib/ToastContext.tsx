import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-4 w-full max-w-[90%] md:max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className="bg-[#0F0F0F] border border-white/20 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 relative overflow-hidden">
                {/* Accent Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  toast.type === 'success' ? 'bg-[#FFB200]' : 
                  toast.type === 'error' ? 'bg-red-500' : 'bg-blue-400'
                }`} />
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  toast.type === 'success' ? 'bg-[#FFB200]/10 text-[#FFB200]' : 
                  toast.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-blue-400/10 text-blue-400'
                }`}>
                  {toast.type === 'success' && <CheckCircle size={24} />}
                  {toast.type === 'error' && <AlertCircle size={24} />}
                  {toast.type === 'info' && <Info size={24} />}
                </div>

                <div className="flex-1 pr-2">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/50 mb-1">
                    {toast.type === 'success' ? 'SUCCESS' : 
                     toast.type === 'error' ? 'ERROR' : 'INFO'}
                  </p>
                  <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
