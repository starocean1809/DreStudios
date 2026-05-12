import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Truck, 
  Calendar, 
  ArrowLeft,
  ChevronRight,
  Package,
  Clock,
  ShieldCheck,
  CreditCard,
  Building2,
  Map,
  Hash
} from 'lucide-react';
import { Orders, Query } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import OrderSuccessAnimation from '@/components/OrderSuccessAnimation';

export default function Checkout() {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [address, setAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state_name: '',
    zip_code: '',
    phone: ''
  });
  const [useProfileAddress, setUseProfileAddress] = useState(true);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (state?.productId) {
        // Direct Buy flow
        try {
          const product = await Query.get(state.productId);
          setItems([{ product, quantity: state.quantity || 1 }]);
        } catch (err) {
          console.error(err);
          navigate('/');
        }
      } else if (state?.items) {
        // Cart Checkout flow
        setItems(state.items);
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    initializeCheckout();
  }, [state, navigate]);

  useEffect(() => {
    if (user && useProfileAddress) {
      setAddress({
        address_line1: `${user.flat_no || ''}${user.flat_no ? ', ' : ''}${user.street_name || ''}`,
        address_line2: user.area_name || '',
        city: user.place || '',
        state_name: user.state || '',
        zip_code: user.pincode || '',
        phone: user.phone || ''
      });
    }
  }, [user, useProfileAddress]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.address_line1 || !address.city || !address.state_name || !address.zip_code || !address.phone) {
      alert('Please fill in all mandatory shipping details');
      return;
    }

    const fullAddress = `${address.address_line1}${address.address_line2 ? ', ' + address.address_line2 : ''}`;
    setIsOrdering(true);
    try {
      let lastOrderId = null;
      for (const item of items) {
        const result = await Orders.create(item.product.id, { 
          shipping_address: fullAddress,
          city: address.city,
          state: address.state_name,
          zip_code: address.zip_code,
          phone: address.phone,
          quantity: item.quantity
        });
        lastOrderId = result.id || result.order_id;
      }
      
      // If it was a cart checkout, clear the cart
      if (state?.items) {
        // Import Cart and clear it
        const { Cart: CartAPI } = await import('@/api/entities');
        await CartAPI.clear();
        window.dispatchEvent(new Event('cartUpdated'));
      }

      setOrderSuccess(true);
      setTimeout(() => navigate(`/order-success/${lastOrderId}`), 3000);
    } catch (err) {
      alert(err.message || 'Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fafbff]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fafbff] p-8 text-center">
        <Package size={48} className="text-slate-200 mb-4" />
        <h2 className="text-xl font-black text-slate-900">No Items to Checkout</h2>
        <p className="text-slate-500 font-medium mt-2">Add something to your cart to get started.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-8 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff]">
      <div className="max-w-6xl mx-auto p-4 md:p-8 pt-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all mb-8"
        >
          <ArrowLeft size={14} /> Back to Product
        </button>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Shipping Form (60%) */}
          <div className="w-full lg:w-[65%] space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong p-8 md:p-12 rounded-[48px] border border-white shadow-2xl bg-white/80"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipping Details</h1>
                  <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Confirm your delivery information</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setUseProfileAddress(true)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      useProfileAddress ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Primary
                  </button>
                  <button 
                    onClick={() => {
                      setUseProfileAddress(false);
                      setAddress({
                        address_line1: '',
                        address_line2: '',
                        city: '',
                        state_name: '',
                        zip_code: '',
                        phone: user?.phone || ''
                      });
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      !useProfileAddress ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    + New Address
                  </button>
                </div>
              </div>

              <form onSubmit={handleOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Address Line 1 <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        type="text"
                        placeholder="House No, Street name..."
                        className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                        value={address.address_line1}
                        onChange={e => setAddress({ ...address, address_line1: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Address Line 2</label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="Area, Landmark..."
                        className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                        value={address.address_line2}
                        onChange={e => setAddress({ ...address, address_line2: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">City <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="City"
                      className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                      value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">State <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="State"
                      className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                      value={address.state_name}
                      onChange={e => setAddress({ ...address, state_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Pincode <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        type="text"
                        placeholder="000000"
                        className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                        value={address.zip_code}
                        onChange={e => setAddress({ ...address, zip_code: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Contact Phone <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                      value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={isOrdering}
                    type="submit"
                    className="w-full h-16 rounded-[24px] bg-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isOrdering ? 'Processing...' : (
                      <>
                        Confirm & Place Order <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Trust Section */}
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-[32px] bg-white border border-slate-100 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Secure Payment</p>
              </div>
              <div className="p-6 rounded-[32px] bg-white border border-slate-100 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Express Delivery</p>
              </div>
              <div className="p-6 rounded-[32px] bg-white border border-slate-100 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Real-time Track</p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary (40%) */}
          <div className="w-full lg:w-[35%] sticky top-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong p-8 rounded-[48px] border border-white shadow-2xl bg-white/80 overflow-hidden"
            >
              <h2 className="text-xl font-black text-slate-900 mb-8">Order Summary</h2>
              
              <div className="space-y-6">
                {/* Product List */}
                <div className="space-y-4 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                  {items.map((item, idx) => (
                    <div key={item.id || idx} className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                        <img 
                          src={typeof item.product?.images?.[0] === 'object' ? item.product.images[0].url : (item.product?.images?.[0] || 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80')} 
                          className="w-full h-full object-cover" 
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{item.product?.category}</p>
                        <h3 className="text-xs font-black text-slate-900 truncate mt-0.5">{item.product?.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</span>
                          <span className="text-xs font-black text-slate-900">₹{(item.product?.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-900">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Express Shipping</span>
                    <span className="text-emerald-500 font-black uppercase text-[10px] bg-emerald-500/10 px-2 py-1 rounded-md tracking-widest">FREE</span>
                  </div>
                  <div className="h-px bg-slate-100 my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Amount</span>
                    <span className="text-3xl font-black text-primary">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                   <div className="flex items-center gap-3 text-primary">
                      <CreditCard size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Payment Method</span>
                   </div>
                   <p className="text-xs font-bold text-slate-600 mt-2">Cash on Delivery / Digital Pay upon Arrival</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
      <AnimatePresence>
        {orderSuccess && <OrderSuccessAnimation />}
      </AnimatePresence>
    </div>
  );
}
