import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Package, Menu, X } from 'lucide-react';

export default function Navbar({ 
  cartCount = 0, 
  onOpenCart, 
  searchQuery, 
  setSearchQuery,
  onHomeClick,
  onAboutClick
}) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (sectionId === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'about') {
      if (onAboutClick) onAboutClick();
      navigate('/about');
    } else if (sectionId === 'contact') {
      navigate('/social');
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Official RUBY RED Logo */}
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="flex items-center gap-2 group">
            <img 
              src="/images/logo.png" 
              alt="Ruby Red Sales & Services - Global Exotic Snacks & Beverages" 
              className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </div>
        </div>

        {/* Right-aligned Navigation & Action Group */}
        <div className="flex items-center gap-4 lg:gap-6 ml-auto">
          
          {/* Navigation Links - Static Non-Tappable Section Titles */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700 select-none">
            <button 
              onClick={() => handleNavClick('home')}
              className="text-red-600 font-bold transition-colors py-1 cursor-pointer hover:text-red-700"
            >
              Home
            </button>
            <span className="text-slate-700 py-1 cursor-default select-none pointer-events-none">
              Shop
            </span>
            <span className="text-slate-700 py-1 cursor-default select-none pointer-events-none">
              Categories
            </span>
            <span className="text-slate-700 py-1 cursor-default select-none pointer-events-none">
              About Us
            </span>
            <span className="text-slate-700 py-1 cursor-default select-none pointer-events-none">
              Contact
            </span>
          </nav>

          {/* Right Action Controls: Expanded Search Bar, Solid Red Login & Cart */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            
            {/* Search Bar Input */}
            <div className="hidden sm:flex items-center bg-slate-50/90 rounded-full px-4 py-2 text-xs border border-red-500/70 hover:border-red-600 w-56 sm:w-64 md:w-80 focus-within:bg-white focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-500/20 transition-all shadow-2xs">
              <Search className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-800 placeholder-slate-400 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  ×
                </button>
              )}
            </div>

            {/* Login Button with Solid Red BG & White Text */}
            <button 
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
              title="Login to Account"
            >
              <User className="w-4 h-4 text-white" />
              <span className="text-white">Login</span>
            </button>

            {/* Cart Button with Solid Red BG & White Icon */}
            <button
              onClick={() => {
                if (onOpenCart) onOpenCart();
                navigate('/cart');
              }}
              className="relative p-2.5 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white shadow-sm hover:shadow-md transition-all group cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
              {cartCount >= 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Orders Icon Button (Placed Right After Cart Icon) */}
            <button
              onClick={() => navigate('/orders')}
              className="relative p-2.5 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white shadow-sm hover:shadow-md transition-all group cursor-pointer"
              title="My Orders & Tracking"
            >
              <Package className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                3
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 space-y-2 shadow-md">
          <div className="flex items-center bg-slate-50 border border-red-500/70 rounded-full px-3.5 py-2 text-xs mb-3">
            <Search className="w-4 h-4 text-red-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-slate-800"
            />
          </div>

          <nav className="flex flex-col space-y-1.5 text-sm font-semibold text-slate-700 select-none">
            <button onClick={() => handleNavClick('home')} className="text-left text-red-600 font-bold px-2 py-1 cursor-pointer">Home</button>
            <span className="text-left px-2 py-1 text-slate-700 font-semibold cursor-default pointer-events-none">Shop</span>
            <span className="text-left px-2 py-1 text-slate-700 font-semibold cursor-default pointer-events-none">Categories</span>
            <span className="text-left px-2 py-1 text-slate-700 font-semibold cursor-default pointer-events-none">About Us</span>
            <span className="text-left px-2 py-1 text-slate-700 font-semibold cursor-default pointer-events-none">Contact</span>
          </nav>

          <div className="pt-2 border-t border-slate-100">
            <button className="w-full py-2.5 px-4 rounded-full bg-[#d9232e] text-white font-bold text-xs flex items-center justify-center gap-2">
              <User className="w-4 h-4 text-white" />
              <span>Login / Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
