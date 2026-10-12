import React, { useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const CATEGORIES_DATA = [
  {
    id: "koikeya-snacks",
    name: "Koikeya Snacks",
    image: "/images/koikeya_karamucho_hot_chili_chips.png"
  },
  {
    id: "milka-chocolates",
    name: "Milka Chocolates",
    image: "/images/Milka Oreo Lavender Kitchen Still Life.png"
  },
  {
    id: "haribo-candies",
    name: "Haribo Gummies",
    image: "/images/Haribo Vampire Gummy Candy Bag.png"
  },
  {
    id: "maoam-chews",
    name: "MAOAM Kracher",
    image: "/images/MAOAM Kracher Candy Showcase.png"
  }
];

// Replicate categories array for seamless infinite looping
const REPEAT_COUNT = 4;
const REPEATED_CATEGORIES = Array.from({ length: REPEAT_COUNT }, () => CATEGORIES_DATA).flat();

export default function CategoriesSection({ onSelectCategory }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = scrollRef.current.scrollWidth / REPEAT_COUNT;
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    const singleSetWidth = scrollWidth / REPEAT_COUNT;
    if (singleSetWidth <= 0) return;

    if (scrollLeft < 15) {
      scrollRef.current.scrollLeft = singleSetWidth + scrollLeft;
    } else if (scrollLeft >= singleSetWidth * (REPEAT_COUNT - 1) - 15) {
      scrollRef.current.scrollLeft = scrollLeft - singleSetWidth;
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="categories" className="py-6 sm:py-10 lg:py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-6">
        
        {/* Header Row - Mobile responsive without negative margin clipping */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-[#d9232e] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden xs:block">
              Explore authentic imported treats by craving
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('featured-products') || document.getElementById('shop');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 group shrink-0 cursor-pointer py-1 px-2 rounded-lg hover:bg-red-50"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          
          {/* Left Arrow Button - Visible only on md+ screens so it doesn't block mobile touch swipe */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-slate-800 hover:bg-[#d9232e] hover:text-white border border-slate-200 shadow-lg items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button - Visible only on md+ screens */}
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-slate-800 hover:bg-[#d9232e] hover:text-white border border-slate-200 shadow-lg items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Horizontally Scrollable Categories Slider */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-center gap-3 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {REPEATED_CATEGORIES.map((cat, index) => (
              <div
                key={`${cat.id}-${index}`}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className="group/card cursor-pointer relative shrink-0 w-[125px] xs:w-[140px] sm:w-[190px] md:w-[220px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xs sm:shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/80 hover:border-red-500/40 active:scale-95 snap-start"
              >
                {/* Photo Background */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Bottom Red Label Bar */}
                <div className="absolute bottom-0 inset-x-0 w-full bg-[#d9232e] py-1.5 sm:py-2 px-2 text-center transition-colors">
                  <h3 className="font-semibold text-white text-xs sm:text-sm lg:text-base leading-tight line-clamp-1">
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
