import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AIAssistantWidget from './components/AIAssistantWidget';
import SplashScreen from './components/SplashScreen';
import MobileBottomNav from './components/MobileBottomNav';

// Pages
import LandingPage from './pages/LandingPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SellerProfileSetup from './pages/SellerProfileSetup';
import Marketplace from './pages/Marketplace';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductStudio from './pages/ProductStudio';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import WishlistPage from './pages/WishlistPage';
import RecommendedBuyersPage from './pages/RecommendedBuyersPage';
import DeliveryCheckerPage from './pages/DeliveryCheckerPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen on first session load
    try {
      const seen = sessionStorage.getItem('bu_splash_seen');
      return !seen;
    } catch {
      return true;
    }
  });

  const handleFinishSplash = () => {
    try {
      sessionStorage.setItem('bu_splash_seen', 'true');
    } catch (e) {
      console.warn(e);
    }
    setShowSplash(false);
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            {showSplash && <SplashScreen onFinish={handleFinishSplash} />}
            <Router>
              <div className="min-h-screen flex flex-col bg-white text-[#172B4D] pb-16 lg:pb-0">
                <Navbar />

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/seller-setup" element={<SellerProfileSetup />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/product-studio" element={<ProductStudio />} />
                    <Route path="/seller-dashboard" element={<SellerDashboard />} />
                    <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                    <Route path="/buyers" element={<RecommendedBuyersPage />} />
                    <Route path="/delivery-checker" element={<DeliveryCheckerPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />

                {/* Persistent Floating AI Advisor & Slide-over Cart */}
                <AIAssistantWidget />
                <CartDrawer />

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
