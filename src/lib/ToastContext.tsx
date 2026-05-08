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
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className="glass bg-charcoal/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden group">
                {/* Accent Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  toast.type === 'success' ? 'bg-gold' : 
                  toast.type === 'error' ? 'bg-red-500' : 'bg-blue-400'
                }`} />
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  toast.type === 'success' ? 'bg-gold/10 text-gold' : 
                  toast.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-blue-400/10 text-blue-400'
                }`}>
                  {toast.type === 'success' && <CheckCircle size={20} />}
                  {toast.type === 'error' && <AlertCircle size={20} />}
                  {toast.type === 'info' && <Info size={20} />}
                </div>

                <div className="flex-1 pr-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-0.5">
                    {toast.type === 'success' ? 'Operation Success' : 
                     toast.type === 'error' ? 'System Error' : 'Notification'}
                  </p>
                  <p className="text-xs font-medium text-white/90 leading-relaxed">{toast.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all"
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
