import React, { useState, useEffect } from 'react';
import { Plus, Package, Trash2, Archive, Layers, Pencil, Film, Filter, ChevronDown } from 'lucide-react';
import { Query } from '@/api/entities';
import { Button } from '@/components/ui/button';
import AddProductModal from '@/components/AddProductModal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function AdminProductCard({ product, onEdit, onDelete }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const getMediaUrl = (item) => {
    if (!item) return 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80';
    return typeof item === 'object' ? item.url : item;
  };

  const activeMedia = product.images?.[activeIdx];
  const isVideo = typeof activeMedia === 'object' && activeMedia.type === 'video';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass rounded-[32px] overflow-hidden group border border-white/60 hover:shadow-2xl transition-all flex flex-col h-full"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 flex-shrink-0">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-200">
            <Film size={40} className="text-primary/20" />
            <p className="absolute bottom-12 text-[10px] font-black text-primary/40 uppercase text-center w-full px-4">Video Content</p>
          </div>
        ) : (
          <img 
            src={getMediaUrl(activeMedia)} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80'; }}
          />
        )}
        
        {/* Multi-media preview strip - Always visible */}
        {product.images?.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 z-10">
            {product.images.slice(0, 4).map((img, idx) => (
              <button 
                key={idx} 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                className={cn(
                  "w-10 h-10 rounded-xl border-2 overflow-hidden shadow-lg bg-white flex-shrink-0 transition-all hover:scale-110",
                  activeIdx === idx ? "border-primary scale-110 ring-4 ring-primary/20" : "border-white/90 hover:border-primary/40"
                )}
              >
                {typeof img === 'object' && img.type === 'video' ? (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Film size={12} className="text-primary/40" />
                  </div>
                ) : (
                  <img 
                    src={getMediaUrl(img)} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </button>
            ))}
            {product.images.length > 4 && (
              <div className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-[10px] font-black text-white border-2 border-white/90">
                +{product.images.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons - Hover Only */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            className="p-2.5 rounded-xl bg-white/90 backdrop-blur shadow-lg text-primary hover:bg-primary hover:text-white transition-all"
            title="Edit Product"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
            className="p-2.5 rounded-xl bg-white/90 backdrop-blur shadow-lg text-destructive hover:bg-destructive hover:text-white transition-all"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">
            {product.category}
          </span>
        </div>
        <h3 className="font-black text-foreground text-lg leading-tight truncate">{product.title}</h3>
        <p className="text-muted-foreground text-xs line-clamp-2 mt-2 mb-4">
          {product.description || "No description provided."}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <p className="text-xl font-black text-primary">₹{product.price?.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <Layers size={14} className="text-primary/40" />
            <span className="text-xs font-black text-foreground">{product.stock_count || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await Query.list();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await Query.delete(id);
        fetchProducts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-foreground">Products Details</h1>
            <p className="text-muted-foreground font-medium">Manage your 3D model inventory and pricing</p>
          </div>
          <Button 
            onClick={handleAddNew}
            className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> New Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass p-6 rounded-3xl border border-white/60 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Package size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Products</p>
                <p className="text-2xl font-black text-foreground">{products.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-foreground">Active Inventory</h2>
            
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Filter size={14} className="text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">Category:</span>
              <div className="relative flex items-center">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-[10px] font-black text-foreground outline-none appearance-none cursor-pointer pr-5 uppercase tracking-wider"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-0 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-64 glass rounded-[40px] border border-dashed border-primary/20 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-white/20">
               <Archive size={40} className="mb-4 opacity-10" />
               <p className="text-sm font-black uppercase tracking-widest opacity-40">No {selectedCategory !== 'All' ? selectedCategory : ''} products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <AdminProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        editProduct={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchProducts();
        }}
      />
    </div>
  );
}
