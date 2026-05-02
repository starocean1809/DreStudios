import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutGrid, Palette, GraduationCap, Shirt, Wrench,
  Flower2, Hammer, Home, ChevronLeft, ChevronRight, Package,
  ShoppingBag, Shield, User, ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
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
    navigate(`/?category=${encodeURIComponent(catId)}`);
  };

  const NavItem = ({ icon: Icon, label, isActive, onClick, colorClass = "" }) => (
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
      <Icon size={18} className={cn("flex-shrink-0", isActive && "text-primary")} />
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
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
          <NavItem 
            icon={Home} 
            label="Browse Shop" 
            isActive={isStore} 
            onClick={() => navigate('/')} 
          />
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
          />
          {user?.is_admin && (
            <NavItem 
              icon={Shield} 
              label="Admin Panel" 
              isActive={location.pathname === '/admin'} 
              onClick={() => navigate('/admin')} 
              colorClass="text-primary"
            />
          )}
        </div>

        {/* Categories (Only if in store) */}
        {isStore && (
          <div className="space-y-1 pt-4 border-t border-white/30">
            {!collapsed && <p className="px-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Categories</p>}
            {categories.map((cat) => (
              <NavItem
                key={cat.id}
                icon={cat.icon}
                label={cat.label}
                isActive={activeCategory === cat.id}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        )}
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
