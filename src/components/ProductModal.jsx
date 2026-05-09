import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, CheckCircle2, MapPin, Truck, Film } from 'lucide-react';
import { Orders, Cart } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const placeholderImages = [
  { url: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=900&q=85', type: 'image' },
];

export default function ProductModal({ product, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
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

  // Normalize images to always be an array of objects
  const media = (product?.images && product.images.length > 0) 
    ? product.images.map(m => typeof m === 'string' ? { url: m, type: 'image' } : m)
    : placeholderImages;

  useEffect(() => {
    setActiveIdx(0);
    setOrderSuccess(false);
    setShowAddressForm(false);
  }, [product]);

  const activeMedia = media[activeIdx];

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
        style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-[40px] overflow-hidden shadow-2xl w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col md:flex-row relative border border-white/20"
        >
          {/* Left: Media Area */}
          <div className="md:w-[60%] relative bg-slate-900 flex-shrink-0 group flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {activeMedia.type === 'video' ? (
                  <video 
                    src={activeMedia.url} 
                    controls 
                    autoPlay 
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = placeholderImages[0].url; }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail Strip */}
            {media.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 z-10">
                {media.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={cn(
                      "w-12 h-12 rounded-xl border-2 overflow-hidden transition-all",
                      activeIdx === idx ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Film size={14} className="text-white/40" />
                      </div>
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {orderSuccess && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-primary/95 flex flex-col items-center justify-center text-white z-20">
                  <motion.div initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}>
                    <CheckCircle2 size={80} className="mb-6" />
                  </motion.div>
                  <h2 className="text-3xl font-black mb-2">Order Confirmed!</h2>
                  <p className="text-sm opacity-80 font-bold uppercase tracking-widest">Preparing your 3D print...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Content Area */}
          <div className="md:w-[40%] p-8 md:p-10 flex flex-col bg-white overflow-y-auto">
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all text-slate-500 z-10"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {!showAddressForm ? (
                <motion.div 
                  key="details" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/5">
                      {product.category}
                    </span>
                    <h2 className="font-black text-4xl text-slate-900 mt-6 leading-tight tracking-tight">{product.title}</h2>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="text-4xl font-black text-primary">₹{product.price?.toLocaleString()}</span>
                      <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock: {product.stock_count || 0}</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About this model</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {product.description || "Premium 3D printed model crafted with high-precision materials for maximum durability and stunning detail."}
                      </p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <Truck size={20} className="text-primary" />
                        <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase">Fast Delivery</p>
                          <p className="text-[9px] font-bold text-slate-400">Sri Lanka Wide</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-primary" />
                        <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase">Quality Print</p>
                          <p className="text-[9px] font-bold text-slate-400">Precision PLA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-10">
                    <button 
                      onClick={handleAddToCart} 
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => setShowAddressForm(true)} 
                      className="flex-[1.2] flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary text-white hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                    >
                      Order Now
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="address" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Checkout</h2>
                    <p className="text-[10px] text-slate-400 mb-8 uppercase font-black tracking-widest">Where should we deliver your print?</p>
                    
                    <form onSubmit={handleOrder} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Shipping Address</label>
                        <textarea
                          required
                          placeholder="No 123, Galle Road, Colombo 03"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none min-h-[100px] resize-none transition-all placeholder:text-slate-300"
                          value={address.shipping_address}
                          onChange={e => setAddress({...address, shipping_address: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                          <input
                            required
                            type="text"
                            placeholder="Colombo"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all placeholder:text-slate-300"
                            value={address.city}
                            onChange={e => setAddress({...address, city: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ZIP Code</label>
                          <input
                            required
                            type="text"
                            placeholder="00300"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all placeholder:text-slate-300"
                            value={address.zip_code}
                            onChange={e => setAddress({...address, zip_code: e.target.value})}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  
                  <div className="flex gap-3 pt-8 mt-auto">
                    <button 
                      type="button" 
                      onClick={() => setShowAddressForm(false)} 
                      className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      disabled={isOrdering} 
                      onClick={handleOrder}
                      className="flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center"
                    >
                      {isOrdering ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
