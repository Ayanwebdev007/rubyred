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
    <section id="featured-products" className="pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-8 lg:pb-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header Row - Pushed significantly further outside of card grid alignment */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mx-4 sm:-mx-8 lg:-mx-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#d9232e] tracking-normal">
              Featured Products
            </h2>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('shop');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5 group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Featured Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {FEATURED_PRODUCTS_DATA.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div
                key={product.id}
                onClick={(e) => handleViewProduct(product, e)}
                className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Product Image Frame with Top Right Rating Star */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3.5 border border-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Top Right Rating Star Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-medium text-slate-900 text-base sm:text-lg group-hover:text-[#d9232e] transition-colors leading-snug line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Short One-Line Description */}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                {/* Bottom Section: Left = Discounted & Actual Price, Right = View Details Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Left Bottom: Discounted Price + Strikethrough Original Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Right Bottom: View Details Button */}
                  <button
                    onClick={(e) => handleViewProduct(product, e)}
                    className="py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold text-white bg-[#d9232e] hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-1 shadow-xs group-hover:shadow-md whitespace-nowrap"
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
