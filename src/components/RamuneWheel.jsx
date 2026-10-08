import React, { useState } from 'react';
import { RAMUNE_FLAVORS } from '../data/products';
import { Sparkles, ShoppingBag, Check, Plus, RefreshCw, Star } from 'lucide-react';

export default function RamuneWheel({ onSelectRamuneFlavor, onAddToCart }) {
  const [selectedFlavor, setSelectedFlavor] = useState(RAMUNE_FLAVORS[0]);
  const [varietyPack, setVarietyPack] = useState({});

  const handleFlavorClick = (flavor) => {
    setSelectedFlavor(flavor);
    if (onSelectRamuneFlavor) {
      onSelectRamuneFlavor(flavor);
    }
  };

  const handleAddToVariety = (flavorName) => {
    setVarietyPack(prev => {
      const current = prev[flavorName] || 0;
      return { ...prev, [flavorName]: current + 1 };
    });
  };

  const totalBottlesInPack = Object.values(varietyPack).reduce((a, b) => a + b, 0);

  const handleAddCustomVarietyCase = () => {
    const customItem = {
      id: `ramune-variety-case-${Date.now()}`,
      name: `Custom 12-Flavor Ramune Variety Case (${totalBottlesInPack} Bottles)`,
      category: "ramune",
      retailPrice: 29.99,
      b2bPrice: 18.50,
      unit: "Case (12 Bottles)",
      caseQty: 12,
      image: "/images/ramune_banner.jpg",
      description: `Custom mix of Ramune flavors: ${Object.entries(varietyPack).map(([f, c]) => `${f} x${c}`).join(', ')}`,
      tags: ["Variety Pack", "Custom Case"],
      inStock: true
    };
    onAddToCart(customItem);
  };

  return (
    <section className="py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Authentic Japanese Glass Marble Soda</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore All <span className="gradient-text-ruby">12 Amazing Ramune Flavors</span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Click any flavor below to update the interactive 3D Ramune Bottle preview, sample flavor profiles, or build your own custom variety case!
        </p>
      </div>

      {/* Flavor Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {RAMUNE_FLAVORS.map((flavor, idx) => {
          const isSelected = selectedFlavor.name === flavor.name;
          return (
            <button
              key={idx}
              onClick={() => handleFlavorClick(flavor)}
              className={`p-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-between text-center relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500 shadow-xl shadow-rose-950/50 scale-105'
                  : 'glass-card hover:border-slate-700'
              }`}
            >
              {/* Color Accent Pill */}
              <div 
                className="w-10 h-10 rounded-full mb-3 shadow-lg border-2 border-white/20 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: flavor.color }}
              >
                <span className="text-white text-xs font-bold font-mono">#{idx+1}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  {flavor.brand}
                </span>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                  {flavor.name}
                </h4>
              </div>

              {/* Add to Custom Variety Case */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToVariety(flavor.name);
                }}
                className="mt-3 w-full py-1.5 px-2 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white rounded-xl text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add to Case ({varietyPack[flavor.name] || 0})
              </button>
            </button>
          );
        })}
      </div>

      {/* Selected Flavor Highlight Banner & Variety Case Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Flavor Details Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-rose-500/30 flex flex-col sm:flex-row items-center gap-6">
          <div 
            className="w-24 h-24 rounded-3xl flex-shrink-0 flex items-center justify-center shadow-2xl border-4 border-white/10"
            style={{ backgroundColor: selectedFlavor.color }}
          >
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/40">
                {selectedFlavor.brand} Japan
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Star className="w-3.5 h-3.5 fill-emerald-400" /> 4.9 Rating
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              {selectedFlavor.name} Ramune
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedFlavor.desc} Packed in classic 200ml glass Codd-neck bottle with marble seal.
            </p>
          </div>
        </div>

        {/* Custom Variety Pack Builder Drawer */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Variety Pack Builder
              </h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full">
                {totalBottlesInPack} / 12 Bottles
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mix and match your favorite 12 Ramune flavors into a custom crate!
            </p>

            {/* Pack breakdown list */}
            <div className="mt-3 max-h-32 overflow-y-auto space-y-1.5 text-xs text-slate-300">
              {Object.keys(varietyPack).length === 0 ? (
                <p className="text-slate-500 italic py-2">Click "+ Add to Case" on flavors above to customize your 12-pack.</p>
              ) : (
                Object.entries(varietyPack).map(([flavorName, qty], i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-900/60 px-2.5 py-1 rounded-lg">
                    <span>{flavorName}</span>
                    <span className="font-bold text-amber-400">x{qty}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Custom Case Price</span>
              <span className="text-xl font-extrabold text-white">$29.99</span>
            </div>
            <button
              disabled={totalBottlesInPack === 0}
              onClick={handleAddCustomVarietyCase}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                totalBottlesInPack > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Add Variety Case
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
