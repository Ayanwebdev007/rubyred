import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Building2, ShieldCheck, Truck, Globe, Store, ArrowRight } from 'lucide-react';
import useCatalog from '../hooks/useCatalog';
import { STORE_INFO } from '../data/products';

const RED = '#d9232e';

function SectionHeading({ eyebrow, title, light = false }) {
  return (
    <div className="space-y-2">
      <span className={`inline-block text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] ${light ? 'text-amber-300' : 'text-[#d9232e]'}`}>
        {eyebrow}
      </span>
      <h2 className={`text-2xl sm:text-4xl font-semibold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
    </div>
  );
}

export default function AboutUsPage() {
  const navigate = useNavigate();
  const { categories, products } = useCatalog();
  const countries = new Set(products.map((p) => p.origin).filter((o) => o && !o.includes('Imported')));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const stats = [
    { value: `${products.length}+`, label: 'Products' },
    { value: categories.length, label: 'Categories' },
    { value: `${countries.size}+`, label: 'Countries Sourced' },
    { value: 'B2C + B2B', label: 'Retail & Wholesale' }
  ];

  const pillars = [
    { img: '/images/warehouse_distribution_hub.jpg', icon: Globe, title: 'Global Sourcing', text: 'Direct imports from Asia, Europe and Latin America.' },
    { img: '/images/b2b_wholesale.jpg', icon: Store, title: 'Wholesale Supply', text: 'Case-pack pricing for stores, gas stations and markets.' },
    { img: '/images/b2b_wholesale.png', icon: Truck, title: 'Delivery Across the USA', text: 'Packed in Houston, shipped nationwide.' }
  ];

  const values = [
    { icon: ShieldCheck, title: '100% Authentic' },
    { icon: Building2, title: 'Houston Warehouse' },
    { icon: Truck, title: 'Fast Dispatch' },
    { icon: Phone, title: 'Direct Support' }
  ];

  return (
    <div className="bg-white">

      {/* 1. Hero */}
      <section className="relative min-h-[420px] sm:min-h-[520px] flex items-end overflow-hidden">
        <img src="/images/ruby_red_warehouse.jpg" alt="Ruby Red warehouse" className="absolute inset-0 w-full h-full object-cover object-[center_22%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a0d] via-[#7f1d1d]/70 to-black/20" />
        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
            Taste the World,<br />One Snack at a Time.
          </h1>
          <p className="text-lg sm:text-2xl font-semibold text-amber-300 italic">We're truly Exotic!</p>
        </div>
      </section>

      {/* 2. Stats band */}
      <section style={{ backgroundColor: RED }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="py-6 sm:py-8 px-1 text-center border-white/20 odd:border-r lg:border-r lg:last:border-r-0 [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0">
              <p className="text-2xl sm:text-4xl font-black text-white">{s.value}</p>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-white/90 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <img src="/images/b2b_wholesale.jpg" alt="Ruby Red store display" className="relative z-10 w-full aspect-[4/3] object-cover rounded-3xl shadow-xl" />
          <img
            src="/images/ruby_red_banner.jpeg"
            alt="Ruby Red brand"
            className="hidden sm:block absolute z-20 -bottom-8 -right-6 w-1/2 aspect-[3/2] object-cover rounded-2xl border-4 border-white shadow-2xl"
          />
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-3xl" style={{ backgroundColor: RED }} />
        </div>

        <div className="space-y-5">
          <SectionHeading eyebrow="Our Story" title="Houston's home for exotic snacks & beverages" />
          <p className="text-slate-600 leading-relaxed">
            Ruby Red Sales & Services imports and distributes international snacks, candy, chocolates and drinks from our
            warehouse at {STORE_INFO.address.split(',')[0]} in Houston, Texas.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We serve snack lovers shopping for something new, and the convenience stores, gas stations and supermarkets
            that stock our products by the case.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 rounded-full text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              style={{ backgroundColor: RED }}
            >
              Shop Products <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/wholesale')}
              className="px-6 py-3 rounded-full font-bold text-sm border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
            >
              Become a Wholesale Partner
            </button>
          </div>
        </div>
      </section>

      {/* 4. What we do */}
      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <SectionHeading eyebrow="What We Do" title="From global brands to your shelf" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {pillars.map(({ img, icon: Icon, title, text }) => (
              <div key={title} className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg">
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a0d] via-[#3b0a0d]/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 space-y-2">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: RED }}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Founder */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2a0709] via-[#5c0f14] to-[#9b1c22]">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <img src="/images/founder.png" alt="Salim NM, Founder" className="w-full rounded-3xl border-4 border-amber-400/70 shadow-2xl" />
              <div className="absolute -bottom-5 left-4 sm:-left-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-5 py-3 rounded-2xl border-2 border-white shadow-xl">
                <p className="font-black leading-none">Salim NM</p>
                <p className="text-xs font-bold mt-1">Founder</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading eyebrow="Leadership" title="A message from our founder" light />
            <blockquote className="text-lg sm:text-2xl text-white/90 leading-relaxed font-light border-l-4 border-amber-400 pl-5">
              “Our commitment has always been simple: bring authentic, high-quality global treats to our customers with
              care, speed and dedication, and build lasting trust with every retail and business partner.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* 6. Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
          <SectionHeading eyebrow="Why Ruby Red" title="Built on trust, freshness and service" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {values.map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-center gap-2.5 xs:gap-3 p-3 xs:p-4 rounded-2xl min-w-0 border border-slate-200 hover:border-[#d9232e]/40 hover:shadow-md transition-all">
                <span className="w-9 h-9 xs:w-11 xs:h-11 shrink-0 rounded-xl bg-red-50 flex items-center justify-center" style={{ color: RED }}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="font-bold text-sm sm:text-base text-slate-900 min-w-0">{title}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/category/${c.id}`)}
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-red-50 text-[#d9232e] border border-red-100 hover:bg-[#d9232e] hover:text-white transition-colors cursor-pointer"
              >
                {c.title || c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-3xl bg-amber-400" />
          <img src="/images/why_us_person.png" alt="Ruby Red team" className="relative w-full max-h-[520px] object-cover object-top rounded-3xl shadow-xl" />
        </div>
      </section>

      {/* 7. Visit us */}
      <section className="relative overflow-hidden">
        <img src="/images/warehouse_distribution_hub.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#3b0a0d]/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <SectionHeading eyebrow="Visit Us" title="Come see the warehouse" light />
            <div className="space-y-3 text-white/90 text-sm sm:text-base">
              <p className="flex items-start gap-3"><MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />{STORE_INFO.address}</p>
              <p className="flex items-start gap-3"><Phone className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />{STORE_INFO.phone}</p>
              <p className="flex items-start gap-3"><Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />{STORE_INFO.hours}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 transition"
              style={{ backgroundColor: RED }}
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_INFO.address)}`}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-full font-bold text-sm bg-white text-slate-900 hover:bg-amber-300 transition-colors text-center"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
