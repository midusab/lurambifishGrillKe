import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 md:bottom-8 right-6 md:right-8 z-[60] group">
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-4 px-3 py-2 bg-charcoal text-white text-[10px] font-bold tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
        Chat on WhatsApp
        <div className="absolute top-full right-6 -translate-y-1/2 border-8 border-transparent border-t-charcoal" />
      </div>

      <motion.a
        href="https://wa.me/254794532900"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-lg flex items-center justify-center shadow-2xl relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
        <MessageCircle className="text-white w-8 h-8" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg animate-ping bg-[#25D366] opacity-30" />
      </motion.a>
    </div>
  );
}
