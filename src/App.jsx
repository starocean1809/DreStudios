import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Store from '@/pages/Store';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ResetPassword from '@/pages/ResetPassword';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminAnalytics from '@/pages/AdminAnalytics';
import UserOrders from '@/pages/UserOrders';
import CartPage from '@/pages/Cart';
import ProductDetails from '@/pages/ProductDetails';
import Profile from '@/pages/Profile';
import AdminOrders from '@/pages/AdminOrders';
import OrderSuccess from '@/pages/OrderSuccess';
import Checkout from '@/pages/Checkout';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" />;
  
  return children;
}

function MainLayout({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen w-full bg-[#f8f9ff] text-foreground font-sans selection:bg-primary/20">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
      />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Store />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/product/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <MainLayout>
                <UserOrders />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/order-success/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <OrderSuccess />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute>
              <MainLayout>
                <CartPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute>
              <MainLayout>
                <Checkout />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <MainLayout>
                <AdminAnalytics />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly>
              <MainLayout>
                <AdminOrders />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
