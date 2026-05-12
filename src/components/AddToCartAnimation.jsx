import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles, Plus } from 'lucide-react';

export default function AddToCartAnimation() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/20 backdrop-blur-md p-6"
    >
      <div className="max-w-xs w-full text-center space-y-6 relative">
        <div className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15 
            }}
            className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl relative z-10"
          >
            <ShoppingCart size={40} className="text-primary" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-lg"
            >
              <Plus size={16} strokeWidth={4} />
            </motion.div>
          </motion.div>
          
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0.5],
                x: Math.cos(i * 45 * Math.PI / 180) * 80,
                y: Math.sin(i * 45 * Math.PI / 180) * 80
              }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Sparkles className="text-yellow-400" size={16} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Added to Cart!</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Item saved successfully</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
