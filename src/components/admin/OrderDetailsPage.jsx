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
  const isWholesale = orderType === 'wholesale';
  const [currentStatus, setCurrentStatus] = useState(order?.status || 'Processing');
  const [isUpdating, setIsUpdating] = useState(false);

  // Parse items
  const lineItems = React.useMemo(() => {
    const items = order?.items;
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      return items.split(',').map((item, idx) => {
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
          unitPrice: null,
          total: null
        };
      });
    }
    return [];
  }, [order?.items, isWholesale]);

  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    const previous = currentStatus;
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      setIsUpdating(true);
      const ok = await onUpdateStatus(order.id, newStatus, isWholesale);
      setIsUpdating(false);
      if (ok === false) setCurrentStatus(previous);
    }
  };

  const statusColor = 
    currentStatus === 'Delivered' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : currentStatus === 'Shipped' 
        ? 'bg-blue-50 text-blue-700 border-blue-200' 
        : 'bg-amber-50 text-amber-700 border-amber-200';

  const orderTotal = Number(order.total ?? order.amount ?? 0);
  const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;

  return (
    <div className="space-y-4 sm:space-y-6 font-['Outfit',sans-serif] animate-in fade-in duration-150 min-w-0">
      
      {/* 1. TOP HEADER & BREADCRUMB BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="-ml-2 xs:ml-0 shrink-0 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
          <div className="hidden xs:block h-4 w-px bg-slate-200" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="text-lg font-semibold text-[#d9232e] tracking-tight break-all">
                Order {order.id}
              </h2>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isWholesale ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-[#d9232e]'
              }`}>
                {isWholesale ? 'Wholesale B2B' : 'Retail B2C'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Placed on {order.date || '—'} • {order.deliveryMethod || (isWholesale ? 'Wholesale' : 'Retail')}
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
              <option value="Cancelled">Cancelled</option>
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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column (8 cols): Line Items & Freight Manifest */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6 min-w-0">
          
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
              <table className="w-full min-w-[560px] text-left text-xs text-slate-600">
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
                          {item.unitLabel === 'Cases' ? `Case${item.caseQty > 1 ? ` of ${item.caseQty}` : ''}` : 'Single unit'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800">
                        {item.qty} {item.unitLabel}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {item.unitPrice == null ? '—' : money(item.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        {item.total == null ? '—' : money(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between gap-3 text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono font-medium">{money(order.subtotal ?? orderTotal)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between gap-3 text-emerald-700">
                  <span>Discounts{order.promoCode ? ` (${order.promoCode})` : ''}:</span>
                  <span className="font-mono font-medium">-{money(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between gap-3 text-slate-600">
                <span>Shipping / Delivery:</span>
                <span className="font-mono font-medium">{Number(order.shipping) > 0 ? money(order.shipping) : 'FREE'}</span>
              </div>
              <div className="flex justify-between gap-3 text-slate-600">
                <span>TX Sales Tax:</span>
                <span className="font-mono font-medium">{order.tax != null ? money(order.tax) : '—'}</span>
              </div>
              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline gap-3">
                <span className="text-sm font-semibold text-slate-900">Order Total:</span>
                <span className="text-xl font-semibold text-[#d9232e] font-mono">
                  {money(orderTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment & status history */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#d9232e]" />
              <span>Fulfillment</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Method</p>
                <p className="font-semibold text-slate-800">{order.deliveryMethod || '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Placed Via</p>
                <p className="font-semibold text-slate-800">{order.source === 'whatsapp' ? 'Website + WhatsApp' : 'Website checkout'}</p>
              </div>
            </div>
            {order.notes && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <p className="font-semibold text-amber-900">Customer Notes</p>
                <p className="text-amber-900/90 break-words">{order.notes}</p>
              </div>
            )}
            {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
              <div className="text-xs space-y-1.5">
                <p className="font-semibold text-slate-800">Status History</p>
                <ul className="space-y-1">
                  {order.statusHistory.map((h, idx) => (
                    <li key={idx} className="flex justify-between gap-3 text-slate-600">
                      <span className="font-medium">{h.status}</span>
                      <span className="text-slate-400">{new Date(h.at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Customer & Payment */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6 min-w-0">

          {/* Card 1: Customer / Business Profile */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                {isWholesale ? <Building2 className="w-4 h-4 text-amber-600" /> : <User className="w-4 h-4 text-[#d9232e]" />}
                <span>{isWholesale ? 'Business Account' : 'Customer'}</span>
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase">
                  {isWholesale ? 'Store / Company Name' : 'Customer Name'}
                </p>
                <p className="font-semibold text-slate-900 text-sm mt-0.5 break-words">
                  {order.storeName || order.customer || '—'}
                </p>
              </div>
              {isWholesale && order.contact && (
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase">Primary Buyer Contact</p>
                  <p className="font-medium text-slate-800 mt-0.5">{order.contact}</p>
                </div>
              )}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                {order.email && (
                  <a href={`mailto:${order.email}`} className="flex items-center gap-2 text-slate-600 hover:text-[#d9232e]">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{order.email}</span>
                  </a>
                )}
                {order.phone && (
                  <a href={`tel:${order.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-slate-600 hover:text-[#d9232e]">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{order.phone}</span>
                  </a>
                )}
                {!order.email && !order.phone && <p className="text-slate-400">No contact details on this order.</p>}
              </div>
            </div>
          </div>

          {/* Card 2: Delivery Destination */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{order.deliveryMethod === 'Store Pickup' ? 'Pickup Location' : 'Delivery Address'}</span>
            </h3>
            <div className="text-xs text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200/70 whitespace-pre-line break-words">
              {order.address || '—'}
            </div>
          </div>

          {/* Card 3: Payment */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>Payment</span>
            </h3>
            <div className="text-xs space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800 text-right">{order.paymentMethod || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Amount Due:</span>
                <span className="font-mono font-semibold text-slate-800">{money(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
