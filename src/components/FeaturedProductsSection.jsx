import React, { useState } from 'react';
import { ArrowRight, Eye, Star } from 'lucide-react';

export const FEATURED_PRODUCTS_DATA = [
  {
    id: "koikeya-karamucho-hot-chili-chips",
    name: "Koikeya Karamucho Hot Chili Potato Chips (Large)",
    shortDesc: "Japan's #1 iconic hot chili potato chips with savory garlic & umami kick",
    fullDesc: "The undisputed legend of Japanese spicy snacks since 1984! Koikeya Karamucho Hot Chili Potato Chips feature a proprietary blend of roasted red chilies, garlic, onion, and rich savory umami seasoning on crispy, golden-fried potato chips. Large size bag for maximum satisfaction.",
    price: 4.49,
    originalPrice: 5.99,
    stockStatus: "In Stock",
    stockCount: 320,
    rating: 5.0,
    image: "/images/koikeya_karamucho_hot_chili_chips.png",
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "115g (Large Size)",
      brand: "Koikeya (湖池屋)",
      flavor: "Hot Chili with Roasted Garlic & Umami",
      shelfLife: "8 Months",
      storage: "Store in a cool, dry place away from direct sunlight"
    },
    bullets: [
      "Japan's #1 best-selling spicy potato chip brand since 1984",
      "Generous large bag size with thick, crispy golden potato chips",
      "Proprietary umami chili blend with roasted garlic and onion"
    ],
    flavors: ["Hot Chili Large", "Mild Chili", "Extra Spicy"]
  },
  {
    id: "koikeya-karamucho-corn-snacks",
    name: "Koikeya Karamucho Hot Chili Corn Snacks",
    shortDesc: "Crunchy puffed corn snack sticks coated in bold spicy chili seasoning",
    fullDesc: "A fan-favorite Japanese texture sensation! These crunchy puffed corn sticks are loaded with Koikeya's signature Karamucho spicy chili seasoning. Delivering a delightful crunch followed by a mouthwatering kick of chili, savory spices, and sweet corn base.",
    price: 3.79,
    originalPrice: 4.99,
    stockStatus: "In Stock",
    stockCount: 275,
    rating: 4.9,
    image: "/images/koikeya_karamucho_hot_chili_snack.png",
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "2.2 oz (65g)",
      brand: "Koikeya (湖池屋)",
      flavor: "Hot Chili Puffed Corn Sticks",
      shelfLife: "8 Months",
      storage: "Store in a cool, dry place away from direct sunlight"
    },
    bullets: [
      "Crispy and airy puffed corn snack stick texture",
      "Coated generously in savory Karamucho red chili spices",
      "Direct import with certified Japanese freshness packaging"
    ],
    flavors: ["Hot Chili Sticks", "Spicy Corn", "Crunchy Fiery"]
  },
  {
    id: "koikeya-pure-potato-black-pepper",
    name: "Koikeya Pure Potato Gokochi Black Pepper Chips",
    shortDesc: "Extra thick sliced freshly cooked potato chips with cracked black pepper",
    fullDesc: "Crafted from 100% Japanese domestic potatoes cut into luxurious extra-thick slices (じゃがいも心地 Gokochi). Freshly cooked to achieve an elegant crispy crunch, generously dusted with aromatic freshly cracked black pepper and rock salt.",
    price: 3.99,
    originalPrice: 5.29,
    stockStatus: "In Stock",
    stockCount: 210,
    rating: 4.9,
    image: "/images/koikeya_pure_potato_black_pepper.png",
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "50g",
      brand: "Koikeya (湖池屋)",
      flavor: "Aromatic Cracked Black Pepper & Rock Salt",
      shelfLife: "6 Months",
      storage: "Store in a cool, dry place away from direct sunlight"
    },
    bullets: [
      "Made with 100% domestic Japanese selected potatoes",
      "Extra-thick slice cut for an exceptionally satisfying crunch",
      "Gourmet seasoning with coarsely ground black pepper and sea salt"
    ],
    flavors: ["Black Pepper & Salt", "Mild Pepper", "Extra Crisp"]
  },
  {
    id: "milka-oreo-chocolate",
    name: "Milka Oreo Alpine Milk Chocolate Bar",
    shortDesc: "Rich 100% Alpine milk chocolate loaded with crunchy Oreo cookie chunks",
    fullDesc: "Iconic European Milka chocolate made with 100% Alpine milk, encasing a creamy vanilla milk filling and crunchy Oreo cookie bits. The ultimate chocolate indulgence.",
    price: 3.99,
    originalPrice: 4.99,
    stockStatus: "In Stock",
    stockCount: 260,
    rating: 5.0,
    image: "/images/Milka Oreo Lavender Kitchen Still Life.png",
    overview: {
      origin: "🇨🇭 Europe / Germany",
      netWeight: "100g",
      brand: "Milka",
      flavor: "Alpine Milk Chocolate & Oreo Bits",
      shelfLife: "12 Months",
      storage: "Store in a cool, dry place"
    },
    bullets: [
      "Crafted with 100% Alpine milk from European farms",
      "Creamy vanilla creme filling with crunchy Oreo cookie pieces",
      "Imported authentic European confectionery"
    ],
    flavors: ["Classic Oreo", "White Oreo", "Mini Oreo"]
  },
  {
    id: "milka-cookies-hazelnuts",
    name: "Milka Cookies & Roasted Hazelnuts Bar",
    shortDesc: "Smooth Alpine chocolate packed with crunchy cookies & whole hazelnuts",
    fullDesc: "A delightful combination of delicate Alpine milk chocolate with crisp chocolate cookie pieces and crunchy roasted hazelnuts. Packed with flavor and texture.",
    price: 4.29,
    originalPrice: 5.49,
    stockStatus: "In Stock",
    stockCount: 195,
    rating: 4.9,
    image: "/images/Milka Cookies and Hazelnuts Still Life.png",
    overview: {
      origin: "🇨🇭 Europe / Germany",
      netWeight: "100g",
      brand: "Milka",
      flavor: "Roasted Hazelnuts & Crispy Cookies",
      shelfLife: "12 Months",
      storage: "Store in a cool, dry place"
    },
    bullets: [
      "Roasted European hazelnuts and crumbly cookie chunks",
      "Melt-in-your-mouth Alpine milk chocolate blend",
      "Perfect treat for chocolate and nut connoisseurs"
    ],
    flavors: ["Cookies & Hazelnut", "Whole Hazelnut", "Crushed Praline"]
  },
  {
    id: "milka-strawberry-chocolate",
    name: "Milka Strawberry Yogurt Chocolate Bar",
    shortDesc: "Silky Alpine chocolate with sweet strawberry fruit cream filling",
    fullDesc: "Mouthwatering Milka Alpine milk chocolate filled with refreshing strawberry yogurt cream and crisp fruit crunch bits. Sweet, creamy, and irresistibly fruity.",
    price: 3.99,
    originalPrice: 4.99,
    stockStatus: "In Stock",
    stockCount: 220,
    rating: 4.9,
    image: "/images/Milka Strawberry Chocolate Still Life.png",
    overview: {
      origin: "🇨🇭 Europe / Germany",
      netWeight: "100g",
      brand: "Milka",
      flavor: "Strawberry Fruit Cream & Alpine Milk",
      shelfLife: "10 Months",
      storage: "Store in a cool, dry place"
    },
    bullets: [
      "Luscious strawberry and yogurt cream layer",
      "Real strawberry fruit pieces inside smooth chocolate",
      "Imported premium European favorite"
    ],
    flavors: ["Strawberry Cream", "Raspberry Cream", "Wild Berries"]
  },
  {
    id: "milka-white-chocolate-dream",
    name: "Milka White Chocolate Dream Bar",
    shortDesc: "Velvety smooth pure white chocolate crafted with Alpine milk",
    fullDesc: "Pure indulgence for white chocolate lovers! Delicately sweet and creamy, crafted using only Alpine milk and fine cocoa butter for an ultra-velvety texture that melts on the tongue.",
    price: 3.99,
    originalPrice: 4.99,
    stockStatus: "In Stock",
    stockCount: 180,
    rating: 4.8,
    image: "/images/Milka White Chocolate Dream Still Life.png",
    overview: {
      origin: "🇨🇭 Europe / Germany",
      netWeight: "100g",
      brand: "Milka",
      flavor: "Pure Alpine White Chocolate",
      shelfLife: "12 Months",
      storage: "Store in a cool, dry place"
    },
    bullets: [
      "Silky rich white chocolate with delicate vanilla notes",
      "Made with authentic Alpine milk ingredients",
      "Rare imported European confection"
    ],
    flavors: ["Pure White", "White Coconut", "White Crispy Rice"]
  },
  {
    id: "fp-ramune-melon",
    name: "Hata Sweet Melon Ramune Soda",
    shortDesc: "Famous Hokkaido melon flavored marble soda",
    fullDesc: "Imported directly from Japan, this vibrant green Ramune soda captures the juicy aroma of fresh Hokkaido cantaloupe melon with delightful fizz.",
    price: 2.99,
    originalPrice: 3.99,
    stockStatus: "In Stock",
    stockCount: 310,
    rating: 4.8,
    image: "/images/ramune_poster.jpeg"
  }
];

