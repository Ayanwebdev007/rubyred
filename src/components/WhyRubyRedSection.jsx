import React from 'react';
import { Sparkles, CheckCircle, Flame, ShieldCheck, MapPin } from 'lucide-react';

export default function WhyRubyRedSection() {
  const points = [
    {
      title: "Quality Products",
      desc: "Reliable products selected to meet customer needs.",
      icon: ShieldCheck
    },
    {
      title: "Easy Ordering",
      desc: "Browse, add to cart and place your order with ease.",
      icon: MapPin
    },
    {
      title: "Retail & Bulk",
      desc: "Solutions for individual customers and business buyers.",
      icon: Flame
    },
    {
      title: "Direct Support",
      desc: "Quick assistance through WhatsApp and direct communication.",
      icon: CheckCircle
    }
  ];

  return (
    <section id="why-ruby-red" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-100 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header Row - Left-aligned to match Categories and Featured Products sections */}
        <div className="-mx-4 sm:-mx-8 lg:-mx-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#d9232e] tracking-normal">
            Why Ruby Red?
          </h2>
        </div>

        {/* 3-Column Layout: Left Floating Pods (2), Centerpiece Person Image + Sky Blue Circle, Right Floating Pods (2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-4 sm:pt-6">
          
          {/* Left Column: Floating Pill Pods (Brand Red Border) */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            {points.slice(0, 2).map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div 
                  key={idx}
                  className="group relative bg-white hover:bg-red-50/30 rounded-full py-4 px-6 border-2 border-[#d9232e] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d9232e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl group-hover:text-[#d9232e] transition-colors tracking-tight text-left lg:text-right w-full">
                    {pt.title}
                  </h3>

                  <div className="shrink-0 text-[#d9232e] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 stroke-[1.75]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Column: Centered Person Image with Ambient Glow & Pop-Out Top */}
          <div className="lg:col-span-4 flex justify-center items-center py-8 lg:py-0 relative">
            
            {/* Ambient Background Radial Glow */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 bg-sky-200/60 rounded-full blur-3xl -z-10" />

            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-end justify-center">
              {/* Layer 1: Light Sky Blue Circle with Clipped Bottom Body */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 via-sky-200/90 to-blue-100 border-4 border-white overflow-hidden flex items-end justify-center">
                <img
                  src="/images/why_us_person.png"
                  alt="Ruby Red Representative"
                  className="h-[135%] sm:h-[140%] max-w-none object-contain object-bottom filter drop-shadow-md"
                />
              </div>

              {/* Layer 2: Unclipped Top Head & Shoulders popping out past the top of circle */}
              <div 
                className="absolute inset-0 flex items-end justify-center z-10 pointer-events-none"
                style={{ clipPath: 'inset(-200px -100px 35% -100px)' }}
              >
                <img
                  src="/images/why_us_person.png"
                  alt=""
                  className="h-[135%] sm:h-[140%] max-w-none object-contain object-bottom filter drop-shadow-md"
                />
              </div>

              {/* Floating Trust Accent Badges */}
              <div className="absolute -top-4 -right-2 z-20 bg-white px-3.5 py-1.5 rounded-full border-2 border-slate-200 text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>100% Authentic</span>
              </div>

              <div className="absolute bottom-6 -left-4 z-20 bg-white px-3.5 py-1.5 rounded-full border-2 border-slate-200 text-[11px] font-extrabold text-[#d9232e] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d9232e]" />
                <span>Houston, TX HQ</span>
              </div>

            </div>
          </div>

          {/* Right Column: Floating Pill Pods (Brand Red Border) */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            {points.slice(2, 4).map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div 
                  key={idx + 2}
                  className="group relative bg-white hover:bg-red-50/30 rounded-full py-4 px-6 border-2 border-[#d9232e] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-start gap-4 overflow-hidden"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#d9232e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="shrink-0 text-[#d9232e] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 stroke-[1.75]" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl group-hover:text-[#d9232e] transition-colors tracking-tight text-left w-full">
                    {pt.title}
                  </h3>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
