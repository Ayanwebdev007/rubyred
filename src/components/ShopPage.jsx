import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import useCatalog from '../hooks/useCatalog';
import ProductGrid from './ProductGrid';

const SORTS = {
  featured: { label: 'Featured', fn: null },
  'name-asc': { label: 'Name: A to Z', fn: (a, b) => (a.title || '').localeCompare(b.title || '') },
  'name-desc': { label: 'Name: Z to A', fn: (a, b) => (b.title || '').localeCompare(a.title || '') },
  newest: { label: 'Newest', fn: (a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')) }
};

export default function ShopPage({ searchQuery = '', setSearchQuery }) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { categories, products, loading } = useCatalog();
  const [sort, setSort] = useState('featured');

  const activeCat = params.get('category') || 'all';
  const query = searchQuery.trim().toLowerCase();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const counts = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.categoryId] = (map[p.categoryId] || 0) + 1; });
    return map;
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) => activeCat === 'all' || p.categoryId === activeCat);
    if (query) {
      list = list.filter((p) =>
        [p.title, p.name, p.categoryName, p.sku, p.barcode, p.origin]
          .some((v) => String(v || '').toLowerCase().includes(query))
      );
    }
    const fn = SORTS[sort].fn;
    return fn ? [...list].sort(fn) : list;
  }, [products, activeCat, query, sort]);

  const setCategory = (id) => {
    if (id === 'all') params.delete('category');
    else params.set('category', id);
    setParams(params, { replace: true });
  };

  const categoryItems = [
    { id: 'all', label: 'All Products', count: products.length, img: null },
    ...categories.map((c) => ({ id: c.id, label: c.title || c.name, count: counts[c.id] || 0, img: c.img || c.image }))
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-2 pb-6">
      <div className="max-w-[1680px] mx-auto px-3 sm:px-5 lg:px-6">

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 items-start">

          {/* Category sidebar (horizontal scroll row on mobile) */}
          <aside className="w-full lg:w-60 shrink-0 lg:sticky lg:top-22">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1.5 lg:p-2">
              <h2 className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-wider px-2.5 pt-1.5 pb-1.5">
                Categories
              </h2>
              <nav className="flex lg:flex-col gap-1.5 lg:gap-0.5 overflow-x-auto no-scrollbar">
                {categoryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCategory(item.id)}
                    className={`shrink-0 flex items-center justify-between gap-2 pl-1.5 pr-3 py-1.5 rounded-xl text-sm font-semibold text-left whitespace-nowrap transition-colors cursor-pointer ${
                      activeCat === item.id
                        ? 'bg-[#d9232e] text-white'
                        : 'text-slate-700 hover:bg-red-50 hover:text-[#d9232e]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 shrink-0 rounded-lg bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                        {item.img ? (
                          <img src={item.img} alt="" className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <LayoutGrid className="w-4 h-4 text-[#d9232e]" />
                        )}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className={`text-xs ${activeCat === item.id ? 'text-white/80' : 'text-slate-400'}`}>{item.count}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0 w-full space-y-3">
        {/* Search + sort */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-2.5 flex flex-col md:flex-row gap-2.5 md:items-center">
            <h1 className="text-lg sm:text-xl font-bold text-[#d9232e] tracking-tight px-1.5 whitespace-nowrap">
              Shop All Products
              <span className="ml-2 text-xs font-semibold text-slate-400">{visible.length} items</span>
            </h1>
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#d9232e]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="Search by name, SKU or barcode…"
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none min-w-0"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="Clear search">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
              <SlidersHorizontal className="w-4 h-4 shrink-0 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#d9232e] cursor-pointer"
              >
                {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
              </select>
            </label>
        </div>

        {query && (
          <p className="text-xs sm:text-sm text-slate-500 px-1">
            Results for “<span className="font-semibold text-slate-800">{searchQuery}</span>”
          </p>
        )}

        {visible.length > 0 ? (
          <ProductGrid columns="lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" products={visible} onSelectProduct={(p) => navigate(`/product/${p.id}`)} showCategory={activeCat === 'all'} />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 py-16 text-center space-y-3">
            <p className="text-sm text-slate-500">{loading ? 'Loading products…' : 'No products match your search.'}</p>
            {!loading && (query || activeCat !== 'all') && (
              <button
                onClick={() => { setSearchQuery && setSearchQuery(''); setCategory('all'); }}
                className="text-sm font-bold text-[#d9232e] hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
