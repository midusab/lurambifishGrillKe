import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion } from 'motion/react';
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
  Database
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

  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const menuSnap = await getDocs(collection(db, 'menu'));
        const reviewSnap = await getDocs(collection(db, 'reviews'));
        
        const reviews = reviewSnap.docs.map(doc => doc.data());
        const totalRating = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        const avg = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        setStatsData({
          menuCount: menuSnap.size,
          reviewCount: reviewSnap.size,
          avgRating: Number(avg)
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
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
    { label: 'Menu Items', value: statsData.menuCount, icon: UtensilsCrossed, color: 'text-gold' },
    { label: 'Avg Rating', value: statsData.avgRating, icon: Star, color: 'text-orange-500' },
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
      
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-72 bg-charcoal text-white p-8 flex flex-col justify-between">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <Star className="text-charcoal w-6 h-6 fill-charcoal" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl tracking-tighter uppercase leading-none">LURAMBI</h1>
              <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Admin Suite</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-4 px-4 py-4 bg-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all">
              <LayoutDashboard size={18} className="text-gold" />
              Overview
            </button>
            <button 
              onClick={() => navigate('/admin/menu')}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 rounded-xl text-white/50 hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
            >
              <UtensilsCrossed size={18} />
              Menu
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 rounded-xl text-white/50 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
              <MessageSquare size={18} />
              Reviews
            </button>
          </nav>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Logged in as</p>
            <p className="text-xs font-medium truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-red-500/20"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h2 className="text-4xl font-display font-black tracking-tighter text-charcoal uppercase">DASHBOARD OVERVIEW</h2>
            <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest">Welcome back to the command center.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-charcoal/90 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Menu Data'}
            </button>
            <a 
              href="/" 
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 glass hover:bg-charcoal/5 rounded-xl text-charcoal text-[10px] font-bold uppercase tracking-widest transition-all border border-charcoal/10"
            >
              View Live Site <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-charcoal/5 shadow-sm space-y-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-charcoal/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] text-charcoal/30 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-display font-black text-charcoal tracking-tight">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions & Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-black text-charcoal uppercase tracking-tight">Quick Management</h3>
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-charcoal/40 uppercase tracking-widest">Live System Status</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => action.link !== '#' && navigate(action.link)}
                  className="group bg-white p-6 rounded-2xl border border-charcoal/5 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-5"
                >
                  <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                    <action.icon size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-charcoal uppercase tracking-wide group-hover:text-gold transition-colors">{action.title}</h4>
                    <p className="text-xs text-charcoal/40 font-medium leading-relaxed">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Performance Monitoring */}
            <div className="bg-white p-8 rounded-2xl border border-charcoal/5 shadow-sm space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-1">Traffic Pulse</h4>
                  <p className="text-[10px] text-charcoal/30 font-medium uppercase tracking-[0.2em]">Real-time engagement metrics</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-display font-black text-gold">98.2%</span>
                  <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Uptime Optimization</p>
                </div>
              </div>
              <div className="flex items-end gap-1 h-24">
                {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85, 60, 100, 70, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className="flex-1 bg-gold/10 hover:bg-gold rounded-t-sm transition-colors cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-display font-black text-charcoal uppercase tracking-tight">Recent Activity</h3>
            <div className="bg-white rounded-2xl border border-charcoal/5 shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                {[
                  { user: 'System', action: 'Database synched with cloud', time: 'Just now', icon: Database },
                  { user: 'Admin', action: 'Authorized login successful', time: '12 mins ago', icon: Users },
                  { user: 'Analytics', action: 'Menu reach increased by 12%', time: '2 hours ago', icon: TrendingUp },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start pb-6 border-b border-charcoal/5 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center shrink-0">
                      <item.icon size={14} className="text-charcoal/40" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal">{item.user} <span className="font-medium text-charcoal/40">{item.action}</span></p>
                      <p className="text-[10px] text-charcoal/30 uppercase font-bold mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/admin/reviews')}
                className="w-full py-4 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                View Feedback Logs <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
