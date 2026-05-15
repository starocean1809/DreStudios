import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative">
        {/* Outer Ring Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-primary/10 border-t-primary"
        />
        
        {/* Inner Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-primary"
        >
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shadow-lg">
            <span className="text-xl font-black text-white italic">D</span>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]"
        >
          Dre Studios
        </motion.p>
        <div className="flex gap-1 justify-center mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              className="w-1.5 h-1.5 rounded-full bg-primary/40"
            />
          ))}
        </div>
      </div>
      
      {/* 3D Printer Style "Scanning" Line */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-px bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.5)] z-[-1]"
      />
    </div>
  );
}
