import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Fish, MapPin, Heart, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      <SEO 
        title="Our Story | The Spirit of Lurambi"
        description="Discover how we combine lakeside tradition with modern luxury. Lurambi Fish Grill's commitment to quality, sustainability, and authentic Kenyan seafood in Kakamega."
      />
      {/* Cinematic Intro */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80" 
            alt="Lakeside" 
            loading="eager"
            className="w-full h-full object-cover grayscale opacity-20 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
        </motion.div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto px-6">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tracking-widest text-gold font-bold text-[10px]"
          >
            Since 2025
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-display font-black tracking-tighter leading-[0.8]"
          >
            The Spirit <br /> of <span className="text-gold">Lurambi</span>
          </motion.h1>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10 order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-tight">
              A Legacy <br /> Born From <span className="text-gold">Water</span>
            </h2>
            <div className="space-y-6 text-charcoal/60 font-light text-lg leading-relaxed italic">
              <p>
                Lurambi Fish Grill didn't start in a boardroom. It started on the banks of Lake Victoria, where our founders witnessed the artistry of local fishermen and the unique, soulful flavor of wood-grilled tilapia.
              </p>
              <p>
                Driven by a vision to elevate traditional Kenyan seafood to a world-class luxury experience, we established our flagship location in Lurambi, Kakamega. We believe that fine dining isn't just about white tablecloths; it's about the respect for ingredients and the warmth of the hospitality.
              </p>
            </div>
            <div className="flex gap-10 pt-6 border-t border-charcoal/5">
              <div className="space-y-2">
                <p className="text-3xl font-display font-black text-charcoal">100%</p>
                <p className="text-[10px] tracking-widest text-gold font-bold">Lakeside Sourced</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-display font-black text-charcoal">24h</p>
                <p className="text-[10px] tracking-widest text-gold font-bold">Catch to Grill</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5">
              <img src="https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80" alt="Chef at work" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <motion.div 
              initial={{ scale: 0, rotate: 0 }}
              whileInView={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="absolute -left-10 top-20 w-48 h-48 bg-gold flex items-center justify-center rounded-[2.5rem] shadow-2xl"
            >
              <Fish className="text-charcoal w-24 h-24" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             whileHover={{ y: -10 }}
             className="p-16 glass rounded-[2.5rem] space-y-8 border-gold/10"
            >
             <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center">
               <Heart className="text-gold" size={32} />
             </div>
             <h3 className="text-4xl font-display font-black tracking-tight text-charcoal">Our Mission</h3>
             <p className="text-charcoal/50 font-light text-lg leading-relaxed">
               To preserve and polish Kenyan culinary traditions through relentless commitment to quality and innovative grilling techniques, serving every guest with the dignity they deserve.
             </p>
            </motion.div>

            <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             viewport={{ once: true }}
             whileHover={{ y: -10 }}
             className="p-16 glass rounded-[2.5rem] space-y-8 border-gold/10"
            >
             <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center">
               <ShieldCheck className="text-gold" size={32} />
             </div>
             <h3 className="text-4xl font-display font-black tracking-tight text-charcoal">Our Vision</h3>
             <p className="text-charcoal/50 font-light text-lg leading-relaxed">
               To become the definitive global reference for African seafood luxury, setting benchmarks in sustainability and culinary excellence that inspire a new generation of Kenyan chefs.
             </p>
            </motion.div>
        </div>
      </section>

      {/* Interior Stills */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-20">
          <div className="space-y-4 max-w-2xl mx-auto">
             <span className="text-gold text-[10px] font-bold tracking-widest">The Ambiance</span>
             <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.9]">Dine in <br /> <span className="text-gold">Sophistication</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="md:col-span-2 rounded-[2.5rem] overflow-hidden relative group"
             >
               <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Lounge" />
               <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="rounded-[2.5rem] overflow-hidden relative group"
             >
               <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Bar" />
               <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="rounded-[2.5rem] overflow-hidden relative group"
             >
               <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Dining area" />
               <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="md:col-span-2 rounded-[2.5rem] overflow-hidden relative group"
             >
               <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Lounge details" />
               <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
             </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
