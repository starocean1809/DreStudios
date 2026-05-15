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
import LoadingScreen from '@/components/LoadingScreen';

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
    return <LoadingScreen />;
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

        <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-start mb-12">
          {/* Top Right: Imagery (on Laptop) / Top on Mobile */}
          <div className="w-full lg:w-[45%] space-y-4 lg:space-y-6 lg:sticky lg:top-8 order-1 lg:order-2">
            <div className="space-y-4 flex flex-col items-center">
              <div className="aspect-square w-full max-w-sm lg:max-w-none rounded-[32px] md:rounded-[40px] overflow-hidden bg-slate-900 relative shadow-2xl shadow-slate-200 group">
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
                <div className="flex gap-3 p-3 md:p-4 rounded-[24px] md:rounded-[32px] bg-white border border-slate-100 shadow-sm overflow-x-auto no-scrollbar w-full justify-start sm:justify-center">
                  {media.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 overflow-hidden transition-all flex-shrink-0",
                        activeIdx === idx ? "border-primary scale-105 shadow-xl shadow-primary/10" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      {item.type === 'video' ? (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <Film size={16} className="text-white/40" />
                        </div>
                      ) : (
                        <img src={item.url} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Left: Title, Price, Checkout (on Laptop) / Below image on Mobile */}
          <div className="w-full lg:w-[55%] order-2 lg:order-1">
            <div className="space-y-6 bg-white p-6 md:p-12 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-primary/5">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400/10 text-yellow-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-yellow-400/5">
                    <Star size={10} fill="currentColor" /> Premium Model
                  </div>
                </div>

                <h1 className="text-2xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {product.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
                    <p className="text-3xl md:text-5xl font-black text-primary">₹{product.price?.toLocaleString()}</p>
                  </div>
                  <div className="h-10 md:h-12 w-px bg-slate-200 hidden sm:block" />
                </div>

                {/* Quantity Selector */}
                {!user?.is_admin && (
                  <div className="flex flex-wrap items-center gap-4 md:gap-8 pt-4 border-t border-slate-100 mt-4">
                    <div className="space-y-2">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Quantity</p>
                      <div className="flex items-center gap-3 md:gap-4 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl p-1 md:p-1.5 w-fit">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 md:w-10 text-center text-base md:text-lg font-black text-slate-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    {/* <div className="space-y-1">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Total</p>
                      <p className="text-xl md:text-2xl font-black text-primary">₹{(product.price * quantity).toLocaleString()}</p>
                    </div> */}
                  </div>
                )}

                {/* Actions: Add to Cart & Order Now - NOW IN PRICE AREA */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      disabled={user?.is_admin || product.is_out_of_stock}
                      onClick={handleAddToCart}
                      className={cn(
                        "w-full sm:flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95",
                        (user?.is_admin || product.is_out_of_stock)
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                      )}
                    >
                      <ShoppingBag size={20} /> Add to Cart
                    </button>
                    <button
                      disabled={user?.is_admin || product.is_out_of_stock}
                      onClick={handleOrder}
                      className={cn(
                        "w-full sm:flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95",
                        (user?.is_admin || product.is_out_of_stock)
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-primary text-white hover:opacity-90 shadow-primary/30"
                      )}
                    >
                      <Truck size={20} /> Order Now
                    </button>
                  </div>
                  {user?.is_admin && (
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest text-center">
                      Shopping is disabled for admin accounts
                    </p>
                  )}
                  {product.is_out_of_stock && (
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center">
                      Currently out of stock
                    </p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-6">
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase">Inspected</p>
                      <p className="text-[7px] md:text-[8px] font-bold text-slate-400 leading-none">Quality Check</p>
                    </div>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                      <Zap size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase">Pure PLA</p>
                      <p className="text-[7px] md:text-[8px] font-bold text-slate-400 leading-none">Eco Friendly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-12 items-start">
          {/* Bottom Left: Description (on Laptop) */}
          <div className="w-full lg:w-[60%] space-y-8 bg-white p-6 md:p-12 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="space-y-6">
              <h4 className="text-[11px] md:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Info size={16} className="text-primary" /> Product Description
              </h4>
              <div className="space-y-8">
                <p className="text-lg md:text-2xl text-slate-600 leading-relaxed font-semibold italic">
                  {product.description?.split('.')[0]}.
                </p>

                <ul className="space-y-4 list-disc pl-6">
                  {product.description?.split('.').filter(s => s.trim().length > 0).slice(1).map((point, idx) => (
                    <li key={idx} className="text-sm md:text-base text-slate-700 font-bold leading-relaxed pl-2">
                      {point.trim()}.
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Right: Reviews (on Laptop) */}
          <div className="w-full lg:w-[40%] space-y-8 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reviews</h2>
                <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">Community Feedback</p>
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xl font-black text-slate-900">
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <Star size={16} fill="currentColor" className="text-yellow-400" />
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-8 text-center">
                <Star size={24} className="text-slate-200 mx-auto mb-3" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No feedback yet. Be the first to rate!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-50/50 p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] border border-primary/5">
                          {review.user_email?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{review.user_email?.split('@')[0]}</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={8}
                                className={cn(i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200")}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      "{review.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
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
