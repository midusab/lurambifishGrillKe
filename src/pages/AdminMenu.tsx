import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  ChevronLeft, 
  Filter,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Upload,
  Loader2
} from 'lucide-react';
import { useToast } from '../lib/ToastContext';
import SEO from '../components/SEO';

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast('File size must be less than 2MB', 'error');
      return;
    }


    setIsUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast(err.message || 'Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Dish',
    image: '',
    isSpicy: false,
    isChefSpecial: false,
    rating: 5.0
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'menu'), orderBy('category'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      setItems(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'menu');
      setLoading(false);
      showToast('Failed to load menu data', 'error');
    });
    return () => unsubscribe();
  }, [showToast]);

  const handleOpenModal = (item: MenuItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Main Dish',
        image: '',
        isSpicy: false,
        isChefSpecial: false,
        rating: 5.0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Create a copy of data without the 'id' field for Firestore
      const { id, ...dataToSave } = formData as any;
      dataToSave.updatedAt = serverTimestamp();
      
      if (editingItem) {
        const docRef = doc(db, 'menu', editingItem.id);
        await updateDoc(docRef, dataToSave);
      } else {
        await addDoc(collection(db, 'menu'), dataToSave);
      }
      
      setIsModalOpen(false);
      showToast(editingItem ? 'Dish updated successfully!' : 'Dish added successfully!', 'success');
    } catch (err: any) {
      console.error('Save error:', err);
      let errorMessage = 'Failed to save dish';
      
      try {
        // Try to parse the JSON error from handleFirestoreError
        const parsed = JSON.parse(err.message);
        errorMessage = parsed.error || errorMessage;
        if (errorMessage.includes('permission-denied')) {
          errorMessage = 'Permission Denied: Please check Firestore Rules.';
        }
      } catch {
        errorMessage = err.message || errorMessage;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'menu', id));
        showToast('Item deleted successfully', 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to delete item', 'error');
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-12">
      <SEO title="Menu Management | Lurambi Admin" description="Manage Lurambi Fish Grill menu items" />

      <header className="max-w-7xl mx-auto flex flex-col md:row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-charcoal/5 hover:border-gold/30 transition-colors shadow-sm cursor-pointer"
          >
            <ChevronLeft size={20} className="text-charcoal" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black tracking-tighter text-charcoal leading-none">Menu Management</h1>
            <p className="text-charcoal/40 text-[10px] font-bold tracking-widest">Update your offerings in real-time</p>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
            <input 
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-xs font-bold tracking-widest"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gold text-charcoal font-black text-xs tracking-widest rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-gold/10"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl border border-charcoal/5 shadow-sm overflow-hidden group"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-charcoal/90 text-white text-[8px] font-bold tracking-widest">
                        {item.category}
                      </span>
                      {item.isChefSpecial && (
                        <span className="px-3 py-1 bg-gold text-charcoal text-[8px] font-bold tracking-widest">
                          Chef's Special
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display font-bold text-xl text-charcoal tracking-tight">{item.name}</h3>
                        <p className="text-charcoal/40 text-[10px] font-bold uppercase tracking-widest">KES {item.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="w-8 h-8 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal hover:bg-gold/20 hover:text-gold transition-colors cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal/60 line-clamp-2 italic leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-charcoal/5 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-black text-charcoal tracking-tight">
                    {editingItem ? 'Edit Dish' : 'Add New Dish'}
                  </h2>
                  <p className="text-[10px] text-charcoal/40 font-bold tracking-widest text-charcoal/40 ml-1">Enter dish details below</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal/40 hover:bg-charcoal/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-charcoal/40 ml-1">Dish Name</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-charcoal/5 border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm font-medium"
                      placeholder="e.g. Signature Pilau"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-charcoal/40 ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="w-full px-4 py-3 bg-charcoal/5 border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm font-medium"
                    >
                      <option value="Main Dish">Main Dish</option>
                      <option value="Drink">Drink</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Snacks">Snacks</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-charcoal/40 ml-1">Price (KES)</label>
                    <input 
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-charcoal/5 border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm font-medium"
                      placeholder="250"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40 ml-1 flex justify-between">
                      Dish Image
                      <span className="text-[8px] text-charcoal/20">Max 2MB</span>
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image Preview */}
                      <div className="w-24 h-24 rounded-3xl bg-charcoal/5 border border-charcoal/5 flex items-center justify-center overflow-hidden shrink-0">
                        {formData.image ? (
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-charcoal/10" size={32} />
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                          <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-charcoal/10 hover:border-gold/40 hover:bg-gold/5 transition-all cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                            {isUploading ? (
                              <Loader2 className="animate-spin text-gold" size={18} />
                            ) : (
                              <Upload className="text-charcoal/20 group-hover:text-gold transition-colors" size={18} />
                            )}
                            <span className="text-xs font-bold text-charcoal/60 uppercase tracking-widest">
                              {isUploading ? 'Uploading...' : 'Upload Image'}
                            </span>
                          </label>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-widest">URL</span>
                          </div>
                          <input 
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-charcoal/5 border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 text-xs font-medium"
                            placeholder="Or paste an image URL..."
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-charcoal/40 ml-1">Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-charcoal/5 border border-charcoal/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm font-medium italic"
                    placeholder="Describe the dish with elegance..."
                  />
                </div>

                <div className="flex gap-8 py-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isChefSpecial}
                      onChange={(e) => setFormData({...formData, isChefSpecial: e.target.checked})}
                      className="hidden"
                    />
                    <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${formData.isChefSpecial ? 'bg-gold border-gold' : 'border-charcoal/10 group-hover:border-gold/40'}`}>
                      {formData.isChefSpecial && <Check size={14} className="text-charcoal" />}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-charcoal/60">Chef's Special</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isSpicy}
                      onChange={(e) => setFormData({...formData, isSpicy: e.target.checked})}
                      className="hidden"
                    />
                    <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${formData.isSpicy ? 'bg-red-500 border-red-500' : 'border-charcoal/10 group-hover:border-red-400'}`}>
                      {formData.isSpicy && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-charcoal/60">Spicy</span>
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-charcoal/5 bg-white sticky bottom-0 z-10 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 md:px-8 py-3 md:py-4 bg-charcoal/5 text-charcoal font-black text-[10px] md:text-xs tracking-widest rounded-xl hover:bg-charcoal/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-8 md:px-10 py-3 md:py-4 bg-gold text-charcoal font-black text-[10px] md:text-xs tracking-widest rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-gold/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={18} /> {isSaving ? 'Saving...' : 'Save Dish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
