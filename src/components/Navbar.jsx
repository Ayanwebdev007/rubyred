import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Package, Menu, X, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  cartCount = 0, 
  onOpenCart, 
  searchQuery, 
  setSearchQuery,
  onHomeClick,
  onAboutClick
}) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitial = currentUser?.name 
    ? currentUser.name.trim().charAt(0).toUpperCase() 
    : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    } else if (sectionId === 'wholesale') {
      navigate('/wholesale');
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs transition-all">
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

            {/* Login Button (when logged out) OR Profile Avatar showing first letter of name (when logged in) */}
            {!currentUser ? (
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
                title="Login to Account"
                id="login-nav-btn"
              >
                <User className="w-4 h-4 text-white" />
                <span className="text-white">Login</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] active:scale-95 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center font-black text-sm uppercase cursor-pointer border-2 border-white select-none"
                  title={`Account: ${currentUser.name || currentUser.email}`}
                  id="profile-nav-btn"
                >
                  <span>{userInitial}</span>
                </button>

                {/* Compact Dropdown directly beneath the avatar button */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#d9232e] text-white flex items-center justify-center font-black text-xs shrink-0">
                          {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-900 text-xs truncate">
                            {currentUser.name || 'Member'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {currentUser.email || currentUser.phone}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          currentUser.role === 'b2b' ? 'bg-amber-100 text-amber-800' : 'bg-red-50 text-[#d9232e]'
                        }`}>
                          {currentUser.role === 'b2b' ? 'Wholesale Partner' : 'Retail Customer'}
                        </span>
                      </div>
                    </div>

                    <div className="p-1 space-y-0.5 text-xs font-semibold">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Orders & Tracking</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (onOpenCart) onOpenCart();
                          navigate('/cart');
                        }}
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        <span>Shopping Cart ({cartCount})</span>
                      </button>

                      {currentUser.role === 'b2b' && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate('/wholesale');
                          }}
                          className="w-full px-3 py-2 text-left text-amber-800 hover:bg-amber-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Building2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Wholesale Portal</span>
                        </button>
                      )}

                      <div className="pt-1 border-t border-slate-100 mt-1">
                        <button
                          onClick={async () => {
                            setIsDropdownOpen(false);
                            await logout();
                            navigate('/');
                          }}
                          className="w-full px-3 py-2 text-left text-[#d9232e] hover:bg-red-50 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Button with Solid Red BG & White Icon (redirects to /login if not logged in) */}
            <button
              onClick={() => {
                if (!currentUser) {
                  navigate('/login');
                  return;
                }
                if (onOpenCart) onOpenCart();
                navigate('/cart');
              }}
              className="relative p-2.5 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white shadow-sm hover:shadow-md transition-all group cursor-pointer"
              title="Shopping Cart"
              id="cart-nav-btn"
            >
              <ShoppingBag className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
              {currentUser && cartCount >= 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Orders Icon Button (redirects to /login if not logged in) */}
            <button
              onClick={() => {
                if (!currentUser) {
                  navigate('/login');
                  return;
                }
                navigate('/orders');
              }}
              className="relative p-2.5 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white shadow-sm hover:shadow-md transition-all group cursor-pointer"
              title="My Orders & Tracking"
              id="orders-nav-btn"
            >
              <Package className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
              {currentUser && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                  3
                </span>
              )}
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

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {!currentUser ? (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#d9232e] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-white" />
                <span>Login</span>
              </button>
            ) : (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#d9232e] text-white flex items-center justify-center font-black text-xs">
                    {userInitial}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{currentUser.name || 'Member'}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.email || currentUser.phone}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await logout();
                    navigate('/');
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (!currentUser) {
                    navigate('/login');
                  } else {
                    navigate('/cart');
                  }
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#d9232e]" />
                <span>Cart ({currentUser ? cartCount : 0})</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (!currentUser) {
                    navigate('/login');
                  } else {
                    navigate('/orders');
                  }
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-[#d9232e]" />
                <span>Orders</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
