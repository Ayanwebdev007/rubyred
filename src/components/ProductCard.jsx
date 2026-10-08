import React from 'react';
import { ShoppingBag, Star, ShieldCheck, Tag, Plus, Check } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import WhatsAppIcon from './WhatsAppIcon';

export default function ProductCard({ product, userMode, onAddToCart, onSelectFor3D }) {
  const [added, setAdded] = React.useState(false);
  const isB2B = userMode === 'b2b';

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hello RUBY RED! I am inquiring about *${product.name}* (${isB2B ? 'B2B Case Wholesale' : 'Retail Order'}). Quantity needed: 1 ${isB2B ? 'Case (' + product.caseQty + ' units)' : 'Unit'}.`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappFormatted}?text=${text}`, '_blank');
  };

  return (
    <div 
      onClick={() => onSelectFor3D && onSelectFor3D(product)}
      className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group relative cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
          {product.origin}
        </span>
        {isB2B && (
          <span className="bg-amber-500 text-slate-950 font-bold text-[11px] px-2 py-0.5 rounded-full shadow-md">
            Wholesale Tier
          </span>
        )}
      </div>

      {/* Product Image Box */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900/50 flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800/80 text-rose-300 border border-rose-900/40">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-100 text-base group-hover:text-rose-400 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Cart Section */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              {isB2B ? (
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-amber-400">
                      ${(product.b2bPrice * product.caseQty).toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">/ case</span>
                  </div>
                  <p className="text-[11px] text-amber-300/80 font-medium">
                    ${product.b2bPrice.toFixed(2)} per unit ({product.caseQty} units/case)
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-white">
                      ${product.retailPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">/ {product.unit}</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3" /> In Stock ({product.stock} avail)
                  </p>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                added
                  ? 'bg-emerald-600 text-white'
                  : isB2B
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> {isB2B ? 'Add Case' : 'Add to Cart'}
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 transition-all flex items-center justify-center gap-1.5"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-300 shrink-0" /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
