import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Phone, MapPin, Truck, ShieldCheck, CheckCircle2, Tag, Sparkles, AlertCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { STORE_INFO } from '../data/products';
import WhatsAppIcon from './WhatsAppIcon';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';

export default function CartPage({ cart, onUpdateQty, onRemove, onClearCart }) {
  const navigate = useNavigate();
  const { currentUser, isApprovedWholesale } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' | 'delivery'
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [userMode, setUserMode] = useState(isApprovedWholesale ? 'b2b' : 'b2c'); // 'b2c' | 'b2b'

  const [customerDetails, setCustomerDetails] = useState({
    phone: currentUser?.phone || '',
    address: typeof currentUser?.address === 'string' ? currentUser.address : '',
    notes: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Wholesale pricing is only for approved wholesale accounts
  useEffect(() => {
    if (!isApprovedWholesale && userMode === 'b2b') setUserMode('b2c');
  }, [isApprovedWholesale, userMode]);

  if (!currentUser) {
    return null;
  }

  const isB2B = isApprovedWholesale && userMode === 'b2b';
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

  // Free Shipping Progress Calculation ($50 threshold, retail delivery)
  const freeShippingThreshold = 50;
  const deliveryFee = isB2B ? 45.00 : (subtotal >= freeShippingThreshold ? 0 : 7.99);
  const shipping = deliveryMethod === 'delivery' ? deliveryFee : 0;
  const grandTotal = subtotal - totalDiscount + tax + shipping;

  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'RUBY10' || code === 'WELCOME10') {
      setDiscountApplied(0.10); // 10% off
      setAppliedPromoCode(code);
    } else if (code === 'VIP15') {
      setDiscountApplied(0.15); // 15% off
      setAppliedPromoCode(code);
    } else {
      setPromoError('Invalid coupon code. Try RUBY10 for 10% off!');
    }
  };

  const buildOrderInput = (source) => ({
    account: currentUser,
    channel: isB2B ? 'wholesale' : 'retail',
    source,
    promoCode: discountApplied > 0 ? appliedPromoCode : '',
    items: cart.map(item => ({
      id: item.id,
      name: item.name || item.title,
      image: item.image || item.img,
      qty: item.qty || 1,
      unitPrice: getUnitPrice(item),
      isCase: isB2B || item.isCase,
      caseQty: item.caseQty
    })),
    totals: { subtotal, discount: totalDiscount, tax, shipping, total: grandTotal },
    fulfillment: { method: deliveryMethod, ...customerDetails }
  });

  const validateCheckout = () => {
    const digits = (customerDetails.phone || '').replace(/\D/g, '');
    if (digits.length < 10) return 'Please enter a phone number so we can reach you about this order.';
    if (deliveryMethod === 'delivery' && customerDetails.address.trim().length < 8) {
      return 'Please enter your full delivery address (street, city, ZIP).';
    }
    return '';
  };

  const submitOrder = async (source) => {
    const problem = validateCheckout();
    if (problem) {
      setCheckoutError(problem);
      return null;
    }
    setCheckoutError('');
    setIsPlacing(true);
    try {
      return await placeOrder(buildOrderInput(source));
    } catch (err) {
      setCheckoutError(err.message || 'Could not place your order. Please try again.');
      return null;
    } finally {
      setIsPlacing(false);
    }
  };

  const finishOrder = (order) => {
    setPlacedOrder(order);
    if (onClearCart) onClearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isPlacing) return;
    const order = await submitOrder('checkout');
    if (order) finishOrder(order);
  };

  const whatsAppTextFor = (order) => {
    const lines = order.items.map(i => `• ${i.name} x${i.qty} ($${i.unitPrice.toFixed(2)}${isB2B ? '/case' : ''})`);
    return [
      `🛒 NEW ${isB2B ? 'B2B WHOLESALE' : 'RETAIL'} ORDER - RUBY RED`,
      `Order ID: ${order.id}`,
      '',
      `Customer: ${order.customer}`,
      `Phone: ${order.phone}`,
      `Fulfillment: ${deliveryMethod === 'pickup' ? 'Store Pickup (9909-A Harwin Dr, Houston)' : 'Delivery to: ' + order.address}`,
      ...(order.notes ? [`Notes: ${order.notes}`] : []),
      '',
      'Items:',
      ...lines,
      '',
      `Subtotal: $${order.subtotal.toFixed(2)}`,
      ...(order.discount > 0 ? [`Savings: -$${order.discount.toFixed(2)}`] : []),
      `Tax: $${order.tax.toFixed(2)}`,
      ...(order.shipping > 0 ? [`Shipping: $${order.shipping.toFixed(2)}`] : []),
      `Grand Total: $${order.total.toFixed(2)}`,
      '',
      'Please confirm order availability!'
    ].join('\n');
  };

  const generateWhatsAppMessage = async () => {
    if (isPlacing) return;
    // Open the window synchronously so pop-up blockers allow it, then point it at WhatsApp
    const popup = window.open('', '_blank');
    const order = await submitOrder('whatsapp');
    if (!order) {
      if (popup) popup.close();
      return;
    }
    const url = `https://wa.me/${STORE_INFO.whatsappFormatted}?text=${encodeURIComponent(whatsAppTextFor(order))}`;
    if (popup) popup.location.href = url;
    else window.location.href = url;
    finishOrder(order);
  };

  if (placedOrder) {
    return (
      <div className="bg-slate-50 min-h-screen py-6 sm:py-14">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Order Placed!</h1>
              <p className="text-sm text-slate-500">
                Order <span className="font-bold text-[#d9232e]">#{placedOrder.id}</span> has been received.
                {placedOrder.deliveryMethod === 'Store Pickup'
                  ? ' We will message you when it is ready for pickup.'
                  : ' We will contact you to confirm delivery.'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left text-sm space-y-1.5">
              <div className="flex justify-between gap-3"><span className="text-slate-500">Items</span><span className="font-semibold text-slate-900">{placedOrder.itemCount}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-500">Fulfillment</span><span className="font-semibold text-slate-900 text-right">{placedOrder.deliveryMethod}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-500">Payment</span><span className="font-semibold text-slate-900 text-right">{placedOrder.paymentMethod}</span></div>
              <div className="flex justify-between gap-3 pt-1.5 border-t border-slate-200"><span className="font-bold text-slate-900">Total</span><span className="font-black text-[#d9232e]">${placedOrder.total.toFixed(2)}</span></div>
            </div>
            <div className="flex flex-col xs:flex-row gap-2.5 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" /> Track My Order
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-full transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
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

          {/* Mode Switcher (approved wholesale accounts only) */}
          {isApprovedWholesale && (
          <div className="self-start sm:self-auto flex items-center gap-1 sm:gap-2 bg-white p-1 rounded-full border border-slate-200 shadow-2xs">
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
          )}
        </div>

        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-md text-center space-y-6 max-w-2xl mx-auto my-4 sm:my-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Cart Items List (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 min-w-0">
              
              {/* Free Shipping Progress Indicator */}
              {!isB2B && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#d9232e]" />
                    <span>
                      {amountNeededForFreeShipping === 0 
                        ? '🎉 You unlocked FREE delivery!' 
                        : `Add $${amountNeededForFreeShipping.toFixed(2)} more for FREE delivery (store pickup is always free)`}
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
              )}

              {/* Items Card List */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-md space-y-4">
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
                        
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-contain rounded-2xl bg-slate-50 p-2 border border-slate-100 group-hover:scale-105 transition-transform" 
                          />
                          <div className="space-y-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug break-words">
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

                        <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          {/* Stepper Control */}
                          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="w-9 h-9 sm:w-7 sm:h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-slate-900">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="w-9 h-9 sm:w-7 sm:h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
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
            <div className="lg:col-span-5 space-y-6 min-w-0">
              
              {/* Order Summary Box */}
              <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
                
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Order Summary
                </h2>

                {/* Fulfillment Method Toggle */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Fulfillment Method
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
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
                        <p className="text-[11px] text-slate-500 font-medium">Houston Store (FREE)</p>
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
                        <p className="text-xs font-bold">Delivery</p>
                        <p className="text-[11px] text-slate-500 font-medium">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Contact & Delivery Details */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact & Delivery Details
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone number *"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#d9232e]"
                    />
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <textarea
                      rows={2}
                      autoComplete="street-address"
                      placeholder="Delivery address (street, city, ZIP) *"
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#d9232e] resize-none"
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Order notes (optional)"
                    value={customerDetails.notes}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#d9232e]"
                  />
                  <p className="text-[11px] text-slate-500">Payment is collected at pickup or on delivery.</p>
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
                      className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 sm:py-2 text-xs text-slate-900 focus:outline-none focus:border-[#d9232e]"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
                      {deliveryMethod === 'pickup' ? 'FREE Store Pickup' : shipping === 0 ? 'FREE Delivery' : `$${formatMoney(shipping)}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline gap-3">
                    <span className="text-lg font-bold text-slate-900">Grand Total</span>
                    <span className="text-2xl font-black text-[#d9232e]">
                      ${formatMoney(grandTotal)}
                    </span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#d9232e]" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Checkout & WhatsApp Support Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={generateWhatsAppMessage}
                    disabled={isPlacing}
                    className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    <WhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
                    <span>Order via WhatsApp</span>
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="w-full py-4 px-4 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isPlacing ? 'Placing Order...' : 'Place Order'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>No payment taken online. Pay at pickup or on delivery.</span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
