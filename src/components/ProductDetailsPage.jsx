import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, ShoppingBag, Phone, ShieldCheck, Truck, RotateCcw, 
  Check, Plus, Minus, Heart, Share2, Sparkles, MessageSquare, ThumbsUp, 
  ChevronRight, Award, Flame, RefreshCw, Package, CheckCircle2
} from 'lucide-react';
import { FEATURED_PRODUCTS_DATA } from './FeaturedProductsSection';
import { INITIAL_PRODUCTS } from '../data/products';
import WhatsAppIcon from './WhatsAppIcon';

export default function ProductDetailsPage({ product: propProduct, onBack, onAddToCart, onSelectProduct }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Resolve active product from prop or URL route param
  const product = propProduct || 
    FEATURED_PRODUCTS_DATA.find((p) => p.id === id) || 
    INITIAL_PRODUCTS.find((p) => p.id === id) || 
    FEATURED_PRODUCTS_DATA[0];

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('Original');
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showBulkSection, setShowBulkSection] = useState(false);
  const [selectedBulkTier, setSelectedBulkTier] = useState(null);

  // Sync state if product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, id]);

  if (!product) return null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
    navigate('/');
  };

  const handleSelectRelated = (relProduct) => {
    if (onSelectProduct) {
      onSelectProduct(relProduct);
    }
    navigate(`/product/${relProduct.id}`);
  };

  // Image variations array
  const imageVariations = [
    product.image,
    "/images/ramune_banner.jpg",
    "/images/ruby_red_hero.jpg",
    "/images/ramune_poster.jpeg"
  ];

  const savingsAmount = product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : '1.00';
  const savingsPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 25;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        qty: quantity,
        selectedFlavor
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        qty: quantity,
        selectedFlavor
      });
    }
    navigate('/cart');
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello RUBY RED! I am interested in purchasing *${product.name}* (Variant: ${selectedFlavor}). Quantity requested: ${quantity} unit(s). Please assist with my order.`
    );
    window.open(`https://wa.me/18323663572?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Mock Reviews Data
  const reviews = [
    {
      id: 1,
      name: "Alex M.",
      location: "Houston, TX",
      date: "October 3, 2026",
      rating: 5,
      comment: "Super authentic taste! Came perfectly packaged with extra care. Will definitely reorder soon.",
      verified: true
    },
    {
      id: 2,
      name: "Priya S.",
      location: "Austin, TX",
      date: "September 28, 2026",
      rating: 5,
      comment: "Kids loved it! The marble pop action is so fun and the flavor is top-notch.",
      verified: true
    },
    {
      id: 3,
      name: "David K.",
      location: "Dallas, TX",
      date: "September 15, 2026",
      rating: 5,
      comment: "Great quality imported snack. Fast delivery to Houston! Will order again.",
      verified: true
    },
    {
      id: 4,
      name: "Emi Takahashi",
      location: "San Jose, CA",
      date: "September 10, 2026",
      rating: 5,
      comment: "Tastes just like buying it in Tokyo! Very impressed with RUBY RED's packaging.",
      verified: true
    },
    {
      id: 5,
      name: "Marcus Vance",
      location: "Chicago, IL",
      date: "August 29, 2026",
      rating: 5,
      comment: "Incredible wholesale pricing for our shop. Super reliable shipping!",
      verified: true
    },
    {
      id: 6,
      name: "Sophia Martinez",
      location: "Miami, FL",
      date: "August 18, 2026",
      rating: 5,
      comment: "Freshness guaranteed! The packaging protected every single bottle perfectly.",
      verified: true
    }
  ];

  // Related Products (excluding current)
  const relatedProducts = FEATURED_PRODUCTS_DATA.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 animate-fadeIn">
      
      {/* Main Product Showcase Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Top Clean Header Action Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#d9232e] transition-colors py-1.5 px-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#d9232e]" />
            <span>Back to Products</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Link to="/" className="hover:text-slate-600">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link to="/" className="hover:text-slate-600">Featured Products</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-900 font-semibold truncate max-w-[180px]">{product.name}</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Top Product Hero Grid (Left: Image Gallery, Right: Details & Purchase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm">
          
          {/* LEFT 6 COLS: Image Showcase & Gallery Variations */}
          <div className="lg:col-span-6 flex flex-row gap-3 sm:gap-4 items-start">
            {/* Thumbnail Image Variations Column strictly on the Left Side */}
            <div className="flex flex-col gap-2.5 flex-shrink-0">
              {imageVariations.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 transition-all bg-slate-50 cursor-pointer ${
                    selectedImage === img 
                      ? 'border-[#d9232e] ring-2 ring-red-500/20 shadow-md scale-102' 
                      : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image Display on the Right of Thumbnails */}
            <div className="relative flex-1 w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/70 shadow-sm group">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Floating Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer ${
                  isFavorite 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500 border border-white/60'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
              </button>

              {/* Discount Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#d9232e] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  SAVE {savingsPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLS: Product Info & Purchase Form */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Origin */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  🇯🇵 Direct Import
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  In Stock ({product.stockCount || 450} available)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-900 tracking-normal leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Bar */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-600">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">•</span>
                <span 
                  className="text-xs font-semibold text-slate-600 underline cursor-pointer hover:text-slate-900" 
                  onClick={() => {
                    const el = document.getElementById('reviews-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  128 Verified Reviews
                </span>
              </div>
            </div>

            {/* Clean Professional Price Display Without Gray Box */}
            <div className="flex items-center gap-3 py-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg sm:text-xl font-medium text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                Save ${savingsAmount} ({savingsPercent}%)
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed border-b border-slate-100 pb-4">
              {product.fullDesc || product.shortDesc}
            </p>

            {/* Variant / Flavor Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Flavor / Variety
              </label>
              <div className="flex flex-wrap gap-2">
                {["Original", "Ripe Peach", "Melon", "Strawberry"].map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedFlavor === flavor
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Dual Action Row (Add to Cart + Bulk Order) */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Quantity & Purchasing Options
              </label>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Plus / Minus Counter */}
                <div className="flex items-center justify-between border border-slate-300 rounded-2xl bg-white px-3 py-2.5 w-full sm:w-32 shadow-xs flex-shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-slate-900 px-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Action Buttons: Add to Cart, Buy Now, Bulk Order in 1 Single Line */}
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAdd}
                    className={`py-3 px-2 sm:px-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1 border border-slate-300 shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap ${
                      isAdded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now CTA */}
                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-2 sm:px-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-1 bg-[#d9232e] hover:bg-[#b91c1c] text-white shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Buy Now</span>
                  </button>

                  {/* Bulk Order Button */}
                  <button
                    onClick={() => setShowBulkSection(!showBulkSection)}
                    className={`py-3 px-2 sm:px-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1 border cursor-pointer whitespace-nowrap ${
                      showBulkSection
                        ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="whitespace-nowrap">Bulk Order</span>
                  </button>
                </div>
              </div>

              {/* Compact Light-Themed Fixed Quantity Bulk Order Section */}
              {showBulkSection && (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5 animate-fadeIn shadow-2xs">
                  
                  {/* Minimal Compact Bulk Buttons: 50, 100, 150 */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { qty: 50, unitPrice: (product.price * 0.85).toFixed(2) },
                      { qty: 100, unitPrice: (product.price * 0.75).toFixed(2) },
                      { qty: 150, unitPrice: (product.price * 0.65).toFixed(2) },
                    ].map((tier) => {
                      const isSelected = selectedBulkTier === tier.qty || quantity === tier.qty;

                      return (
                        <button
                          key={tier.qty}
                          onClick={() => {
                            setSelectedBulkTier(tier.qty);
                            setQuantity(tier.qty);
                          }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-[#d9232e] border-[#d9232e] text-white shadow-xs font-bold'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-sm font-black block leading-tight">
                            {tier.qty} Units
                          </span>
                          <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-white/90 font-semibold' : 'text-emerald-600 font-bold'}`}>
                            ${tier.unitPrice}/ea
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Clean WhatsApp Inquiry Action */}
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#20ba59] text-white transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                    <span>Inquire {quantity} Units via WhatsApp Support</span>
                  </button>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-bold text-slate-800">100% Authentic</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-1">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">Fast Shipping</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-1">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span className="text-[11px] font-bold text-slate-800">Guaranteed Fresh</span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Information Sections (Stacked One After Another) */}
        <div className="space-y-8">
          
          {/* Section 1: Overview & Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-3.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d9232e]" />
              <span>Overview & Details</span>
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {product.fullDesc || "Imported directly from Japan, this product embodies authentic craftsmanship and traditional recipe techniques. Made with high-quality ingredients and packaged with care for peak freshness."}
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
              <li>Authentic regional import sourced directly from authorized suppliers</li>
              <li>Sealed packaging ensuring crisp flavor and optimal shelf life</li>
              <li>Perfect for gifting, snack lovers, or party celebrations</li>
            </ul>
          </div>

          {/* Customer Reviews */}

          {/* Section 3: Customer Reviews */}
          <div id="reviews-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#d9232e]" />
                <span>Customer Reviews (128)</span>
              </h3>
              <button
                onClick={() => alert("Review form submission feature enabled!")}
                className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Write a Review
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">{product.rating}</span>
                  <span className="text-sm text-slate-500 font-semibold">out of 5</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                100% Verified Buyer Ratings
              </span>
            </div>

            {/* Horizontal Infinite Looping Review Cards */}
            <div className="overflow-hidden w-full relative py-2 -mx-2">
              {/* Fade Gradients at Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div className="flex animate-marquee gap-5 items-stretch">
                {[...reviews, ...reviews].map((rev, idx) => (
                  <div 
                    key={`${rev.id}-${idx}`}
                    className="w-[290px] sm:w-[340px] flex-shrink-0 bg-white rounded-3xl p-5 border-2 border-slate-100 hover:border-[#d9232e] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-3 relative group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-[#d9232e] transition-colors">{rev.name}</span>
                          {rev.verified && (
                            <span className="text-[10px] font-bold bg-rose-50 text-[#d9232e] border border-rose-200/80 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">
                        📍 {rev.location}
                      </span>
                      <span className="text-[10px] font-bold text-[#d9232e]">
                        RUBY RED Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* You May Also Like Carousel / Grid */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-medium text-slate-900">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct.id}
                onClick={() => handleSelectRelated(relProduct)}
                className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-medium text-slate-900 text-sm group-hover:text-[#d9232e] transition-colors line-clamp-1">
                    {relProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {relProduct.shortDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">
                    ${relProduct.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-red-600 group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
