import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Store from '@/pages/Store';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AdminDashboard from '@/pages/AdminDashboard';
import UserOrders from '@/pages/UserOrders';
import CartPage from '@/pages/Cart';
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
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Store />
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

          <Route path="/cart" element={
            <ProtectedRoute>
              <MainLayout>
                <CartPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
