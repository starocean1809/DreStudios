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
  const [activeTab, setActiveTab] = useState('all'); // all, pending, printing, shipped, completed

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling for new orders
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

  const COMPLETED_STATUSES = ['DELIVERED', 'completed'];

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'all') {
      // "All Orders" now means "Active Orders" per user request (excludes completed)
      return !COMPLETED_STATUSES.includes(o.status);
    }
    if (activeTab === 'completed') {
      return COMPLETED_STATUSES.includes(o.status);
    }
    return o.status === activeTab;
  });

  const stats = {
    all: orders.filter(o => !COMPLETED_STATUSES.includes(o.status)).length,
    pending: orders.filter(o => o.status === 'pending').length,
    printing: orders.filter(o => o.status === 'printing').length,
    completed: orders.filter(o => COMPLETED_STATUSES.includes(o.status)).length,
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
              <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedOrder.order_id}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <Calendar size={12} /> {new Date(selectedOrder.created_at).toLocaleDateString()} · {new Date(selectedOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                  ['completed', 'DELIVERED'].includes(selectedOrder.status) ? "bg-emerald-100 text-emerald-600" : "bg-primary/5 text-primary"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-12">
            {/* 1. Product Details Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Box size={18} className="text-primary" /> Product Details
                </h3>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  {selectedOrder.items?.length || 0} Items
                </span>
              </div>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => navigate(`/product/${item.product?.id}`)}
                    className="glass p-6 rounded-[32px] border border-white/60 shadow-xl flex flex-col md:flex-row items-center gap-6 group cursor-pointer hover:border-primary/20 transition-all bg-white/50"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-500 bg-slate-100">
                      <img
                        src={typeof item.product?.images?.[0] === 'object' ? item.product.images[0].url : (item.product?.images?.[0] || 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80')}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80'; }}
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">
                          {item.product?.category}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{item.product?.title}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                        <span className="text-slate-400">Unit:</span> ₹{item.price?.toLocaleString()}
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-slate-400">Total:</span> <span className="text-primary">₹{item.total?.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2 & 3. Side-by-Side: Payment & Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Payment Details (Document Style) */}
              <section className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <ShoppingBag size={18} className="text-primary" /> Payment Details
                </h3>
                <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex flex-col h-full">
                  <div className="space-y-3 font-mono text-sm border-b border-slate-100 pb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Price:</span>
                      <span className="text-slate-900 font-black">₹{selectedOrder.subtotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Tax:</span>
                      <span className="text-slate-900 font-black">₹{selectedOrder.gst_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Shipping:</span>
                      <span className="text-slate-900 font-black">₹{selectedOrder.shipping_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-6 flex justify-between items-center mt-auto">
                    <span className="text-primary uppercase tracking-[0.2em] text-[10px] font-black">Total Amount:</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{selectedOrder.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </section>

              {/* Customer Details */}
              <section className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <UserIcon size={18} className="text-primary" /> Customer Details
                </h3>
                <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm space-y-6 h-full flex flex-col">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white text-lg font-black shrink-0 shadow-lg">
                      {(selectedOrder.user?.name || selectedOrder.user?.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Username</p>
                      <p className="text-sm font-black text-slate-900 truncate">{selectedOrder.user?.name || 'Customer'}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate italic">{selectedOrder.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <Phone size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs font-black text-slate-900">{selectedOrder.phone || selectedOrder.user?.phone}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs font-bold text-slate-600 leading-relaxed">
                        {selectedOrder.shipping_address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.zip_code}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 mt-auto">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                      Verified Delivery
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Sidebar (1/3) Sticky Milestones */}
          <div className="lg:col-span-1 space-y-8 sticky top-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock size={14} className="text-primary" /> Production Pipeline
              </h3>
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
                {selectedOrder.milestones?.sort((a, b) => a.step_order - b.step_order).map((m, mIdx) => {
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
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-[28px] shadow-sm w-fit">
        {[
          { id: 'all', label: 'Active Orders', count: stats.all },
          { id: 'completed', label: 'Delivered / Completed', count: stats.completed },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            {tab.label}
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[8px] font-black",
              activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="glass rounded-[32px] border border-white/60 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
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
                        <p className="text-xs font-black text-foreground">{order.order_id}</p>
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
                      <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{order.user?.name || 'Unknown User'}</p>
                      <p className="text-[10px] text-muted-foreground font-bold italic">@{order.user?.email.split('@')[0]}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-black text-foreground">{order.phone || order.user?.phone}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col max-w-[200px]">
                      <p className="text-[10px] font-black text-foreground line-clamp-1">{order.shipping_address}</p>
                      <p className="text-[9px] text-muted-foreground font-bold">{order.city}, {order.state}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img
                          src={typeof order.items?.[0]?.product?.images?.[0] === 'object' ? order.items[0].product.images[0].url : (order.items?.[0]?.product?.images?.[0] || 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80')}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=400&q=80'; }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground truncate max-w-[120px]">{order.items?.[0]?.product?.title || 'Unknown'}</p>
                        {order.items?.length > 1 && (
                          <p className="text-[8px] font-black text-primary uppercase">+{order.items.length - 1} more items</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      ['completed', 'DELIVERED'].includes(order.status) ? "bg-emerald-100 text-emerald-600" :
                        ['shipped', 'SHIPPED'].includes(order.status) ? "bg-blue-100 text-blue-600" :
                          ['printing', 'PROCESSING'].includes(order.status) ? "bg-purple-100 text-purple-600" :
                            "bg-yellow-100 text-yellow-600"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all">
                      View Details
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
