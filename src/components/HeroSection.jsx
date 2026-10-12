import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDE_IMAGES = [
  {
    src: '/images/Delivered Karamucho Delight.png',
    alt: 'Ruby Red - Delivered Karamucho Delight Anywhere in USA',
    objectPosition: 'center 38%'
  },
  {
    src: '/images/Milka Delivered Across the USA.png',
    alt: 'Ruby Red - Milka Delivered Across the USA',
    objectPosition: 'center 38%'
  }
];

// Extended list with clones at ends for seamless infinite loop without rewind glitches
const EXTENDED_SLIDES = [
  SLIDE_IMAGES[SLIDE_IMAGES.length - 1], // clone of last
  ...SLIDE_IMAGES,
  SLIDE_IMAGES[0]                        // clone of first
];

export default function HeroSection() {
  const navigate = useNavigate();

  // currentIndex in EXTENDED_SLIDES: 1 corresponds to SLIDE_IMAGES[0]
  const [currentIndex, setCurrentIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const trackRef = useRef(null);

  // Active dot index (0, 1, or 2)
  const activeDotIndex = (currentIndex - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length;

  const handleNext = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const handleDotClick = (idx) => {
    setWithTransition(true);
    setCurrentIndex(idx + 1);
  };

  // Reset seamless loop when hitting cloned ends
  const handleTransitionEnd = () => {
    if (currentIndex >= EXTENDED_SLIDES.length - 1) {
      setWithTransition(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setWithTransition(false);
      setCurrentIndex(EXTENDED_SLIDES.length - 2);
    }
  };

  // Auto-play timer
  const resetAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    if (!isPaused && !isDragging) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext();
      }, 4200);
    }
  }, [isPaused, isDragging, handleNext]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [resetAutoPlay]);

  // Touch Drag Handling for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
    setWithTransition(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - touchStartX.current;
    const diffY = e.touches[0].clientY - touchStartY.current;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe.current) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setWithTransition(true);

    if (isHorizontalSwipe.current) {
      if (dragOffset < -45) {
        handleNext();
      } else if (dragOffset > 45) {
        handlePrev();
      }
    }
    setDragOffset(0);
    isHorizontalSwipe.current = null;
    resetAutoPlay();
  };

  const handleShopClick = (e) => {
    if (e) e.stopPropagation();
    const el = document.getElementById('featured-products') || document.getElementById('categories') || document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBulkClick = (e) => {
    if (e) e.stopPropagation();
    navigate('/wholesale');
  };

  return (
    <section id="home" className="w-full bg-slate-50 overflow-hidden">
      {/* Mobile Card / Desktop Full Hero Container */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-0 lg:max-w-none pt-2.5 sm:pt-4 pb-2.5 sm:pb-3.5 lg:pt-0 lg:pb-0">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-none h-[230px] xs:h-[260px] sm:h-[380px] md:h-[480px] lg:min-h-[calc(100vh-80px)] flex items-end select-none group touch-pan-y"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Continuous Infinite Sliding Track */}
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            className="absolute inset-0 flex h-full will-change-transform"
            style={{
              transform: dragOffset !== 0
                ? `calc(-${currentIndex * 100}% + ${dragOffset}px)`
                : `translateX(-${currentIndex * 100}%)`,
              transition: withTransition && !isDragging
                ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none'
            }}
          >
            {EXTENDED_SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className="w-full min-w-full max-w-full shrink-0 basis-full h-full relative flex items-end"
              >
                {/* Background Image for this slide */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                  className={`absolute inset-0 w-full h-full object-cover ${slide.position || ''} filter brightness-105 contrast-105 pointer-events-none select-none`}
                  loading={idx === 1 ? "eager" : "lazy"}
                  draggable={false}
                />

                {/* Subtle bottom gradient for button contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Slide Overlay: Action Buttons */}
                <div className="relative z-10 p-4 sm:p-10 lg:p-16 max-w-3xl text-left pb-4 sm:pb-10 lg:pb-14">
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5 sm:gap-3 font-sans">
                    {/* Primary Shop Button */}
                    <button
                      onClick={handleShopClick}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 group border border-red-500/30 cursor-pointer"
                    >
                      <span>Shop Products</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Secondary Bulk Button */}
                    <button
                      onClick={handleBulkClick}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white/95 hover:bg-white active:scale-95 text-slate-900 border border-white/80 font-bold text-xs sm:text-sm rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      Order in Bulk
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 active:scale-90 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 active:scale-90 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-3 right-4 sm:bottom-6 sm:right-8 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/35 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
            {SLIDE_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); handleDotClick(idx); }}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeDotIndex === idx
                    ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-[#d9232e]'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
