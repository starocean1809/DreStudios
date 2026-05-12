import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Truck, 
  Calendar, 
  ArrowLeft,
  ChevronRight,
  Package,
  Clock,
  Printer
} from 'lucide-react';
import { Orders } from '@/api/entities';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      // Since there is no single GET order API in entities.js, we fetch the list and find it
      const allOrders = await Orders.list();
      const found = allOrders.find(o => o.id.toString() === id);
      setOrder(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fafbff]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fafbff] p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6 text-destructive">
          <Package size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-slate-500 mt-2">We couldn't retrieve the details for this order.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-8 flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
        >
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff]">
      <div className="max-w-4xl mx-auto p-4 md:p-8 pt-12 md:pt-20">
        {/* Success Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 rounded-[40px] bg-emerald-500 shadow-2xl shadow-emerald-500/30 flex items-center justify-center mx-auto mb-8 text-white relative">
             <CheckCircle2 size={48} />
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: [1, 1.5, 1] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-0 rounded-[40px] border-4 border-emerald-500/30"
             />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Order Confirmed!</h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Thank you for choosing Dre Studios. Your print is now in queue.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-[48px] border border-white shadow-2xl overflow-hidden bg-white/80"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                  <p className="text-lg font-black text-slate-900">#{order.id.toString().padStart(4, '0')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Date</p>
                  <p className="text-sm font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Product Section */}
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="w-full sm:w-40 aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-inner border border-slate-100 flex-shrink-0">
                    <img 
                      src={typeof order.product?.images?.[0] === 'object' ? order.product.images[0].url : (order.product?.images?.[0] || 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80')} 
                      className="w-full h-full object-cover" 
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80'; }}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/5">
                        {order.product?.category}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-2">{order.product?.title}</h3>
                      <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-2 leading-relaxed">
                        {order.product?.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Quantity</p>
                          <p className="text-sm font-black text-slate-900">{order.quantity} Units</p>
                       </div>
                       <div className="w-px h-8 bg-slate-100" />
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price / Unit</p>
                          <p className="text-sm font-black text-slate-900">₹{order.product?.price?.toLocaleString()}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Tracking Preview */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Truck size={12} className="text-primary" /> Current Status
                  </h4>
                  <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-wide">In Queue</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Our team is preparing your custom print model.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Processing</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Info (Right 1/3) */}
          <div className="space-y-6">
            {/* Address Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[40px] border border-white shadow-xl space-y-6"
            >
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <MapPin size={12} className="text-primary" /> Delivery Details
              </h4>
              <div className="space-y-4">
                <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    {order.shipping_address}
                  </p>
                  <p className="text-xs font-black text-slate-900 mt-2 uppercase">
                    {order.city}, {order.state} — {order.zip_code}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Contact Phone</p>
                    <p className="text-xs font-black text-slate-900">{order.phone}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Price Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong p-8 rounded-[40px] border border-white shadow-xl bg-slate-900 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Payment Summary</h4>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm font-bold opacity-60">
                   <span>Items ({order.quantity})</span>
                   <span>₹{(order.product?.price * order.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold opacity-60">
                   <span>Shipping</span>
                   <span className="text-emerald-400 font-black">FREE</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid</span>
                   <span className="text-3xl font-black text-white">₹{(order.product?.price * order.quantity).toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button 
                onClick={() => navigate('/orders')}
                className="w-full h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                Track Progress <ChevronRight size={14} />
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full h-14 rounded-2xl bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
