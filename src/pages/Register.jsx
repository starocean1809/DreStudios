import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, Package, ArrowRight, User } from 'lucide-react';
import { Auth } from '@/api/entities';
import { Button } from '@/components/ui/button';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    try {
      await Auth.register(formData.email, formData.phone, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong p-8 rounded-3xl shadow-2xl border border-white/60">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <User className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground text-sm">Join Dre Studios today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 text-center text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-primary/20">
              Create Account <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/40 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account? {' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
