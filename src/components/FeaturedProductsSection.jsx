import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Check, X, Star, ShieldCheck } from 'lucide-react';

export const FEATURED_PRODUCTS_DATA = [
  {
    id: "fp-ramune-orig",
    name: "Sangaria Ramune Original Soda",
    shortDesc: "Authentic Japanese marble glass soda with classic fizz",
    fullDesc: "Experience the iconic Japanese refreshment! Sangaria Ramune features the traditional Codd-neck glass bottle sealed with a glass marble. Sparkling, crisp, and delightfully sweet.",
    price: 2.99,
    originalPrice: 3.99,
    stockStatus: "In Stock",
    stockCount: 450,
    rating: 4.9,
    image: "/images/cat_ramune.jpg"
  },
  {
    id: "fp-snacks-crack",
    name: "Kyoto Umami Seaweed Crackers",
    shortDesc: "Premium handcrafted savory roasted rice crackers",
    fullDesc: "Handcrafted in Kyoto, these crispy rice crackers are roasted to perfection and seasoned with authentic Kyushu nori seaweed and rich umami soy glaze.",
    price: 3.99,
    originalPrice: 4.99,
    stockStatus: "In Stock",
    stockCount: 280,
    rating: 4.9,
    image: "/images/cat_snacks.jpg"
  },
  {
    id: "fp-choco-ruby",
    name: "Hoshi Artisan Ruby Chocolate Bar",
    shortDesc: "Luxury German cocoa bar with smooth berry notes",
    fullDesc: "Crafted with rare ruby cocoa beans, this artisan chocolate offers a natural pink color and a velvety balance of rich milk chocolate and fresh berry notes.",
    price: 4.49,
    originalPrice: 5.99,
    stockStatus: "In Stock",
    stockCount: 190,
    rating: 5.0,
    image: "/images/cat_chocolates.jpg"
  },
  {
    id: "fp-gummy-fruit",
    name: "Nature's Joy Juicy Fruit Mix Gummies",
    shortDesc: "Real Japanese fruit juice chewy gummy candies",
    fullDesc: "Made with 100% real fruit juice concentrate including Kyoho grape, Yamanashi white peach, and Satsuma mandarin orange. Soft, chewy, and intensely flavorful.",
    price: 3.49,
    originalPrice: 4.49,
    stockStatus: "In Stock",
    stockCount: 320,
    rating: 4.8,
    image: "/images/cat_candies.jpg"
  },
  {
    id: "fp-bev-citrus",
    name: "Citrus Burst Sparkling Beverage",
    shortDesc: "Refreshing ice-cold citrus soda with natural lime",
    fullDesc: "A crisp, electrifying sparkling citrus drink packed with natural lemon and lime extracts. Served ice cold for maximum fruity refreshment.",
    price: 2.49,
    originalPrice: 3.29,
    stockStatus: "In Stock",
    stockCount: 510,
    rating: 4.7,
    image: "/images/cat_beverages.jpg"
  },
  {
    id: "fp-cookie-matcha",
    name: "Sencha Matcha Cookies & Cream",
    shortDesc: "Crispy biscuit wafers filled with sweet matcha cream",
    fullDesc: "Delicate sandwich cookie wafers filled with smooth green tea matcha cream harvested from Uji tea fields. A classic Japanese tea-time treat.",
    price: 3.99,
    originalPrice: 4.99,
    stockStatus: "In Stock",
    stockCount: 230,
    rating: 4.9,
    image: "/images/cat_cookies.jpg"
  },
  {
    id: "fp-mochi-sakura",
    name: "Sakura & Matcha Daifuku Mochi",
    shortDesc: "Soft Japanese rice cake with fresh strawberry filling",
    fullDesc: "Pillowy soft mochi rice cakes handcrafted with sweet adzuki bean paste, fresh strawberry compote, and ceremonial grade matcha powder.",
    price: 4.99,
    originalPrice: 6.49,
    stockStatus: "In Stock",
    stockCount: 140,
    rating: 5.0,
    image: "/images/cat_mochi.jpg"
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

                {/* Bottom Section: Price + View Details Button */}
                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
                  {/* Left: Discounted Price + Strikethrough Original Price */}
                  <div className="flex items-baseline gap-1 sm:gap-1.5">
                    <span className="text-sm xs:text-base sm:text-lg font-extrabold text-slate-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Right: View Details CTA */}
                  <button
                    onClick={(e) => handleViewProduct(product, e)}
                    className="w-full xs:w-auto py-1.5 px-2 xs:px-2.5 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-white bg-[#d9232e] hover:bg-[#b91c1c] active:scale-95 transition-all flex items-center justify-center gap-1 shadow-xs whitespace-nowrap cursor-pointer"
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">View Details</span>
                    <span className="xs:hidden">Details</span>
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
