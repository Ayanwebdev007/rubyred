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
    <section id="bulk-ordering" className="relative w-full min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] flex items-stretch overflow-hidden bg-slate-900 border-b border-slate-100">
      {/* 100% Crystal Clear Full Width & Height Background Image */}
      <img
        src="/images/b2b_wholesale.png"
        onError={(e) => { e.target.src = '/images/b2b_wholesale.jpg'; }}
        alt="Ruby Red Bulk Wholesale & Distribution"
        className="absolute inset-0 w-full h-full object-cover object-top sm:object-top"
      />

      {/* Slightly Expanded Brand Red Solid Rectangle Block on the Right Side (Occupies Right 42% on Desktop) */}
      <div className="absolute top-0 bottom-0 right-0 w-full sm:w-[55%] md:w-[48%] lg:w-[42%] bg-[#d9232e] z-10 flex items-center justify-end px-6 sm:px-9 lg:px-12 py-10 shadow-2xl">
        <div className="flex flex-col items-end text-right space-y-4 text-white w-full">
          
          {/* Heading & Copy */}
          <div className="space-y-2 text-right w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight text-right leading-tight">
              Buying in Bulk?
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-red-100 font-medium leading-relaxed text-right max-w-sm ml-auto">
              Get convenient ordering support for your <br className="hidden sm:inline" />
              business and bulk requirements.
            </p>
          </div>

          {/* Minimal Trust Perks (Right-Aligned) */}
          <div className="flex flex-col items-end gap-2 pt-1 w-full">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
              <span>Direct Container Import</span>
              <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
              <span>Flexible Case Quantities</span>
              <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
            </div>
          </div>

          {/* CTA Action Buttons (Right-Aligned) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 w-full">
            {/* Secondary CTA: WhatsApp Support */}
            <button
              onClick={handleWhatsAppContact}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-bold text-xs bg-white hover:bg-red-50 text-slate-900 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366] shrink-0" />
              <span>WhatsApp Support</span>
            </button>

            {/* Primary CTA: Request Bulk Order */}
            <button
              onClick={() => navigate('/wholesale')}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer group whitespace-nowrap"
            >
              <span>Request Bulk Order</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
