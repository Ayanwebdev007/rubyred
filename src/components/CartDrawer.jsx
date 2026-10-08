import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, Phone, CheckCircle2, ShieldCheck, MapPin, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORE_INFO } from '../data/products';

export default function CartDrawer({ isOpen, onClose, cartItems = [], cart = [], onUpdateQty, onRemove, setCart, userMode }) {
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' | 'delivery'
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  if (!isOpen) return null;

  const activeCart = cartItems.length > 0 ? cartItems : cart;
  const isB2B = userMode === 'b2b';

  const updateQty = (id, delta) => {
    if (onUpdateQty) {
      onUpdateQty(id, delta);
    } else if (setCart) {
      setCart(prev => prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean));
    }
  };

  const removeItem = (id) => {
    if (onRemove) {
      onRemove(id);
    } else if (setCart) {
      setCart(prev => prev.filter(item => item.id !== id));
    }
  };

  const formatMoney = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const getItemUnitPrice = (item) => {
    if (!item) return 0;
    if (isB2B) {
      const b2b = item.b2bPrice !== undefined ? item.b2bPrice : ((item.retailPrice || item.price || 0) * 0.6);
      const caseQty = item.caseQty || 1;
      return Number(b2b) * Number(caseQty);
    }
    const retail = item.retailPrice !== undefined ? item.retailPrice : (item.price || 0);
    return Number(retail);
  };

  // Subtotal Calculation
  const subtotal = activeCart.reduce((sum, item) => {
    const unitPrice = getItemUnitPrice(item);
    return sum + (unitPrice * (item.qty || 1));
  }, 0);

  // B2B Tier Discount calculation
  let discountRate = 0;
  if (isB2B) {
    const totalCases = activeCart.reduce((acc, i) => acc + (i.qty || 1), 0);
    if (totalCases >= 100) discountRate = 0.35;
    else if (totalCases >= 50) discountRate = 0.25;
    else if (totalCases >= 25) discountRate = 0.18;
    else if (totalCases >= 10) discountRate = 0.10;
  }

  const discountAmount = subtotal * discountRate;
  const tax = (subtotal - discountAmount) * 0.0825; // 8.25% TX Sales Tax
  const shipping = deliveryMethod === 'delivery' ? (isB2B ? 45.00 : 7.99) : 0;
  const finalTotal = subtotal - discountAmount + tax + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCheckoutStep('success');
  };

  const generateWhatsAppMessage = () => {
    const itemsText = activeCart.map(i => {
      const unitP = getItemUnitPrice(i);
      const p = isB2B ? `$${formatMoney(unitP)}/case` : `$${formatMoney(unitP)}`;
      return `• ${i.name} x${i.qty || 1} (${p})`;
    }).join('%0A');

    const msg = `🛒 *NEW ${isB2B ? 'B2B WHOLESALE' : 'RETAIL'} ORDER - RUBY RED*%0A%0A` +
      `*Customer:* ${customerDetails.name || 'Guest'}%0A` +
      `*Phone:* ${customerDetails.phone || 'N/A'}%0A` +
      `*Fulfillment:* ${deliveryMethod === 'pickup' ? 'Store Pickup (9909-A Harwin Dr, Houston)' : 'Shipping to: ' + customerDetails.address}%0A%0A` +
      `*Items Ordered:*%0A${itemsText}%0A%0A` +
      `*Subtotal:* $${formatMoney(subtotal)}%0A` +
      (discountAmount > 0 ? `*Wholesale Discount:* -$${formatMoney(discountAmount)}%0A` : '') +
      `*Total Amount:* *$${formatMoney(finalTotal)}*%0A%0A` +
      `Please confirm order availability and dispatch status!`;

    window.open(`https://wa.me/${STORE_INFO.whatsappFormatted}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-400" />
            <h2 className="font-extrabold text-white text-lg">
              {checkoutStep === 'cart' ? 'Your Shopping Cart' : checkoutStep === 'checkout' ? 'Order Checkout' : 'Order Confirmed!'}
            </h2>
            <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full">
              {isB2B ? 'B2B Wholesale' : 'Retail'}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS LIST */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeCart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-300">Your cart is empty</h3>
                  <p className="text-xs text-slate-500">Explore our 12 Ramune flavors and exotic global snacks!</p>
                </div>
              ) : (
                activeCart.map((item) => {
                  const unitPrice = getItemUnitPrice(item);
                  return (
                    <div key={item.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-xl bg-slate-900 p-1" />
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-xs line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                          ${formatMoney(unitPrice)} {isB2B ? `/ case (${item.caseQty || 1}ct)` : '/ unit'}
                        </p>
                        
                        {/* Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-6 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-3">
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                    <span>Wholesale Bulk Discount ({(discountRate * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white">
                  <span>Estimated Total</span>
                  <span className="text-rose-400">${(subtotal - discountAmount).toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { onClose(); navigate('/cart'); }}
                    className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl transition-all"
                  >
                    View Full Cart Page
                  </button>
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-rose-950/50"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT DETAILS */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between">
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Pickup vs Shipping Choice */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Fulfillment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 ${
                      deliveryMethod === 'pickup' 
                        ? 'border-rose-500 bg-rose-950/40 text-white font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="text-xs">Store Pickup</p>
                      <p className="text-[10px] text-slate-400 font-normal">Houston Store (Free)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 ${
                      deliveryMethod === 'delivery' 
                        ? 'border-rose-500 bg-rose-950/40 text-white font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="text-xs">Ground Shipping</p>
                      <p className="text-[10px] text-slate-400 font-normal">${shipping.toFixed(2)}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name / Business Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter your name"
                    value={customerDetails.name}
                    onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number (for WhatsApp confirmation) *</label>
                  <input
                    required
                    type="tel"
                    placeholder="832-XXX-XXXX"
                    value={customerDetails.phone}
                    onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                {deliveryMethod === 'delivery' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Street address, City, State, ZIP"
                      value={customerDetails.address}
                      onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${formatMoney(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Wholesale Volume Discount</span>
                    <span>-${formatMoney(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>TX Sales Tax (8.25%)</span>
                  <span>${formatMoney(tax)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fulfillment Fee</span>
                  <span>{shipping === 0 ? 'FREE Pickup' : `$${formatMoney(shipping)}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm text-white">
                  <span>Total Due</span>
                  <span className="text-emerald-400">${formatMoney(finalTotal)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="w-1/3 py-3 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg"
              >
                Confirm Order Placement
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS & WHATSAPP GENERATOR */}
        {checkoutStep === 'success' && (
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Order Received!</h3>
              <p className="text-xs text-slate-400">
                Thank you for ordering with RUBY RED Sales & Services.
              </p>
            </div>

            <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Order Total:</span>
                <span className="font-bold text-white">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fulfillment:</span>
                <span className="font-semibold text-amber-400">{deliveryMethod === 'pickup' ? 'Store Pickup (Houston)' : 'Delivery'}</span>
              </div>
            </div>

            <button
              onClick={generateWhatsAppMessage}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Send Instant WhatsApp Order Confirmation
            </button>

            <button
              onClick={() => {
                setCart([]);
                setCheckoutStep('cart');
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Drawer & Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
