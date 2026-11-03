import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useCatalog from '../hooks/useCatalog';

// Ruby Red brand palette: brand red (#d9232e), logo gold and deep red, alternated across cards
const BRAND_ACCENTS = [
  { from: '#fff1f2', to: '#fecdd3', ink: '#d9232e' },   // soft ruby
  { from: '#fff8e1', to: '#fde68a', ink: '#b91c1c' },   // logo gold
  { from: '#ffe4e6', to: '#fda4af', ink: '#9f1239' }    // deep ruby
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, products } = useCatalog();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-[#d9232e] tracking-tight px-1">All Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, index) => {
            const items = products.filter((p) => p.categoryId === cat.id);
            const accent = BRAND_ACCENTS[index % BRAND_ACCENTS.length];
            const collage = items.slice(0, 4);
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="group text-left bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-[#d9232e]/40 shadow-sm hover:shadow-xl hover:shadow-red-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Banner: tinted background with a product collage */}
                <div
                  className="relative h-52 sm:h-56 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
                >
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/30" />
                  <div className="absolute -left-8 -bottom-12 w-36 h-36 rounded-full bg-white/25" />

                  <div className="absolute inset-0 grid grid-cols-4 items-end gap-2 px-4 pb-8 pt-12">
                    {collage.map((p, i) => (
                      <div
                        key={p.id}
                        className={`aspect-[3/4] rounded-2xl bg-white shadow-md p-1.5 flex items-center justify-center transition-transform duration-500 ${
                          i % 2 === 0 ? 'group-hover:-translate-y-2' : 'translate-y-3 group-hover:translate-y-0'
                        }`}
                      >
                        <img src={p.img || p.image} alt="" loading="lazy" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>

                  <span
                    className="absolute top-3 left-3 text-[11px] sm:text-xs font-bold bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-xs"
                    style={{ color: accent.ink }}
                  >
                    {items.length} products
                  </span>

                  <img
                    src="/images/logo.png"
                    alt="Ruby Red"
                    className="absolute top-4 right-4 h-9 sm:h-10 w-auto object-contain drop-shadow-sm"
                  />

                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3 text-center">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#d9232e] transition-colors">
                      {cat.title || cat.name}
                    </h2>
                    {cat.description && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-2">{cat.description}</p>
                    )}
                  </div>
                  <span className="mt-auto w-full py-2.5 rounded-xl bg-[#d9232e] group-hover:bg-[#b91c1c] text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-colors">
                    Shop {cat.title || cat.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
