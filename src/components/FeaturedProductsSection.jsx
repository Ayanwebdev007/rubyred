import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, Star } from 'lucide-react';
import useCatalog, { pickFeatured } from '../hooks/useCatalog';

/**
 * Product grid.
 * - Home page (no categoryId): a featured mix across all categories.
 * - Category page (categoryId): every product in that category.
 */
export default function FeaturedProductsSection({ categoryId, onSelectProduct }) {
  const { categories, products, loading } = useCatalog();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const category = categoryId ? categories.find((c) => c.id === categoryId) : null;

  const visibleProducts = useMemo(() => {
    if (categoryId) return products.filter((p) => p.categoryId === categoryId);
    if (activeTab !== 'all') return products.filter((p) => p.categoryId === activeTab).slice(0, 12);
    return pickFeatured(products, 12);
  }, [products, categoryId, activeTab]);

  const handleViewProduct = (product, e) => {
    if (e) e.stopPropagation();
    if (onSelectProduct) onSelectProduct(product);
  };

  const title = categoryId ? (category?.title || category?.name || 'Category') : 'Featured Products';
  const subtitle = categoryId ? category?.description || '' : '';

  return (
    <section id="featured-products" className="py-6 sm:py-10 lg:py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

        {/* Section Header Row */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-[#d9232e] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden xs:block">
                {subtitle}
              </p>
            )}
          </div>

          {categoryId ? (
            <span className="text-xs sm:text-sm font-semibold text-slate-500 shrink-0">
              {visibleProducts.length} product{visibleProducts.length === 1 ? '' : 's'}
            </span>
          ) : (
            <button
              onClick={() => navigate(activeTab === 'all' ? '/shop' : `/category/${activeTab}`)}
              className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 group shrink-0 cursor-pointer py-1 px-2 rounded-lg hover:bg-red-50"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {!categoryId && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
            {[{ id: 'all', title: 'All' }, ...categories].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`shrink-0 px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === c.id
                    ? 'bg-[#d9232e] text-white border-[#d9232e]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#d9232e]/50 hover:text-[#d9232e]'
                }`}
              >
                {c.title || c.name}
              </button>
            ))}
          </div>
        )}

        {categoryId && !category && !loading ? (
          <div className="text-center py-16 text-sm text-slate-500">
            This category isn't available. Pick one of the categories above.
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-16 text-sm text-slate-500">
            {loading ? 'Loading products…' : 'No products in this category yet.'}
          </div>
        ) : (
          /* Responsive Product Cards Grid: 2 columns on mobile, 3-4 columns on tablet & desktop */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-5 lg:gap-6">
            {visibleProducts.map((product) => {
              const name = product.title || product.name;
              const image = product.img || product.image;
              const meta = [!categoryId && product.categoryName, product.netWeight].filter(Boolean).join(' • ');
              return (
                <div
                  key={product.id}
                  onClick={(e) => handleViewProduct(product, e)}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
                >
                  <div>
                    {/* Product Image Frame */}
                    <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white mb-2 sm:mb-3 border border-slate-100">
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {product.rating ? (
                        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10">
                          <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-amber-600 font-bold bg-white/95 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-2xs border border-amber-200/60">
                            <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      ) : null}

                      {product.inStock === false && (
                        <span className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 text-[10px] sm:text-xs font-bold bg-slate-900/85 text-white px-2 py-0.5 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-slate-900 text-xs xs:text-sm sm:text-base group-hover:text-[#d9232e] transition-colors leading-snug line-clamp-2">
                      {name}
                    </h3>

                    {meta && (
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed hidden xs:block">
                        {meta}
                      </p>
                    )}
                  </div>

                  {/* Bottom Section: View Details Button (No price displayed on product cards) */}
                  <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => handleViewProduct(product, e)}
                      className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
