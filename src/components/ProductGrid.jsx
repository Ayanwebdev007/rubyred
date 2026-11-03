import React from 'react';
import { Eye } from 'lucide-react';

/** Shared product card grid used by the Shop page. */
export default function ProductGrid({ products, onSelectProduct, showCategory = true, columns = 'lg:grid-cols-4' }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 ${columns} gap-2.5 sm:gap-3.5`}>
      {products.map((product) => {
        const name = product.title || product.name;
        const meta = [showCategory && product.categoryName, product.netWeight].filter(Boolean).join(' • ');
        return (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="group bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#d9232e]/30 transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
          >
            <div>
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-2">
                <img
                  src={product.img || product.image}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {product.inStock === false && (
                  <span className="absolute bottom-1.5 left-1.5 text-[10px] sm:text-xs font-bold bg-slate-900/85 text-white px-2 py-0.5 rounded-full">
                    Out of stock
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-[#d9232e] transition-colors leading-snug line-clamp-2 min-h-[2.5em]">
                {name}
              </h3>
              {meta && (
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{meta}</p>
              )}
            </div>
            <div className="mt-2">
              <span className="w-full py-1.5 sm:py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#d9232e] group-hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap">
                <Eye className="w-3.5 h-3.5" />
                View Details
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
