import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Film, Layers, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const isOutOfStock = product.is_out_of_stock;

  const getMediaUrl = (item) => {
    if (!item) return 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80';
    return typeof item === 'object' ? item.url : item;
  };

  const activeMedia = product.images?.[activeIdx];
  const isVideo = typeof activeMedia === 'object' && activeMedia.type === 'video';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isOutOfStock ? {} : { y: -6 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className={cn(
        "glass rounded-[32px] overflow-hidden group border hover:shadow-2xl transition-all flex flex-col h-full cursor-pointer bg-white/40 backdrop-blur-md relative",
        isOutOfStock ? "border-slate-200 grayscale-[0.8] opacity-70 cursor-not-allowed" : "border-white/60"
      )}
    >
      {isOutOfStock && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-red-500 text-white text-[8px] font-black uppercase tracking-widest shadow-xl">
          Out of Stock
        </div>
      )}

      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 flex-shrink-0">
        {isVideo ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200">
            <Film size={32} className="text-primary/20 mb-2" />
            <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Video Preview</p>
          </div>
        ) : (
          <img 
            src={getMediaUrl(activeMedia)} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80'; }}
          />
        )}
        
        {/* Multi-media preview strip - Fixed at bottom */}
        {!isOutOfStock && product.images?.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 z-10">
            {product.images.slice(0, 4).map((img, idx) => (
              <button 
                key={idx} 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                className={cn(
                  "w-8 h-8 rounded-lg border-2 overflow-hidden shadow-lg bg-white flex-shrink-0 transition-all hover:scale-110",
                  activeIdx === idx ? "border-primary scale-110 ring-4 ring-primary/10" : "border-white/90 hover:border-primary/30"
                )}
              >
                {typeof img === 'object' && img.type === 'video' ? (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Film size={10} className="text-primary/40" />
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

        {/* View Action - Hover Only */}
        {!isOutOfStock && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <div className="p-2.5 rounded-xl bg-white/90 backdrop-blur shadow-lg text-primary hover:bg-primary hover:text-white transition-all">
              <ShoppingBag size={18} />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">
            {product.category}
          </span>
        </div>
        <h3 className="font-black text-foreground text-base leading-tight truncate">{product.title}</h3>
        <p 
          className="hidden sm:block text-muted-foreground text-[10px] mt-2 mb-4 leading-normal font-medium overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description || "Crafted with precision using advanced 3D printing technology."}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <p className="text-lg font-black text-primary">₹{product.price?.toLocaleString()}</p>
          {isOutOfStock && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Sold Out</span>}
        </div>
      </div>
    </motion.div>
  );
}
