import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, User, CheckCircle2, MapPin, Building, Map } from 'lucide-react';
import { Auth } from '@/api/entities';
import { Button } from '@/components/ui/button';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    phone: '',
    flat_no: '',
    street_name: '',
    area_name: '',
    place: '',
    district: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError('Please enter a valid email address');
    }
    
    setIsLoading(true);
    try {
      await Auth.sendOtp(formData.email);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.otp) {
      return setError('Please enter the OTP');
    }

    setIsLoading(true);
    try {
      await Auth.verifyOtp(formData.email, formData.otp);
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      return setError('Please enter a valid phone number (e.g. +91 9876543210)');
    }

    setIsLoading(true);
    try {
      await Auth.register({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        flat_no: formData.flat_no,
        street_name: formData.street_name,
        area_name: formData.area_name,
        place: formData.place,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        password: formData.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff] py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="glass-strong p-8 rounded-3xl shadow-2xl border border-white/60">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              {step === 1 ? <Mail className="text-primary w-8 h-8" /> : <User className="text-primary w-8 h-8" />}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {step === 1 ? 'Verify Email' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground text-sm text-center">
              {step === 1 
                ? 'We need to verify your email address first' 
                : 'Please provide your details to complete registration'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 text-center font-medium">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
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
                    <Button disabled={isLoading} type="submit" className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-primary/20">
                      {isLoading ? 'Sending...' : 'Send OTP'} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-sm text-center text-muted-foreground mb-4">
                      <p>OTP sent to <span className="font-semibold text-foreground">{formData.email}</span></p>
                      <p className="text-[10px] mt-2 text-destructive font-bold uppercase tracking-wider">
                        Not in your inbox? Please check your <strong>Spam</strong> folder.
                      </p>
                      <button type="button" onClick={() => setOtpSent(false)} className="text-primary mt-2 hover:underline text-xs block mx-auto">Change Email</button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground ml-1">Enter 6-digit OTP</label>
                      <div className="relative group">
                        <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          value={formData.otp}
                          onChange={(e) => setFormData({...formData, otp: e.target.value})}
                          placeholder="000000"
                          maxLength={6}
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm text-center tracking-[0.5em] font-semibold"
                          required
                        />
                      </div>
                    </div>
                    <Button disabled={isLoading} type="submit" className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-primary/20">
                      {isLoading ? 'Verifying...' : 'Verify OTP'} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground ml-1">Phone Number (+91)</label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91 9876543210"
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary" /> Address Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={formData.flat_no}
                          onChange={(e) => setFormData({...formData, flat_no: e.target.value})}
                          placeholder="Flat No / Door No"
                          className="w-full h-11 px-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={formData.street_name}
                          onChange={(e) => setFormData({...formData, street_name: e.target.value})}
                          placeholder="Street Name"
                          className="w-full h-11 px-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={formData.area_name}
                          onChange={(e) => setFormData({...formData, area_name: e.target.value})}
                          placeholder="Area Name"
                          className="w-full h-11 px-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={formData.place}
                          onChange={(e) => setFormData({...formData, place: e.target.value})}
                          placeholder="Place / City"
                          className="w-full h-11 px-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={formData.district}
                          onChange={(e) => setFormData({...formData, district: e.target.value})}
                          placeholder="District"
                          className="w-full h-11 px-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          placeholder="State"
                          className="w-full h-11 px-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                          placeholder="Pincode"
                          className="w-full h-11 px-4 rounded-xl bg-white/50 border border-white/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="text-xs font-semibold text-muted-foreground ml-1">Confirm Password</label>
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
                  </div>

                  <Button disabled={isLoading} type="submit" className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-primary/20 mt-4">
                    {isLoading ? 'Creating...' : 'Create Account'} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

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
