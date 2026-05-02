import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, CheckCircle2, MapPin, Truck } from 'lucide-react';
import { Orders, Cart } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const placeholderImages = [
  'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=900&q=85',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=85',
];

export default function ProductModal({ product, onClose }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    shipping_address: '',
    city: '',
    zip_code: ''
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const images = (product?.images && product.images.length > 0) ? product.images : placeholderImages;

  useEffect(() => {
    setCurrentImg(0);
    setOrderSuccess(false);
    setShowAddressForm(false);
  }, [product]);

  const prev = () => setCurrentImg(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrentImg(i => (i + 1) % images.length);

  const handleOrder = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }

    if (!address.shipping_address || !address.city || !address.zip_code) {
      alert('Please fill in all shipping details');
      return;
    }

    setIsOrdering(true);
    try {
      await Orders.create(product.id, address);
      setOrderSuccess(true);
      setTimeout(() => {
        navigate('/orders');
        onClose();
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await Cart.add(product.id, 1);
      alert('Added to cart!');
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        style={{ background: 'rgba(180, 170, 220, 0.25)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
          className="glass-strong rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative"
        >
          {/* Left: Image carousel */}
          <div className="md:w-[55%] relative bg-lavender/20 flex-shrink-0" style={{ minHeight: '300px' }}>
            <img
              key={currentImg}
              src={images[currentImg]}
              alt={product.title}
              className="w-full h-full object-cover"
              style={{ minHeight: '300px', maxHeight: '600px' }}
              onError={e => { e.target.src = placeholderImages[0]; }}
            />

            {images.length > 1 && !orderSuccess && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white/90 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white/90 transition-all">
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            <AnimatePresence>
              {orderSuccess && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center text-white z-20">
                  <motion.div initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}>
                    <CheckCircle2 size={64} className="mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Order Received!</h2>
                  <p className="text-sm opacity-80">Redirecting to your orders...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Details & Form */}
          <div className="md:w-[45%] p-8 flex flex-col overflow-y-auto max-h-[90vh]">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all shadow-sm">
              <X size={15} />
            </button>

            <AnimatePresence mode="wait">
              {!showAddressForm ? (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h2 className="font-black text-3xl text-foreground mt-4 leading-tight">{product.title}</h2>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary">₹{product.price?.toFixed(2)}</span>
                    <span className="text-sm font-bold text-muted-foreground uppercase opacity-60">INR</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 leading-relaxed bg-white/30 p-4 rounded-2xl border border-white/50">
                    {product.description || "Premium 3D printed model crafted with high-precision PLA material for maximum durability and detail."}
                  </p>
                  
                  <div className="flex gap-3 mt-10">
                    <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold bg-white/40 border border-white/60 hover:bg-white/60 transition-all text-foreground">
                      Add to Cart
                    </button>
                    <button onClick={() => setShowAddressForm(true)} className="flex-[1.5] flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" style={{ background: 'linear-gradient(135deg, hsl(250,60%,65%), hsl(200,70%,60%))' }}>
                      <Truck size={18} /> Order Print
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black text-foreground mb-1">Shipping Details</h2>
                  <p className="text-xs text-muted-foreground mb-6 uppercase font-bold tracking-widest opacity-60">Where should we send your print?</p>
                  
                  <form onSubmit={handleOrder} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shipping Address</label>
                      <textarea
                        required
                        placeholder="Street, House No, etc."
                        className="w-full bg-white/50 border border-white/70 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none min-h-[80px] resize-none transition-all focus:bg-white/80"
                        value={address.shipping_address}
                        onChange={e => setAddress({...address, shipping_address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                        <input
                          required
                          type="text"
                          placeholder="Colombo"
                          className="w-full bg-white/50 border border-white/70 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all focus:bg-white/80"
                          value={address.city}
                          onChange={e => setAddress({...address, city: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">ZIP Code</label>
                        <input
                          required
                          type="text"
                          placeholder="00100"
                          className="w-full bg-white/50 border border-white/70 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all focus:bg-white/80"
                          value={address.zip_code}
                          onChange={e => setAddress({...address, zip_code: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-6">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 py-3.5 rounded-2xl font-bold bg-white/40 border border-white/60 hover:bg-white/60 transition-all text-xs uppercase tracking-widest">
                        Back
                      </button>
                      <button disabled={isOrdering} type="submit" className="flex-[2] py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(250,60%,65%), hsl(200,70%,60%))' }}>
                        {isOrdering ? '...' : 'Confirm & Pay'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
