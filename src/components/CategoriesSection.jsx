import React, { useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const CATEGORIES_DATA = [
  {
    id: "snacks",
    name: "Snacks",
    image: "/images/cat_snacks.jpg"
  },
  {
    id: "chocolates",
    name: "Chocolates",
    image: "/images/cat_chocolates.jpg"
  },
  {
    id: "candies",
    name: "Candies",
    image: "/images/cat_candies.jpg"
  },
  {
    id: "ramune",
    name: "Ramune Soda",
    image: "/images/cat_ramune.jpg"
  },
  {
    id: "mochi",
    name: "Mochi & Soft Cake",
    image: "/images/cat_mochi.jpg"
  },
  {
    id: "cookies",
    name: "Cookies & Biscuits",
    image: "/images/cat_cookies.jpg"
  },
  {
    id: "beverages",
    name: "Exotic Beverages",
    image: "/images/cat_beverages.jpg"
  }
];

// Triplicate categories array to enable seamless 360° infinite horizontal looping
const TRIPLE_CATEGORIES = [...CATEGORIES_DATA, ...CATEGORIES_DATA, ...CATEGORIES_DATA];

export default function CategoriesSection({ onSelectCategory }) {
  const scrollRef = useRef(null);

  // Set initial scroll position to middle set on mount
  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = scrollRef.current.scrollWidth / 3;
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  // Seamless infinite loop scroll position handler
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    const singleSetWidth = scrollWidth / 3;

    // Instantly teleport position if approaching left or right boundaries
    if (scrollLeft < 20) {
      scrollRef.current.scrollLeft = singleSetWidth + scrollLeft;
    } else if (scrollLeft >= singleSetWidth * 2 - 20) {
      scrollRef.current.scrollLeft = scrollLeft - singleSetWidth;
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = 270; // Width of one category card + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="categories" className="pt-10 pb-6 sm:pt-12 sm:pb-8 lg:pt-14 lg:pb-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mx-4 sm:-mx-8 lg:-mx-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#d9232e] tracking-normal">
            Shop by Category
          </h2>

          <button
            onClick={() => {
              const el = document.getElementById('shop');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5 group cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Carousel Container with Both Side Arrows & Seamless Infinite Loop */}
        <div className="relative group/carousel">
          
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-[#d9232e] hover:text-white border border-slate-200 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Scroll Left"
            title="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-slate-800 hover:bg-[#d9232e] hover:text-white border border-slate-200 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Scroll Right"
            title="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Horizontally Scrollable Categories Slider */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-center gap-5 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}
          >
            {TRIPLE_CATEGORIES.map((cat, index) => (
              <div
                key={`${cat.id}-${index}`}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className="group/card cursor-pointer relative flex-shrink-0 w-[210px] sm:w-[230px] md:w-[245px] aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/70 hover:border-red-500/40 hover:-translate-y-2"
              >
                {/* Photo Background */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Thin Horizontal Rectangle Bar at the Bottom */}
                <div className="absolute bottom-0 inset-x-0 w-full bg-[#d9232e] py-2.5 px-3 text-center transition-colors duration-300">
                  <h3 className="font-medium text-white text-sm sm:text-base lg:text-lg leading-snug line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
