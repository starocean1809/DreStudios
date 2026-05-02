import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';
import { Orders } from '@/api/entities';
import { cn } from '@/lib/utils';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Auto-update every 5 seconds for "instant" feel
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
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

  if (loading) return null;

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground">Track your 3D print progress</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="glass h-64 rounded-3xl flex flex-col items-center justify-center text-muted-foreground border-dashed border-2">
            <Inbox size={48} className="mb-4 opacity-10" />
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm">Browse our store to start your first 3D print!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-strong p-8 rounded-[2rem] border border-white/60 shadow-xl overflow-hidden relative"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
                          Status: {order.status}
                        </span>
                        <h3 className="text-2xl font-bold text-foreground">{order.product?.title || '3D Print Order'}</h3>
                        <p className="text-sm text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-tighter">Total Price</p>
                        <p className="text-2xl font-black text-foreground">₹{order.product?.price?.toFixed(2) || '29.99'}</p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white/30 rounded-2xl p-4 border border-white/40 mb-8 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Shipping To</p>
                        <p className="text-sm font-bold text-foreground">
                          {order.shipping_address}, {order.city} {order.zip_code}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8 relative pl-1">
                      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-muted/20" />
                      {order.milestones.map((m) => (
                        <div key={m.id} className="relative flex gap-6">
                          <div className={cn(
                            "w-8 h-8 rounded-full border-2 flex-shrink-0 z-10 transition-all flex items-center justify-center",
                            m.completed 
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                              : "bg-white border-muted/20 text-muted/40"
                          )}>
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <p className={cn("text-base font-bold", m.completed ? "text-foreground" : "text-muted-foreground/50")}>{m.label}</p>
                            <p className="text-xs text-muted-foreground leading-tight max-w-sm">{m.description}</p>
                            {m.completed_at && (
                              <p className="text-[10px] text-primary/70 font-semibold mt-1">Confirmed at {new Date(m.completed_at).toLocaleTimeString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-64 flex flex-col gap-4">
                    <div className="aspect-square rounded-2xl bg-white/50 border border-white/60 p-2 overflow-hidden">
                       <img src={order.product?.images?.[0] || 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80'} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="glass p-4 rounded-2xl border border-white/40">
                      <p className="text-xs font-bold text-muted-foreground mb-1">Product Details</p>
                      <p className="text-sm font-bold text-foreground">{order.product?.title}</p>
                      <p className="text-[11px] text-muted-foreground">{order.product?.description || 'Premium 3D printed model.'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
