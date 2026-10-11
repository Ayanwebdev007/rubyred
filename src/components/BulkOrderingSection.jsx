import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function BulkOrderingSection() {
  const navigate = useNavigate();

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hello RUBY RED! I would like to inquire about business wholesale and bulk purchasing requirements.");
    window.open(`https://wa.me/18323663572?text=${text}`, '_blank');
  };

  return (
    <section id="bulk-ordering" className="relative w-full bg-slate-900 border-b border-slate-100 overflow-hidden">
      
      {/* MOBILE VIEW (< md): Stacked Image Showcase + Brand Red Content Panel */}
      <div className="block md:hidden">
        {/* Mobile Visual Image Banner - 100% Bright & Clear */}
        <div className="relative h-48 xs:h-56 w-full overflow-hidden bg-white">
          <img
            src="/images/b2b_wholesale.png"
            onError={(e) => { e.target.src = '/images/b2b_wholesale.jpg'; }}
            alt="Ruby Red Bulk Wholesale & Distribution"
            className="w-full h-full object-cover object-top filter brightness-105 contrast-105"
          />
        </div>

        {/* Mobile Red Content Panel */}
        <div className="bg-[#d9232e] px-4 xs:px-5 py-5 text-white space-y-3.5">
          <div className="space-y-1 text-left">
            <h2 className="text-2xl xs:text-3xl font-semibold text-white tracking-tight leading-tight">
              Buying in Bulk?
            </h2>
            <p className="text-xs xs:text-sm text-red-100 font-medium leading-relaxed">
              Convenient ordering support & direct wholesale pricing for your store, cafe, or business.
            </p>
          </div>

          {/* 2x2 Trust Perks Grid */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Direct Import</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Case Quantities</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Verified Fresh</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Houston Pickup</span>
            </div>
          </div>

          {/* Mobile CTA Action Buttons - Side by Side */}
          <div className="pt-1.5 flex flex-row items-center gap-2 w-full">
            {/* Primary CTA */}
            <button
              onClick={() => navigate('/wholesale')}
              className="flex-1 py-2.5 px-2 xs:px-3.5 rounded-xl font-bold text-[11px] xs:text-xs bg-slate-900 hover:bg-slate-800 active:scale-95 text-white shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer group whitespace-nowrap"
            >
              <span>Request Bulk Order</span>
              <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Secondary CTA: WhatsApp */}
            <button
              onClick={handleWhatsAppContact}
              className="flex-1 py-2.5 px-2 xs:px-3.5 rounded-xl font-bold text-[11px] xs:text-xs bg-white hover:bg-red-50 active:scale-95 text-slate-900 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366] shrink-0" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (md+): Original Signature Split Layout */}
      <div className="hidden md:flex relative w-full min-h-[480px] lg:min-h-[520px] items-stretch">
        {/* Full Width Background Image */}
        <img
          src="/images/b2b_wholesale.png"
          onError={(e) => { e.target.src = '/images/b2b_wholesale.jpg'; }}
          alt="Ruby Red Bulk Wholesale & Distribution"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Brand Red Solid Panel on Right */}
        <div className="absolute top-0 bottom-0 right-0 w-[50%] lg:w-[42%] bg-[#d9232e] z-10 flex items-center justify-end px-8 lg:px-12 py-10 shadow-2xl">
          <div className="flex flex-col items-end text-right space-y-4 text-white w-full">
            <div className="space-y-2 text-right w-full">
              <h2 className="text-3xl lg:text-4xl font-medium text-white tracking-tight text-right leading-tight">
                Buying in Bulk?
              </h2>
              <p className="text-sm lg:text-base text-red-100 font-medium leading-relaxed text-right max-w-sm ml-auto">
                Get convenient ordering support for your <br />
                business and bulk requirements.
              </p>
            </div>

            {/* Perks */}
            <div className="flex flex-col items-end gap-2 pt-1 w-full">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span>Direct Container Import</span>
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span>Flexible Case Quantities</span>
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 w-full">
              <button
                onClick={handleWhatsAppContact}
                className="py-3 px-5 rounded-xl font-bold text-xs bg-white hover:bg-red-50 text-slate-900 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366] shrink-0" />
                <span>WhatsApp Support</span>
              </button>

              <button
                onClick={() => navigate('/wholesale')}
                className="py-3 px-5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer group whitespace-nowrap"
              >
                <span>Request Bulk Order</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
