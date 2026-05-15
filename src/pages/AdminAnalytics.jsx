import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Package, ShoppingBag, CheckCircle2, 
  TrendingUp, BarChart3, ArrowUpRight
} from 'lucide-react';
import { AdminStats } from '@/api/entities';
import LoadingScreen from '@/components/LoadingScreen';

const StatCard = ({ icon: Icon, label, value, color, delay, suffix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-strong p-4 sm:p-7 rounded-[24px] sm:rounded-[32px] border border-white/60 shadow-xl flex flex-col gap-3 sm:gap-5 relative overflow-hidden group hover:shadow-2xl transition-all"
  >
    {/* Background glow */}
    <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 blur-2xl ${color}`} />

    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${color} bg-opacity-10`}>
        <Icon size={20} className="sm:w-6 sm:h-6 text-current opacity-80" />
      </div>
      <span className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
        <ArrowUpRight size={10} /> Live
      </span>
    </div>

    <div>
      <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
      <p className="text-2xl sm:text-5xl font-black text-slate-900 tabular-nums">
        {value !== null ? value.toLocaleString() : '—'}
        {suffix && <span className="text-xs sm:text-2xl text-slate-300 ml-1">{suffix}</span>}
      </p>
    </div>
  </motion.div>
);

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await AdminStats.getOverview();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completionRate = stats
    ? stats.total_ordered > 0
      ? Math.round((stats.total_completed / stats.total_ordered) * 100)
      : 0
    : 0;

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <BarChart3 className="text-primary" size={32} /> Analytics Dashboard
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Live overview of your 3D printing business</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Live Data</span>
          </div>
        </motion.div>

        {error && (
          <div className="p-4 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Metric Cards */}
        {loading ? (
          <LoadingScreen />
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              icon={Users}
              label="Total Registered Users"
              value={stats?.total_users ?? null}
              color="bg-violet-500 text-violet-500"
              delay={0}
            />
            <StatCard
              icon={Package}
              label="Total Products Listed"
              value={stats?.total_products ?? null}
              color="bg-blue-500 text-blue-500"
              delay={0.1}
            />
            <StatCard
              icon={ShoppingBag}
              label="Total Orders Placed"
              value={stats?.total_ordered ?? null}
              color="bg-amber-500 text-amber-500"
              delay={0.2}
              suffix="orders"
            />
            <StatCard
              icon={CheckCircle2}
              label="Orders Delivered"
              value={stats?.total_completed ?? null}
              color="bg-emerald-500 text-emerald-500"
              delay={0.3}
              suffix="orders"
            />
          </div>
        )}

        {/* Completion Rate Card */}
        {!loading && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-[32px] border border-white/60 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <TrendingUp className="text-primary" size={20} /> Order Completion Rate
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-1">Completed vs total orders placed</p>
              </div>
              <span className="text-4xl font-black text-primary">{completionRate}%</span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-emerald-400 shadow-lg"
              />
            </div>

            <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>{stats.total_completed} delivered</span>
              <span>{stats.total_ordered} total orders</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
