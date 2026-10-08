import React from 'react';
import { STORE_INFO } from '../data/products';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ExternalLink, ArrowRight, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-b from-[#d9232e] via-[#bd1823] to-[#8d0f17] text-white pt-14 pb-10 border-t-4 border-amber-400 relative overflow-hidden">
      
      {/* Decorative Subtle Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* White Rectangle Card containing Official Logo Image */}
            <div className="inline-block">
              <div className="bg-white px-5 py-3 rounded-2xl shadow-lg border border-white/40 flex items-center justify-center cursor-pointer hover:scale-102 transition-transform" onClick={() => navigate('/')}>
                <img 
                  src="/images/logo.png" 
                  alt="Ruby Red Sales & Services" 
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-rose-100/90 text-xs leading-relaxed max-w-sm">
              Houston's premier importer and distributor for Japanese Ramune sodas, exotic chips, candy, and global confectionery. Supplying retail snack lovers and B2B commercial buyers across North America.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-300 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>100% Authentic & Fresh</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider border-b border-white/20 pb-2 inline-block">
              Navigation & Pages
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-rose-100">
              <li>
                <button 
                  onClick={() => navigate('/')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-rose-300 group-hover:translate-x-1 transition-transform" />
                  <span>Product Catalogue</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/wholesale')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-rose-300 group-hover:translate-x-1 transition-transform" />
                  <span>B2B Wholesale Portal</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/about')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-rose-300 group-hover:translate-x-1 transition-transform" />
                  <span>About Us & Founder's Message</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/wheel')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-rose-300 group-hover:translate-x-1 transition-transform" />
                  <span>12 Ramune Flavors Wheel</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/social')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-rose-300 group-hover:translate-x-1 transition-transform" />
                  <span>Follow Us on Social Media</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/orders')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group cursor-pointer font-bold text-amber-300"
                >
                  <ArrowRight className="w-3 h-3 text-rose-300 group-hover:translate-x-1 transition-transform" />
                  <span>Track & View Orders</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/admin')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-rose-300 group-hover:translate-x-1 transition-transform" />
                  <span>Admin Operations Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Houston HQ Location & Hours (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider border-b border-white/20 pb-2 inline-block">
              Houston HQ
            </h4>
            <div className="space-y-2.5 text-xs text-rose-100">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>9909-A Harwin Dr., Houston, TX 77036</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{STORE_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">{STORE_INFO.email}</span>
              </p>
              <p className="flex items-center gap-2 text-rose-200 pt-1">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Mon–Sat: 9am–6pm</span>
              </p>
            </div>
          </div>

          {/* Col 4: WhatsApp Direct Action Card (3 Cols) */}
          <div className="lg:col-span-3">
            <div className="bg-black/25 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-amber-300">
                <Phone className="w-4 h-4 fill-amber-300 text-amber-300" />
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  WhatsApp Direct Orders
                </h5>
              </div>
              
              <p className="text-[11px] text-rose-100 leading-relaxed">
                Connect directly with our Houston store team for immediate inventory checks, custom mix packs, or pallet pricing.
              </p>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappFormatted}?text=Hello%20Ruby%20Red!%20I%20have%20an%20inquiry%20about%20your%20products.`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-center text-xs transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Location Note */}
        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-100/80">
          <p>© 2026 Ruby Red Sales & Services. All Rights Reserved. • Houston, TX</p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span onClick={() => navigate('/about')} className="hover:text-amber-300 cursor-pointer transition-colors">Company Info</span>
            <span>•</span>
            <span onClick={() => navigate('/wholesale')} className="hover:text-amber-300 cursor-pointer transition-colors">B2B Portal</span>
            <span>•</span>
            <span className="text-amber-300 font-bold">Houston Store Pickup</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
