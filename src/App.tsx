/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminReviews from './pages/AdminReviews';
import WhatsAppButton from './components/WhatsAppButton';
import FloatingCallButton from './components/FloatingCallButton';
import BackToTop from './components/BackToTop';
import { useEffect, ReactNode } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ADMIN_EMAIL } from './constants';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />;
  
  return <>{children}</>;
}


function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="relative bg-white min-h-screen overflow-x-hidden selection:bg-gold/30">
      {!isAdminPage && <Navbar />}
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/reviews" element={<PageWrapper><Reviews /></PageWrapper>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <PageWrapper><AdminDashboard /></PageWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/menu" 
              element={
                <ProtectedRoute>
                  <PageWrapper><AdminMenu /></PageWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reviews" 
              element={
                <ProtectedRoute>
                  <PageWrapper><AdminReviews /></PageWrapper>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AnimatePresence>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
      {!isAdminPage && <FloatingCallButton />}
      {!isAdminPage && <BackToTop />}
    </div>
  );
}


export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}


