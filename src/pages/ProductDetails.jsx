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
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState({
    shipping_address: '',
    city: '',
    zip_code: ''
  });

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    if (user) {
      setAddress({
        shipping_address: user.address || '',
        city: user.city || '',
        zip_code: user.zip_code || ''
      });
    }
  }, [id, user]);

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

  const handleOrder = async (e) => {
    if (e) e.preventDefault();
    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }
    if (!address.shipping_address || !address.city || !address.zip_code) {
      alert('Please fill in all shipping details');
      return;
    }

    setIsOrdering(true);
    try {
      await Orders.create(product.id, { ...address, quantity });
      setOrderSuccess(true);
      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      alert(err.message || 'Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await Cart.add(product.id, quantity);
      setAddToCartSuccess(true);
      setTimeout(() => navigate('/cart'), 1500);
    } catch (err) {
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

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Visuals */}
          <div className="lg:w-[60%] space-y-4">
            <div className="aspect-[16/10] md:aspect-[16/9] rounded-[40px] overflow-hidden bg-slate-900 relative shadow-2xl shadow-slate-200 group">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
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
                      className="w-full h-full object-cover"
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
                      "w-20 h-20 rounded-2xl border-4 overflow-hidden transition-all flex-shrink-0",
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

          {/* Right: Info & Actions */}
          <div className="lg:w-[40%] space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/5">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400/10 text-yellow-600 text-[10px] font-black uppercase tracking-widest border border-yellow-400/5">
                  <Star size={10} fill="currentColor" /> Premium Model
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4">
                <p className="text-4xl font-black text-primary">₹{product.price?.toLocaleString()}</p>
                <div className="h-8 w-px bg-slate-200" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Status</p>
                  <p className={cn("text-xs font-black flex items-center gap-1", product.stock_count > 0 ? "text-emerald-500" : "text-red-400")}>
                    <CheckCircle2 size={12} /> {product.stock_count > 0 ? `${product.stock_count} Units Available` : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              {!user?.is_admin && product.stock_count > 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</p>
                  <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock_count, q + 1))}
                      className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">Total: <span className="text-primary font-black">₹{(product.price * quantity).toLocaleString()}</span></p>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={12} /> Model Specifications
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                  {product.description || "Expertly designed for 3D printing with high-precision PLA. This model features optimized structural integrity and exquisite surface detailing."}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase">Quality Inspected</p>
                    <p className="text-[9px] font-bold text-slate-400">100% Precision</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase">Eco Friendly</p>
                    <p className="text-[9px] font-bold text-slate-400">Pure PLA Material</p>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!showAddressForm ? (
                  <motion.div 
                    key="actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-4 pt-4"
                  >
                    <div className="flex gap-4">
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
                        onClick={() => setShowAddressForm(true)}
                        className={cn(
                          "flex-[1.5] h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2",
                          user?.is_admin 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                            : "bg-primary text-white hover:opacity-90 shadow-primary/20"
                        )}
                      >
                        <Truck size={18} /> Order Print Now
                      </button>
                    </div>
                    {user?.is_admin && (
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest text-center">
                        Shopping is disabled for admin accounts
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900">Delivery Info</h3>
                      <button onClick={() => setShowAddressForm(false)} className="text-[10px] font-black text-primary uppercase tracking-widest">Cancel</button>
                    </div>

                    {/* Order Summary */}
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-2xl px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ShoppingBag size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{product.title}</p>
                          <p className="text-[10px] font-bold text-slate-400">Qty: {quantity} unit{quantity > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-primary">₹{(product.price * quantity).toLocaleString()}</p>
                    </div>
                    
                    <form onSubmit={handleOrder} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Address</label>
                        <textarea
                          required
                          placeholder="No 123, Galle Road, Colombo"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none min-h-[100px] resize-none transition-all placeholder:text-slate-300"
                          value={address.shipping_address}
                          onChange={e => setAddress({...address, shipping_address: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                          <input
                            required
                            type="text"
                            placeholder="Colombo"
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all"
                            value={address.city}
                            onChange={e => setAddress({...address, city: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ZIP</label>
                          <input
                            required
                            type="text"
                            placeholder="00300"
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all"
                            value={address.zip_code}
                            onChange={e => setAddress({...address, zip_code: e.target.value})}
                          />
                        </div>
                      </div>
                      <button 
                        disabled={isOrdering}
                        type="submit"
                        className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center"
                      >
                        {isOrdering ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Confirm Order & Pay'}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
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
