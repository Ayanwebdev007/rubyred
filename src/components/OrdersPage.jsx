import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, Clock, CheckCircle2, Truck, RefreshCw,
  Search, XCircle, AlertCircle
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useAuth } from '../context/AuthContext';
import useMyOrders from '../hooks/useMyOrders';
import { STORE_INFO } from '../data/products';

const STATUS_STYLES = {
  Processing: { cls: 'bg-amber-100 text-amber-800 border border-amber-200', Icon: Clock, iconCls: 'text-amber-600' },
  Shipped: { cls: 'bg-blue-100 text-blue-800 border border-blue-200', Icon: Truck, iconCls: 'text-blue-600' },
  Delivered: { cls: 'bg-emerald-100 text-emerald-800 border border-emerald-200', Icon: CheckCircle2, iconCls: 'text-emerald-600' },
  Cancelled: { cls: 'bg-slate-100 text-slate-700 border border-slate-200', Icon: XCircle, iconCls: 'text-slate-500' }
};

const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const orderDate = (o) => {
  const d = new Date(o.createdAt || o.date);
  return isNaN(d) ? (o.date || '') : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const isWholesaleOrder = (o) => o.channel === 'wholesale';

export default function OrdersPage({ onAddToCart }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const { orders, loading, error } = useMyOrders();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'processing' | 'shipped' | 'delivered' | 'b2b'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentUser) {
    return null;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'processing' ? order.status === 'Processing' :
      activeFilter === 'shipped' ? order.status === 'Shipped' :
      activeFilter === 'delivered' ? order.status === 'Delivered' :
      activeFilter === 'b2b' ? isWholesaleOrder(order) : true;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(term) ||
      (order.items || []).some(i => (i.name || '').toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  const handleReorder = (order) => {
    if (onAddToCart) {
      (order.items || []).forEach(item => {
        onAddToCart({
          id: item.id,
          name: item.name,
          price: item.unitPrice,
          retailPrice: isWholesaleOrder(order) ? undefined : item.unitPrice,
          image: item.image,
          qty: item.qty
        });
      });
    }
    navigate('/cart');
  };

  const handleContactSupport = (orderId) => {
    const text = encodeURIComponent(`Hello RUBY RED! I am inquiring about my Order #${orderId}. Please provide an update.`);
    window.open(`https://wa.me/${STORE_INFO.whatsappFormatted}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#d9232e] transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-[#d9232e]" />
            <span>Back to Shopping</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-red-100 text-[#d9232e] px-3.5 py-1.5 rounded-full border border-red-200 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-medium text-[#d9232e] tracking-tight">
            Order History & Tracking
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your retail orders, Houston store pickup status, and B2B wholesale shipments.
          </p>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { key: 'all', label: 'All Orders', count: orders.length },
              { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
              { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
              { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
              ...(orders.some(isWholesaleOrder) ? [{ key: 'b2b', label: 'B2B Wholesale', count: orders.filter(isWholesaleOrder).length }] : [])
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === tab.key
                    ? 'bg-[#d9232e] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by Order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#d9232e]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Orders List Grid */}
        <div className="space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Could not load your orders. {error}</span>
            </div>
          )}
          {loading ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 text-sm text-slate-500">
              Loading your orders…
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">{orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}</h3>
              <p className="text-sm text-slate-500">
                {orders.length === 0
                  ? 'When you place an order it will appear here with live status updates.'
                  : 'No order matches your current filter or search criteria.'}
              </p>
              {orders.length === 0 && (
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-sm rounded-full cursor-pointer"
                >
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/80 px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Order Placed</span>
                      <span className="text-sm font-bold text-slate-900">{orderDate(order)}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Order ID</span>
                      <span className="text-sm font-bold text-[#d9232e]">#{order.id}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                    <div className="hidden sm:block">
                      <span className="text-xs text-slate-400 font-semibold block">Order Type</span>
                      <span className="text-xs font-bold text-slate-700">{isWholesaleOrder(order) ? 'B2B Wholesale' : order.deliveryMethod}</span>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-3">
                    {(() => {
                      const style = STATUS_STYLES[order.status] || STATUS_STYLES.Processing;
                      const StatusIcon = style.Icon;
                      return (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${style.cls}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${style.iconCls}`} />
                          <span>{order.status || 'Processing'}</span>
                        </span>
                      );
                    })()}

                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-xs font-bold text-slate-700 hover:text-[#d9232e] bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Progress / Shipment Timeline Tracker (For In Transit) */}
                {order.trackingNumber && (
                  <div className="bg-amber-50/50 px-4 sm:px-6 py-3 border-b border-amber-100/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-amber-900 font-bold">
                      <Truck className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>Estimated Delivery: {order.estimatedDelivery}</span>
                      <span className="text-slate-400 font-normal">| Carrier: {order.carrier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-600">Tracking #:</span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900">
                        {order.trackingNumber}
                      </span>
                    </div>
                  </div>
                )}

                {/* Order Items Section */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3 sm:gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 object-contain bg-slate-50 rounded-2xl p-1.5 border border-slate-100" 
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                            <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                              Qty: {item.qty} × {money(item.unitPrice)}{item.unitLabel === 'Cases' ? ' / case' : ''}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-slate-900 block">
                            {money(item.total ?? item.qty * item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Collapsible Extended Order Info */}
                  {selectedOrder === order.id && (
                    <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-fadeIn bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">Fulfillment Details</span>
                        <p className="text-slate-600 font-medium">Method: {order.deliveryMethod}</p>
                        <p className="text-slate-600 font-medium">Address: {order.address}</p>
                        <p className="text-slate-600 font-medium">Payment: {order.paymentMethod}</p>
                        {order.notes && <p className="text-slate-600 font-medium">Notes: {order.notes}</p>}
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">Payment Breakdown</span>
                        <div className="space-y-1 text-slate-600">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-900">{money(order.subtotal)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                              <span>Discount</span>
                              <span>-{money(order.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-semibold text-slate-900">{order.shipping > 0 ? money(order.shipping) : 'FREE'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sales Tax</span>
                            <span className="font-semibold text-slate-900">{money(order.tax)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                            <span>Order Total</span>
                            <span className="text-[#d9232e]">{money(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Action Buttons Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReorder(order)}
                        className="py-2.5 px-4 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reorder Items</span>
                      </button>

                      <button
                        onClick={() => handleContactSupport(order.id)}
                        className="py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
                        <span>WhatsApp Order Support</span>
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 font-medium mr-2">Total Amount:</span>
                      <span className="text-lg font-black text-slate-900">{money(order.total)}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
