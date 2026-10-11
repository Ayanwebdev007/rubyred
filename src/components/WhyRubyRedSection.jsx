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
    <section id="why-ruby-red" className="py-8 sm:py-14 lg:py-20 bg-white border-b border-slate-100 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 lg:space-y-12 relative z-10">
        
        {/* Section Header Row - Clean alignment with 100% Authentic Trust Badge */}
        <div className="flex items-center justify-between gap-3 px-1">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-[#d9232e] tracking-tight">
            Why Ruby Red?
          </h2>
          {/* Relocated 100% Authentic Badge */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/90 px-2.5 py-1 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Authentic</span>
          </div>
        </div>

        {/* MOBILE VIEW (< lg): Bigger Person Illustration Top + Compact 2x2 Feature Grid Below */}
        <div className="block lg:hidden space-y-5 sm:space-y-7">
          {/* Bigger Centered Person Illustration with ample top headroom */}
          <div className="flex justify-center items-center pt-14 xs:pt-16 sm:pt-20 pb-2 relative">
            <div className="absolute w-72 h-72 xs:w-80 xs:h-80 bg-sky-200/50 rounded-full blur-3xl -z-10" />

            {/* Scaled-up Container */}
            <div className="relative w-60 h-60 xs:w-68 xs:h-68 sm:w-76 sm:h-76 flex items-end justify-center">
              {/* Circle layer */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 via-sky-200/90 to-blue-100 border-4 border-white overflow-hidden flex items-end justify-center shadow-lg">
                <img
                  src="/images/why_us_person.png"
                  alt="Ruby Red Representative"
                  className="h-[130%] xs:h-[132%] sm:h-[138%] max-w-none object-contain object-bottom filter drop-shadow-md"
                  loading="lazy"
                />
              </div>

              {/* Pop-out top (wide unconstrained top boundary so head is never cropped) */}
              <div 
                className="absolute inset-0 flex items-end justify-center z-10 pointer-events-none"
                style={{ clipPath: 'inset(-350px -100px 35% -100px)' }}
              >
                <img
                  src="/images/why_us_person.png"
                  alt=""
                  className="h-[130%] xs:h-[132%] sm:h-[138%] max-w-none object-contain object-bottom filter drop-shadow-md"
                />
              </div>

              {/* Bottom HQ Badge (clean and anchored) */}
              <div className="absolute bottom-2 left-2 xs:bottom-3 xs:left-3 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 xs:px-3 xs:py-1.5 rounded-full border border-slate-200 text-[10px] xs:text-[11px] font-extrabold text-[#d9232e] flex items-center gap-1.5 shadow-sm">
                <MapPin className="w-3 h-3 text-[#d9232e]" />
                <span>Houston, TX HQ</span>
              </div>
            </div>
          </div>

          {/* Compact 2x2 Feature Grid on Mobile */}
          <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div
                  key={idx}
                  className="bg-white hover:bg-red-50/20 rounded-xl xs:rounded-2xl p-2.5 xs:p-3 border-[1.5px] border-[#d9232e] shadow-2xs active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-red-50 text-[#d9232e] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-[11px] xs:text-xs sm:text-sm leading-tight line-clamp-1">
                    {pt.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP VIEW (lg+): 3-Column Symmetrical Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center pt-6">
          {/* Left Column: Floating Pill Pods */}
          <div className="col-span-4 space-y-8">
            {points.slice(0, 2).map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div 
                  key={idx}
                  className="group relative bg-white hover:bg-red-50/30 rounded-full py-4 px-6 border-2 border-[#d9232e] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d9232e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-[#d9232e] transition-colors tracking-tight text-right w-full">
                    {pt.title}
                  </h3>

                  <div className="shrink-0 text-[#d9232e] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 stroke-[1.75]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Column: Person Image */}
          <div className="col-span-4 flex justify-center items-center relative">
            <div className="absolute w-80 h-80 bg-sky-200/60 rounded-full blur-3xl -z-10" />

            <div className="relative w-80 h-80 flex items-end justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 via-sky-200/90 to-blue-100 border-4 border-white overflow-hidden flex items-end justify-center">
                <img
                  src="/images/why_us_person.png"
                  alt="Ruby Red Representative"
                  className="h-[140%] max-w-none object-contain object-bottom filter drop-shadow-md"
                />
              </div>

              <div 
                className="absolute inset-0 flex items-end justify-center z-10 pointer-events-none"
                style={{ clipPath: 'inset(-200px -100px 35% -100px)' }}
              >
                <img
                  src="/images/why_us_person.png"
                  alt=""
                  className="h-[140%] max-w-none object-contain object-bottom filter drop-shadow-md"
                />
              </div>

              <div className="absolute -top-4 -right-2 z-20 bg-white px-3.5 py-1.5 rounded-full border-2 border-slate-200 text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>100% Authentic</span>
              </div>

              <div className="absolute bottom-6 -left-4 z-20 bg-white px-3.5 py-1.5 rounded-full border-2 border-slate-200 text-[11px] font-extrabold text-[#d9232e] flex items-center gap-1.5 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#d9232e]" />
                <span>Houston, TX HQ</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Pill Pods */}
          <div className="col-span-4 space-y-8">
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

                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-[#d9232e] transition-colors tracking-tight text-left w-full">
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
