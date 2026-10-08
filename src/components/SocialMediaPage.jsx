import React from 'react';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function SocialMediaPage() {
  const navigate = useNavigate();

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
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#d9232e] transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>

          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-red-100 text-[#d9232e] border border-red-200">
            Official Social Media Hub
          </span>
        </div>

        {/* Clean Page Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-medium text-[#d9232e] tracking-tight">
            Follow Ruby Red
          </h1>
          <p className="text-base text-slate-600">
            Join our community across Instagram, Facebook, and TikTok for the latest exotic snack releases, Ramune soda flavors, and wholesale updates.
          </p>
        </div>

        {/* Layout Grid: Left Instagram Screenshot, Right 3 Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          <div className="lg:col-span-6 flex justify-center items-center py-4">
            <img
              src="/images/instagram_mobile.png"
              alt="Ruby Red Official Instagram"
              className="w-72 sm:w-80 lg:w-96 max-w-sm sm:max-w-md h-auto block object-contain filter drop-shadow-xl hover:scale-103 transition-transform duration-300"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            {socialChannels.map((chan, idx) => {
              const IconComponent = chan.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${chan.gradient} text-white flex items-center justify-center shrink-0 shadow-md`}>
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-xl">{chan.name}</h3>
                      <p className="font-extrabold text-[#d9232e] text-sm">{chan.handle}</p>
                      <p className="text-xs text-slate-500">{chan.desc}</p>
                    </div>
                  </div>

                  <a
                    href={chan.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-5 py-2.5 ${chan.btnBg} text-white font-bold text-xs sm:text-sm rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 shrink-0`}
                  >
                    <span>Follow</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
