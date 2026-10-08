import React from 'react';
import { Sparkles, Truck, Flame, ShieldCheck, Tag, Star, ArrowRight } from 'lucide-react';

export default function RollingOfferTicker() {
  const offers = [
    { text: "FREE Shipping on Houston Orders over $50", icon: Truck, badge: "Limited Offer" },
    { text: "12 Authentic Flavors of Japanese Ramune Soda in Stock", icon: Sparkles, badge: "Best Seller" },
    { text: "Direct Container Importer & Bulk Wholesale Pricing", icon: Tag, badge: "B2B Deals" },
    { text: "100% Guaranteed Freshness & Authenticity", icon: ShieldCheck, badge: "Quality First" },
    { text: "Same-Day Houston Store Pickup at 9909-A Harwin Dr.", icon: Flame, badge: "Fast Pickup" },
    { text: "Exotic Japanese & European Snacks Fresh Arrivals", icon: Star, badge: "New Stock" }
  ];

  // Repeat array twice to create a seamless infinite loop
  const doubledOffers = [...offers, ...offers];

  return (
    <div className="w-full bg-[#d9232e] text-white py-3 border-y border-red-700/80 shadow-md overflow-hidden relative select-none sticky top-[80px] z-40 backdrop-blur-md">
      
      {/* Decorative Subtle Side Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#d9232e] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#d9232e] to-transparent z-10 pointer-events-none" />

      {/* Infinite Rolling Marquee Track */}
      <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
        {doubledOffers.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 shrink-0 cursor-pointer group">
              
              {/* Badge */}
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-2xs group-hover:scale-105 transition-transform">
                {item.badge}
              </span>

              {/* Icon */}
              <Icon className="w-4 h-4 text-amber-300 shrink-0 group-hover:rotate-12 transition-transform" />

              {/* Offer Text */}
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                {item.text}
              </span>

              {/* Separator Dot */}
              <span className="text-rose-300/60 font-black text-sm ml-3">•</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
