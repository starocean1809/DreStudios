import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Tag, FileText, Image as ImageIcon, Layers, Save, Video, Trash2, Film } from 'lucide-react';
import { Query } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AddProductModal({ isOpen, onClose, onSuccess, editProduct = null }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Art',
    price: '',
    description: '',
    media: []
  });

  useEffect(() => {
    if (editProduct) {
      // Handle legacy string images or new object-based media
      const existingMedia = (editProduct.images || []).map(m => 
        typeof m === 'string' ? { url: m, type: 'image', id: Math.random().toString(36).substr(2, 9) } : { ...m, id: m.id || Math.random().toString(36).substr(2, 9) }
      );

      setFormData({
        title: editProduct.title || '',
        category: editProduct.category || 'Art',
        price: editProduct.price?.toString() || '',
        description: editProduct.description || '',
        media: existingMedia
      });
    } else {
      setFormData({
        title: '',
        category: 'Art',
        price: '',
        description: '',
        media: []
      });
    }
  }, [editProduct, isOpen]);

  const [categories, setCategories] = useState(['Art', 'Education', 'Mechanical', 'Decoration', 'Tools', 'Household']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const trimmedCategory = newCategory.trim();
      if (!categories.includes(trimmedCategory)) {
        setCategories([...categories, trimmedCategory]);
      }
      setFormData({ ...formData, category: trimmedCategory });
      setIsAddingCategory(false);
      setNewCategory('');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for multi-upload
        setError('Each file should be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          media: [...prev.media, { 
            url: reader.result, 
            type: file.type.startsWith('video') ? 'video' : 'image',
            id: Math.random().toString(36).substr(2, 9)
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter(m => m.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.media.length === 0) {
      setError('Please upload at least one image or video');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        images: formData.media, // Backend stores the whole media array
        stock_count: 999 // Default high stock
      };

      if (editProduct) {
        await Query.update(editProduct.id, payload);
      } else {
        await Query.create(payload);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl overflow-y-auto max-h-[95vh] relative no-scrollbar"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {editProduct ? <Save className="text-primary w-5 h-5" /> : <Plus className="text-primary" />}
              </div>
              <h2 className="text-xl font-bold">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            {/* Media Upload Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-wider">Product Media (Images & Videos)</label>
              
              <div className="grid grid-cols-3 gap-3">
                <AnimatePresence>
                  {formData.media.map((m) => (
                    <motion.div 
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="aspect-square rounded-2xl border border-slate-100 bg-slate-50 relative group overflow-hidden shadow-sm"
                    >
                      {m.type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                          <Film className="text-primary/40" />
                        </div>
                      ) : (
                        <img src={m.url} className="w-full h-full object-cover" />
                      )}
                      <button 
                        type="button"
                        onClick={() => removeMedia(m.id)}
                        className="absolute top-1 right-1 p-1.5 rounded-lg bg-white/90 shadow-sm text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[8px] font-black text-white uppercase tracking-tighter">
                        {m.type}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-all relative group">
                  <Plus className="w-5 h-5 text-muted-foreground/40 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest text-center">Add Media</p>
                  <input 
                    type="file" 
                    multiple
                    accept="image/*,video/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Model Title</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Geometric Vase v2"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm appearance-none transition-all"
                    value={isAddingCategory ? 'ADD_NEW' : formData.category}
                    onChange={e => {
                      if (e.target.value === 'ADD_NEW') {
                        setIsAddingCategory(true);
                      } else {
                        setFormData({...formData, category: e.target.value});
                        setIsAddingCategory(false);
                      }
                    }}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="ADD_NEW" className="text-primary font-bold">+ Add New Category</option>
                  </select>
                </div>
                {isAddingCategory && (
                  <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative flex-1">
                      <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="New category..."
                        className="w-full h-10 pl-9 pr-4 rounded-xl bg-primary/5 border border-primary/20 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      type="button"
                      size="sm"
                      onClick={handleAddCategory}
                      className="h-10 px-4 rounded-xl shadow-lg shadow-primary/10"
                    >
                      Add
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingCategory(false)}
                      className="h-10 px-3 rounded-xl hover:bg-black/5"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Price (Rs)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                <input
                  required
                  type="number"
                  step="1"
                  placeholder="500"
                  className="w-full h-11 pl-8 pr-4 rounded-xl bg-slate-50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  rows="3"
                  placeholder="Tell users about this 3D model..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl mt-4 font-bold shadow-xl shadow-primary/20">
              {loading ? (editProduct ? 'Saving...' : 'Adding...') : (editProduct ? 'Save Changes' : 'Publish Product')}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
