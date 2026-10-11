import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

function InstagramIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.83V7.62a6.34 6.34 0 0 0-5.11 6.18A6.34 6.34 0 1 0 15.82 7.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

export default function SocialMediaSection() {
  const socialChannels = [
    {
      name: "Instagram",
      handle: "@rubyredsales",
      desc: "Daily exotic snack arrivals & behind the scenes",
      followers: "Official Feed",
      icon: InstagramIcon,
      gradient: "from-purple-600 via-pink-500 to-amber-500",
      btnBg: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      url: "https://instagram.com"
    },
    {
      name: "Facebook",
      handle: "Ruby Red Sales & Services",
      desc: "Wholesale updates & community announcements",
      followers: "Official Page",
      icon: FacebookIcon,
      gradient: "from-blue-600 to-indigo-700",
      btnBg: "bg-blue-600 hover:bg-blue-700",
      url: "https://facebook.com"
    },
    {
      name: "TikTok",
      handle: "@rubyredsnacks",
      desc: "Trending snack reviews & Ramune taste tests",
      followers: "Short Videos",
      icon: TikTokIcon,
      gradient: "from-slate-900 via-slate-800 to-[#00f2fe]",
      btnBg: "bg-slate-900 hover:bg-black",
      url: "https://tiktok.com"
    }
  ];

  return (
    <section id="social" className="py-8 sm:py-14 lg:py-20 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 relative z-10">
        
        {/* Header - Clean mobile alignment without negative margin clipping */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-[#d9232e] tracking-tight">
              Follow Us on Social Media
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-500 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-200 shadow-2xs w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>@rubyredsales across all platforms</span>
          </div>
        </div>

        {/* 2-Column Clean Layout: Left Picture Showpiece, Right 3 Social Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Background-Removed Mobile Image (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center items-center py-2 sm:py-4">
            <img
              src="/images/instagram_mobile.png"
              alt="Ruby Red Sales Official Instagram Page"
              className="w-56 xs:w-64 sm:w-80 lg:w-96 max-w-sm sm:max-w-md h-auto block object-contain filter drop-shadow-xl hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* Right Column: 3 Clean Social Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {socialChannels.map((chan, idx) => {
              const IconComponent = chan.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3 xs:p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-row items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 xs:gap-3.5 sm:gap-4 min-w-0">
                    {/* Brand Gradient Icon Badge */}
                    <div className={`w-10 h-10 xs:w-12 xs:h-12 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${chan.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm xs:text-base sm:text-lg leading-tight truncate">
                        {chan.name}
                      </h3>
                      <p className="font-bold text-[#d9232e] text-[11px] xs:text-xs sm:text-sm truncate">
                        {chan.handle}
                      </p>
                    </div>
                  </div>

                  <a
                    href={chan.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3 xs:px-4 sm:px-5 py-2 sm:py-2.5 ${chan.btnBg} active:scale-95 text-white font-bold text-[11px] xs:text-xs sm:text-sm rounded-xl sm:rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1 sm:gap-1.5 group/btn shrink-0 whitespace-nowrap cursor-pointer`}
                  >
                    <span>Follow Us</span>
                    <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
