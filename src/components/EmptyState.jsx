import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ category }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-6"
    >
      <div className="w-48 h-48 rounded-3xl overflow-hidden glass flex items-center justify-center">
        <img
          src="https://media.giphy.com/media/3oKIPseendMIBE2mxy/giphy.gif"
          alt="3D Printer in action"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground text-lg">Printing soon…</p>
        <p className="text-muted-foreground text-sm mt-1">
          {category !== 'All Products' ? `No ${category} products yet.` : 'No products found.'} Check back later!
        </p>
      </div>
    </motion.div>
  );
}
