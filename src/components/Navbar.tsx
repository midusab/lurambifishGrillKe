import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../lib/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Fish } from 'lucide-react';
import { cn } from '../lib/utils';
import logo from '../assets/logo.png';
import { WHATSAPP_LINK } from '../constants';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'About', href: '/about' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg border-charcoal/10 py-3 shadow-md' 
          : 'bg-transparent border-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 border border-gold/20 shadow-lg p-1.5">
            <img src={logo} alt="Lurambi Logo" className="w-full h-full object-contain" />
          </div>
          <span className={cn(
            "font-display text-lg md:text-xl font-bold tracking-tighter hidden sm:block",
            isScrolled ? "text-charcoal" : "text-white"
          )}>
            Lurambi <span className="text-gold">Fish Grill</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'text-sm font-medium tracking-widest transition-colors hover:text-gold relative',
                location.pathname === link.href 
                  ? 'text-gold' 
                  : (isScrolled ? 'text-charcoal/70' : 'text-white/80')
              )}
            >
              {link.name}
              {location.pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                />
              )}
            </Link>
          ))}
          <button
            onClick={() => window.open(WHATSAPP_LINK, '_blank')}
            className="px-6 py-2 bg-gold text-charcoal font-bold text-xs tracking-widest rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            Order Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden p-2 rounded-lg transition-colors",
            isScrolled ? "text-charcoal hover:bg-charcoal/5" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-charcoal/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'text-xl font-display font-medium',
                    location.pathname === link.href ? 'text-gold' : 'text-charcoal'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => window.open(WHATSAPP_LINK, '_blank')}
                className="w-full py-4 bg-gold text-charcoal font-bold text-center tracking-widest rounded-lg cursor-pointer"
              >
                Order Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
