import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  const handleShopClick = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="w-full bg-white overflow-hidden relative min-h-[calc(100vh-80px)] flex items-end">
      
      {/* Full Page Hero Background Image (Vibrant & Bright on Right Side) */}
      <img
        src="/images/hero_banner.png"
        alt="Japanese Snack Festival by Mount Fuji - Ruby Red Sales & Services"
        className="absolute inset-0 w-full h-full object-cover block object-center filter brightness-105 contrast-105"
      />

      {/* Tightly Scoped Dark Gradient Overlay ONLY on the Bottom-Left Text Area */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/35 via-40% to-transparent to-70% pointer-events-none" />

      {/* Bottom-Left Overlay Text Content & Buttons */}
      <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-4 text-left pb-12 sm:pb-16 lg:pb-20">
        
        {/* Main Heading - Thinner Font Medium Weight */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-white tracking-normal leading-[1.15] drop-shadow-md">
          <span className="block whitespace-nowrap">Quality Products.</span>
          <span className="block whitespace-nowrap">Simple Ordering.</span>
        </h1>

        {/* Action Buttons Row - Shorter & Compact Styling */}
        <div className="flex flex-wrap items-center gap-3 pt-2 font-sans">
          {/* Primary Red CTA Button - Compact */}
          <button
            onClick={handleShopClick}
            className="px-5 sm:px-6 py-2.5 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 group border border-red-500/30 cursor-pointer"
          >
            <span>Shop Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Bulk CTA Button - Compact */}
          <button
            onClick={() => navigate('/wholesale')}
            className="px-5 sm:px-6 py-2.5 bg-white/95 hover:bg-white text-slate-900 border border-white/80 font-bold text-xs sm:text-sm rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            Order in Bulk
          </button>
        </div>
      </div>
    </section>
  );
}
