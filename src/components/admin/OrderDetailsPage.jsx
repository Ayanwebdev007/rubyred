import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Receipt, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Boxes, 
  ExternalLink,
  ChevronRight,
  Package
} from 'lucide-react';

export default function OrderDetailsPage({
  order,
  orderType = 'wholesale', // 'wholesale' | 'retail'
  onBack,
  onUpdateStatus
}) {
  if (!order) return null;

  const isWholesale = orderType === 'wholesale';
  const [currentStatus, setCurrentStatus] = useState(order.status || 'Processing');
  const [isUpdating, setIsUpdating] = useState(false);

  // Parse items
  const lineItems = React.useMemo(() => {
    if (Array.isArray(order.items)) return order.items;
    if (typeof order.items === 'string') {
      return order.items.split(',').map((item, idx) => {
        const trimmed = item.trim();
        // check for "5 Cases Sangaria Ramune" or "2x Milka Oreo"
        const caseMatch = trimmed.match(/^(\d+)\s*(?:Cases?|cases?|x)?\s*(.*)$/i);
        const qty = caseMatch ? caseMatch[1] : '1';
        const name = caseMatch && caseMatch[2] ? caseMatch[2].trim() : trimmed;
        return {
          id: `item-${idx}`,
          name: name || trimmed,
          qty: qty || '1',
          unitLabel: isWholesale ? 'Cases' : 'Units',
          unitPrice: isWholesale ? 61.50 : 3.79,
          total: isWholesale ? Number(qty || 1) * 61.50 : Number(qty || 1) * 3.79
        };
      });
    }
    return [
      { id: 'item-1', name: 'Import Snack Variety Pack', qty: '1', unitLabel: 'Units', unitPrice: Number(order.amount || 24.50), total: Number(order.amount || 24.50) }
    ];
  }, [order.items, isWholesale, order.amount]);

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      setIsUpdating(true);
      await onUpdateStatus(order.id, newStatus, isWholesale);
      setIsUpdating(false);
    }
  };

  const statusColor = 
    currentStatus === 'Delivered' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : currentStatus === 'Shipped' 
        ? 'bg-blue-50 text-blue-700 border-blue-200' 
        : 'bg-amber-50 text-amber-700 border-amber-200';

  const orderTotal = Number(order.amount || order.total || 0);

  return (
    <div className="space-y-6 font-['Outfit',sans-serif] animate-in fade-in duration-150">
      
      {/* 1. TOP HEADER & BREADCRUMB BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-[#d9232e] tracking-tight">
                Order {order.id}
              </h2>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isWholesale ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-[#d9232e]'
              }`}>
                {isWholesale ? 'Wholesale B2B' : 'Retail B2C'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Placed on {order.date || 'October 17, 2026'} • Texas Regional Fulfillment
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Print Invoice / BOL */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isWholesale ? 'Print BOL / Invoice' : 'Print Receipt'}</span>
          </button>

          {/* Close/Done button */}
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-[#d9232e] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>

      </div>

      {/* 2. ORDER FULFILLMENT LIFECYCLE STEPPER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900">Fulfillment Progression</span>
          <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
            Current State: {currentStatus}
          </span>
        </div>

        {/* 3 Step Visual Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          
          <div className={`p-3 rounded-xl border transition-all ${
            currentStatus === 'Processing' || currentStatus === 'Shipped' || currentStatus === 'Delivered'
              ? 'bg-amber-50/60 border-amber-300'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <span className="text-xs font-semibold text-slate-900">Order Received & Queued</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-8">Invoice validated • Staged in Houston Harwin depot</p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            currentStatus === 'Shipped' || currentStatus === 'Delivered'
              ? 'bg-blue-50/60 border-blue-300'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <span className="text-xs font-semibold text-slate-900">Dispatched & In Transit</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-8">
              {isWholesale ? 'Palletized LTL Freight on route' : 'Local courier out for delivery'}
            </p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            currentStatus === 'Delivered'
              ? 'bg-emerald-50/60 border-emerald-300'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <span className="text-xs font-semibold text-slate-900">Delivered & Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-8">Signed receipt verified at destination dock</p>
          </div>

        </div>
      </div>

      {/* 3. TWO-COLUMN ORDER DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Line Items & Freight Manifest */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card A: Ordered Line Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                  {isWholesale ? 'Case Pack Line Items' : 'Customer Items'}
                </h3>
                <p className="text-xs text-slate-400 font-normal">
                  {isWholesale ? `${order.cases || '10 Cases'} (Factory Master Cartons)` : 'Retail Package Units'}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                {lineItems.length} Products Included
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 text-[11px] font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Item & Specification</th>
                    <th className="py-3 px-4">Packaging Type</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md ${
                          isWholesale ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isWholesale ? 'Factory Master Carton' : 'Retail Pack'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800">
                        {item.qty} {item.unitLabel}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Calculation Footer */}
            <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono font-medium">${orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Freight & Delivery:</span>
                <span className="font-medium text-emerald-700">Free Texas Regional Logistics</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State & Local Sales Tax:</span>
                <span className="font-mono font-medium">
                  {isWholesale ? '$0.00 (TX Resale Tax Exemption)' : '$0.00 (Included)'}
                </span>
              </div>
              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-slate-900">Total Invoiced:</span>
                <span className="text-xl font-semibold text-[#d9232e] font-mono">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Freight Manifest & Delivery Logistics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#d9232e]" />
                <span>Shipping & Transport Manifest</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                BOL #{order.id}-TX
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Logistics Type</p>
                <p className="font-semibold text-slate-800">
                  {isWholesale ? 'Palletized LTL Freight' : 'Direct Ground Courier'}
                </p>
                <p className="text-[10px] text-slate-500">Scheduled Dispatch</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Origin Hub</p>
                <p className="font-semibold text-slate-800">Houston Harwin Depot</p>
                <p className="text-[10px] text-slate-500">Warehouse Dock 4</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Handling Requirements</p>
                <p className="font-semibold text-slate-800">Climate Controlled (Cool)</p>
                <p className="text-[10px] text-emerald-700 font-medium">Food-Grade Certified</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
              <p className="font-semibold text-slate-800">Receiving & Delivery Instructions:</p>
              <p className="text-slate-600 font-normal">
                {isWholesale 
                  ? 'Deliver to rear loading dock bay 2. Forklift and pallet jack available on site. Inspect cartons and sign physical BOL.'
                  : 'Deliver directly to front address. Ring doorbell upon delivery. Age 21+ ID verified for snack order delivery.'
                }
              </p>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Customer Account & Payment Terms */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Customer / Business Profile */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                {isWholesale ? <Building2 className="w-4 h-4 text-amber-600" /> : <User className="w-4 h-4 text-[#d9232e]" />}
                <span>{isWholesale ? 'Business Account' : 'Customer Profile'}</span>
              </h3>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase">
                  {isWholesale ? 'Store / Company Name' : 'Customer Name'}
                </p>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">
                  {order.storeName || order.customer || 'Harwin Partner Account'}
                </p>
              </div>

              {isWholesale && order.contact && (
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Primary Buyer Contact</p>
                  <p className="font-medium text-slate-800 mt-0.5">{order.contact}</p>
                </div>
              )}

              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{order.email || 'billing@rubyredwholesale.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{order.phone || '713-555-0144'}</span>
                </div>
              </div>

              {isWholesale && (
                <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-[11px] space-y-1">
                  <p className="font-semibold text-amber-900">Texas Resale Tax Exemption</p>
                  <p className="font-mono text-amber-800">Certificate: TX-881234-1</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Delivery Destination */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Delivery Destination</span>
            </h3>

            <div className="text-xs space-y-1 text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="font-semibold text-slate-900">
                {order.storeName || order.customer}
              </p>
              <p className="text-slate-600">7420 Harwin Drive, Suite B</p>
              <p className="text-slate-600">Houston, TX 77036</p>
              <p className="text-[11px] text-slate-400 pt-1">United States • Metro Houston Region</p>
            </div>
          </div>

          {/* Card 3: Payment & Terms */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>Payment & Terms</span>
            </h3>

            <div className="text-xs space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800">
                  {isWholesale ? 'Net 30 Wholesale Terms' : 'Credit Card (Online)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-semibold text-emerald-700">
                  {isWholesale ? 'Invoice Dispatched (Net 30)' : 'Paid in Full'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currency:</span>
                <span className="font-mono font-semibold text-slate-800">USD ($)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
