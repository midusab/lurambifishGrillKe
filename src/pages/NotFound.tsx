import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Fish } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative">
      <SEO title="404 - Page Not Found | Lurambi Fish Grill" description="The page you are looking for does not exist." />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center space-y-12 relative z-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h1 className="text-[15rem] font-display font-black text-charcoal/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-24 h-24 bg-gold rounded-3xl flex items-center justify-center shadow-2xl shadow-gold/40"
            >
              <Fish size={48} className="text-charcoal" />
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-3xl font-display font-black text-charcoal uppercase tracking-tighter">LOST AT SEA?</h2>
          <p className="text-charcoal/40 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
            The page you're looking for has drifted away. <br />
            Let's get you back to the grill.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-charcoal text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-gold hover:text-charcoal transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <Home size={16} /> Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-charcoal/5 text-charcoal font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-charcoal/10 transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>

      {/* Floating accent */}
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute top-20 right-20 text-gold/20 opacity-50 hidden md:block"
      >
        <Fish size={120} />
      </motion.div>
    </div>
  );
}
