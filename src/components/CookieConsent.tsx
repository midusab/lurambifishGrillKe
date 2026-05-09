import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setTimeout(() => setShowConsent(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100]"
        >
          <div className="glass p-8 rounded-3xl border border-charcoal/5 shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Cookie size={24} />
              </div>
              <h4 className="text-xl font-display font-black tracking-tight text-charcoal">Cookie Policy</h4>
            </div>
            
            <p className="text-charcoal/50 text-[11px] font-bold tracking-widest leading-relaxed">
              We use cookies to enhance your lakeside dining experience. 
              By continuing to visit this site, you agree to our use of cookies.
            </p>

            <div className="flex gap-4">
              <button 
                onClick={handleAccept}
                className="flex-1 py-4 bg-charcoal text-white font-black text-[10px] tracking-widest rounded-2xl hover:bg-gold hover:text-charcoal transition-all shadow-xl"
              >
                Accept All
              </button>
              <button 
                onClick={handleDecline}
                className="flex-1 py-4 bg-charcoal/5 text-charcoal font-black text-[10px] tracking-widest rounded-2xl hover:bg-charcoal/10 transition-all border border-charcoal/10"
              >
                Decline
              </button>
            </div>

            <button 
              onClick={() => setShowConsent(false)}
              className="absolute top-4 right-4 text-charcoal/20 hover:text-charcoal transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
