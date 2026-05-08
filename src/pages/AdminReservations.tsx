import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ChevronLeft, 
  Search,
  User,
  Clock,
  Mail,
  Filter,
  Users
} from 'lucide-react';
import SEO from '../components/SEO';
import { useToast } from '../lib/ToastContext';
import { Reservation } from '../types';

export default function AdminReservations() {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      setReservations(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reservations');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this reservation permanently?')) {
      try {
        await deleteDoc(doc(db, 'reservations', id));
        showToast('Reservation deleted successfully.', 'info');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'reservations');
        showToast('Failed to delete reservation.', 'error');
      }
    }
  };

  const handleStatusChange = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'reservations', id), { status });
      showToast(`Reservation ${status} successfully!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'reservations');
      showToast(`Failed to update reservation status.`, 'error');
    }
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-12">
      <SEO title="Reservations Management | Lurambi Admin" description="Manage guest table bookings and events" />

      <header className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-charcoal/5 hover:border-gold/30 transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft size={24} className="text-charcoal" />
          </button>
          <div>
            <h1 className="text-4xl font-display font-black tracking-tighter text-charcoal uppercase leading-none">RESERVATIONS</h1>
            <p className="text-charcoal/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Manage guest table bookings and events</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
            <input 
              type="text"
              placeholder="Search by name, email or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all text-xs font-bold uppercase tracking-widest placeholder:text-charcoal/20"
            />
          </div>
          <div className="flex gap-2">
             <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="appearance-none pl-10 pr-10 py-4 bg-white border border-charcoal/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={14} />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Loading bookings...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 glass rounded-[3rem] border-dashed border-charcoal/10"
          >
            <Calendar className="mx-auto text-charcoal/10 w-24 h-24 mb-6" />
            <p className="text-charcoal/40 font-black uppercase tracking-[0.2em] text-sm">No reservations found</p>
            <p className="text-charcoal/20 text-xs mt-2 uppercase tracking-widest">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReservations.map((res) => (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-charcoal/5 shadow-sm hover:shadow-xl transition-all flex flex-col lg:row gap-10 items-start lg:items-center group"
                >
                  <div className="flex gap-6 items-start shrink-0">
                    <div className="w-16 h-16 rounded-3xl bg-charcoal/5 border-2 border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
                      <User size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-black text-2xl text-charcoal uppercase tracking-tight leading-none">{res.name}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                        <Mail size={12} className="text-gold" />
                        {res.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                        <Clock size={12} className="text-gold" />
                        {res.createdAt?.toDate ? res.createdAt.toDate().toLocaleString() : 'Just now'}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-1.5 bg-charcoal/5 text-charcoal/60 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-charcoal/5">
                        {res.type}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                        res.status === 'confirmed' ? 'bg-green-50 text-green-500 border-green-100' :
                        res.status === 'cancelled' ? 'bg-red-50 text-red-500 border-red-100' :
                        'bg-blue-50 text-blue-500 border-blue-100'
                      }`}>
                        {res.status || 'Pending Approval'}
                      </span>
                    </div>
                    {res.message && (
                      <div className="bg-charcoal/[0.02] p-6 rounded-2xl border border-charcoal/5">
                         <p className="text-charcoal/60 text-xs italic leading-relaxed">
                          “{res.message}”
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-6 lg:pt-0 border-charcoal/5">
                    <button 
                      onClick={() => handleStatusChange(res.id, 'confirmed')}
                      disabled={res.status === 'confirmed'}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                        res.status === 'confirmed' 
                        ? 'bg-green-500 text-white cursor-not-allowed' 
                        : 'bg-white text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white'
                      }`}
                      title="Confirm Reservation"
                    >
                      <CheckCircle size={22} />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(res.id, 'cancelled')}
                      disabled={res.status === 'cancelled'}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                        res.status === 'cancelled' 
                        ? 'bg-red-500 text-white cursor-not-allowed' 
                        : 'bg-white text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
                      }`}
                      title="Cancel Reservation"
                    >
                      <XCircle size={22} />
                    </button>
                    <div className="w-px h-10 bg-charcoal/5 mx-2 hidden lg:block" />
                    <button 
                      onClick={() => handleDelete(res.id)}
                      className="w-12 h-12 rounded-2xl bg-charcoal/5 text-charcoal/30 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-lg cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
