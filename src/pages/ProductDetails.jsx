import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Film,
  ArrowLeft,
  Star,
  ShieldCheck,
  Zap,
  Info,
  Minus,
  Plus
} from 'lucide-react';
import { Query, Orders, Cart, Reviews } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import OrderSuccessAnimation from '@/components/OrderSuccessAnimation';
import AddToCartAnimation from '@/components/AddToCartAnimation';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const data = await Reviews.list(id);
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await Query.list(); // Usually we'd have a getById but list works if we filter
      const item = data.find(p => p.id.toString() === id);
      if (item) {
        setProduct(item);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const media = product?.images?.map(m => typeof m === 'string' ? { url: m, type: 'image' } : m) || [];
  const activeMedia = media[activeIdx];

  const handleOrder = (e) => {
    if (e) e.preventDefault();
    if (user?.is_admin) {
      alert('Admin accounts cannot place orders.');
      return;
    }
    navigate('/checkout', { state: { productId: product.id, quantity } });
  };

  const handleAddToCart = async () => {
    // Immediate visual feedback
    setAddToCartSuccess(true);
    setTimeout(() => setAddToCartSuccess(false), 1000); // Auto-hide animation

    try {
      await Cart.add(product.id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
      setAddToCartSuccess(false); // Hide on error
      alert(err.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fafbff]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/20 transition-all mb-8 shadow-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Shop</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left: Visuals & Secondary Info (40%) */}
          <div className="lg:w-[40%] space-y-8 sticky top-8">
            <div className="space-y-4 flex flex-col items-center">
              <div className="aspect-square w-full max-w-sm rounded-[40px] overflow-hidden bg-slate-900 relative shadow-2xl shadow-slate-200 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full p-4"
                  >
                    {activeMedia?.type === 'video' ? (
                      <video
                        src={activeMedia.url}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={activeMedia?.url}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              {media.length > 1 && (
                <div className="flex gap-4 p-4 rounded-[32px] bg-white border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                  {media.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        "w-12 h-12 rounded-xl border-2 overflow-hidden transition-all flex-shrink-0",
                        activeIdx === idx ? "border-primary scale-105 shadow-xl shadow-primary/10" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      {item.type === 'video' ? (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <Film size={20} className="text-white/40" />
                        </div>
                      ) : (
                        <img src={item.url} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shifted Info: Specs & Actions */}
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                  <button
                    disabled={user?.is_admin}
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2",
                      user?.is_admin
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                    )}
                  >
                    <ShoppingBag size={18} /> Add to Cart
                  </button>
                  <button
                    disabled={user?.is_admin}
                    onClick={handleOrder}
                    className={cn(
                      "flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2",
                      user?.is_admin
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-primary text-white hover:opacity-90 shadow-primary/20"
                    )}
                  >
                    <Truck size={18} /> Order Now
                  </button>
                </div>
                {user?.is_admin && (
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest text-center">
                    Shopping is disabled for admin accounts
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-900 uppercase">Inspected</p>
                    <p className="text-[8px] font-bold text-slate-400 leading-none">Quality Check</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-900 uppercase">Pure PLA</p>
                    <p className="text-[8px] font-bold text-slate-400 leading-none">Eco Friendly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Primary Info & Detailed Description (60%) */}
          <div className="lg:w-[60%] space-y-8">
            <div className="space-y-6 bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/5">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400/10 text-yellow-600 text-[10px] font-black uppercase tracking-widest border border-yellow-400/5">
                    <Star size={10} fill="currentColor" /> Premium Model
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {product.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
                    <p className="text-4xl font-black text-primary">₹{product.price?.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200 hidden sm:block" />
                </div>

                {/* Quantity Selector */}
                {!user?.is_admin && (
                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 mt-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Quantity</p>
                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-3xl p-1.5 w-fit">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center text-lg font-black text-slate-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Total</p>
                      <p className="text-xl font-black text-primary">₹{(product.price * quantity).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Description with Bullet Points */}
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Info size={16} className="text-primary" /> Product Description
                </h4>
                <div className="space-y-6">
                  <p className="text-lg text-slate-600 leading-relaxed font-semibold italic">
                    {product.description?.split('.')[0]}.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {product.description?.split('.').filter(s => s.trim().length > 0).slice(1).map((point, idx) => (
                      <div key={idx} className="flex gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors group">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                          <CheckCircle2 size={14} className="text-primary group-hover:text-white" />
                        </div>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">
                          {point.trim()}.
                        </p>
                      </div>
                    ))}
                    {/* Fallback if description is too short */}
                    {(!product.description || product.description.split('.').length < 2) && [
                      "Expertly optimized for high-resolution 3D printing results.",
                      "Features enhanced structural integrity for long-lasting display.",
                      "Exquisite surface detailing captured with precision PLA material.",
                      "Eco-friendly production process using 100% biodegradable materials."
                    ].map((point, idx) => (
                      <div key={idx} className="flex gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 size={14} className="text-primary" />
                        </div>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Customer Reviews</h2>
              <p className="text-muted-foreground font-medium mt-1">Verified feedback from our 3D printing community</p>
            </div>
            {reviews.length > 0 && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl font-black text-slate-900">
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <div className="flex text-yellow-400">
                    <Star size={20} fill="currentColor" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Based on {reviews.length} reviews</p>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-[40px] border border-slate-100 p-12 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mx-auto mb-4">
                <Star size={32} />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No reviews yet</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Be the first to share your experience with this model!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                        {review.user_email?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{review.user_email?.split('@')[0]}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={cn(i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200")}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    "{review.comment}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <AnimatePresence>
        {orderSuccess && <OrderSuccessAnimation />}
        {addToCartSuccess && <AddToCartAnimation />}
      </AnimatePresence>
    </div>
  );
}
