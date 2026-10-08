import React from 'react';
import { ArrowRight, Quote, Sparkles } from 'lucide-react';
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
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Header Row - Left-aligned matching site standard */}
        <div className="-mx-4 sm:-mx-8 lg:-mx-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#d9232e] tracking-normal">
            Founder's Message
          </h2>
        </div>

        {/* Content & Image Grid (Picture on Left, Content on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
          
          {/* Left: Founder Image with Overlapping Premium Golden Card (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center items-center pb-6 lg:pb-0">
            <div className="relative rounded-3xl border-4 border-white bg-white group w-full max-w-md">
              
              {/* Pure Clean Image - No Dark Gradient Overlay */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="/images/founder.png"
                  alt="Our Beloved Founder - Ruby Red Sales & Services"
                  className="w-full h-auto block group-hover:scale-102 transition-transform duration-700"
                />
              </div>

              {/* Overlapping Premium Golden Card at Bottom Left Corner */}
              <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-5 py-3 rounded-2xl border-2 border-white backdrop-blur-md z-20 flex flex-col justify-center space-y-0.5 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <span className="text-base font-black text-slate-950 tracking-tight leading-none">
                  Salim NM
                </span>
                <p className="text-xs font-bold text-slate-900/90 tracking-wide">
                  Founder, Ruby Red Sales & Services
                </p>
              </div>

            </div>
          </div>

          {/* Right: Founder Message & Signature Block (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Elegant Founder Statement Container */}
            <div className="relative pl-6 sm:pl-8 border-l-4 border-[#d9232e] py-1 space-y-4">
              <Quote className="w-8 h-8 text-red-500/20 absolute -top-3 -left-4 bg-white p-1" />
              <p className="text-lg sm:text-xl text-slate-800 font-medium leading-relaxed tracking-tight italic space-y-2">
                <span>"Ruby Red Sales & Services provides quality products and convenient purchasing solutions for both retail and business customers. </span>
                <span>Our passion is curating authentic global exotic snacks and beverages with guaranteed freshness. </span>
                <span>We are dedicated to delivering fast, dependable service and building lasting partnerships across North America."</span>
              </p>
            </div>

            {/* Founder Signature & Title */}
            <div className="pt-2 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md border-2 border-white shrink-0">
                SN
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">Salim NM</h3>
                <p className="text-xs font-semibold text-slate-500">Founder & CEO, Ruby Red Sales & Services</p>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={handleLearnMore}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
