import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, ArrowRight, Share2 } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import WhatsAppIcon from './WhatsAppIcon';

const RED = '#d9232e';
const MAP_QUERY = encodeURIComponent(STORE_INFO.address);

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', topic: 'Retail order', message: '' });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = [
      `Hello RUBY RED! (${form.topic})`,
      `Name: ${form.name}`,
      form.phone && `Phone: ${form.phone}`,
      '',
      form.message
    ].filter((line) => line !== false && line !== undefined).join('\n');
    window.open(`https://wa.me/${STORE_INFO.whatsappFormatted}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const cards = [
    { icon: Phone, label: 'Call Us', value: STORE_INFO.phone, href: `tel:+1${STORE_INFO.phone.replace(/\D/g, '')}` },
    { icon: WhatsAppIcon, label: 'WhatsApp', value: STORE_INFO.phone, href: `https://wa.me/${STORE_INFO.whatsappFormatted}` },
    { icon: Mail, label: 'Email', value: STORE_INFO.email, href: `mailto:${STORE_INFO.email}` },
    { icon: MapPin, label: 'Visit Us', value: STORE_INFO.address, href: `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}` }
  ];

  const input = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d9232e] focus:bg-white transition-colors';

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative h-64 sm:h-80 flex items-center justify-center overflow-hidden">
        <img src="/images/warehouse_distribution_hub.jpg" alt="Ruby Red warehouse" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a0d] via-[#7f1d1d]/75 to-black/30" />
        <div className="relative text-center px-4 space-y-3">
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">Get in Touch</h1>
          <p className="text-lg sm:text-2xl font-semibold text-amber-300 italic">We're truly Exotic!</p>
        </div>
      </section>

      {/* Contact cards, overlapping the hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-5">
          {cards.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="group min-w-0 bg-white rounded-2xl sm:rounded-3xl p-3 xs:p-4 sm:p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-[#d9232e]/40 transition-all text-center flex flex-col items-center gap-2 sm:gap-3"
            >
              <span
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                style={{ backgroundColor: RED }}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.15em] text-[#d9232e]">{label}</span>
              <span className="w-full text-xs sm:text-sm font-semibold text-slate-900 wrap-anywhere">{value}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Form + map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#d9232e]">Message Us</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Send us a message</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required className={input} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={input} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <select className={input} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
            <option>Retail order</option>
            <option>Wholesale / bulk pricing</option>
            <option>Product availability</option>
            <option>Order status</option>
            <option>Other</option>
          </select>
          <textarea required rows={5} className={input} placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <Send className="w-4 h-4" /> Send via WhatsApp
          </button>
        </form>

        <div className="flex flex-col gap-6">
          <div className="flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              title="Ruby Red location map"
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              className="w-full h-full min-h-[300px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-3xl p-5 sm:p-6 text-white bg-gradient-to-br from-[#2a0709] via-[#5c0f14] to-[#9b1c22] flex items-start gap-4">
            <span className="w-11 h-11 shrink-0 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-amber-300 mb-1">Store Hours</p>
              {STORE_INFO.hours.split('|').map((h) => (
                <p key={h} className="text-sm sm:text-base font-semibold">{h.trim()}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale banner */}
      <section className="relative overflow-hidden">
        <img src="/images/b2b_wholesale.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3b0a0d] via-[#3b0a0d]/85 to-[#3b0a0d]/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">Wholesale & B2B</span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">Stock Ruby Red in your store</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/wholesale')}
              className="px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 transition"
              style={{ backgroundColor: RED }}
            >
              Apply for Wholesale <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/social')}
              className="px-7 py-3.5 rounded-full font-bold text-sm bg-white text-slate-900 hover:bg-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Follow Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
