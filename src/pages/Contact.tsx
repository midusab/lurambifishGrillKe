import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '../lib/ToastContext';
import SEO from '../components/SEO';

export default function Contact() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Table Booking',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please provide your name and email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reservations'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setSubmitted(true);
      showToast('Reservation sent successfully!', 'success');
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', type: 'Table Booking', message: '' });
      }, 5000);
    } catch (err) {
      console.error(err);
      showToast('Failed to send reservation. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Reservations & Contact | Lurambi Fish Grill"
        description="Book your table at Lurambi Fish Grill. Experience premium lakeside dining in the heart of Kakamega."
      />

      {/* Cinematic Header Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80" 
            alt="Lakeside Grill" 
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-charcoal/80 to-white" />
          <div className="absolute inset-0 smoke-overlay opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-gold/20"
          >
            <Star className="w-3 h-3 fill-gold" />
            Direct Reservations
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.9] text-white"
          >
            SECURE YOUR <br /> <span className="text-gold text-glow-gold">LAKESIDE TABLE</span>
          </motion.h1>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="relative z-20 -mt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-charcoal p-10 rounded-3xl text-white shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Connect</span>
                  <h3 className="text-4xl font-display font-black uppercase tracking-tight leading-none">VISIT <br /> THE <span className="text-gold">GRILL</span></h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    { icon: Phone, label: 'Reservations', value: '+254 700 000 000' },
                    { icon: Mail, label: 'General Inquiry', value: 'hello@lurambi.ke' },
                    { icon: MapPin, label: 'Find Us', value: 'Webuye Rd, Lurambi' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-5 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold group-hover/item:bg-gold group-hover/item:text-charcoal transition-colors">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{item.label}</p>
                        <p className="text-sm font-bold tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex gap-4">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors" />
            </div>

            <div className="bg-white p-10 rounded-3xl border border-charcoal/5 shadow-xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-charcoal/5 rounded-2xl flex items-center justify-center text-gold">
                  <Clock size={24} />
                </div>
                <h4 className="text-xl font-display font-black uppercase tracking-tight text-charcoal">Opening Hours</h4>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center py-2 border-b border-charcoal/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Weekdays</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal">10:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Weekends</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold">09:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Reservation Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 bg-white p-10 md:p-12 rounded-3xl shadow-2xl border border-charcoal/5 relative overflow-hidden"
          >
            <AnimatePresence>
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 space-y-6"
                >
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-500/20"
                  >
                    <CheckCircle2 className="text-white w-12 h-12" />
                  </motion.div>
                  <div className="space-y-3">
                    <h3 className="text-4xl font-display font-black uppercase tracking-tighter text-charcoal">Request <br /> <span className="text-green-500">Received</span></h3>
                    <p className="text-charcoal/40 text-sm max-w-xs mx-auto font-medium">Our team has been notified. We will contact you shortly to confirm your lakeside experience.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-12 py-4 bg-charcoal text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-gold hover:text-charcoal transition-all shadow-xl"
                  >
                    Close Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-10 space-y-2">
              <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-charcoal">Quick Reservation</h3>
              <p className="text-charcoal/40 text-xs font-medium">Please fill in the details below to book your lake-side experience.</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none transition-all placeholder:text-charcoal/20 font-bold"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none transition-all placeholder:text-charcoal/20 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Experience Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Table Booking', 'Couple Special', 'Private Event'].map((type) => (
                      <label key={type} className="relative cursor-pointer group">
                        <input 
                          type="radio" 
                          name="res_type" 
                          className="hidden peer" 
                          checked={formData.type === type}
                          onChange={() => setFormData({...formData, type})}
                        />
                        <div className="px-4 py-3 rounded-2xl border border-charcoal/10 bg-charcoal/5 peer-checked:border-gold peer-checked:bg-gold/5 text-center transition-all group-hover:border-gold/30">
                          <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/40 peer-checked:text-gold">{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Message (Optional)</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Special requests or occasion details..."
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none transition-all placeholder:text-charcoal/20 resize-none font-bold"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-charcoal text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-gold hover:text-charcoal transition-all shadow-xl group disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>Confirm Reservation <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.04351336423!2d34.7578278!3d0.282711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178101a07205166b%3A0xe549a997235a901d!2sLurambi%2C%20Kakamega!5e0!3m2!1sen!2ske!4v1715073600000!5m2!1sen!2ske" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }} 
              allowFullScreen 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
            
            <div className="absolute bottom-10 left-10 glass p-8 rounded-[2.5rem] max-w-xs border border-white/20 hidden md:block">
              <h4 className="text-xl font-display font-black text-charcoal uppercase mb-2">Visit Lurambi</h4>
              <p className="text-[10px] text-charcoal/50 font-bold uppercase tracking-widest leading-loose">
                Webuye Road, Lurambi<br />
                Kakamega, Kenya
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
