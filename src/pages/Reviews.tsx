import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, User, Calendar, Quote, CheckCircle2, MessageSquare } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useToast } from '../lib/ToastContext';
import SEO from '../components/SEO';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'), 
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reviews');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment || rating < 1) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'reviews'), {
        userName: name,
        rating,
        comment,
        createdAt: serverTimestamp(),
        status: 'pending',
        approved: false
      });
      
      setSubmitted(true);
      showToast('Review submitted for moderation!', 'success');
      setName('');
      setRating(5);
      setComment('');
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      showToast('Failed to submit review. Please try again.', 'error');
      setError('Could not submit your review. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <SEO 
        title="Guest Reviews | Lurambi Fish Grill Experience"
        description="Read what our guests have to say about the finest tilapia in Kakamega. Share your own dining experience and help us maintain our premium standards."
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Form Column */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4">
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">Share Your Experience</span>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.8]">Leave a <br /><span className="text-gold">Review</span></h1>
              <p className="text-charcoal/50 font-light text-lg">Your feedback helps us maintain the gold standard of Kenyan seafood excellence.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 glass p-8 rounded-2xl border-charcoal/5 relative overflow-hidden">
              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 space-y-4"
                  >
                    <CheckCircle2 className="text-green-500 w-16 h-16" />
                    <h3 className="text-2xl font-display font-bold text-charcoal">Thank You!</h3>
                    <p className="text-charcoal/50 text-sm">Your review has been published successfully.</p>
                    <button 
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-gold text-[10px] font-bold uppercase tracking-widest pt-4"
                    >
                      Write Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40 ml-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-6 py-4 focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none transition-all placeholder:text-charcoal/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40 ml-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star 
                          className={star <= rating ? "text-gold fill-gold" : "text-charcoal/10"} 
                          size={24}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40 ml-1">Your Review</label>
                  <textarea 
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the fish, the service, and the atmosphere..."
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-6 py-4 focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none transition-all placeholder:text-charcoal/20 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-charcoal text-white font-black uppercase text-xs tracking-[0.3em] rounded-xl flex items-center justify-center gap-3 hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>Submit Review <Send size={14} /></>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* List Column */}
          <div className="lg:col-span-7 space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="text-gold" size={24} />
                </div>
                <h3 className="text-2xl font-display font-black tracking-tighter uppercase">{reviews.length} Guest Reviews</h3>
              </div>
            </div>

            <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4 scrollbar-hide">
              {reviews.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-charcoal/5 rounded-2xl">
                  <Quote className="mx-auto text-charcoal/10 mb-4" size={40} />
                  <p className="text-charcoal/40 font-light italic">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-8 glass rounded-2xl border-charcoal/5 space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-charcoal/5 rounded-full flex items-center justify-center border border-charcoal/10">
                          <User size={18} className="text-charcoal" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-charcoal uppercase text-sm tracking-widest">{review.userName}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star 
                                key={idx} 
                                size={10} 
                                className={idx < review.rating ? "text-gold fill-gold" : "text-charcoal/10"} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-charcoal/30 uppercase tracking-widest">
                        <Calendar size={12} />
                        {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </div>
                    </div>
                    
                    <p className="text-charcoal/60 font-light leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
