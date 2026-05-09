import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import Footer from '@/components/Footer';
import { Query } from '@/api/entities';

export default function Store() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync with URL params
  const activeCategory = searchParams.get('category') || 'All Products';
  const search = searchParams.get('search') || '';
  const viewMode = searchParams.get('view') || 'grid';
  const sortBy = searchParams.get('sort') || 'newest';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
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
  }, [activeCategory, search, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <main className="flex-1 overflow-y-auto px-6 py-6 pei-grid-bg">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
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
