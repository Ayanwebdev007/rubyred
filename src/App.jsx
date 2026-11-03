import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import BulkOrderingSection from './components/BulkOrderingSection';
import WhyRubyRedSection from './components/WhyRubyRedSection';
import AboutRubyRedSection from './components/AboutRubyRedSection';
import AboutUsPage from './components/AboutUsPage';
import ShopPage from './components/ShopPage';
import CategoriesPage from './components/CategoriesPage';
import ContactPage from './components/ContactPage';
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
import { AuthProvider } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import AdminLoginPage from './components/AdminLoginPage';

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  return (
    <div className="py-8">
      <CategoriesSection
        activeCategoryId={id}
        onSelectCategory={(catId) => navigate(`/category/${catId}`)}
      />
      <FeaturedProductsSection
        categoryId={id}
        onSelectProduct={(p) => navigate(`/product/${p.id}`)}
      />
    </div>
  );
}

function MainAppContent({ cart, setCart, handleAddToCart, handleUpdateQty, handleRemoveFromCart, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthOrAdminPage = location.pathname === '/login' || location.pathname.startsWith('/admin');
  const cartCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-red-[#d9232e] selection:text-white relative">
      {/* Show Storefront Navbar only on regular pages */}
      {!isAuthOrAdminPage && (
        <Navbar
          cartCount={cartCount}
          onOpenCart={() => navigate('/cart')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onHomeClick={() => navigate('/')}
          onAboutClick={() => navigate('/about')}
        />
      )}

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
            element={<CategoryPage />}
          />

          {/* B2B Wholesale Portal Route */}
          <Route
            path="/wholesale"
            element={<B2BWholesalePortal onAddToCart={handleAddToCart} />}
          />

          {/* Customer Onboarding & Login Page Route */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Admin Operations & Auth Gate Route */}
          <Route
            path="/admin"
            element={<AdminLoginPage />}
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
          <Route path="/shop" element={<ShopPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Sticky Floating WhatsApp Button only on regular storefront pages */}
      {!isAuthOrAdminPage && <WhatsAppWidget />}

      {/* Footer only on regular storefront pages */}
      {!isAuthOrAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rubyred_cart') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // Keep the cart across page reloads
  React.useEffect(() => {
    try {
      localStorage.setItem('rubyred_cart', JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

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
    <AuthProvider>
      <Router>
        <MainAppContent
          cart={cart}
          setCart={setCart}
          handleAddToCart={handleAddToCart}
          handleUpdateQty={handleUpdateQty}
          handleRemoveFromCart={handleRemoveFromCart}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Router>
    </AuthProvider>
  );
}
