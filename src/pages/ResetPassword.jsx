import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, KeyRound, ArrowRight } from 'lucide-react';
import { Auth } from '@/api/entities';
import { Button } from '@/components/ui/button';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If no token is present, we could show an error, but let's just let it be handled by submit or show early error.
  if (!token && !error && !success) {
    setError('Invalid or missing reset token.');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      return setError('Invalid or missing reset token.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const res = await Auth.resetPassword(token, formData.password);
      setSuccess(res.msg || 'Password has been reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong p-8 rounded-3xl shadow-2xl border border-white/60">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <KeyRound className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
            <p className="text-muted-foreground text-sm">Please enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 text-center font-medium">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs border border-emerald-500/20 text-center font-medium">
                {success}
                <p className="mt-1 text-[10px]">Redirecting to login...</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1">New Password</label>
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
              <label className="text-xs font-semibold text-muted-foreground ml-1">Confirm New Password</label>
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

            <Button 
              type="submit" 
              disabled={isLoading || !token || success !== ''} 
              className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-primary/20 mt-4"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
