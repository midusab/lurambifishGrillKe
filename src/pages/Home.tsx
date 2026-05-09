import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Quote, ChevronRight, MapPin, Phone, Users, Fish, Flame, UtensilsCrossed, Utensils, ShoppingBag, Truck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MenuItem } from '../types';
import { cn } from '../lib/utils';
import SEO from '../components/SEO';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
}

export default function Home() {
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const [featuredDishes, setFeaturedDishes] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState<any[]>([
    { label: 'Happy Guests', value: '850+', icon: 'Users' },
    { label: 'Fish Served', value: '1200+', icon: 'Fish' },
    { label: 'Chef Awards', value: '4', icon: 'Star' }
  ]);

  useEffect(() => {
    // Fetch featured dishes
    const menuQ = query(
      collection(db, 'menu'), 
      where('isChefSpecial', '==', true),
      limit(3)
    );
    const unsubscribeMenu = onSnapshot(menuQ, (snapshot) => {
      const firestoreFeatured = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setFeaturedDishes(firestoreFeatured);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'menu');
      setFeaturedDishes([]);
    });

    // Fetch reviews (only approved ones)
    const q = query(
      collection(db, 'reviews'), 
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'), 
      limit(4)
    );
    const unsubscribeReviews = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setLatestReviews(data);
      
      // Update stats based on reviews count + high base dummy values
      setLiveStats(prev => prev.map(s => {
        if (s.label === 'Happy Guests') return { ...s, value: `${850 + snapshot.size * 2}+` }; 
        if (s.label === 'Fish Served') return { ...s, value: `${1200 + snapshot.size * 3}+` };
        return s;
      }));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reviews');
    });

    // Fetch total menu items for stats
    const unsubStats = onSnapshot(collection(db, 'menu'), (snap) => {
      setLiveStats(prev => prev.map(s => {
        if (s.label === 'Chef Awards') return { ...s, value: `${Math.max(4, Math.floor(snap.size / 4))}` };
        return s;
      }));
    });

    return () => {
      unsubscribeMenu();
      unsubscribeReviews();
      unsubStats();
    };
  }, []);


  const iconMap: Record<string, React.ElementType> = {
    Users: Users,
    Fish: Fish,
    Star: Star,
    Fire: Flame,
    Lounge: UtensilsCrossed,
    DineIn: Utensils,
    TakeOut: ShoppingBag,
    Delivery: Truck,
  };

  return (
    <div className="flex flex-col">
      <SEO 
        title="Premium Lake Victoria Tilapia in Kakamega"
        description="Experience the finest charcoal-grilled tilapia and luxury lakeside dining in Kakamega. Fresh Lake Victoria fish served with traditional Kenyan passion since 2025."
      />
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-white/20 to-white" />
        
        {/* Background Image / Video Mock */}
        <div className="absolute inset-0 scale-105">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80" 
            alt="Charcoal Grill" 
            className="w-full h-full object-cover object-center animate-subtle-zoom brightness-50"
          />
          {/* Particles/Smoke Effect Overlay */}
          <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
          <motion.div 
            className="absolute inset-0 smoke-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-gold text-[10px] sm:text-xs font-bold tracking-widest mb-4 border border-gold/20"
          >
            <Star className="w-3 h-3 fill-gold text-gold" />
            Voted #1 Seafood in Kakamega
          </motion.div>


          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-8xl font-display font-black leading-[0.9] tracking-tighter"
          >
            Kakamega’s <br />
            <span className="text-gold text-glow-gold">Premium Fish</span> Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto text-charcoal/70 text-lg md:text-xl font-light tracking-wide leading-relaxed"
          >
            Authentic Lake Victoria Tilapia, charcoal-grilled to perfection with our signature 
            Lurambi spice blend. Luxury dining redefined in the heart of Kakamega.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link 
              to="/menu"
              className="group relative px-10 py-5 bg-gold text-charcoal font-black text-xs tracking-widest rounded-2xl overflow-hidden transition-all hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Online <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link 
              to="/contact"
              className="px-10 py-5 glass hover:bg-charcoal/10 text-charcoal font-black text-xs tracking-widest rounded-2xl transition-all"
            >
              Book a Table
            </Link>
          </motion.div>
        </div>

        {/* Floating Reservation Card (Bottom Right Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden lg:block absolute bottom-12 right-12 z-30 w-72 glass p-6 border-charcoal/5 shadow-2xl space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-xs text-gold">Reservations</h3>
            <div className="w-2 h-2 bg-green-500 animate-pulse" />
          </div>
          <p className="text-sm text-charcoal/90 font-medium">Quick Booking Available</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-charcoal/50 tracking-widest">
              <Phone size={12} className="text-gold" />
              <span>+254 700 000 000</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-charcoal/50 tracking-widest">
              <MapPin size={12} className="text-gold" />
              <span>Webuye Rd, Lurambi</span>
            </div>
          </div>
          <button className="w-full py-3 bg-charcoal/5 hover:bg-charcoal/10 border border-charcoal/10 rounded-xl text-[10px] font-bold tracking-[0.2em] transition-colors">
            Check Availability
          </button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {liveStats.map((stat, i) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-2 p-10 glass rounded-3xl border-charcoal/5 hover:border-gold/20 transition-all group flex flex-col items-center justify-center min-h-[220px]"
              >
                <div className="w-12 h-12 bg-charcoal/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon className="text-gold w-6 h-6" />
                </div>
                <h3 className="text-4xl font-display font-black text-charcoal">{stat.value}</h3>
                <p className="text-[10px] tracking-widest text-charcoal/40">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Chef Spotlight/Featured Dishes */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:row justify-between items-end gap-6 mb-16">
            <div className="space-y-4">
              <span className="text-gold text-[10px] font-bold tracking-widest">Signature Selection</span>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-tight">Our Chef's Specials</h2>
            </div>
            <Link to="/menu" className="group flex items-center gap-2 text-charcoal/50 hover:text-gold text-xs font-bold tracking-widest transition-all">
              View Full Menu <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredDishes.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group relative h-[500px] overflow-hidden rounded-[2.5rem]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-500" />
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                
                {/* Shine Sweep Effect */}
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                <div className="absolute bottom-0 left-0 right-0 p-10 z-20 space-y-4 transform transition-transform group-hover:-translate-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-gold text-charcoal text-[9px] font-bold rounded-xl tracking-widest">
                      {dish.category}
                    </span>
                    <span className="text-lg font-display font-black text-charcoal">
                      KES {dish.price}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-display font-black text-charcoal leading-tight">
                      {dish.name}
                    </h3>
                    {dish.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star 
                            key={idx} 
                            size={10} 
                            className={cn(
                              idx < Math.floor(dish.rating) ? "text-gold fill-gold" : "text-charcoal/10",
                              idx === Math.floor(dish.rating) && dish.rating % 1 !== 0 ? "text-gold fill-gold opacity-50" : ""
                            )} 
                          />
                        ))}
                        <span className="text-[10px] text-charcoal/40 font-bold ml-1">{dish.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-charcoal/60 text-xs font-light line-clamp-2 italic">
                    {dish.description}
                  </p>
                  <button className="pt-4 flex items-center gap-2 text-gold text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    Discover More <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-charcoal/5">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80" 
                alt="Ambiance" 
                className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-10 -right-10 w-64 h-64 glass rounded-[2rem] p-8 flex flex-col justify-center gap-4 border-gold/10 shadow-2xl"
            >
              <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                <Star className="text-gold animate-pulse" />
              </div>
              <p className="text-xl font-display font-bold text-charcoal tracking-tight">Pure Lakeside Tradition</p>
              <p className="text-[10px] tracking-widest text-charcoal/50">Quality is our only ingredient.</p>
            </motion.div>
          </motion.div>

          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-charcoal/5"
            >
              {[
                { title: 'Dine In', desc: 'Enjoy our luxury lakeside ambiance and premium hospitality.', icon: 'DineIn' },
                { title: 'Take-Out', desc: 'Quick and easy pick-up for those on the move.', icon: 'TakeOut' },
                { title: 'Delivery', desc: 'Bringing the lake taste directly to your doorstep.', icon: 'Delivery' }
              ].map((service, i) => {
                const Icon = iconMap[service.icon];
                return (
                  <motion.div 
                    key={service.title} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Icon className="text-gold w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-charcoal tracking-widest text-sm">{service.title}</h4>
                      <p className="text-[10px] text-charcoal/50 leading-relaxed max-w-[150px] mx-auto italic">{service.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <span className="text-gold text-[10px] font-bold tracking-widest">Our Excellence</span>
                <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-tight">Beyond Just <br />A Meal</h2>
              </motion.div>
            
            <div className="space-y-8">
              {[
                { title: 'Fresh Daily Catch', desc: 'Sourced directly from Lake Victoria every morning ensureing maximum flavor.', icon: 'Fish' },
                { title: 'Signature Smoked Grilling', desc: 'Our unique charcoal technique locks in juices while adding a refined smoky aroma.', icon: 'Fire' },
                { title: 'Luxury Ambiance', desc: 'Designed for intimacy and comfort, perfect for business meetings or romantic dates.', icon: 'Lounge' }
              ].map((item, i) => {
                const Icon = iconMap[item.icon];
                return (
                  <motion.div 
                    key={item.title} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                    viewport={{ once: true }}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-charcoal/5 flex items-center justify-center border border-charcoal/10 group-hover:border-gold/30 transition-colors">
                      <Icon className="text-gold w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-charcoal tracking-wider">{item.title}</h4>
                      <p className="text-charcoal/40 text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>

      {/* Testimonials */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-20"
          >
             <span className="text-gold text-[10px] font-bold tracking-widest">Guest Feedback</span>
             <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-tight text-charcoal">What Our Guests <br />Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestReviews.length > 0 ? (
              latestReviews.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="p-12 glass rounded-[2.5rem] relative space-y-8"
                >
                  <Quote className="absolute top-10 right-10 text-gold/10 w-20 h-20" />
                  <div className="flex gap-1 text-gold">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-base md:text-lg font-light italic text-charcoal/90 leading-relaxed relative z-10">
                    “{t.comment}”
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-charcoal/5 border-2 border-gold/20 flex items-center justify-center">
                      <User className="text-gold" size={24} />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-charcoal tracking-widest text-sm">{t.userName}</h5>
                      <p className="text-xs text-charcoal/40">Verified Guest</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full p-20 text-center glass rounded-2xl border-dashed border-charcoal/10">
                <Quote className="mx-auto text-gold/20 w-16 h-16 mb-6" />
                <p className="text-charcoal/50 font-light italic text-xl mb-8">Be the first to share your experience with Lurambi Fish Grill.</p>
                <Link to="/reviews" className="px-10 py-4 bg-gold text-charcoal font-black text-xs tracking-widest rounded-2xl">Write a Review</Link>
              </div>
            )}
          </div>

          {latestReviews.length > 0 && (
            <div className="mt-20 text-center">
              <Link 
                to="/reviews" 
                className="group inline-flex items-center gap-2 text-charcoal/50 hover:text-gold text-xs font-bold tracking-widest transition-all"
              >
                View All Guest Stories <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80" 
             alt="Restaurant" 
             className="w-full h-full object-cover opacity-20"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
         </div>
         
         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-10"
         >
           <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter text-charcoal">
             Ready for the <br /> <span className="text-gold text-glow-gold">Perfect Catch?</span>
           </h2>
           <p className="text-charcoal/60 text-lg font-light tracking-wide italic">
             Join us tonight for an unforgettable seafood experience. 
             Reservations filling up fast for the weekend.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link 
                to="/contact" 
                className="px-12 py-6 bg-gold text-charcoal font-black text-xs tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-lg shadow-gold/20"
              >
                Secure Your Table
              </Link>
              <Link 
                to="/menu" 
                className="px-12 py-6 glass text-charcoal font-black text-xs tracking-[0.2em] rounded-2xl hover:bg-charcoal/10 transition-all font-bold"
              >
                Explore Full Menu
              </Link>
           </div>
         </motion.div>
      </section>
    </div>
  );
}
