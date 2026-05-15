import React, { useState, useEffect } from 'react';
import { Plus, Package, Trash2, Archive, Layers, Pencil, Film, Filter, ChevronDown, Box, ShoppingCart, Power, PowerOff } from 'lucide-react';
import { Query } from '@/api/entities';
import { Button } from '@/components/ui/button';
import AddProductModal from '@/components/AddProductModal';
import LoadingScreen from '@/components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function AdminProductCard({ product, onEdit, onToggleStock }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isToggling, setIsToggling] = useState(false);

  const getMediaUrl = (item) => {
    if (!item) return 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80';
    return typeof item === 'object' ? item.url : item;
  };

  const activeMedia = product.images?.[activeIdx];
  const isVideo = typeof activeMedia === 'object' && activeMedia.type === 'video';
  const isOutOfStock = product.is_out_of_stock;

  const handleToggle = async (e) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      await onToggleStock(product.id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "glass rounded-[24px] md:rounded-[32px] overflow-hidden group border hover:shadow-2xl transition-all flex flex-col h-full relative",
        isOutOfStock ? "border-red-200 opacity-80" : "border-white/60"
      )}
    >
      {isOutOfStock && (
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-red-500 text-white text-[6px] md:text-[8px] font-black uppercase tracking-widest shadow-lg">
          Out of Stock
        </div>
      )}

      <div className="aspect-square relative overflow-hidden bg-white flex-shrink-0 border-b border-slate-100">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <Film size={24} className="md:w-10 md:h-10 text-primary/20" />
          </div>
        ) : (
          <img 
            src={getMediaUrl(activeMedia)} 
            className={cn(
              "w-full h-full object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-500",
              isOutOfStock && "grayscale opacity-50"
            )} 
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80'; }}
          />
        )}
        
        {/* Multi-media preview strip - Always visible */}
        {product.images?.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 md:gap-2 z-10">
            {product.images.slice(0, 4).map((img, idx) => (
              <button 
                key={idx} 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                className={cn(
                  "w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl border md:border-2 overflow-hidden shadow-lg bg-white flex-shrink-0 transition-all hover:scale-110",
                  activeIdx === idx ? "border-primary scale-110 ring-2 md:ring-4 ring-primary/20" : "border-white/90 hover:border-primary/40"
                )}
              >
                {typeof img === 'object' && img.type === 'video' ? (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Film size={8} className="md:w-3 md:h-3 text-primary/40" />
                  </div>
                ) : (
                  <img 
                    src={getMediaUrl(img)} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons - ALWAYS VISIBLE */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 flex gap-1 md:gap-2 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-white shadow-xl text-primary hover:bg-primary hover:text-white transition-all border border-slate-100"
            title="Edit Product"
          >
            <Pencil size={12} className="md:w-4.5 md:h-4.5" />
          </button>
          <button 
            disabled={isToggling}
            onClick={handleToggle}
            className={cn(
              "p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-white shadow-xl transition-all border border-slate-100",
              isOutOfStock 
                ? "text-green-600 hover:bg-green-600 hover:text-white" 
                : "text-red-500 hover:bg-red-500 hover:text-white"
            )}
            title={isOutOfStock ? "Set as In Stock" : "Set as Out of Stock"}
          >
            {isOutOfStock ? <Power size={12} className="md:w-4.5 md:h-4.5" /> : <PowerOff size={12} className="md:w-4.5 md:h-4.5" />}
          </button>
        </div>
      </div>

      <div className="p-3 md:p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1 md:mb-2">
          <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[6px] md:text-[8px] font-black uppercase tracking-widest">
            {product.category}
          </span>
        </div>
        <h3 className={cn(
          "font-black text-slate-900 text-xs md:text-lg leading-tight truncate",
          isOutOfStock && "text-slate-400"
        )}>{product.title}</h3>
        <p className="text-slate-500 text-[10px] md:text-xs line-clamp-1 md:line-clamp-2 mt-1 md:mt-2 mb-2 md:mb-4">
          {product.description || "No description."}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-2 md:pt-4 border-t border-slate-100">
          <p className={cn(
            "text-sm md:text-xl font-black text-primary",
            isOutOfStock && "text-slate-400"
          )}>₹{product.price?.toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminProducts() {
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

  const handleToggleStock = async (id) => {
    try {
      await Query.toggleStock(id);
      fetchProducts();
    } catch (err) {
      alert(err.message);
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
    <div className="flex-1 overflow-auto bg-[#fafbff] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-foreground flex items-center gap-2">
                Products
                <span className="bg-primary/10 text-primary text-[10px] md:text-xs px-2 py-0.5 rounded-lg border border-primary/20">
                  {products.length}
                </span>
              </h1>
              <p className="text-[10px] md:text-base text-muted-foreground font-medium uppercase tracking-widest">Inventory</p>
            </div>
          </div>
          <Button 
            onClick={handleAddNew}
            className="rounded-xl md:rounded-2xl px-4 md:px-8 h-10 md:h-14 font-black uppercase tracking-widest text-[8px] md:text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex-shrink-0"
          >
            <Plus className="w-3 h-3 md:w-5 md:h-5 mr-1 md:mr-2" /> New <span className="hidden xs:inline">Product</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/60 shadow-sm"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Package size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                <p className="text-lg md:text-2xl font-black text-foreground">{products.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
            <h2 className="text-lg md:text-xl font-black text-foreground">Active Inventory</h2>
            
            <div className="w-full sm:w-auto flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Filter size={12} className="text-primary" />
              <span className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">Category:</span>
              <div className="relative flex items-center flex-1 sm:flex-none">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-[9px] md:text-[10px] font-black text-foreground outline-none appearance-none cursor-pointer pr-5 uppercase tracking-wider"
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
            <LoadingScreen />
          ) : filteredProducts.length === 0 ? (
            <div className="h-64 glass rounded-[32px] md:rounded-[40px] border border-dashed border-primary/20 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-white/20">
               <Archive size={32} className="mb-4 opacity-10 md:w-10 md:h-10" />
               <p className="text-[10px] md:text-sm font-black uppercase tracking-widest opacity-40">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <AdminProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={handleEdit} 
                    onToggleStock={handleToggleStock} 
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
