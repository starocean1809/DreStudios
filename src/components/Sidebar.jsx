import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutGrid, Palette, GraduationCap, Shirt, Wrench,
  Flower2, Hammer, Home, ChevronLeft, ChevronRight, Package,
  ShoppingBag, Shield, User, ShoppingCart, Clock, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const categories = [
  { id: 'All Products', label: 'All Products', icon: LayoutGrid },
  { id: 'Art', label: 'Art', icon: Palette },
  { id: 'Education', label: 'Education', icon: GraduationCap },
  { id: 'Mechanical', label: 'Mechanical', icon: Wrench },
  { id: 'Decoration', label: 'Decoration', icon: Flower2 },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All Products';

  const isStore = location.pathname === '/';

  const handleCategoryClick = (catId) => {
    if (catId === 'All Products') {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(catId)}`);
    }
  };

  const [availableCategories, setAvailableCategories] = React.useState([]);
  const [cartCount, setCartCount] = React.useState(0);

  const fetchCartCount = async () => {
    try {
      const data = await fetch('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json());
      const totalCount = data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    const fetchAvailableCategories = async () => {
      try {
        const data = await fetch('http://localhost:5000/api/products').then(res => res.json());
        const uniqueCats = Array.from(new Set(data.map(p => p.category)));
        setAvailableCategories(uniqueCats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAvailableCategories();
    fetchCartCount();

    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, []);

  const NavItem = ({ icon: Icon, label, isActive, onClick, badge = null, colorClass = "" }) => (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 relative group",
        isActive 
          ? "text-primary bg-primary/10" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/40",
        collapsed && "justify-center px-0",
        colorClass
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeBar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"
        />
      )}
      <div className="relative">
        <Icon size={18} className={cn("flex-shrink-0", isActive && "text-primary")} />
        {collapsed && badge !== null && badge > 0 && (
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-white text-[8px] font-black flex items-center justify-center border-2 border-white">
            {badge}
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="flex-1 flex items-center justify-between overflow-hidden">
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
          {badge !== null && badge > 0 && (
            <span className="bg-primary/20 text-primary text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
              {badge}
            </span>
          )}
        </div>
      )}
    </button>
  );

  return (
    <aside
      className="transition-sidebar flex flex-col h-full glass-strong border-r border-white/60 relative z-20"
      style={{ width: collapsed ? '68px' : '220px', minWidth: collapsed ? '68px' : '220px' }}
    >
      {/* Logo */}
      <div 
        onClick={() => navigate('/')}
        className={cn("flex items-center gap-3 p-4 border-b border-white/40 cursor-pointer hover:bg-white/20 transition-colors", collapsed && "justify-center")}
      >
        <div
          className="rounded-xl overflow-hidden flex-shrink-0 shadow-md transform group-hover:rotate-12 transition-transform"
          style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, hsl(250,55%,88%), hsl(200,70%,88%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Package size={20} className="text-primary" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <p className="font-bold text-sm text-foreground leading-tight">Dre Studios</p>
            <p className="text-[10px] text-primary/60 font-bold uppercase tracking-tighter">3D Printing</p>
          </motion.div>
        )}
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 no-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-1">
          {user?.is_admin ? (
            <>
              <NavItem 
                icon={BarChart3} 
                label="Dashboard" 
                isActive={location.pathname === '/admin'} 
                onClick={() => navigate('/admin')} 
                colorClass="text-primary font-bold"
              />
              <NavItem 
                icon={Shield} 
                label="Products Details" 
                isActive={location.pathname === '/admin/products'} 
                onClick={() => navigate('/admin/products')} 
                colorClass="text-primary font-bold"
              />
              <NavItem 
                icon={Clock} 
                label="Order Requests" 
                isActive={location.pathname === '/admin/orders'} 
                onClick={() => navigate('/admin/orders')} 
                colorClass="text-primary font-bold"
              />
              <NavItem 
                icon={User} 
                label="My Profile" 
                isActive={location.pathname === '/profile'} 
                onClick={() => navigate('/profile')} 
              />
              <NavItem 
                icon={Home} 
                label="All Categories" 
                isActive={isStore} 
                onClick={() => navigate('/')} 
              />
            </>
          ) : (
            <>
              <NavItem 
                icon={Home} 
                label="All Categories" 
                isActive={isStore && activeCategory === 'All Products'} 
                onClick={() => handleCategoryClick('All Products')} 
              />

              {/* Sub-menu for available categories */}
              {!collapsed && availableCategories.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pl-9 space-y-1 mt-1 border-l-2 border-primary/5 ml-4"
                >
                  {availableCategories.map(cat => {
                    const isActive = activeCategory === cat;
                    const catInfo = categories.find(c => c.label === cat);
                    const Icon = catInfo?.icon || Package;
                    
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={cn(
                          "w-full flex items-center gap-3 py-2 text-[11px] font-black uppercase tracking-widest transition-all hover:text-primary",
                          isActive ? "text-primary" : "text-slate-400"
                        )}
                      >
                        <div className={cn(
                          "w-1 h-1 rounded-full",
                          isActive ? "bg-primary scale-150" : "bg-slate-300"
                        )} />
                        {cat}
                      </button>
                    );
                  })}
                </motion.div>
              )}

              <NavItem 
                icon={ShoppingBag} 
                label="My Orders" 
                isActive={location.pathname === '/orders'} 
                onClick={() => navigate('/orders')} 
              />
              <NavItem 
                icon={ShoppingCart} 
                label="My Cart" 
                isActive={location.pathname === '/cart'} 
                onClick={() => navigate('/cart')} 
                badge={cartCount}
              />
              <NavItem 
                icon={User} 
                label="My Profile" 
                isActive={location.pathname === '/profile'} 
                onClick={() => navigate('/profile')} 
              />
            </>
          )}
        </div>

      </div>

      {/* Toggle button */}
      <div className="p-3 border-t border-white/40">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-8 rounded-lg hover:bg-white/50 transition-colors text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
