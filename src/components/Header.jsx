import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, ChevronDown, User, LogOut, Package, Shield, ShoppingCart } from 'lucide-react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Cart } from '@/api/entities';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc', label: 'Name A → Z' },
];

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const viewMode = searchParams.get('view') || 'grid';
  const sortBy = searchParams.get('sort') || 'newest';

  const currentSort = sortOptions.find(s => s.value === sortBy) || sortOptions[0];
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStore = location.pathname === '/';
  
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchCartCount = async () => {
      try {
        const items = await Cart.list();
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (err) {
        console.error('Failed to fetch cart count', err);
      }
    };

    fetchCartCount();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [user]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    <header className="sticky top-0 z-10 px-6 py-3 glass border-b border-white/50 flex items-center justify-between gap-4 h-[64px]">
      {/* Search - Only on store page */}
      <div className="flex-1 max-w-xl relative">
        {isStore && (
          <>
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search 3D models..."
              value={search}
              onChange={e => updateParam('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-white/60 backdrop-blur-sm border border-white/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 placeholder:text-muted-foreground/60 transition-all"
            />
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* State specific controls */}
        {/* Cart Button */}
        {user && (
          <button 
            onClick={() => navigate('/cart')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 border border-white/70 shadow-sm hover:scale-105 transition-all text-primary relative"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* User Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 border border-white/70 shadow-sm hover:scale-105 transition-all text-primary overflow-hidden">
              {user ? (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                   {user.email.substring(0, 2).toUpperCase()}
                </div>
              ) : (
                <User size={18} />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-strong border-white/60 shadow-xl min-w-[200px]">
            {user ? (
              <>
                <DropdownMenuLabel className="pb-0">
                  <p className="text-sm font-bold truncate">{user.email}</p>
                  <p className="text-[10px] text-muted-foreground font-normal">{user.phone}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/40 my-2" />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer gap-2.5">
                  <User size={15} className="text-primary" /> My Profile
                </DropdownMenuItem>
                {user.is_admin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer gap-2.5">
                    <Shield size={15} className="text-primary" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer gap-2.5">
                  <Package size={15} className="text-primary" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/40" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer gap-2.5 text-destructive focus:text-destructive">
                  <LogOut size={15} /> Sign Out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => navigate('/login')} className="cursor-pointer font-semibold">
                  Sign In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/register')} className="cursor-pointer">
                  Create Account
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
