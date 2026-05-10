import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Calendar, 
  MapPin, 
  Edit3, 
  LogOut, 
  CheckCircle2, 
  Save, 
  X,
  Truck,
  Hash
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Auth } from '@/api/entities';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { user, logout, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    flat_no: '',
    street_name: '',
    area_name: '',
    place: '',
    district: '',
    state: '',
    pincode: '',
    profile_image: ''
  });

  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        flat_no: user.flat_no || '',
        street_name: user.street_name || '',
        area_name: user.area_name || '',
        place: user.place || '',
        district: user.district || '',
        state: user.state || '',
        pincode: user.pincode || '',
        profile_image: user.profile_image || ''
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_image: reader.result }));
        // Automatically save image when selected or wait for save button?
        // Let's just update the state and let them click save.
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Auth.updateProfile(formData);
      // We might need to refresh the user context here
      // But typically AuthContext might need a refresh function
      window.location.reload(); // Quickest way to refresh user context
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground">Account Settings</h1>
            <p className="text-muted-foreground font-medium">Personalize your experience and manage delivery details</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-sm border",
                isEditing 
                  ? "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200" 
                  : "bg-white border-primary/10 text-primary hover:bg-primary/5"
              )}
            >
              {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-destructive/5 text-destructive border border-destructive/10 hover:bg-destructive hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full">
          {/* Top Section: Summary Card */}
          <div className="w-full space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong p-8 rounded-[40px] border border-white/60 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-transparent -z-10" />
              
              <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl border-4 border-white flex items-center justify-center font-black text-4xl text-primary overflow-hidden relative">
                  {formData.profile_image ? (
                    <img src={formData.profile_image} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    user.email.substring(0, 2).toUpperCase()
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-primary text-white shadow-lg hover:scale-110 transition-all border-4 border-[#fafbff]"
                >
                  <Camera size={16} />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-black text-foreground truncate max-w-[200px]">{user.name || user.email.split('@')[0]}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                    {user.is_admin ? 'Admin' : 'Member'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                    ID: #{user.id}
                  </span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 w-full grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-500 uppercase">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Level</p>
                  <p className="text-xs font-black text-slate-900 uppercase">Verified</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-[32px] border border-white/60 shadow-lg bg-white/40 space-y-4"
            >
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} className="text-primary" /> Security Overview
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Password</span>
                  <button 
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      try {
                        setIsSaving(true);
                        await Auth.requestPasswordReset(user.email);
                        alert('Password reset link has been sent to your email.');
                      } catch (err) {
                        alert(err.message || 'Failed to send reset link');
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    className="text-[10px] font-black text-primary uppercase cursor-pointer hover:underline disabled:opacity-50"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Two-Factor</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase">Disabled</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section: Form Sections */}
          <div className="w-full">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Personal Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-8 md:p-10 rounded-[40px] border border-white/60 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <h3 className="text-xl font-black text-foreground">Personal Information</h3>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                      isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                    )}>
                      <UserIcon size={18} className="text-primary/40" />
                      {isEditing ? (
                        <input 
                          type="text"
                          className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm font-bold text-foreground">{user.name || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                    <div className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                      isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                    )}>
                      <Phone size={18} className="text-primary/40" />
                      {isEditing ? (
                        <input 
                          type="text"
                          className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm font-bold text-foreground">{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                      isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                    )}>
                      <Mail size={18} className="text-primary/40" />
                      {isEditing ? (
                        <input 
                          type="email"
                          className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-8 md:p-10 rounded-[40px] border border-white/60 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-xl font-black text-foreground">Shipping Details</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Flat No / Door No</label>
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                      )}>
                        <MapPin size={18} className="text-primary/40" />
                        {isEditing ? (
                          <input 
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                            value={formData.flat_no}
                            onChange={e => setFormData({...formData, flat_no: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-bold text-foreground">{user.flat_no || '—'}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Name</label>
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                      )}>
                        <MapPin size={18} className="text-primary/40" />
                        {isEditing ? (
                          <input 
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                            value={formData.street_name}
                            onChange={e => setFormData({...formData, street_name: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-bold text-foreground">{user.street_name || '—'}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Area Name</label>
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                      )}>
                        <MapPin size={18} className="text-primary/40" />
                        {isEditing ? (
                          <input 
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                            value={formData.area_name}
                            onChange={e => setFormData({...formData, area_name: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-bold text-foreground">{user.area_name || '—'}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Place / City</label>
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                      )}>
                        <MapPin size={18} className="text-primary/40" />
                        {isEditing ? (
                          <input 
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                            value={formData.place}
                            onChange={e => setFormData({...formData, place: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-bold text-foreground">{user.place || '—'}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">District</label>
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                      )}>
                        <MapPin size={18} className="text-primary/40" />
                        {isEditing ? (
                          <input 
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                            value={formData.district}
                            onChange={e => setFormData({...formData, district: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-bold text-foreground">{user.district || '—'}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                      )}>
                        <MapPin size={18} className="text-primary/40" />
                        {isEditing ? (
                          <input 
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                            value={formData.state}
                            onChange={e => setFormData({...formData, state: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-bold text-foreground">{user.state || '—'}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
                      <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        isEditing ? "bg-white border-primary/20 ring-4 ring-primary/5" : "bg-slate-50/50 border-slate-100"
                      )}>
                        <Hash size={18} className="text-primary/40" />
                        {isEditing ? (
                          <input 
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-foreground"
                            value={formData.pincode}
                            onChange={e => setFormData({...formData, pincode: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-bold text-foreground">{user.pincode || '—'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-10 pt-8 border-t border-slate-100 flex justify-end"
                    >
                      <button 
                        disabled={isSaving}
                        type="submit"
                        className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><Save size={16} /> Save Changes</>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for conditional classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
