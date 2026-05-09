import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  Box,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Orders } from '@/api/entities';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminOrderRequests() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await Orders.list();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMilestone = async (orderId, milestoneId, currentStatus) => {
    setUpdatingId(milestoneId);
    try {
      await Orders.updateMilestone(orderId, milestoneId, { completed: !currentStatus });
      // Refresh order details in modal if open
      if (selectedOrder?.id === orderId) {
        const updatedOrders = await Orders.list();
        setOrders(updatedOrders);
        setSelectedOrder(updatedOrders.find(o => o.id === orderId));
      } else {
        fetchOrders();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        {/* Detail Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Order #ORD-{selectedOrder.id.toString().padStart(4, '0')}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <Calendar size={12} /> {new Date(selectedOrder.created_at).toLocaleDateString()} · {new Date(selectedOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                  selectedOrder.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-primary/5 text-primary"
                )}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
               Print Invoice
             </button>
             <button 
              onClick={() => setSelectedOrder(null)}
              className="px-6 py-3 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
             >
               Back to List
             </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer & Shipping */}
          <div className="lg:col-span-1 space-y-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <UserIcon size={14} className="text-primary" /> Customer Info
              </h3>
              <div className="glass p-6 rounded-[32px] border border-white/60 shadow-xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{selectedOrder.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-bold text-slate-900">{selectedOrder.user?.phone}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Truck size={14} className="text-primary" /> Delivery Address
              </h3>
              <div className="glass p-6 rounded-[32px] border border-white/60 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mt-1">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed mt-1">
                      {selectedOrder.shipping_address}<br />
                      {selectedOrder.city}, {selectedOrder.zip_code}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Milestones & Product */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock size={14} className="text-primary" /> Production Pipeline
              </h3>
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
                {selectedOrder.milestones?.map((m, mIdx) => {
                  const completedCount = selectedOrder.milestones.filter(x => x.completed).length;
                  const isNext = !m.completed && mIdx === completedCount;
                  const isLast = mIdx === selectedOrder.milestones.length - 1;

                  return (
                    <div key={m.id} className="flex gap-5">
                      {/* Left: connector column */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        {/* Circle */}
                        <button
                          onClick={() => handleToggleMilestone(selectedOrder.id, m.id, m.completed)}
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 shadow-sm",
                            m.completed
                              ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-200"
                              : isNext
                              ? "bg-amber-50 border-amber-400 text-amber-500 animate-pulse"
                              : "bg-slate-50 border-slate-200 text-slate-300"
                          )}
                        >
                          {updatingId === m.id ? (
                            <div className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          ) : m.completed ? (
                            <CheckCircle2 size={18} strokeWidth={3} />
                          ) : isNext ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </button>

                        {/* Vertical connector line + arrow */}
                        {!isLast && (
                          <div className="flex flex-col items-center my-1">
                            <div className={cn(
                              "w-0.5 h-8 transition-all",
                              m.completed ? "bg-emerald-400" : "bg-slate-200 border-l-2 border-dashed border-slate-200"
                            )} />
                            {/* Arrowhead */}
                            <div className={cn(
                              "w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent transition-all",
                              m.completed ? "border-t-emerald-400" : "border-t-slate-300"
                            )} />
                          </div>
                        )}
                      </div>

                      {/* Right: content */}
                      <div className={cn(
                        "flex-1 pb-2",
                        !isLast && "mb-4"
                      )}>
                        <div
                          onClick={() => handleToggleMilestone(selectedOrder.id, m.id, m.completed)}
                          className={cn(
                            "p-4 rounded-[20px] border cursor-pointer transition-all group",
                            m.completed
                              ? "bg-emerald-50 border-emerald-100"
                              : isNext
                              ? "bg-amber-50 border-amber-200 shadow-md shadow-amber-50"
                              : "bg-slate-50 border-slate-100 hover:border-primary/20"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={cn(
                                "text-xs font-black uppercase tracking-widest",
                                m.completed ? "text-emerald-700" : isNext ? "text-amber-700" : "text-slate-400"
                              )}>
                                {m.label}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{m.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              {m.completed && m.completed_at ? (
                                <div>
                                  <p className="text-[9px] font-black text-emerald-500 uppercase">
                                    {new Date(m.completed_at).toLocaleDateString()}
                                  </p>
                                  <p className="text-[9px] font-black text-emerald-400 uppercase">
                                    {new Date(m.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              ) : isNext ? (
                                <span className="px-2 py-1 rounded-lg bg-amber-400/20 text-amber-600 text-[8px] font-black uppercase tracking-widest">
                                  Next Step
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] pt-2 mt-2 border-t border-slate-100">
                  Click any step to mark it as completed
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Box size={14} className="text-primary" /> Request Item
              </h3>
              <div 
                onClick={() => navigate(`/product/${selectedOrder.product?.id}`)}
                className="glass p-6 rounded-[32px] border border-white/60 shadow-xl flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:border-primary/20 transition-all"
              >
                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={typeof selectedOrder.product?.images?.[0] === 'object' ? selectedOrder.product.images[0].url : selectedOrder.product?.images?.[0]} 
                    className="w-full h-full object-cover"
                    alt="Product"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">
                      {selectedOrder.product?.category}
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{selectedOrder.product?.title}</h4>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 max-w-lg mx-auto md:mx-0">
                    {selectedOrder.product?.description || 'Premium 3D printed model requested by user.'}
                  </p>
                  <p className="text-xl font-black text-primary mt-4">₹{selectedOrder.product?.price?.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <ExternalLink size={20} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-[32px] border border-white/60 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="group hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">ORD-{order.id.toString().padStart(4, '0')}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-[9px] text-muted-foreground/70 font-bold">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <p className="text-xs font-black text-foreground truncate max-w-[150px]">{order.user?.email}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">{order.user?.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img 
                          src={typeof order.product?.images?.[0] === 'object' ? order.product.images[0].url : order.product?.images?.[0]} 
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80'; }}
                        />
                      </div>
                      <p className="text-xs font-black text-foreground truncate max-w-[120px]">{order.product?.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      order.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                      order.status === 'shipped' ? "bg-blue-100 text-blue-600" :
                      order.status === 'printing' ? "bg-purple-100 text-purple-600" :
                      "bg-yellow-100 text-yellow-600"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <p className="text-sm font-black text-muted-foreground uppercase tracking-widest opacity-30">No order requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
