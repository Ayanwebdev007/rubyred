import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Phone, MapPin, Truck, ShieldCheck, CheckCircle2, Tag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { STORE_INFO } from '../data/products';
import WhatsAppIcon from './WhatsAppIcon';

export default function CartPage({ cart, onUpdateQty, onRemove, onClearCart }) {
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' | 'delivery'
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [userMode, setUserMode] = useState('b2c'); // 'b2c' | 'b2b'

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const isB2B = userMode === 'b2b';
  const totalItemCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  const formatMoney = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Helper to safely obtain unit price regardless of data shape
  const getUnitPrice = (item) => {
    if (!item) return 0;
    if (isB2B) {
      const casePrice = item.b2bPrice !== undefined ? item.b2bPrice : ((item.retailPrice || item.price || 0) * 0.6);
      return Number(casePrice) * Number(item.caseQty || 1);
    }
    const retail = item.retailPrice !== undefined ? item.retailPrice : (item.price || 0);
    return Number(retail);
  };

  // Subtotal Calculation
  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = getUnitPrice(item);
    return sum + (unitPrice * (item.qty || 1));
  }, 0);

  // B2B Bulk Tier Discount Calculation
  let b2bDiscountRate = 0;
  if (isB2B) {
    if (totalItemCount >= 100) b2bDiscountRate = 0.35;
    else if (totalItemCount >= 50) b2bDiscountRate = 0.25;
    else if (totalItemCount >= 25) b2bDiscountRate = 0.18;
    else if (totalItemCount >= 10) b2bDiscountRate = 0.10;
  }

  const b2bDiscountAmount = subtotal * b2bDiscountRate;
  const promoDiscountAmount = (subtotal - b2bDiscountAmount) * discountApplied;
  const totalDiscount = b2bDiscountAmount + promoDiscountAmount;

  const tax = (subtotal - totalDiscount) * 0.0825; // 8.25% TX Sales Tax
  const shipping = deliveryMethod === 'delivery' ? (isB2B ? 45.00 : 7.99) : 0;
  const grandTotal = subtotal - totalDiscount + tax + shipping;

  // Free Shipping Progress Calculation ($50 threshold)
  const freeShippingThreshold = 50;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'RUBY10' || code === 'WELCOME10') {
      setDiscountApplied(0.10); // 10% off
    } else if (code === 'VIP15') {
      setDiscountApplied(0.15); // 15% off
    } else {
      setPromoError('Invalid coupon code. Try RUBY10 for 10% off!');
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    setOrderSuccess(true);
  };

  const generateWhatsAppMessage = () => {
    const itemsText = cart.map(i => {
      const unitP = getUnitPrice(i);
      const p = isB2B ? `$${unitP.toFixed(2)}/case` : `$${unitP.toFixed(2)}`;
      return `• ${i.name} x${i.qty || 1} (${p})`;
    }).join('%0A');

    const msg = `🛒 *NEW ${isB2B ? 'B2B WHOLESALE' : 'RETAIL'} ORDER - RUBY RED*%0A%0A` +
      `*Customer Name:* ${customerDetails.name || 'Guest'}%0A` +
      `*Phone:* ${customerDetails.phone || 'N/A'}%0A` +
      `*Fulfillment:* ${deliveryMethod === 'pickup' ? 'Store Pickup (9909-A Harwin Dr, Houston)' : 'Shipping to: ' + customerDetails.address}%0A%0A` +
      `*Items Ordered:*%0A${itemsText}%0A%0A` +
      `*Subtotal:* $${subtotal.toFixed(2)}%0A` +
      (totalDiscount > 0 ? `*Total Savings:* -$${totalDiscount.toFixed(2)}%0A` : '') +
      `*Tax:* $${tax.toFixed(2)}%0A` +
      `*Grand Total:* *$${grandTotal.toFixed(2)}*%0A%0A` +
      `Please confirm order availability!`;

    window.open(`https://wa.me/${STORE_INFO.whatsappFormatted}?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#d9232e] transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shopping</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-slate-200 shadow-2xs">
            <button
              onClick={() => setUserMode('b2c')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                userMode === 'b2c' 
                  ? 'bg-[#d9232e] text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Retail Buyer
            </button>
            <button
              onClick={() => setUserMode('b2b')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                userMode === 'b2b' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              B2B Wholesale
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="-mx-4 sm:-mx-8 lg:-mx-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-medium text-[#d9232e] tracking-tight">
              Your Shopping Cart
            </h1>
            <span className="text-xs font-extrabold bg-red-100 text-[#d9232e] px-3 py-1 rounded-full border border-red-200">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Main Grid: Left Items List (7 Cols), Right Summary Box (5 Cols) */}
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-md text-center space-y-6 max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-red-50 text-[#d9232e] flex items-center justify-center mx-auto border-2 border-red-100">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Explore our 12 Japanese Ramune soda flavors, exotic chips, chocolates, and savory snacks.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Explore Products</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items List (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Free Shipping Progress Indicator */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#d9232e]" />
                    <span>
                      {amountNeededForFreeShipping === 0 
                        ? '🎉 You unlocked FREE Shipping!' 
                        : `Add $${amountNeededForFreeShipping.toFixed(2)} more for FREE Houston Store Pickup & Priority Handling!`}
                    </span>
                  </div>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#d9232e] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  <span>Product Details</span>
                  <span>Quantity & Total</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item) => {
                    const unitPrice = getUnitPrice(item);
                    const itemTotal = unitPrice * (item.qty || 1);

                    return (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                        
                        <div className="flex items-center gap-4 flex-1">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl bg-slate-50 p-2 border border-slate-100 group-hover:scale-105 transition-transform" 
                          />
                          <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                              {item.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {isB2B ? `Case of ${item.caseQty || 1} units` : 'Individual Unit'}
                            </p>
                            <p className="text-xs font-extrabold text-[#d9232e]">
                              ${unitPrice.toFixed(2)} {isB2B ? '/ case' : '/ unit'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          {/* Stepper Control */}
                          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-slate-900">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right">
                            <span className="text-base font-extrabold text-slate-900 block">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => onRemove(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Checkout & Order Summary Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order Summary Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
                
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Order Summary
                </h2>

                {/* Fulfillment Method Toggle */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        deliveryMethod === 'pickup'
                          ? 'border-[#d9232e] bg-red-50/50 text-[#d9232e] font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-[#d9232e] shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Store Pickup</p>
                        <p className="text-[10px] text-slate-500 font-medium">Houston Store (FREE)</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        deliveryMethod === 'delivery'
                          ? 'border-[#d9232e] bg-red-50/50 text-[#d9232e] font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Truck className="w-5 h-5 text-[#d9232e] shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Ground Shipping</p>
                        <p className="text-[10px] text-slate-500 font-medium">${shipping.toFixed(2)}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Promo / Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. RUBY10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#d9232e]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>}
                  {discountApplied > 0 && (
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Coupon applied! {(discountApplied * 100)}% discount extra
                    </p>
                  )}
                </form>

                {/* Cost Breakdown List */}
                <div className="space-y-3 pt-2 text-sm border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${formatMoney(subtotal)}</span>
                  </div>

                  {b2bDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold text-xs">
                      <span>B2B Volume Tier Discount ({(b2bDiscountRate * 100).toFixed(0)}%)</span>
                      <span>-${formatMoney(b2bDiscountAmount)}</span>
                    </div>
                  )}

                  {promoDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold text-xs">
                      <span>Promo Coupon Discount</span>
                      <span>-${formatMoney(promoDiscountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>TX Sales Tax (8.25%)</span>
                    <span className="font-semibold text-slate-900">${formatMoney(tax)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Fulfillment / Shipping</span>
                    <span className="font-semibold text-slate-900">
                      {shipping === 0 ? 'FREE Store Pickup' : `$${formatMoney(shipping)}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-lg font-bold text-slate-900">Grand Total</span>
                    <span className="text-2xl font-black text-[#d9232e]">
                      ${formatMoney(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout & WhatsApp Support Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={generateWhatsAppMessage}
                    className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
                    <span>Instant WhatsApp Order & Support</span>
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-4 px-4 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Buy Now</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified Safe & Secure Checkout</span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
