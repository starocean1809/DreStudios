import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, Inbox, MapPin, Truck } from 'lucide-react';
import { Cart, Orders } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Footer from '@/components/Footer';
import OrderSuccessAnimation from '@/components/OrderSuccessAnimation';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await Cart.list();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id, newQty) => {
    try {
      await Cart.update(id, newQty);
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      await Cart.remove(id);
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout', { state: { items } });
  };

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return null;

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">Shopping Cart</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
               <span className="text-primary">Items</span>
               <ArrowRight size={14} className="opacity-30" />
               <span>Shipping</span>
               <ArrowRight size={14} className="opacity-30" />
               <span>Confirmation</span>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="glass h-64 rounded-3xl flex flex-col items-center justify-center text-muted-foreground border-dashed border-2">
            <Inbox size={48} className="mb-4 opacity-10" />
            <p className="text-lg font-medium font-bold opacity-60">Your cart is empty</p>
            <Button onClick={() => navigate('/')} variant="link" className="text-primary font-black uppercase text-xs tracking-widest mt-2">
              Browse Models
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List or Address */}
            <div className="lg:col-span-8">
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="glass p-5 rounded-3xl border border-white/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div 
                      onClick={() => navigate(`/product/${item.product.id}`)}
                      className="w-24 h-24 rounded-2xl overflow-hidden bg-white/50 flex-shrink-0 cursor-pointer group/img"
                    >
                      <img 
                        src={typeof item.product.images?.[0] === 'object' ? item.product.images[0].url : item.product.images?.[0]} 
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" 
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div 
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="cursor-pointer group/text"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover/text:text-primary transition-colors">{item.product.category}</span>
                        <h3 className="font-bold text-lg text-foreground truncate h-6 group-hover/text:text-primary transition-colors">{item.product.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground font-bold mt-1">₹{item.product.price.toFixed(2)} / unit</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center bg-white/40 border border-white/70 rounded-xl p-0.5 shadow-sm">
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground">
                            <Minus size={15} />
                          </button>
                          <span className="w-10 text-center text-sm font-black text-foreground">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground">
                            <Plus size={15} />
                          </button>
                        </div>
                        <button onClick={() => handleRemove(item.id)} className="p-2 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right pr-4">
                      <p className="text-xl font-black text-primary">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4 gap-6 flex flex-col">
              <div className="glass-strong p-8 rounded-[40px] border border-white/70 shadow-2xl sticky top-8">
                <h2 className="text-xl font-black mb-8">Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground font-bold">
                    <span>Subtotal</span>
                    <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground font-bold">
                     <span>Express Shipping</span>
                     <span className="text-green-500 font-extrabold uppercase text-[10px] bg-green-500/10 px-2 py-1 rounded-md">FREE</span>
                  </div>
                  <div className="pt-6 border-t border-white/40 flex justify-between items-baseline">
                    <span className="font-black text-foreground uppercase tracking-wider text-xs">Total</span>
                    <span className="text-3xl font-black text-primary">₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3"
                  >
                    Shipping Details <ArrowRight size={18} />
                  </Button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-center gap-6 opacity-30">
                   <div className="text-[10px] font-black uppercase italic">Safe Pay</div>
                   <div className="text-[10px] font-black uppercase italic">Fast Print</div>
                   <div className="text-[10px] font-black uppercase italic">HQ Finish</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
