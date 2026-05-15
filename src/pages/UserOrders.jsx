import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Truck,
  Box,
  MapPin,
  Calendar,
  AlertCircle,
  ShoppingBag as ShoppingBagIcon,
  Star,
  X
} from 'lucide-react';
import { Orders, Reviews } from '@/api/entities';
import LoadingScreen from '@/components/LoadingScreen';
import { cn } from '@/lib/utils';

const StepIcon = ({ label, completed, active }) => {
  switch (label) {
    case 'Received': return <Box size={16} />;
    case 'Preparing': return <Clock size={16} />;
    case 'Printing': return <Package size={16} />;
    case 'Quality Check': return <CheckCircle2 size={16} />;
    case 'Shipped': return <Truck size={16} />;
    default: return <Box size={16} />;
  }
};

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await Orders.list();
      // Sort by latest first
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReviewOrder) return;

    setIsSubmittingReview(true);
    try {
      await Reviews.create({
        product_id: selectedReviewOrder.productId, // Use the specific product being reviewed
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setSelectedReviewOrder(null);
      setReviewForm({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const isCompleted = ['completed', 'DELIVERED'].includes(o.status);
    return activeTab === 'active' ? !isCompleted : isCompleted;
  });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-muted-foreground font-medium mt-1">Track the progress of your custom 3D prints</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-white border border-slate-100 rounded-2xl shadow-sm self-start md:self-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'active' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Active Prints
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'completed' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Completed
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              key={`${activeTab}-empty`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass h-80 rounded-[40px] flex flex-col items-center justify-center text-muted-foreground border-dashed border-2 border-slate-200 bg-white/40"
            >
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6 opacity-20">
                <Inbox size={40} />
              </div>
              <p className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">
                {activeTab === 'active' ? "No active prints" : "No completed orders"}
              </p>
              <p className="text-xs font-bold text-slate-400 mt-2">
                {activeTab === 'active' ? "Start your next project today" : "Your finished masterpieces will appear here"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-list`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {filteredOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-strong rounded-[32px] md:rounded-[40px] border border-white/60 shadow-2xl overflow-hidden bg-white/80 flex flex-col"
                >
                  {/* 1. Product Items - Top on mobile */}
                  <div className="bg-slate-50/30 border-b border-slate-100 divide-y divide-slate-100 order-1 lg:order-3">
                    {order.items?.map((item, iIdx) => (
                      <div key={item.id || iIdx} className="p-4 md:p-6 flex flex-row items-start gap-4 md:gap-6 group hover:bg-white transition-colors">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0 border border-slate-100">
                          <img
                            src={typeof item.product?.images?.[0] === 'object' ? item.product.images[0].url : (item.product?.images?.[0] || 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80')}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-[13px] md:text-base font-black text-slate-900 truncate">{item.product?.title}</h4>
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-widest">Qty: {item.quantity}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.product?.description || 'Premium 3D printed model.'}</p>

                          <div className="flex items-center gap-2 mt-3">
                            {['completed', 'DELIVERED'].includes(order.status) && (
                              <button
                                onClick={() => setSelectedReviewOrder({ ...order, productId: item.product.id, productTitle: item.product.title })}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest border border-emerald-100"
                              >
                                <Star size={10} fill="currentColor" />
                                Write Reviews
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/product/${item.product?.id}`)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-all text-[9px] font-black uppercase tracking-widest"
                            >
                              Details <ChevronRight size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2 & 3. Order Info (ID, Date, Price, Status) */}
                  <div className="p-6 md:p-8 border-b border-slate-100 order-2 lg:order-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-primary relative flex-shrink-0">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">#{order.id.toString().padStart(4, '0')}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mt-0.5">Order Details</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{order.order_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-8 md:gap-16 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                          <p className="text-xl md:text-2xl font-black text-primary">
                            ₹{order.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-colors",
                            ['COMPLETED', 'DELIVERED'].includes(order.status) ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              ['SHIPPED'].includes(order.status) ? "bg-blue-50 text-blue-600 border-blue-100" :
                                ['PRINTING', 'PROCESSING'].includes(order.status) ? "bg-amber-50 text-amber-600 border-amber-100" :
                                  ['QUALITY CHECK'].includes(order.status) ? "bg-violet-50 text-violet-600 border-violet-100" :
                                    "bg-primary/5 text-primary border-primary/10"
                          )}>
                            {order.status === 'PAYMENT_SUCCESS' ? 'Received' : order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Milestone Map */}
                  <div className="p-6 md:p-12 order-3 lg:order-2">
                    <div className="relative">
                      {/* Connecting Line Background */}
                      <div className="absolute top-[18px] left-[40px] right-[40px] h-1 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                        {/* Active Progress Line */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(order.milestones.filter(m => m.completed).length - 1) / (order.milestones.length - 1) * 100}%`
                          }}
                          className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        />
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-8 md:gap-4">
                        {order.milestones.map((m, mIdx) => {
                          const isCompleted = m.completed;
                          const isCurrent = mIdx === order.milestones.filter(x => x.completed).length - 1;
                          const isNext = mIdx === order.milestones.filter(x => x.completed).length;

                          return (
                            <div key={m.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-4 flex-1">
                              {/* Circle Node */}
                              <div className="relative">
                                <motion.div
                                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className={cn(
                                    "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                                    isCompleted ? "bg-emerald-500 border-emerald-100 text-white shadow-lg shadow-emerald-500/20" :
                                      isNext ? "bg-white border-primary/40 text-primary animate-pulse" :
                                        "bg-white border-slate-100 text-slate-300"
                                  )}
                                >
                                  {isCompleted ? <CheckCircle2 size={18} /> : <StepIcon label={m.label} />}
                                </motion.div>

                                {/* Mobile Vertical Line */}
                                {mIdx < order.milestones.length - 1 && (
                                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-100 md:hidden">
                                    {isCompleted && <div className="w-full h-full bg-emerald-500" />}
                                  </div>
                                )}
                              </div>

                              {/* Labels */}
                              <div className="text-left md:text-center">
                                <p className={cn(
                                  "text-[11px] font-black uppercase tracking-widest transition-colors",
                                  isCompleted ? "text-slate-900" : isNext ? "text-primary" : "text-slate-300"
                                )}>
                                  {m.label}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5 leading-tight max-w-[120px] hidden md:block">
                                  {m.description}
                                </p>
                                {isCompleted && m.completed_at && (
                                  <p className="text-[8px] font-black text-emerald-500 uppercase mt-1">
                                    {new Date(m.completed_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Modal */}
        <AnimatePresence>
          {selectedReviewOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Write a Review</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      For {selectedReviewOrder.productTitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedReviewOrder(null)}
                    className="p-3 rounded-2xl hover:bg-slate-50 text-slate-400 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="p-8 space-y-8">
                  {/* Star Rating */}
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How was your experience?</p>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-all hover:scale-125"
                        >
                          <Star
                            size={32}
                            className={cn(
                              "transition-colors",
                              star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">- Write comments for this product</label>
                    <textarea
                      required
                      placeholder="Share your experience with this custom 3D print..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none min-h-[150px] resize-none transition-all text-slate-900"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                  </div>

                  <button
                    disabled={isSubmittingReview}
                    type="submit"
                    className="w-full h-16 rounded-[24px] bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Re-using local ShoppingBag since it's common
const ShoppingBag = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
