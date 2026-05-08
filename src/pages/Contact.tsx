import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <div className="pt-32 pb-24">
      <SEO 
        title="Contact & Reservations | Visit Us in Kakamega"
        description="Book your table at Lurambi Fish Grill. Find our location on Webuye Rd, Lurambi, and get in touch for private events, corporate catering, or premium seafood dining inquiries."
      />
      {/* Contact Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
          <div className="space-y-8">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]"
            >
              Get In Touch
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85]"
            >
              LET’S START A <br /> <span className="text-gold">CONVERSATION</span>
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/50 text-lg font-light leading-relaxed max-w-md italic pb-4"
          >
            Whether you're planning an intimate dinner, a corporate event, or just want to say hello, we’re here to assist you.
          </motion.div>
        </div>
      </div>

      {/* Main Contact Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          {[
            { icon: Phone, title: 'Phone Support', value: '+254 700 000 000', sub: 'Reservations & Orders' },
            { icon: Mail, title: 'Email Us', value: 'hello@lurambifishgrill.com', sub: 'Inquiries & Feedback' },
            { icon: MapPin, title: 'Find Us', value: 'Webuye Rd, Lurambi', sub: 'Kakamega, Kenya' },
            { icon: Clock, title: 'Active Hours', value: '10:00 AM - 10:00 PM', sub: 'Daily Open' }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 glass rounded-2xl border-charcoal/5 hover:border-gold/20 transition-all flex items-start gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-charcoal/5 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                <item.icon className="text-gold" size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-charcoal/30">{item.title}</p>
                <p className="text-lg font-display font-bold text-charcoal tracking-tight">{item.value}</p>
                <p className="text-xs text-charcoal/40 italic">{item.sub}</p>
              </div>
            </motion.div>
          ))}
          
          {/* Social Social Links */}
          <div className="flex gap-4 pt-6">
            <a href="#" className="w-14 h-14 rounded-lg glass flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
              <Instagram size={24} />
            </a>
            <a href="#" className="w-14 h-14 rounded-lg glass flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
              <Facebook size={24} />
            </a>
            <a href="#" className="w-14 h-14 rounded-lg glass flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* Inquiry Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 p-12 glass rounded-2xl border-gold/10"
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-3 font-bold">
              <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold ml-2">Your Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-6 py-4 text-charcoal focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div className="space-y-3 font-bold">
              <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold ml-2">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-6 py-4 text-charcoal focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div className="space-y-3 md:col-span-2 font-bold">
              <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold ml-2">Subject</label>
              <select className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-6 py-4 text-charcoal focus:outline-none focus:border-gold/50 transition-colors appearance-none font-bold">
                <option className="bg-white">Table Reservation</option>
                <option className="bg-white">Couple Special</option>
                <option className="bg-white">Solo Special</option>
              </select>
            </div>
            <div className="space-y-3 md:col-span-2 font-bold">
              <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold ml-2">Your Message</label>
              <textarea 
                rows={5}
                placeholder="Tell us about your plans..." 
                className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-6 py-4 text-charcoal focus:outline-none focus:border-gold/50 transition-colors resize-none font-bold"
              />
            </div>
            <div className="md:col-span-2 pt-4 flex flex-col sm:flex-row gap-4">
              <button className="group flex-1 py-5 bg-gold text-charcoal font-black uppercase text-xs tracking-widest rounded-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-gold/20">
                Send Application <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <a 
                href="tel:+254700000000"
                className="group flex-1 py-5 glass text-charcoal font-black uppercase text-xs tracking-widest rounded-lg hover:bg-charcoal/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                Call Directly <Phone size={16} className="text-gold group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-7xl mx-auto px-6 mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-[500px] rounded-2xl overflow-hidden grayscale border border-white/5 group"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.04351336423!2d34.7578278!3d0.282711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178101a07205166b%3A0xe549a997235a901d!2sLurambi%2C%20Kakamega!5e0!3m2!1sen!2ske!4v1715073600000!5m2!1sen!2ske" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
          />
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute top-10 left-10 z-20 glass p-8 rounded-xl space-y-4 max-w-xs"
          >
            <h4 className="font-display font-bold uppercase tracking-[0.3em] text-gold text-xs">Our Location</h4>
            <p className="text-charcoal text-sm leading-relaxed font-light italic">
              Located on the outskirts of Kakamega town, Lurambi Fish Grill offers a serene escape with easy access from the main highway.
            </p>
            <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={14} /> Get Directions
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
