import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MenuItem } from '../types';
import { cn } from '../lib/utils';
import { Flame, Star, ShoppingBag, Plus } from 'lucide-react';
import SEO from '../components/SEO';
import { useToast } from '../lib/ToastContext';

export default function Menu() {
  const { showToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'menu'), orderBy('category'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      
      setItems(firestoreItems);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'menu');
      showToast('Failed to load menu data. Please try again.', 'error');
      setItems([]); 
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filter unique categories based on merged items
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => 
    activeCategory === 'All' ? true : item.category === activeCategory
  );


  return (
    <div className="pt-32 pb-24">
      <SEO 
        title="Our Menu | Authentic Grilled Tilapia & Sides"
        description="Explore our curated menu of premium Lake Victoria tilapia, hand-crafted milkshakes, and traditional Kenyan sides. Quality ingredients, authentic spices, and sizes from 200g up to 500g."
      />
      {/* Menu Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full glass text-gold text-[10px] font-bold tracking-widest"
          >
            Exquisite Dining
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85]"
          >
            Our <span className="text-gold">Menu</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-charcoal/60 font-light text-lg italic"
          >
            A curated selection of the finest lakeside treasures, prepared with artisan techniques and traditional soul.
          </motion.p>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-y border-charcoal/5 py-6 mb-8 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center gap-4 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full text-[10px] font-bold tracking-widest transition-all",
                activeCategory === cat 
                  ? "bg-gold text-charcoal shadow-[0_0_20px_rgba(255,178,0,0.3)]" 
                  : "glass text-charcoal/50 hover:text-charcoal hover:border-charcoal/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Info Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="glass border-gold/20 px-8 py-4 rounded-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-charcoal/70">
              Fish sizes available: <span className="text-gold">200g, 250g, 300g, 350g, 400g, 450g, 500g</span>
            </span>
          </div>
          <p className="text-[10px] font-bold tracking-widest text-gold italic">
            Milkshakes & Ice Cream Available
          </p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group p-4 rounded-3xl glass border-charcoal/5 hover:border-gold/20 transition-all duration-500 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  {/* Subtle Color Overlay & Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Luxury Shine Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {(item.isSpicy || item.description.toLowerCase().includes('spice') || item.description.toLowerCase().includes('spicy')) && (
                      <div className="bg-gold/20 backdrop-blur-sm p-2 rounded-xl text-gold" title="Spicy">
                        <Flame size={14} fill="currentColor" />
                      </div>
                    )}
                    {item.isChefSpecial && (
                      <div className="bg-gold/20 backdrop-blur-sm p-2 rounded-xl text-gold" title="Chef Special">
                        <Star size={14} fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Concept */}
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-white text-charcoal rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Plus size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-charcoal tracking-tight group-hover:text-gold transition-colors">
                        {item.name}
                      </h3>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={10} 
                              className={cn(
                                i < Math.floor(item.rating) ? "text-gold fill-gold" : "text-charcoal/10",
                                i === Math.floor(item.rating) && item.rating % 1 !== 0 ? "text-gold fill-gold opacity-50" : ""
                              )} 
                            />
                          ))}
                          <span className="text-[10px] text-charcoal/40 font-bold ml-1">{item.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xl font-display font-black text-charcoal shrink-0 transition-colors group-hover:text-gold">
                      <span className="text-gold text-xs mr-1 transition-colors group-hover:text-gold">KES</span>
                      {item.price}
                    </p>
                  </div>
                  <p className="text-sm text-charcoal/50 font-light leading-relaxed line-clamp-2 italic">
                    {item.description}
                  </p>
                  
                  {/* Footer details */}
                  <div className="pt-4 flex items-center justify-between border-t border-charcoal/5">
                    <span className="text-[9px] tracking-widest text-charcoal/30 font-bold">
                      Category: {item.category}
                    </span>
                    <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick Order <ShoppingBag size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Special Banner */}
      <section className="mt-32 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-96 rounded-3xl overflow-hidden flex items-center justify-center text-center p-12"
        >
          <img 
            src="https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
            alt="Chef preparing"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-white/95 to-gold/10 opacity-80" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-8 max-w-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-[0.9] text-charcoal">
              Today’s <span className="text-gold text-glow-gold">Secret</span> Catch
            </h2>
            <p className="text-charcoal/70 italic text-lg md:text-xl font-light">
              "Ask your server about our daily off-menu specialties sourced directly from the fishermen at first light."
            </p>
            <button className="px-10 py-4 border border-gold/30 text-gold text-[10px] font-bold tracking-widest rounded-2xl hover:bg-gold hover:text-charcoal hover:border-gold transition-all">
              Request Daily Special
            </button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
