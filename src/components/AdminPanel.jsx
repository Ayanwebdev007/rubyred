import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Search,
  DollarSign,
  AlertCircle,
  Building2,
  FileCheck
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';

export default function AdminPanel({ products, setProducts }) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock Orders State
  const [orders, setOrders] = useState([
    {
      id: "ORD-9821",
      customer: "Harwin Express Market",
      type: "B2B Wholesale",
      items: "5 Cases Sangaria Ramune, 2 Cases Lay's Seaweed",
      amount: 412.50,
      status: "Processing",
      date: "2026-10-07 14:20"
    },
    {
      id: "ORD-9820",
      customer: "Jessica Taylor",
      type: "B2C Retail",
      items: "2 Bottles Ramune Melon, 1 Bag Milka Oreo",
      amount: 9.47,
      status: "Shipped",
      date: "2026-10-07 11:05"
    },
    {
      id: "ORD-9819",
      customer: "Bella Vista Supermarket",
      type: "B2B Wholesale",
      items: "10 Cases Ramune Variety, 4 Cases Monster Ultra",
      amount: 680.00,
      status: "Pending",
      date: "2026-10-06 18:45"
    },
    {
      id: "ORD-9818",
      customer: "Marcus Rodriguez",
      type: "B2C Retail",
      items: "1 Tajin Clásico, 2 Ramune Peach",
      amount: 9.47,
      status: "Delivered",
      date: "2026-10-06 09:30"
    }
  ]);

  // Mock Wholesaler Applications
  const [b2bApplicants, setB2bApplicants] = useState([
    { id: 1, business: "Houston Exotic Munchies LLC", taxId: "TX-994820", contact: "David Kim", phone: "832-555-0192", status: "Pending Review" },
    { id: 2, business: "Harwin Gas & Snack Depot", taxId: "TX-881234", contact: "Samir Patel", phone: "713-555-0144", status: "Approved" }
  ]);

  // Product Add Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'ramune',
    origin: '🇯🇵 Japan',
    retailPrice: 2.99,
    b2bPrice: 1.65,
    caseQty: 30,
    stock: 100,
    description: '',
    image: '/images/ramune_banner.jpg',
    tags: 'Exotic, Import'
  });

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const created = {
      ...newProduct,
      id: `custom-prod-${Date.now()}`,
      retailPrice: parseFloat(newProduct.retailPrice),
      b2bPrice: parseFloat(newProduct.b2bPrice),
      stock: parseInt(newProduct.stock),
      caseQty: parseInt(newProduct.caseQty),
      rating: 5.0,
      reviewsCount: 1,
      tags: newProduct.tags.split(',').map(t => t.trim()),
      inStock: true
    };
    setProducts([created, ...products]);
    setIsAddProductOpen(false);
  };

  const toggleStock = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const approveApplicant = (id) => {
    setB2bApplicants(b2bApplicants.map(a => a.id === id ? { ...a, status: "Approved" } : a));
  };

  return (
    <div className="py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Store Operations Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Central Admin Dashboard</h1>
          <p className="text-xs text-slate-400">
            Manage inventory, B2B wholesale pricing, customer orders, and site parameters.
          </p>
        </div>

        <button
          onClick={() => setIsAddProductOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-rose-950/50"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveAdminSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminSubTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveAdminSubTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminSubTab === 'products'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminSubTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('b2b')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminSubTab === 'b2b'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Wholesaler Accounts ({b2bApplicants.length})
        </button>
      </div>

      {/* OVERVIEW SUBTAB */}
      {activeAdminSubTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Monthly Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">$14,890.00</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" /> +24% vs last month
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>B2B Wholesale Orders</span>
                <Building2 className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">42 Cases</p>
              <p className="text-[11px] text-amber-400 font-medium">$11,400.00 in bulk revenue</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Active Products</span>
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white">{products.length} Items</p>
              <p className="text-[11px] text-slate-400 font-medium">12 Ramune soda flavors live</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pending Approvals</span>
                <Clock className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-white">1 Applicant</p>
              <p className="text-[11px] text-rose-400 font-medium">Wholesale Resale License</p>
            </div>
          </div>

          {/* Quick Orders Summary */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base">Recent Store Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-white">{order.id}</td>
                      <td className="p-3 font-semibold">{order.customer}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.type.includes('B2B') ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">${order.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-semibold">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS SUBTAB */}
      {activeAdminSubTab === 'products' && (
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">All Products Inventory</h3>
              <input
                type="text"
                placeholder="Filter by product name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Origin</th>
                    <th className="p-3">Retail Price</th>
                    <th className="p-3">B2B Case Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products
                    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(p => (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded bg-slate-950 p-1" />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-3">{p.origin}</td>
                        <td className="p-3 font-semibold text-white">${p.retailPrice.toFixed(2)}</td>
                        <td className="p-3 font-semibold text-amber-400">
                          ${(p.b2bPrice * p.caseQty).toFixed(2)} ({p.caseQty}ct)
                        </td>
                        <td className="p-3 font-mono">{p.stock} units</td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleStock(p.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.inStock ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => toggleStock(p.id)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS SUBTAB */}
      {activeAdminSubTab === 'orders' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base">Customer Orders Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Order Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-white">{order.id}</td>
                    <td className="p-3 font-semibold">{order.customer}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.type.includes('B2B') ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{order.items}</td>
                    <td className="p-3 font-bold text-emerald-400">${order.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-white"
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* B2B APPLICANTS SUBTAB */}
      {activeAdminSubTab === 'b2b' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base">B2B Wholesaler Applications</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Business Name</th>
                  <th className="p-3">Resale Tax ID</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {b2bApplicants.map(app => (
                  <tr key={app.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">{app.business}</td>
                    <td className="p-3 font-mono">{app.taxId}</td>
                    <td className="p-3">{app.contact}</td>
                    <td className="p-3">{app.phone}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {app.status !== 'Approved' && (
                        <button
                          onClick={() => approveApplicant(app.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                        >
                          Approve Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-extrabold text-white">Add New Product to Store</h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sangaria Ramune Watermelon Soda"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="ramune">Ramune Soda</option>
                    <option value="chips">Chips & Snacks</option>
                    <option value="chocolates">Chocolates</option>
                    <option value="beverages">Beverages</option>
                    <option value="candy">Candy & Gums</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Origin Tag</label>
                  <input
                    type="text"
                    placeholder="🇯🇵 Japan"
                    value={newProduct.origin}
                    onChange={e => setNewProduct({...newProduct, origin: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Retail Price ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={newProduct.retailPrice}
                    onChange={e => setNewProduct({...newProduct, retailPrice: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">B2B Unit Price ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={newProduct.b2bPrice}
                    onChange={e => setNewProduct({...newProduct, b2bPrice: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Case Quantity</label>
                  <input
                    required
                    type="number"
                    value={newProduct.caseQty}
                    onChange={e => setNewProduct({...newProduct, caseQty: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Product notes and specs..."
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
