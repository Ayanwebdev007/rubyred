import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Building2, 
  FileText, 
  LayoutDashboard, 
  Phone, 
  ShieldCheck, 
  Menu, 
  X,
  Layers
} from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  userMode, 
  setUserMode, 
  cartCount, 
  setIsCartOpen,
  searchQuery,
  setSearchQuery
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      {/* Top Banner - Store Announcement & WhatsApp Direct */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-xs py-1.5 px-4 text-slate-200 border-b border-rose-800/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-rose-200 font-medium">
            <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Store Location</span>
            <span>📍 {STORE_INFO.address}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-amber-400">🔥 12 Flavors Japanese Ramune Soda Available Now!</span>
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappFormatted}`}
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: {STORE_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('store')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 rounded-full">
              3D
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-rose-400 transition-colors">
                RUBY RED
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-rose-900/50 text-rose-300 border border-rose-700/50 font-semibold">
                SALES & SERVICES
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              {STORE_INFO.tagline}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search Ramune, Lay's Seaweed, Pocky, Milka..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/60 rounded-full py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* B2C vs B2B Mode Switcher */}
        <div className="hidden lg:flex items-center p-1 bg-slate-900 rounded-full border border-slate-800">
          <button
            onClick={() => setUserMode('b2c')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              userMode === 'b2c' 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Retail (B2C)</span>
          </button>
          <button
            onClick={() => setUserMode('b2b')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              userMode === 'b2b' 
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B Wholesale</span>
            <span className="bg-amber-900/60 text-amber-200 text-[9px] px-1 rounded">Bulk</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-200 hover:text-white transition-all shadow-md group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-950">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Bar Links */}
      <nav className="hidden md:block bg-slate-900/50 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('store')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'store'
                  ? 'border-rose-500 text-rose-400 bg-rose-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Storefront & Catalogue
            </button>
            <button
              onClick={() => setActiveTab('ramune')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'ramune'
                  ? 'border-rose-500 text-rose-400 bg-rose-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>12 Ramune Flavors</span>
            </button>
            <button
              onClick={() => setActiveTab('wholesale')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'wholesale'
                  ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>B2B Wholesale Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('proposal')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'proposal'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>GS3 Proposal & Scope</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Houston Wholesale Distributor</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
          <div className="p-2 bg-slate-950 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Customer Ordering Mode:</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setUserMode('b2c')}
                className={`px-2.5 py-1 text-xs rounded-lg ${userMode === 'b2c' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Retail
              </button>
              <button 
                onClick={() => setUserMode('b2b')}
                className={`px-2.5 py-1 text-xs rounded-lg ${userMode === 'b2b' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                B2B Bulk
              </button>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <button
              onClick={() => { setActiveTab('store'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeTab === 'store' ? 'bg-rose-600 text-white' : 'text-slate-300'}`}
            >
              Storefront & Catalogue
            </button>
            <button
              onClick={() => { setActiveTab('ramune'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeTab === 'ramune' ? 'bg-rose-600 text-white' : 'text-slate-300'}`}
            >
              12 Ramune Flavors Showcase
            </button>
            <button
              onClick={() => { setActiveTab('wholesale'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeTab === 'wholesale' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              B2B Wholesale Portal
            </button>
            <button
              onClick={() => { setActiveTab('proposal'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeTab === 'proposal' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              GS3 Solution LLC Proposal
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeTab === 'admin' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
