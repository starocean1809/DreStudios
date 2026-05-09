import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, Sparkles } from 'lucide-react';

export default function OrderSuccessAnimation({ onComplete }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-6"
    >
      <div className="max-w-md w-full text-center space-y-8 relative">
        {/* Floating background elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-20 -left-10 text-primary/20"
        >
          <Package size={80} />
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute -bottom-20 -right-10 text-primary/20"
        >
          <Truck size={80} />
        </motion.div>

        {/* Main Success Circle */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] bg-primary flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 relative z-10"
          >
            <CheckCircle2 size={64} className="text-white" />
          </motion.div>
          
          {/* Sparkles around circle */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateY(-100px)`
              }}
            >
              <Sparkles className="text-yellow-400" size={24} />
            </motion.div>
          ))}
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-black text-white leading-tight">Order Placed Successfully!</h2>
          <p className="text-slate-400 font-medium">
            Your 3D print request has been received. Our studio is now warming up the extruders for your masterpiece!
          </p>
        </motion.div>

        {/* Progress Bar Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
            className="h-full bg-primary shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="text-[10px] font-black text-primary uppercase tracking-[0.3em]"
        >
          Redirecting to your orders...
        </motion.p>
      </div>
    </motion.div>
  );
}
