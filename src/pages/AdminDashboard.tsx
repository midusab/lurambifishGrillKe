import React, { useState, useEffect } from 'react'; // Refined Admin Dashboard
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  MessageSquare, 
  LogOut, 
  TrendingUp, 
  Users, 
  Star,
  ExternalLink,
  Settings,
  ChevronRight,
  RefreshCw,
  Database,
  Calendar
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../lib/ToastContext';
import SEO from '../components/SEO';
import { migrateMenu } from '../lib/migrateMenu';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [statsData, setStatsData] = useState({
    menuCount: 0,
    reviewCount: 0,
    avgRating: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    // 1. Real-time Stats & Initial Data
    const fetchStats = async () => {
      try {
        const menuSnap = await getDocs(collection(db, 'menu'));
        const reviewSnap = await getDocs(collection(db, 'reviews'));
        const reviewsData = reviewSnap.docs.map(doc => doc.data());
        const totalRating = reviewsData.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        const avg = reviewsData.length > 0 ? (totalRating / reviewsData.length).toFixed(1) : 0;

        setStatsData({
          menuCount: menuSnap.size,
          reviewCount: reviewSnap.size,
          avgRating: Number(avg)
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };
    fetchStats();

    // 2. Real-time Activity Stream
    const qMenu = query(collection(db, 'menu'), orderBy('updatedAt', 'desc'), limit(5));
    const qReviews = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'), limit(5));

    const unsubMenu = onSnapshot(qMenu, (snapshot) => {
      const menuActs = snapshot.docs.map(doc => ({
        id: doc.id,
        user: 'Staff',
        action: `Updated ${doc.data().name}`,
        time: doc.data().updatedAt?.toDate() || new Date(),
        icon: UtensilsCrossed,
        type: 'menu'
      }));
      updateActivities(menuActs, 'menu');
    });

    const unsubReviews = onSnapshot(query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(10)), (snapshot) => {
      const reviewActs = snapshot.docs.map(doc => ({
        id: doc.id,
        user: doc.data().userName || 'Guest',
        action: `Left a ${doc.data().rating}★ review`,
        time: doc.data().createdAt?.toDate() || new Date(),
        icon: MessageSquare,
        type: 'review',
        status: doc.data().status
      }));
      setReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      updateActivities(reviewActs, 'review');
    });

    const unsubRes = onSnapshot(query(collection(db, 'reservations'), orderBy('createdAt', 'desc'), limit(5)), (snapshot) => {
      const resActs = snapshot.docs.map(doc => ({
        id: doc.id,
        user: doc.data().name,
        action: `Reserved: ${doc.data().type}`,
        time: doc.data().createdAt?.toDate() || new Date(),
        icon: Calendar,
        type: 'reservation'
      }));
      updateActivities(resActs, 'reservation');
    });

    const updateActivities = (newActs: any[], type: string) => {
      setActivities(prev => {
        const otherTypes = prev.filter(a => a.type !== type);
        const combined = [...otherTypes, ...newActs].sort((a, b) => b.time - a.time).slice(0, 10);
        return combined;
      });
    };

    return () => {
      unsubMenu();
      unsubReviews();
      unsubRes();
    };
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await migrateMenu();
      showToast('Menu data synchronized successfully!', 'success');
      // Refresh counts
      const menuSnap = await getDocs(collection(db, 'menu'));
      setStatsData(prev => ({ ...prev, menuCount: menuSnap.size }));
    } catch (err) {
      showToast('Synchronization failed. Check console.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };



  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const stats = [
    { label: 'Revenue (Est.)', value: `KES ${statsData.menuCount * 450}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Guests', value: statsData.reviewCount * 12, icon: Users, color: 'text-blue-500' },
    { label: 'Pending Reviews', value: reviews.filter(r => r.status === 'pending' || !r.status).length, icon: MessageSquare, color: 'text-orange-500' },
    { label: 'Pending Bookings', value: activities.filter(a => a.type === 'reservation' && (!a.status || a.status === 'pending')).length, icon: Calendar, color: 'text-gold' },
  ];

  const quickActions = [
    { 
      title: 'Menu Management', 
      desc: 'Update dishes, prices, and availability', 
      icon: UtensilsCrossed, 
      link: '/admin/menu',
      color: 'bg-gold/10 text-gold'
    },
    { 
      title: 'Review Moderation', 
      desc: 'Manage guest feedback and testimonials', 
      icon: MessageSquare, 
      link: '/admin/reviews', 
      color: 'bg-blue-50 text-blue-500'
    },
    { 
      title: 'System Settings', 
      desc: 'Configure site metadata and notifications', 
      icon: Settings, 
      link: '#',
      color: 'bg-charcoal/5 text-charcoal'
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row">
      <SEO title="Dashboard | Lurambi Admin" description="Lurambi Fish Grill Administrative Dashboard" />
      
      {/* Navigation (Sticky on Mobile, Fixed Sidebar on Desktop) */}
      <aside className="w-full md:w-72 md:h-screen bg-charcoal text-white p-6 md:p-8 flex flex-row md:flex-col justify-between items-center md:items-stretch sticky top-0 z-[100] md:fixed left-0 shadow-2xl md:shadow-none">
        <div className="flex flex-row md:flex-col items-center md:items-stretch gap-6 md:gap-12 w-full">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gold rounded-2xl flex items-center justify-center">
              <Star className="text-charcoal w-5 h-5 md:w-6 md:h-6 fill-charcoal" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-black text-lg md:text-xl tracking-tighter uppercase leading-none">LURAMBI</h1>
              <p className="text-[8px] md:text-[10px] text-gold font-bold uppercase tracking-widest">Admin Suite</p>
            </div>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 flex-1 md:flex-none justify-end md:justify-start overflow-x-auto no-scrollbar">
            <button className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-4 bg-white/10 rounded-2xl text-white font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap">
              <LayoutDashboard size={16} className="text-gold" />
              <span className="hidden md:inline">Overview</span>
            </button>
            <button 
              onClick={() => navigate('/admin/menu')}
              className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-4 hover:bg-white/5 rounded-2xl text-white/50 hover:text-white font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap"
            >
              <UtensilsCrossed size={16} />
              <span className="hidden md:inline">Menu</span>
            </button>
            <button 
              onClick={() => navigate('/admin/reviews')}
              className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-4 hover:bg-white/5 rounded-2xl text-white/50 hover:text-white font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageSquare size={16} />
              <span className="hidden md:inline">Reviews</span>
            </button>
            <button 
              onClick={() => navigate('/admin/reservations')}
              className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-4 hover:bg-white/5 rounded-2xl text-white/50 hover:text-white font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar size={16} />
              <span className="hidden md:inline">Bookings</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:flex flex-col gap-6 w-full">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Logged in as</p>
            <p className="text-xs font-medium truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-red-500/20 cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile Logout (Icon only) */}
        <button 
          onClick={handleLogout}
          className="md:hidden w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl cursor-pointer shrink-0 ml-2"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* Main Content Spacer for Fixed Sidebar on Desktop */}
      <div className="hidden md:block w-72 shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto min-h-[calc(100vh-80px)] md:min-h-screen">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-charcoal/40 font-black uppercase tracking-[0.2em]">System Online • Live</p>
            </div>
            <h2 className="text-5xl font-display font-black tracking-tighter text-charcoal uppercase leading-none">ADMIN DASHBOARD</h2>
            <p className="text-charcoal/40 text-sm font-bold uppercase tracking-widest">Manage your restaurant and menu</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/admin/menu')}
              className="flex items-center gap-3 px-8 py-4 bg-gold text-charcoal rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-gold/20 cursor-pointer"
            >
              <UtensilsCrossed size={18} />
              Quick Add Dish
            </button>
            <a 
              href="/" 
              target="_blank"
              className="flex items-center gap-3 px-8 py-4 bg-white text-charcoal border border-charcoal/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-charcoal/5 cursor-pointer"
            >
              View Site <ExternalLink size={18} />
            </a>
          </div>
        </header>

        {/* Primary Management Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <button
            onClick={() => navigate('/admin/menu')}
            className="group relative bg-charcoal p-10 rounded-3xl text-left overflow-hidden transition-all hover:scale-[1.02] shadow-2xl cursor-pointer"
          >
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-charcoal shadow-lg">
                <UtensilsCrossed size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-2">Manage Menu</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[280px]">Add new dishes, update prices, and change daily specials.</p>
              </div>
              <div className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                Open Menu Manager <ChevronRight size={14} />
              </div>
            </div>
            {/* Abstract Background Element */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors" />
          </button>

          <button
            onClick={() => navigate('/admin/reviews')}
            className="group relative bg-white p-10 rounded-3xl border border-charcoal/5 text-left overflow-hidden transition-all hover:scale-[1.02] shadow-xl cursor-pointer"
          >
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <MessageSquare size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-display font-black text-charcoal uppercase tracking-tight mb-2">Customer Reviews</h3>
                <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-[280px]">See what guests are saying and manage your testimonials.</p>
              </div>
              <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
                View All Reviews <ChevronRight size={14} />
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
          </button>

          <button
            onClick={() => navigate('/admin/reservations')}
            className="group relative bg-charcoal p-10 rounded-3xl text-left overflow-hidden transition-all hover:scale-[1.02] shadow-2xl cursor-pointer md:col-span-2"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-charcoal shadow-lg">
                  <Calendar size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-2">Reservation Hub</h3>
                  <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[400px]">Manage all incoming table bookings, private events, and guest requests in real-time.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Live Status</p>
                  <p className="text-xl font-display font-black text-gold">ACTIVE SYSTEM</p>
                </div>
                <div className="px-8 py-4 bg-white/10 rounded-2xl text-gold text-[10px] font-black uppercase tracking-widest group-hover:bg-gold group-hover:text-charcoal transition-all">
                  Open Hub
                </div>
              </div>
            </div>
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-gold/5 rounded-full blur-[100px] group-hover:bg-gold/10 transition-colors" />
          </button>
        </div>

        {/* Unified Stats & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black text-charcoal/30 uppercase tracking-[0.3em]">Restaurant Stats</h3>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="text-[10px] font-black text-gold uppercase tracking-widest flex items-center gap-2 hover:text-charcoal transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                Refresh Data
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center mb-4 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-[9px] text-charcoal/30 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                  <h4 className="text-xl font-display font-black text-charcoal">{stat.value}</h4>
                </div>
              ))}
            </div>

            {/* Compact Traffic Pulse */}
            <div className="bg-white p-8 rounded-3xl border border-charcoal/5 shadow-sm flex items-center gap-12">
              <div className="shrink-0">
                <p className="text-[10px] text-charcoal/30 font-black uppercase tracking-[0.2em] mb-2">Popularity</p>
                <div className="text-3xl font-display font-black text-charcoal">98.2%</div>
                <div className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Active Status</div>
              </div>
              <div className="flex-1 flex items-end gap-1 h-12">
                {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85, 60, 100, 70, 80, 50, 90].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-gold/10 hover:bg-gold rounded-full transition-colors cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black text-charcoal/30 uppercase tracking-[0.3em] px-2">Recent Updates</h3>
            <div className="bg-white rounded-3xl border border-charcoal/5 shadow-sm overflow-hidden">
              <div className="p-8 space-y-8">
                <AnimatePresence mode="popLayout">
                  {activities.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 items-start"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'review' ? 'bg-blue-50 text-blue-500' : 'bg-gold/10 text-gold'}`}>
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal leading-tight">
                          {item.user} <span className="font-medium text-charcoal/40">{item.action}</span>
                        </p>
                        <p className="text-[9px] text-charcoal/30 uppercase font-black mt-1.5">
                          {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                            Math.ceil((item.time.getTime() - Date.now()) / 60000), 
                            'minute'
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {activities.length === 0 && (
                  <p className="text-center text-[10px] text-charcoal/30 font-bold uppercase tracking-widest py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
