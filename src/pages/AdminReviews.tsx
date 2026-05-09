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
  MessageSquare, 
  Star, 
  Trash2, 
  ChevronLeft, 
  Search,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import SEO from '../components/SEO';
import { useToast } from '../lib/ToastContext';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
  status?: 'pending' | 'approved' | 'rejected';
}

export default function AdminReviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reviews');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this review permanently?')) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        showToast('Review deleted permanently.', 'info');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'reviews');
        showToast('Failed to delete review.', 'error');
      }
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'reviews', id), { 
        status,
        approved: status === 'approved' 
      });
      showToast(`Review ${status} successfully!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'reviews');
      showToast(`Failed to update review status.`, 'error');
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-12">
      <SEO title="Review Moderation | Lurambi Admin" description="Manage guest feedback and testimonials" />

      <header className="max-w-7xl mx-auto flex flex-col md:row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-charcoal/5 hover:border-gold/30 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} className="text-charcoal" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black tracking-tighter text-charcoal">Review Moderation</h1>
            <p className="text-charcoal/40 text-[10px] font-bold tracking-widest">Manage guest stories and feedback</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
          <input 
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-xs font-bold tracking-widest"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border-dashed border-charcoal/10">
            <MessageSquare className="mx-auto text-charcoal/10 w-16 h-16 mb-4" />
            <p className="text-charcoal/40 font-bold tracking-widest text-xs">No reviews found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 rounded-3xl border border-charcoal/5 shadow-sm hover:shadow-md transition-all flex flex-col md:row gap-8 items-start"
                >
                  <div className="flex gap-4 items-start shrink-0">
                    <div className="w-14 h-14 rounded-full bg-charcoal/5 border-2 border-gold/20 flex items-center justify-center">
                      <User className="text-gold" size={24} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-charcoal tracking-tight">{review.userName}</h3>
                      <div className="flex gap-1 text-gold mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-charcoal/10"} />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-charcoal/30 font-bold tracking-widest">
                        <Clock size={10} />
                        {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <p className="text-charcoal/70 text-sm italic leading-relaxed">
                      “{review.comment}”
                    </p>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-widest ${
                        review.status === 'approved' ? 'bg-green-50 text-green-500' :
                        review.status === 'rejected' ? 'bg-red-50 text-red-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        {review.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0 self-end md:self-center">
                    <button 
                      onClick={() => handleStatusChange(review.id, 'approved')}
                      className="w-10 h-10 rounded-xl bg-green-50 text-green-500 hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center"
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(review.id, 'rejected')}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                    <div className="w-px h-8 bg-charcoal/5 mx-1" />
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="w-10 h-10 rounded-xl bg-charcoal/5 text-charcoal/40 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
