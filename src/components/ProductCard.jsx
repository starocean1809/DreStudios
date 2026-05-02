import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const placeholderImages = [
  'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80',
  'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=600&q=80',
];

export default function ProductCard({ product, onClick, listMode }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const imageRef = useRef(null);

  const images = (product.images && product.images.length > 0)
    ? product.images
    : placeholderImages.slice(0, 1);

  const activeImage = hoveredSegment !== null ? images[hoveredSegment] : images[0];

  const handleMouseMove = (e) => {
    if (!imageRef.current || images.length <= 1) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const segmentWidth = rect.width / images.length;
    const seg = Math.min(Math.floor(x / segmentWidth), images.length - 1);
    setHoveredSegment(seg);
  };

  const handleMouseLeave = () => setHoveredSegment(null);

  if (listMode) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        onClick={() => onClick(product)}
        className="glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group flex gap-4 p-3"
      >
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-lavender/30">
          <img
            src={images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = placeholderImages[0]; }}
          />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{product.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{product.category}</p>
          {product.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>
        <div className="flex-shrink-0 flex flex-col items-end justify-center gap-2">
          <span className="font-bold text-primary text-base">₹{product.price?.toFixed(2)}</span>
          <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium">Buy</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onClick={() => onClick(product)}
      className="glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
    >
      {/* Image area */}
      <div
        ref={imageRef}
        className="relative overflow-hidden bg-lavender/20"
        style={{ aspectRatio: '4/3' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={activeImage}
          alt={product.title}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          onError={e => { e.target.src = placeholderImages[0]; }}
        />

        {/* Segment indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ${
                  (hoveredSegment ?? 0) === i ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs font-bold px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-primary shadow-sm">
            ₹{product.price?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3.5">
        <p className="font-semibold text-foreground text-sm leading-tight">{product.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{product.category}</p>
      </div>
    </motion.div>
  );
}
