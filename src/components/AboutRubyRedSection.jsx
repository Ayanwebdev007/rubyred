import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutRubyRedSection({ onLearnMore }) {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      navigate('/about');
    }
  };

  return (
    <section id="about" className="py-8 sm:py-14 lg:py-20 bg-white border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Section Header Row - Clean mobile alignment without negative margin clipping */}
        <div className="px-1">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-[#d9232e] tracking-tight">
            Founder's Message
          </h2>
        </div>

        {/* Content & Image Grid (Picture on Left, Content on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left: Founder Image with Overlapping Premium Golden Card (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center items-center pb-4 sm:pb-6 lg:pb-0">
            <div className="relative rounded-2xl sm:rounded-3xl border-4 border-white bg-white shadow-md sm:shadow-lg group w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md">
              
              {/* Pure Clean Image */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50">
                <img
                  src="/images/founder.png"
                  alt="Our Beloved Founder - Ruby Red Sales & Services"
                  className="w-full h-auto block group-hover:scale-102 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Overlapping Premium Golden Card - Mobile Proportioned & Non-Clipping */}
              <div className="absolute -bottom-3 -left-2 xs:-bottom-4 xs:-left-3 sm:-left-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-3.5 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-white shadow-md z-20 flex flex-col justify-center space-y-0.5 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <span className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-none">
                  Salim NM
                </span>
                <p className="text-[10px] sm:text-xs font-bold text-slate-900/90 tracking-wide">
                  Founder, Ruby Red Sales & Services
                </p>
              </div>

            </div>
          </div>

          {/* Right: Founder Message & Signature Block (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 pt-2 lg:pt-0">
            
            {/* Elegant Founder Statement Container */}
            <div className="relative pl-4 sm:pl-8 border-l-3 sm:border-l-4 border-[#d9232e] py-1 space-y-3">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-red-500/20 absolute -top-2.5 -left-3 sm:-top-3 sm:-left-4 bg-white p-0.5 sm:p-1" />
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-slate-800 font-medium leading-relaxed tracking-tight italic space-y-1.5">
                <span>"Ruby Red Sales & Services provides quality products and convenient purchasing solutions for both retail and business customers. </span>
                <span>Our passion is curating authentic global exotic snacks and beverages with guaranteed freshness. </span>
                <span>We are dedicated to delivering fast, dependable service and building lasting partnerships across North America."</span>
              </p>
            </div>

            {/* Founder Signature & Title */}
            <div className="pt-1 sm:pt-2 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-sm sm:text-lg shadow-md border-2 border-white shrink-0">
                SN
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">Salim NM</h3>
                <p className="text-xs font-semibold text-slate-500">Founder & CEO, Ruby Red Sales & Services</p>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={handleLearnMore}
                className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3.5 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
