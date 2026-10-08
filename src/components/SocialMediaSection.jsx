import React from 'react';
import { ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <section id="social" className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Left-Aligned Header Matching Site Standard */}
        <div className="-mx-4 sm:-mx-8 lg:-mx-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#d9232e] bg-red-100 px-3 py-1 rounded-full border border-red-200">
              Stay Connected
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#d9232e] tracking-normal mt-2">
              Follow Us on Social Media
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>@rubyredsales across all platforms</span>
          </div>
        </div>

        {/* 2-Column Clean Layout: Left Picture Showpiece, Right 3 Social Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Background-Removed Mobile Image (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center items-center py-4">
            <img
              src="/images/instagram_mobile.png"
              alt="Ruby Red Sales Official Instagram Page"
              className="w-72 sm:w-80 lg:w-96 max-w-sm sm:max-w-md h-auto block object-contain filter drop-shadow-xl hover:scale-103 transition-transform duration-300"
            />
          </div>

          {/* Right Column: 3 Clean Social Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {socialChannels.map((chan, idx) => {
              const IconComponent = chan.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Brand Gradient Icon Badge */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${chan.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                          {chan.name}
                        </h3>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                          {chan.followers}
                        </span>
                      </div>
                      <p className="font-extrabold text-[#d9232e] text-sm">
                        {chan.handle}
                      </p>
                      <p className="text-xs text-slate-500">
                        {chan.desc}
                      </p>
                    </div>
                  </div>

                  <a
                    href={chan.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full sm:w-auto px-5 py-2.5 ${chan.btnBg} text-white font-bold text-xs sm:text-sm rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group/btn shrink-0 cursor-pointer`}
                  >
                    <span>Follow Us</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
