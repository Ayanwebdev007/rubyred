import React from 'react';
import { ArrowLeft, ShieldCheck, Sparkles, Building2, CheckCircle, Package, Globe, PhoneCall, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#d9232e] transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-[#d9232e] border border-red-200">
            Official Company Profile
          </span>
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-[#d9232e]_1px,transparent_1px] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
              <Globe className="w-3.5 h-3.5" />
              Global Exotic Snacks & Beverages
            </span>
            <h1 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
              About Ruby Red Sales & Services
            </h1>
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              Ruby Red Sales & Services provides quality products and convenient purchasing solutions for both retail and business customers across North America.
            </p>
          </div>
        </div>

        {/* Detailed Story & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Our Story & Commitment
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                At Ruby Red Sales & Services, we specialize in curating and distributing authentic international snacks, European chocolates, artisan Japanese sodas like Ramune, and gourmet savory treats. 
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Whether you are an individual customer searching for rare hard-to-find treats or a business owner looking for dependable bulk inventory, Ruby Red delivers freshness, competitive pricing, and fast dispatch.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black text-[#d9232e]">100%</span>
                <p className="text-xs text-slate-500 font-medium">Guaranteed Freshness</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-black text-[#d9232e]">500+</span>
                <p className="text-xs text-slate-500 font-medium">Global Products Sourced</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-md border-4 border-white min-h-[320px]">
            <img
              src="/images/b2b_wholesale.jpg"
              alt="Ruby Red Warehouse Showcase"
              className="w-full h-full object-cover object-center"
            />
          </div>

        </div>

        {/* Meet Our Beloved Founder Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-700/80 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Founder Portrait (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center items-center pb-6 lg:pb-0">
              <div className="relative rounded-3xl border-4 border-amber-400/50 bg-white w-full max-w-sm">
                
                {/* Pure Clean Image - No Overlay */}
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="/images/founder.png"
                    alt="Our Beloved Founder - Ruby Red Sales & Services"
                    className="w-full h-auto block"
                  />
                </div>

                {/* Overlapping Premium Golden Card at Bottom Left Corner */}
                <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-5 py-3 rounded-2xl border-2 border-white z-20 flex flex-col justify-center space-y-0.5 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <span className="text-base font-black text-slate-950 tracking-tight leading-none">
                    Salim NM
                  </span>
                  <p className="text-xs font-bold text-slate-900/90 tracking-wide">
                    Founder, Ruby Red Sales & Services
                  </p>
                </div>

              </div>
            </div>

            {/* Founder Message & Vision (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Leadership & Vision</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-medium text-white tracking-tight">
                A Message from Our Beloved Founder
              </h2>

              <blockquote className="text-base sm:text-lg text-slate-200 italic leading-relaxed border-l-4 border-[#d9232e] pl-4">
                "At Ruby Red Sales & Services, our commitment has always been simple: to bring authentic, high-quality global treats straight to our customers with care, speed, and dedication. We take pride in building long-lasting trust with both retail snack lovers and business partners across North America."
              </blockquote>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Customer First Commitment</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>Global Confectionery Network</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight">
            Why Choose Ruby Red Sales & Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-[#d9232e] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Quality Guaranteed</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Reliable products selected to meet the highest customer standards with batch verification.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-[#d9232e] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Easy Ordering</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Browse, add to cart, and place your order with complete ease and instant confirmation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-[#d9232e] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Retail & Wholesale</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tailored solutions for individual retail buyers and commercial B2B business customers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-[#d9232e] flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Direct Support</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Quick assistance through WhatsApp, live messaging, and direct telephone communication.
              </p>
            </div>

          </div>
        </div>

        {/* Location & Commercial Info Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-[#d9232e] font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Headquarters Location</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Ruby Red Sales & Services</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              9909-A Harwin Dr., Houston, TX 77036, United States
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/wholesale')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Explore B2B Wholesale</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors cursor-pointer"
            >
              Return to Store
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
