import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import BulkOrderingSection from './components/BulkOrderingSection';
import WhyRubyRedSection from './components/WhyRubyRedSection';
import AboutRubyRedSection from './components/AboutRubyRedSection';
import AboutUsPage from './components/AboutUsPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import B2BWholesalePortal from './components/B2BWholesalePortal';
import AdminPanel from './components/AdminPanel';
import RamuneWheel from './components/RamuneWheel';
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';
import SocialMediaSection from './components/SocialMediaSection';
import SocialMediaPage from './components/SocialMediaPage';
import RollingOfferTicker from './components/RollingOfferTicker';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';

function MainAppContent({ cart, handleAddToCart, handleUpdateQty, handleRemoveFromCart, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-red-[#d9232e] selection:text-white relative">
      {/* Navbar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => navigate('/cart')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onHomeClick={() => navigate('/')}
        onAboutClick={() => navigate('/about')}
      />

      {/* Main Body with Client-side Routes */}
      <main className="flex-1">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <RollingOfferTicker />
                <CategoriesSection 
                  onSelectCategory={(catId) => navigate(`/category/${catId}`)}
                />
                <FeaturedProductsSection
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(p) => navigate(`/product/${p.id}`)}
                />
                <BulkOrderingSection />
                <AboutRubyRedSection onLearnMore={() => navigate('/about')} />
                <WhyRubyRedSection />
                <SocialMediaSection />
              </>
            }
          />

          {/* Dedicated About Us Page Route */}
          <Route
            path="/about"
            element={<AboutUsPage />}
          />

          {/* Dedicated Social Media Hub Route */}
          <Route
            path="/social"
            element={<SocialMediaPage />}
          />

          {/* Product Showcase Page Route */}
          <Route
            path="/product/:id"
            element={
              <ProductDetailsPage
                onBack={() => navigate('/')}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => navigate(`/product/${p.id}`)}
              />
            }
          />

          {/* Category View Route */}
          <Route
            path="/category/:id"
            element={
              <div className="py-8">
                <CategoriesSection 
                  onSelectCategory={(catId) => navigate(`/category/${catId}`)}
                />
                <FeaturedProductsSection
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(p) => navigate(`/product/${p.id}`)}
                />
              </div>
            }
          />

          {/* B2B Wholesale Portal Route */}
          <Route
            path="/wholesale"
            element={<B2BWholesalePortal onAddToCart={handleAddToCart} />}
          />

          {/* Admin Panel Route */}
          <Route
            path="/admin"
            element={<AdminPanel />}
          />

          {/* Ramune Wheel Interactive Game Route */}
          <Route
            path="/wheel"
            element={<RamuneWheel onAddToCart={handleAddToCart} />}
          />

          {/* Dedicated Full Shopping Cart Page Route */}
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveFromCart}
                onClearCart={() => setCart([])}
              />
            }
          />

          {/* Dedicated Orders History & Tracking Page Route */}
          <Route
            path="/orders"
            element={<OrdersPage onAddToCart={handleAddToCart} />}
          />

          {/* Fallback Aliases & Wildcard Redirects to prevent blank pages */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/shop" element={<Navigate to="/" replace />} />
          <Route path="/categories" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Navigate to="/social" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Sticky Floating WhatsApp Button */}
      <WhatsAppWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  const handleAddToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productToAdd.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === productToAdd.id ? { ...item, qty: item.qty + (productToAdd.qty || 1) } : item
        );
      }
      return [...prevCart, { ...productToAdd, qty: productToAdd.qty || 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <MainAppContent
        cart={cart}
        handleAddToCart={handleAddToCart}
        handleUpdateQty={handleUpdateQty}
        handleRemoveFromCart={handleRemoveFromCart}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </Router>
  );
}
