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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
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
      await addDoc(collection(db, 'contact'), {
        ...formData,
        status: 'pending',
        source: 'Website Contact Form',
        createdAt: serverTimestamp()
      });
      

      showToast('We have received your request!', 'success');
      
      setTimeout(() => {
        setFormData({ 
          name: '', 
          email: '', 
          phone: '',
          subject: 'General Inquiry',
          message: '' 
        });
      }, 5000);
    } catch (err) {
      console.error(err);
      showToast('Submission failed. Please check your connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Inquiry & Contact | Lurambi Fish Grill"
        description="Connect with Lurambi Fish Grill for inquiries and events. Experience premium lakeside dining in the heart of Kakamega."
      />

      {/* Cinematic Header Section */}
      <section className="relative min-h-[75vh] w-full flex items-center justify-center py-24">
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-gold text-[10px] font-black tracking-widest mb-4 border border-gold/20"
          >
            <Star className="w-3 h-3 fill-gold" />
            General Inquiries
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-tight text-white"
          >
            Connect With <br /> <span className="text-gold text-glow-gold">Lurambi Grill</span>
          </motion.h1>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="relative z-20 -mt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-charcoal p-10 rounded-3xl text-white shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <span className="text-gold text-[10px] font-black tracking-widest">Connect</span>
                  <h3 className="text-4xl font-display font-black tracking-tight leading-none">Visit <br /> the <span className="text-gold">Grill</span></h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    { icon: Phone, label: 'Call Us', value: '+254 794 532 900' },
                    { icon: Mail, label: 'General Inquiry', value: 'hello@lurambi.ke' },
                    { icon: MapPin, label: 'Find Us', value: 'Webuye Rd, Lurambi' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-5 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold group-hover/item:bg-gold group-hover/item:text-charcoal transition-colors">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black tracking-widest text-white/20 mb-1">{item.label}</p>
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
                <h4 className="text-xl font-display font-black tracking-tight text-charcoal">Opening Hours</h4>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center py-2 border-b border-charcoal/5">
                  <span className="text-[10px] font-black tracking-widest text-charcoal/30">Weekdays</span>
                  <span className="text-[10px] font-black tracking-widest text-charcoal">10:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[10px] font-black tracking-widest text-charcoal/30">Weekends</span>
                  <span className="text-[10px] font-black tracking-widest text-gold">09:00 AM - 11:00 PM</span>
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


            <div className="mb-12 space-y-4">
              <h3 className="text-2xl font-display font-black tracking-tighter text-charcoal">Send an Inquiry</h3>
              <p className="text-charcoal/40 text-xs font-medium">Please fill in the details below and we will get back to you shortly.</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-charcoal/40 ml-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none transition-all placeholder:text-charcoal/20 font-bold"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-charcoal/40 ml-1">Email Address</label>
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
                    <label className="text-[10px] font-black tracking-widest text-charcoal/40 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +254..."
                      className="w-full bg-charcoal/5 border border-charcoal/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none transition-all placeholder:text-charcoal/20 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-charcoal/40 ml-1">Inquiry Subject</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['General Inquiry', 'Private Event', 'Feedback'].map((type) => (
                      <label key={type} className="relative cursor-pointer group">
                        <input 
                          type="radio" 
                          name="inquiry_type" 
                          className="hidden peer" 
                          checked={formData.subject === type}
                          onChange={() => setFormData({...formData, subject: type})}
                        />
                        <div className="px-4 py-3 rounded-2xl border border-charcoal/10 bg-charcoal/5 peer-checked:border-gold peer-checked:bg-gold/5 text-center transition-all group-hover:border-gold/30">
                          <span className="text-[9px] font-black tracking-widest text-charcoal/40 peer-checked:text-gold">{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-charcoal/40 ml-1">Message (Optional)</label>
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
                  className="w-full py-5 bg-charcoal text-white font-black text-xs tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-gold hover:text-charcoal transition-all shadow-xl group disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>Send Inquiry <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
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
              <h4 className="text-xl font-display font-black text-charcoal mb-2">Visit Lurambi</h4>
              <p className="text-[10px] text-charcoal/50 font-bold tracking-widest leading-loose">
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
