import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, CheckCircle2, Clock, Truck, 
  ChevronRight, Search, Filter, AlertCircle,
  BarChart3, Users, Settings, Plus, MapPin, Phone, Mail
} from 'lucide-react';
import { Orders } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AddProductModal from '@/components/AddProductModal';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [selectedOrder?.id]); // Re-run if selected order changes to keep focus logic clean

  const fetchOrders = async () => {
    try {
      const data = await Orders.list();
      setOrders(data);
      setSelectedOrder(prev => {
        if (!prev) return null;
        return data.find(o => o.id === prev.id) || prev;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [editingMilestone, setEditingMilestone] = useState(null);

  const handleUpdateMilestone = async (orderId, mId, updateData) => {
    // Make update instantly visible!
    setSelectedOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      const newMilestones = prev.milestones.map(m => 
        m.id === mId ? { ...m, ...updateData } : m
      );
      return { ...prev, milestones: newMilestones };
    });

    try {
      await Orders.updateMilestone(orderId, mId, updateData);
      fetchOrders(); // Refresh background
      setEditingMilestone(null);
    } catch (err) {
      alert(err.message);
      fetchOrders(); // Revert on fail
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    // Perform an optimistic cascade on the milestones local state!
    let targetSteps = 0;
    if (newStatus === 'pending') targetSteps = 1;
    else if (newStatus === 'preparing') targetSteps = 2;
    else if (newStatus === 'printing') targetSteps = 3;
    else if (newStatus === 'shipped' || newStatus === 'completed') targetSteps = 5;

    setSelectedOrder(prev => {
      if (!prev) return null;
      // If the data does not have step_order, fallback to hardcoded indexes
      const newMilestones = prev.milestones.map((m, idx) => {
        const step = m.step_order !== undefined && m.step_order !== null && m.step_order !== 0 ? m.step_order : idx;
        return {
          ...m,
          completed: step < targetSteps,
          completed_at: step < targetSteps ? (m.completed_at || new Date().toISOString()) : null
        };
      });
      return { ...prev, status: newStatus, milestones: newMilestones };
    });

    try {
      await Orders.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert(err.message);
      fetchOrders();
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-foreground">Admin Command</h1>
            <p className="text-muted-foreground font-medium">Control inventory and fulfill 3D print orders</p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> New Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-primary' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-orange-500' },
            { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, icon: Truck, color: 'text-green-500' },
            { label: 'Store Items', value: 'Live', icon: BarChart3, color: 'text-blue-500' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-6 rounded-3xl border border-white/60 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl bg-white/50 shadow-inner", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-black text-foreground ml-2">Shipment Queue</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <motion.button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "w-full text-left p-5 rounded-[28px] border transition-all duration-300 flex items-center justify-between",
                    selectedOrder?.id === order.id 
                      ? "glass-strong border-primary/30 shadow-xl ring-2 ring-primary/10" 
                      : "glass border-white/60 hover:bg-white/80"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                      <img src={order.product?.images?.[0]} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-foreground leading-tight">{order.product?.title}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mt-1">
                        #{order.id.toString().padStart(4, '0')} • {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                      order.status === 'pending' ? "bg-orange-500/10 text-orange-600" : 
                      order.status === 'printing' ? "bg-blue-500/10 text-blue-600" :
                      "bg-green-500/10 text-green-600"
                    )}>
                      {order.status}
                    </span>
                    <ChevronRight size={18} className={cn("text-muted-foreground/40 transition-transform", selectedOrder?.id === order.id && "translate-x-1 text-primary")} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-strong p-8 rounded-[40px] border border-white/60 shadow-2xl sticky top-8"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-foreground">Order Details</h3>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Manage fulfillment roadmap</p>
                    </div>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      className="bg-white border-white/60 rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="printing">Printing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Customer Block */}
                  <div className="bg-white/40 rounded-3xl p-6 border border-white/60 mb-8 space-y-4 shadow-inner">
                    <div className="flex items-start gap-4">
                       <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Shipping Address</p>
                         <p className="text-sm font-bold text-foreground leading-snug mt-1">
                           {selectedOrder.shipping_address}<br/>
                           {selectedOrder.city}, {selectedOrder.zip_code}
                         </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <Mail size={18} className="text-primary flex-shrink-0" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email</p>
                         <p className="text-sm font-bold text-foreground truncate">{selectedOrder.user?.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <Phone size={18} className="text-primary flex-shrink-0" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Contact</p>
                         <p className="text-sm font-bold text-foreground">{selectedOrder.user?.phone}</p>
                       </div>
                    </div>
                  </div>
                  
                  {/* Milestones */}
                  <div className="space-y-6 relative ml-2">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-primary/10" />
                    {selectedOrder.milestones.map((m) => (
                      <div key={m.id} className="relative flex gap-5 group">
                        <button
                          onClick={() => handleUpdateMilestone(selectedOrder.id, m.id, { completed: !m.completed })}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 flex-shrink-0 z-10 transition-all flex items-center justify-center shadow-sm",
                            m.completed 
                              ? "bg-primary border-primary text-white scale-110" 
                              : "glass border-white/80 text-muted-foreground/30 hover:border-primary/50"
                          )}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        
                        <div className="pt-0.5 flex-1">
                          {editingMilestone === m.id ? (
                            <div className="bg-white/60 p-3 rounded-2xl border border-primary/20 space-y-2">
                              <input 
                                className="w-full bg-transparent border-b border-primary/20 focus:outline-none text-sm font-black uppercase tracking-tight"
                                defaultValue={m.label}
                                onBlur={(e) => handleUpdateMilestone(selectedOrder.id, m.id, { label: e.target.value })}
                                autoFocus
                              />
                              <textarea 
                                className="w-full bg-transparent text-[11px] text-muted-foreground font-medium leading-tight focus:outline-none resize-none"
                                defaultValue={m.description}
                                onBlur={(e) => handleUpdateMilestone(selectedOrder.id, m.id, { description: e.target.value })}
                              />
                            </div>
                          ) : (
                            <div 
                              className="cursor-pointer hover:bg-primary/5 p-2 rounded-xl transition-all"
                              onClick={() => setEditingMilestone(m.id)}
                            >
                              <p className={cn("text-sm font-black uppercase tracking-tight", m.completed ? "text-foreground" : "text-muted-foreground opacity-40")}>{m.label}</p>
                              <p className="text-[11px] text-muted-foreground font-medium leading-tight">{m.description}</p>
                              {m.completed_at && (
                                <p className="text-[10px] font-black text-primary/40 mt-1 uppercase tracking-tighter">Done {new Date(m.completed_at).toLocaleTimeString()}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-64 glass rounded-[40px] border border-dashed border-primary/20 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-white/20">
                  <AlertCircle size={40} className="mb-4 opacity-10" />
                  <p className="text-sm font-black uppercase tracking-widest opacity-40">Select shipment to inspect</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          alert('Product added successfully!');
        }}
      />
    </div>
  );
}
