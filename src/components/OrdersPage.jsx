import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Clock, CheckCircle2, Truck, RefreshCw, 
  ChevronRight, ExternalLink, Download, FileText, ShoppingBag, 
  MapPin, ShieldCheck, Search, Filter, Sparkles
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export const DUMMY_ORDERS = [
  {
    id: 'RR-892401',
    date: 'Oct 6, 2026',
    status: 'In Transit',
    type: 'Retail Order',
    deliveryMethod: 'Priority Shipping',
    estimatedDelivery: 'Oct 10, 2026',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-889421094US',
    address: '2401 Westheimer Rd, Suite 400, Houston, TX 77098',
    paymentMethod: 'Credit Card (**** 4821)',
    subtotal: 48.50,
    shipping: 7.99,
    tax: 4.00,
    total: 60.49,
    items: [
      {
        id: 'ramune-melon',
        name: 'Hata Kosen Japanese Ramune Soda - Melon Flavor',
        qty: 4,
        price: 3.50,
        image: '/images/ramune_poster.jpeg',
        variant: 'Melon'
      },
      {
        id: 'lays-cucumber',
        name: "Lay's Exotic China Limited Edition - Cucumber Flavor",
        qty: 3,
        price: 4.50,
        image: '/images/cat_candies.jpg',
        variant: 'Crispy Snack Bag'
      },
      {
        id: 'pocky-strawberry',
        name: 'Glico Pocky Strawberry Cream Biscuit Sticks',
        qty: 3,
        price: 3.00,
        image: '/images/cat_cookies.jpg',
        variant: 'Strawberry'
      }
    ]
  },
  {
    id: 'RR-885120',
    date: 'Sep 28, 2026',
    status: 'Delivered',
    type: 'Store Pickup',
    deliveryMethod: 'Houston Store Pickup',
    estimatedDelivery: 'Picked up on Sep 30, 2026',
    carrier: 'Self Pickup',
    trackingNumber: 'PU-9909-HARWIN',
    address: 'RUBY RED Store: 9909-A Harwin Dr, Houston, TX 77036',
    paymentMethod: 'Apple Pay',
    subtotal: 34.20,
    shipping: 0.00,
    tax: 2.82,
    total: 37.02,
    items: [
      {
        id: 'ramune-original',
        name: 'Hata Kosen Japanese Ramune Soda - Original Flavor',
        qty: 6,
        price: 3.20,
        image: '/images/cat_ramune.jpg',
        variant: 'Original Glass Bottle'
      },
      {
        id: 'meiji-yan-yan',
        name: 'Meiji Yan Yan Chocolate Cream Dip Sticks (Pack of 10)',
        qty: 3,
        price: 5.00,
        image: '/images/cat_chocolates.jpg',
        variant: 'Double Choco'
      }
    ]
  },
  {
    id: 'RR-871049',
    date: 'Sep 14, 2026',
    status: 'Delivered',
    type: 'B2B Wholesale',
    deliveryMethod: 'Freight Freight Trucking',
    estimatedDelivery: 'Delivered on Sep 17, 2026',
    carrier: 'R+L Carriers Wholesale',
    trackingNumber: 'RL-551029481',
    address: 'Metro Wholesale Distributors, 1200 Commerce St, Dallas, TX 75201',
    paymentMethod: 'B2B Net 30 Invoice',
    subtotal: 240.00,
    discount: 48.00,
    shipping: 0.00,
    tax: 15.84,
    total: 207.84,
    items: [
      {
        id: 'ramune-bundle-case',
        name: 'Hata Kosen Ramune Soda Variety Pack (Full Case of 30 Bottles)',
        qty: 2,
        price: 72.00,
        image: '/images/ramune_banner.jpg',
        variant: 'Case (30 Units)'
      },
      {
        id: 'bulk-snack-assortment',
        name: 'Asian Exotic Snack & Candy Bulk Master Case',
        qty: 1,
        price: 96.00,
        image: '/images/ruby_red_hero.jpg',
        variant: 'Master Carton'
      }
    ]
  }
];

export default function OrdersPage({ onAddToCart }) {
  const navigate = useNavigate();
  const [orders] = useState(DUMMY_ORDERS);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'in_transit' | 'delivered' | 'b2b'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'in_transit' ? order.status === 'In Transit' :
      activeFilter === 'delivered' ? order.status === 'Delivered' :
      activeFilter === 'b2b' ? order.type === 'B2B Wholesale' : true;

    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleReorder = (order) => {
    if (onAddToCart) {
      order.items.forEach(item => {
        onAddToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: item.qty
        });
      });
    }
    navigate('/cart');
  };

  const handleContactSupport = (orderId) => {
    const text = encodeURIComponent(`Hello RUBY RED! I am inquiring about my Order #${orderId}. Please provide an update.`);
    window.open(`https://wa.me/18323663572?text=${text}`, '_blank');
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
              <span>3 Recent Orders</span>
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
              { key: 'in_transit', label: 'In Transit', count: orders.filter(o => o.status === 'In Transit').length },
              { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
              { key: 'b2b', label: 'B2B Wholesale', count: orders.filter(o => o.type === 'B2B Wholesale').length }
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
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
              <p className="text-sm text-slate-500">No order matches your current filter or search criteria.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Order Placed</span>
                      <span className="text-sm font-bold text-slate-900">{order.date}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Order ID</span>
                      <span className="text-sm font-bold text-[#d9232e]">#{order.id}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                    <div className="hidden sm:block">
                      <span className="text-xs text-slate-400 font-semibold block">Order Type</span>
                      <span className="text-xs font-bold text-slate-700">{order.type}</span>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      order.status === 'In Transit'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {order.status === 'In Transit' ? (
                        <Truck className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>{order.status}</span>
                    </span>

                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-xs font-bold text-slate-700 hover:text-[#d9232e] bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Progress / Shipment Timeline Tracker (For In Transit) */}
                {order.status === 'In Transit' && (
                  <div className="bg-amber-50/50 px-6 py-3 border-b border-amber-100/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Truck className="w-4 h-4 text-amber-600" />
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
                <div className="p-6 space-y-4">
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-14 h-14 object-contain bg-slate-50 rounded-2xl p-1.5 border border-slate-100" 
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{item.variant}</p>
                            <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                              Qty: {item.qty} × ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 block">
                            ${(item.qty * item.price).toFixed(2)}
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
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">Payment Breakdown</span>
                        <div className="space-y-1 text-slate-600">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-900">${order.subtotal.toFixed(2)}</span>
                          </div>
                          {order.discount && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                              <span>Wholesale Discount</span>
                              <span>-${order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-semibold text-slate-900">${order.shipping.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sales Tax</span>
                            <span className="font-semibold text-slate-900">${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                            <span>Total Paid</span>
                            <span className="text-[#d9232e]">${order.total.toFixed(2)}</span>
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
                      <span className="text-lg font-black text-slate-900">${order.total.toFixed(2)}</span>
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
