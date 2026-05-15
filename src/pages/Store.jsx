import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import Footer from '@/components/Footer';
import { Query } from '@/api/entities';
import { categories } from '@/components/Sidebar';
import { LayoutGrid, Package } from 'lucide-react';
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from '@/lib/utils';

export default function Store() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync with URL params
  const activeCategory = searchParams.get('category') || 'All Products';
  const search = searchParams.get('search') || '';
  const viewMode = searchParams.get('view') || 'grid';
  const sortBy = searchParams.get('sort') || 'newest';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all once to get categories if not done yet
      let allData = allProducts;
      if (allData.length === 0) {
        allData = await Query.list();
        setAllProducts(allData);
      }

      const data = await Query.list({
        category: activeCategory,
        search,
        sortBy,
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search, sortBy, allProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryClick = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'All Products') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    navigate(`/?${newParams.toString()}`);
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto px-6 py-6 pei-grid-bg">
        
        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-2 pb-4 mb-6 border-b border-white/40">
          {/* Always show "All Products" */}
          {[
            { id: 'All Products', label: 'All Products', icon: LayoutGrid },
            ...Array.from(new Set(allProducts.map(p => p.category))).map(cat => ({
              id: cat,
              label: cat,
              icon: categories.find(c => c.label === cat)?.icon || Package
            }))
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm border",
                  isActive 
                    ? "bg-primary text-white border-primary shadow-primary/20" 
                    : "bg-white/60 text-slate-500 hover:bg-white/90 border-white/70 hover:text-primary hover:border-primary/20"
                )}
              >
                <Icon size={12} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <LoadingScreen />
        ) : products.length === 0 ? (
          <EmptyState category={activeCategory} />
        ) : (
          <AnimatePresence mode="popLayout">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3 max-w-3xl"
              >
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
      
      <Footer />
    </>
  );
}
