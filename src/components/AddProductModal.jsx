import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, DollarSign, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import { Query } from '@/api/entities';
import { Button } from '@/components/ui/button';

export default function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Art',
    price: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await Query.create({
        ...formData,
        price: parseFloat(formData.price),
        images: [formData.imageUrl]
      });
      onSuccess();
      onClose();
      setFormData({ title: '', category: 'Art', price: '', description: '', imageUrl: '' });
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
          className="glass-strong w-full max-w-lg rounded-[2.5rem] p-8 border border-white/60 shadow-2xl overflow-hidden relative"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="text-primary" />
              </div>
              <h2 className="text-xl font-bold">Add New Product</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Model Title</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Geometric Vase v2"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm appearance-none transition-all"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {['Art', 'Education', 'Mechanical', 'Decoration', 'Tools', 'Household'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Price (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="29.99"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all"
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl mt-4 font-bold shadow-xl shadow-primary/20">
              {loading ? 'Adding...' : 'Publish Product'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
