import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  DollarSign,
  Truck,
  Settings,
  Calendar,
  ArrowUpRight,
  Download,
  Search,
  ChevronDown,
  Box
} from 'lucide-react';
import { Invoices, Settings as SettingsAPI } from '@/api/entities';
import { cn } from '@/lib/utils';

const StatCard = ({ icon: Icon, label, value, trend, colorClass, isCurrency = true }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-full">
    <div className="flex items-start justify-between">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorClass)}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
          <TrendingUp size={10} /> {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">
        {isCurrency ? `₹${value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `${value} Units`}
      </p>
    </div>
  </div>
);

export default function AdminInvoices() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState({ gst_rate: '18', shipping_fee: '250' });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const invoiceStats = await Invoices.getStats();
      setStats(invoiceStats);

      try {
        const currentSettings = await SettingsAPI.get();
        if (Object.keys(currentSettings).length === 0) {
          await SettingsAPI.init();
          const initialized = await SettingsAPI.get();
          setSettings(initialized);
        } else {
          setSettings(currentSettings);
        }
      } catch (err) {
        // If it fails (e.g. table doesn't exist yet), try to init
        console.log("Settings not found, initializing...");
        await SettingsAPI.init();
        const initialized = await SettingsAPI.get();
        setSettings(initialized);
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await SettingsAPI.update(settings);
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to update settings");
    } finally {
      setUpdating(false);
    }
  };

  const currentMonthData = stats?.monthly_data?.find(m => m.month_idx === selectedMonth) || {
    total_revenue: 0, total_gst: 0, total_shipping: 0, total_invoices: 0
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-12 pb-20">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-primary" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Financial Management</p>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Invoices & Tax Records</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="appearance-none bg-white border border-slate-200 px-6 py-3 pr-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-sm hover:border-primary/20"
              >
                {stats?.monthly_data?.map(m => (
                  <option key={m.month_idx} value={m.month_idx}>{m.month} {stats.year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" size={16} />
            </div>
            <button className="p-3 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
              <Download size={20} />
            </button>
          </div>
        </header>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard
            icon={Box}
            label="Total Products Sold"
            value={currentMonthData.total_products}
            isCurrency={false}
            colorClass="bg-blue-50 text-blue-500"
          />
          <StatCard
            icon={DollarSign}
            label="Product Revenue"
            value={currentMonthData.total_subtotal}
            colorClass="bg-indigo-50 text-indigo-500"
          />
          <StatCard
            icon={FileText}
            label="Total GST (18%)"
            value={currentMonthData.total_gst}
            colorClass="bg-purple-50 text-purple-500"
          />
          <StatCard
            icon={Truck}
            label="Shipping Revenue"
            value={currentMonthData.total_shipping}
            colorClass="bg-amber-50 text-amber-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Monthly Revenue"
            value={currentMonthData.total_revenue}
            colorClass="bg-emerald-50 text-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main Table: Monthly Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <Calendar size={18} className="text-primary" /> Monthly Statement
              </h3>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Month</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Units Sold</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Rev</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">GST Collected</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Net Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.monthly_data?.map((m) => (
                    <tr
                      key={m.month_idx}
                      className={cn(
                        "group transition-all cursor-pointer",
                        selectedMonth === m.month_idx ? "bg-primary/5" : "hover:bg-slate-50"
                      )}
                      onClick={() => setSelectedMonth(m.month_idx)}
                    >
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-900">{m.month}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{stats.year}</p>
                      </td>
                      <td className="px-8 py-5 text-center text-sm font-black text-slate-600">
                        {m.total_products}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-indigo-600">
                        ₹{m.total_subtotal?.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-purple-600">
                        ₹{m.total_gst?.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <p className="text-sm font-black text-slate-900">₹{m.total_revenue?.toLocaleString()}</p>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Verified</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar: Global Settings */}
          <div className="lg:col-span-1 space-y-6 sticky top-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <Settings size={18} className="text-primary" /> Tax & Shipping
            </h3>

            <form
              onSubmit={handleUpdateSettings}
              className="bg-slate-900 p-8 rounded-[48px] shadow-2xl text-white space-y-8"
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global GST Rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={settings.gst_rate}
                      onChange={(e) => setSettings({ ...settings, gst_rate: e.target.value })}
                      className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
                      placeholder="18"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 text-sm font-black">%</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fixed Shipping Fee (₹)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={settings.shipping_fee}
                      onChange={(e) => setSettings({ ...settings, shipping_fee: e.target.value })}
                      className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
                      placeholder="250"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 text-sm font-black">₹</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                  * Note: Changes to these values will reflect immediately in the checkout cart for all customers.
                </p>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-primary py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Global Changes'}
              </button>
            </form>

            {/* Total Yearly Recap */}
            <div className="bg-emerald-500 p-8 rounded-[48px] shadow-xl text-white">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Annual Net Revenue</p>
              <p className="text-4xl font-black tracking-tighter">₹{stats?.totals?.revenue?.toLocaleString()}</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  Total GST: ₹{stats?.totals?.gst?.toLocaleString()}
                </div>
                <TrendingUp size={20} className="text-white/40" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
