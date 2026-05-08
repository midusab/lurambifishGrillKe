import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter, ArrowRight, Star } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
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
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-charcoal p-10 rounded-[4rem] text-white shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Connect</h3>
                
                <div className="space-y-6">
                  {[
                    { icon: Phone, label: 'Reservations', value: '+254 700 000 000' },
                    { icon: Mail, label: 'General Inquiry', value: 'hello@lurambi.ke' },
                    { icon: MapPin, label: 'Find Us', value: 'Webuye Rd, Lurambi' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{item.label}</p>
                        <p className="text-sm font-bold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex gap-4">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors" />
            </div>

            <div className="bg-white p-10 rounded-[4rem] border border-charcoal/5 shadow-xl space-y-6">
              <div className="w-12 h-12 bg-charcoal/5 rounded-2xl flex items-center justify-center text-gold">
                <Clock size={24} />
              </div>
              <h4 className="text-xl font-display font-black uppercase tracking-tight text-charcoal">Opening Hours</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-charcoal/30">Weekdays</span>
                  <span className="text-charcoal">10:00 - 22:00</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-charcoal/30">Weekends</span>
                  <span className="text-gold">09:00 - 23:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-charcoal/5"
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-12" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20 ml-2">Guest Name</label>
                <input 
                  type="text" 
                  placeholder="Michael Otieno"
                  className="w-full bg-charcoal/5 border-b-2 border-transparent focus:border-gold py-4 text-charcoal font-bold focus:outline-none transition-all placeholder:text-charcoal/10"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20 ml-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="michael@luxury.com"
                  className="w-full bg-charcoal/5 border-b-2 border-transparent focus:border-gold py-4 text-charcoal font-bold focus:outline-none transition-all placeholder:text-charcoal/10"
                />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20 ml-2">Experience Selection</label>
                <div className="flex flex-wrap gap-4">
                  {['Standard Table', 'Couple Special', 'Private Event'].map((type) => (
                    <label key={type} className="relative cursor-pointer group">
                      <input type="radio" name="res_type" className="hidden peer" defaultChecked={type === 'Standard Table'} />
                      <div className="px-8 py-3 rounded-full border-2 border-charcoal/5 peer-checked:border-gold peer-checked:bg-gold/5 transition-all">
                        <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/40 peer-checked:text-gold group-hover:text-charcoal transition-colors">{type}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20 ml-2">Special Requests</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your celebration..."
                  className="w-full bg-charcoal/5 border-b-2 border-transparent focus:border-gold py-4 text-charcoal font-bold focus:outline-none transition-all resize-none placeholder:text-charcoal/10 italic"
                />
              </div>
              <div className="md:col-span-2 pt-6">
                <button className="w-full md:w-auto px-12 py-6 bg-charcoal text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-gold hover:text-charcoal transition-all shadow-xl flex items-center justify-center gap-4 group">
                  Send Reservation <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[4rem] overflow-hidden shadow-2xl h-[500px] border-8 border-white">
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
