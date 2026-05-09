/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import FloatingCallButton from './components/FloatingCallButton';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import { useEffect, ReactNode, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ToastProvider } from './lib/ToastContext';
import { ADMIN_EMAIL } from './constants';
import NotFound from './pages/NotFound';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Reviews = lazy(() => import('./pages/Reviews'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminMenu = lazy(() => import('./pages/AdminMenu'));
const AdminReviews = lazy(() => import('./pages/AdminReviews'));
const AdminReservations = lazy(() => import('./pages/AdminReservations'));
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ToastProvider } from './lib/ToastContext';
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
  // Hide the existence of admin pages by returning NotFound for unauthorized access
  // Case-insensitive email comparison to prevent unauthorized 404s
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return <NotFound />;
  
  return <>{children}</>;
}


function AppContent() {
  const location = useLocation();
  // Secret entrance check
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/lurambi-staff-gate';

  return (
    <div className="relative bg-white min-h-screen overflow-x-hidden selection:bg-gold/30">
      {!isAdminPage && <Navbar />}
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          }>
            <Routes location={location}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/reviews" element={<PageWrapper><Reviews /></PageWrapper>} />
              
              {/* Secret Admin Entry Point */}
              <Route path="/lurambi-staff-gate" element={<AdminLogin />} />

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
              <Route 
                path="/admin/reservations" 
                element={
                  <ProtectedRoute>
                    <PageWrapper><AdminReservations /></PageWrapper>
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route returns NotFound */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </AnimatePresence>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
      {!isAdminPage && <FloatingCallButton />}
      {!isAdminPage && <BackToTop />}
      {!isAdminPage && <CookieConsent />}
    </div>
  );
}


export default function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}


