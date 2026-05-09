import { motion } from 'motion/react';
import { Phone } from 'lucide-react';

export default function FloatingCallButton() {
  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 md:right-28 z-[60] group">
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-4 px-3 py-2 bg-charcoal text-white text-[10px] font-bold tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
        Call Reservations
        <div className="absolute top-full right-6 -translate-y-1/2 border-8 border-transparent border-t-charcoal" />
      </div>

      <motion.a
        href="tel:+254794532900"
        className="w-14 h-14 md:w-16 md:h-16 bg-gold rounded-lg flex items-center justify-center shadow-2xl relative border-2 border-charcoal/5"
        whileHover={{ scale: 1.1, backgroundColor: '#FFFFFF' }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Phone className="text-charcoal w-7 h-7 group-hover:scale-110 transition-transform" />
        
        {/* Subtle indicator */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full m-2 animate-pulse" />
      </motion.a>
    </div>
  );
}
