import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Fish, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl overflow-hidden flex items-center justify-center border border-gold/30 shadow-sm p-1">
              <img src={logo} alt="Lurambi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-lg font-bold tracking-tighter uppercase text-charcoal">
              Lurambi <span className="text-gold">Fish Grill</span>
            </span>
          </Link>
          <p className="text-charcoal/50 text-sm leading-relaxed">
            Kakamega's premier destination for authentic, premium grilled fish. 
            Experience the finest Lake Victoria tilapia in an atmosphere of luxury.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-lg border border-charcoal/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg border border-charcoal/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg border border-charcoal/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h4 className="font-display text-charcoal uppercase text-sm font-bold mb-6 tracking-widest">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-charcoal/50 hover:text-gold transition-colors text-sm font-medium">Home</Link></li>
            <li><Link to="/menu" className="text-charcoal/50 hover:text-gold transition-colors text-sm font-medium">Our Menu</Link></li>
            <li><Link to="/about" className="text-charcoal/50 hover:text-gold transition-colors text-sm font-medium">Our Story</Link></li>
            <li><Link to="/reviews" className="text-charcoal/50 hover:text-gold transition-colors text-sm font-medium">Guest Reviews</Link></li>
            <li><Link to="/contact" className="text-charcoal/50 hover:text-gold transition-colors text-sm font-medium">Contact Us</Link></li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
           <h4 className="font-display text-charcoal uppercase text-sm font-bold mb-6 tracking-widest">Our Services</h4>
           <ul className="space-y-4">
            <li className="text-charcoal/50 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              Dine-In Luxury
            </li>
            <li className="text-charcoal/50 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              Quick Take-Out
            </li>
            <li className="text-charcoal/50 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              Reliable Delivery
            </li>
            <li className="text-charcoal/50 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              Private Events
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="font-display text-charcoal uppercase text-sm font-bold mb-6 tracking-widest">Opening Hours</h4>
          <ul className="space-y-4">
            <li className="flex justify-between text-sm">
              <span className="text-charcoal/50">Mon - Fri</span>
              <span className="text-charcoal font-medium">10:00 - 22:00</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-charcoal/50">Saturday</span>
              <span className="text-charcoal font-medium">09:00 - 23:00</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-charcoal/50">Sunday</span>
              <span className="text-charcoal font-medium">11:00 - 21:00</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
           <h4 className="font-display text-charcoal uppercase text-sm font-bold mb-6 tracking-widest">Contact Info</h4>
           <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <MapPin className="text-gold shrink-0" size={18} />
              <span className="text-charcoal/50">Lurambi, Along Webuye Rd, Kakamega, Kenya</span>
            </li>
            <li className="flex gap-3 text-sm group">
              <Phone className="text-gold shrink-0 group-hover:scale-110 transition-transform" size={18} />
              <a href="tel:+254794532900" className="text-charcoal/50 hover:text-charcoal transition-colors tracking-wide font-medium">+254 794 532 900</a>
            </li>
            <li className="flex gap-3 text-sm">
              <Mail className="text-gold shrink-0" size={18} />
              <span className="text-charcoal/50 font-medium">hello@lurambifishgrill.com</span>
            </li>
          </ul>
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-charcoal/5 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-charcoal/30 text-xs uppercase tracking-tighter">
          © 2025 Lurambi Fish Grill. All Rights Reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-charcoal/30 text-[10px] uppercase hover:text-charcoal">Privacy Policy</a>
          <a href="#" className="text-charcoal/30 text-[10px] uppercase hover:text-charcoal">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