export default function FeaturedProductsSection({ onAddToCart, onSelectProduct }) {
  const [addedIds, setAddedIds] = useState({});

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleViewProduct = (product, e) => {
    if (e) e.stopPropagation();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <section id="featured-products" className="py-6 sm:py-10 lg:py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Section Header Row - Clean mobile layout without negative margins */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-[#d9232e] tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden xs:block">
              Handpicked bestsellers & rare Japanese imports
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('shop');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 group shrink-0 cursor-pointer py-1 px-2 rounded-lg hover:bg-red-50"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Product Cards Grid: 2 columns on mobile, 3-4 columns on tablet & desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-5 lg:gap-6">
          {FEATURED_PRODUCTS_DATA.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div
                key={product.id}
                onClick={(e) => handleViewProduct(product, e)}
                className="group bg-white rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
              >
                <div>
                  {/* Product Image Frame with Top Right Rating Star */}
                  <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 mb-2 sm:mb-3 border border-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Top Right Rating Star Badge */}
                    <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10">
                      <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-amber-600 font-bold bg-white/95 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-2xs border border-amber-200/60">
                        <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-slate-900 text-xs xs:text-sm sm:text-base group-hover:text-[#d9232e] transition-colors leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Short One-Line Description (hidden on extra small to keep cards compact) */}
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed hidden xs:block">
                    {product.shortDesc}
                  </p>
                </div>

                {/* Bottom Section: View Details Button (No price displayed on front page) */}
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

      </div>
    </section>
  );
}
