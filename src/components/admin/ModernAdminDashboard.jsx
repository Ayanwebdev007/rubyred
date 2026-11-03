import React, { useState, useMemo } from 'react';
import { 
  ChevronRight,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle2,
  Package,
  ShoppingBag,
  Building2,
  Users,
  Store,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export default function ModernAdminDashboard({
  categories = [],
  productsList = [],
  retailOrders = [],
  wholesaleOrders = [],
  retailCustomers = [],
  wholesaleCustomers = [],
  setActiveTab,
  onSelectRetailOrder,
  onSelectWholesaleOrder
}) {
  const [timeframe, setTimeframe] = useState('30d');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'retail' | 'wholesale'

  // 1. Live records only (no sample data)
  const effectiveRetailOrders = retailOrders || [];
  const effectiveWholesaleOrders = wholesaleOrders || [];
  const effectiveRetailCustomers = retailCustomers || [];
  const effectiveWholesaleCustomers = wholesaleCustomers || [];
  const effectiveCategories = categories || [];
  const effectiveProducts = productsList || [];

  const orderAmount = (o) => Number(o.total ?? o.amount ?? 0) || 0;
  const orderTime = (o) => {
    const t = new Date(o.createdAt || (o.date || '').replace(' ', 'T')).getTime();
    return isNaN(t) ? null : t;
  };
  const isCounted = (o) => o.status !== 'Cancelled';

  // Per-account order stats for the customer cards
  const customerStats = useMemo(() => {
    const stats = new Map();
    [...effectiveRetailOrders, ...effectiveWholesaleOrders].filter(isCounted).forEach(o => {
      if (!o.userId) return;
      const s = stats.get(o.userId) || { count: 0, spent: 0 };
      s.count += 1;
      s.spent += orderAmount(o);
      stats.set(o.userId, s);
    });
    return stats;
  }, [effectiveRetailOrders, effectiveWholesaleOrders]);

  // Combined and sorted latest orders
  const recentOrdersList = useMemo(() => {
    const summary = (o) => o.itemsSummary || (typeof o.items === 'string' ? o.items : '');
    const rMapped = effectiveRetailOrders.map(o => ({
      ...o,
      orderType: 'retail',
      displayName: o.customer || 'Retail Customer',
      amountNum: orderAmount(o),
      itemSnippet: summary(o) || 'Retail order'
    }));
    const wMapped = effectiveWholesaleOrders.map(o => ({
      ...o,
      orderType: 'wholesale',
      displayName: o.storeName || o.businessName || o.customer || 'Wholesale Store',
      amountNum: orderAmount(o),
      itemSnippet: o.cases ? `${o.cases} • ${summary(o) || 'Cases'}` : (summary(o) || 'Wholesale order')
    }));

    let merged = [...rMapped, ...wMapped];
    if (orderFilter === 'retail') merged = rMapped;
    if (orderFilter === 'wholesale') merged = wMapped;

    return merged.sort((a, b) => (orderTime(b) || 0) - (orderTime(a) || 0)).slice(0, 5);
  }, [effectiveRetailOrders, effectiveWholesaleOrders, orderFilter]);

  // 2. Calculated Telemetry Metrics
  const metrics = useMemo(() => {
    const activeRetailRev = effectiveRetailOrders.filter(isCounted).reduce((sum, o) => sum + orderAmount(o), 0);
    const activeWholesaleRev = effectiveWholesaleOrders.filter(isCounted).reduce((sum, o) => sum + orderAmount(o), 0);
    const totalRev = activeRetailRev + activeWholesaleRev;

    const retailShare = totalRev > 0 ? Math.round((activeRetailRev / totalRev) * 100) : 0;
    const wholesaleShare = totalRev > 0 ? 100 - retailShare : 0;

    const totalSkus = effectiveProducts.length;
    const inStockSkus = effectiveProducts.filter(p => p.inStock !== false && (p.stock === undefined || p.stock > 0)).length;
    const stockHealthRate = totalSkus > 0 ? Math.round((inStockSkus / totalSkus) * 100) : 0;
    const totalOrdersCount = effectiveRetailOrders.length + effectiveWholesaleOrders.length;
    const totalStoresCount = effectiveWholesaleCustomers.length;

    // Pipeline counts
    const allOrders = [...effectiveRetailOrders, ...effectiveWholesaleOrders];
    const queueCount = allOrders.filter(o => o.status === 'Processing').length;
    const transitCount = allOrders.filter(o => o.status === 'Shipped').length;
    const deliveredCount = allOrders.filter(o => o.status === 'Delivered').length;

    return {
      activeRetailRev,
      activeWholesaleRev,
      totalRev,
      retailShare,
      wholesaleShare,
      totalSkus,
      inStockSkus,
      stockHealthRate,
      totalOrdersCount,
      totalStoresCount,
      queueCount,
      transitCount,
      deliveredCount
    };
  }, [effectiveRetailOrders, effectiveWholesaleOrders, effectiveProducts, effectiveWholesaleCustomers]);

  // 3. Revenue trend from real orders (cancelled orders excluded)
  const chartData = useMemo(() => {
    const DAY = 24 * 60 * 60 * 1000;
    const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const today = startOfDay(Date.now());
    const short = (t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let buckets;
    if (timeframe === '7d') {
      buckets = Array.from({ length: 7 }, (_, i) => {
        const start = today - (6 - i) * DAY;
        return { start, end: start + DAY, label: new Date(start).toLocaleDateString('en-US', { weekday: 'short' }), fullDate: short(start) };
      });
    } else if (timeframe === '90d') {
      const now = new Date();
      buckets = Array.from({ length: 3 }, (_, i) => {
        const start = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1).getTime();
        const end = new Date(now.getFullYear(), now.getMonth() - (2 - i) + 1, 1).getTime();
        const name = new Date(start).toLocaleDateString('en-US', { month: 'short' });
        return { start, end, label: name, fullDate: new Date(start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
      });
    } else {
      buckets = Array.from({ length: 4 }, (_, i) => {
        const end = today + DAY - (3 - i) * 7 * DAY;
        const start = end - 7 * DAY;
        return { start, end, label: `Week ${i + 1}`, fullDate: `${short(start)} - ${short(end - DAY)}` };
      });
    }

    const sumIn = (orders, b) => orders.filter(isCounted).reduce((sum, o) => {
      const t = orderTime(o);
      return t !== null && t >= b.start && t < b.end ? sum + orderAmount(o) : sum;
    }, 0);

    return buckets.map(b => ({
      label: b.label,
      fullDate: b.fullDate,
      retail: Math.round(sumIn(effectiveRetailOrders, b) * 100) / 100,
      wholesale: Math.round(sumIn(effectiveWholesaleOrders, b) * 100) / 100
    }));
  }, [timeframe, effectiveRetailOrders, effectiveWholesaleOrders]);

  const fmt = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const fmtPrecise = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

  // SVG Chart Geometry
  const chartW = 600;
  const chartH = 210;
  const padX = 35;
  const padY = 25;

  const maxVal = useMemo(() => {
    return Math.max(...chartData.map(d => Math.max(d.wholesale, d.retail))) * 1.2 || 100;
  }, [chartData]);

  const getCoord = (val, idx) => {
    const x = padX + (idx / (chartData.length - 1)) * (chartW - padX * 2);
    const y = chartH - padY - (val / maxVal) * (chartH - padY * 2);
    return { x, y };
  };

  const buildPath = (key) => {
    if (chartData.length === 0) return '';
    const pts = chartData.map((d, i) => getCoord(d[key], i));
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const buildArea = (key) => {
    const line = buildPath(key);
    if (!line) return '';
    const pFirst = getCoord(chartData[0][key], 0);
    const pLast = getCoord(chartData[chartData.length - 1][key], chartData.length - 1);
    const ground = chartH - padY;
    return `${line} L ${pLast.x} ${ground} L ${pFirst.x} ${ground} Z`;
  };

  const wholesaleLine = buildPath('wholesale');
  const wholesaleArea = buildArea('wholesale');
  const retailLine = buildPath('retail');
  const retailArea = buildArea('retail');

  const activePoint = hoveredIdx !== null ? chartData[hoveredIdx] : chartData[chartData.length - 1];

  // Radial Multi-Ring Calculations (Spacious Apple-style rings with wide center diameter)
  const rWholesale = 44;
  const rRetail = 38;
  const rStock = 32;
  const cWholesale = 2 * Math.PI * rWholesale;
  const cRetail = 2 * Math.PI * rRetail;
  const cStock = 2 * Math.PI * rStock;

  return (
    <div className="space-y-4 sm:space-y-6 font-['Outfit',sans-serif] min-w-0">

      {/* ========================================================================= */}
      {/* 1. HERO INFOGRAPHIC BANNER: LIGHT THEME REVENUE WAVE + CONCENTRIC GAUGE   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden relative">
        
        {/* Soft colorful accent wash */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Main Visual Wave Chart (8 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 space-y-4 relative z-10 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#d9232e] tracking-tight">Sales Overview</h2>
              </div>

              {/* Segmented Timeframe Switcher & Legend */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-normal">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Wholesale ({metrics.wholesaleShare}%)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d9232e]" />
                    Retail ({metrics.retailShare}%)
                  </span>
                </div>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
                  {['7d', '30d', '90d'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-md transition-all cursor-pointer ${
                        timeframe === t 
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Data Readout Bar (Light Tinted) */}
            <div className="px-3 sm:px-4 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 font-normal">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500">Timeline Node:</span>
                <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs whitespace-nowrap">
                  {activePoint.fullDate || activePoint.label}
                </span>
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span className="flex items-center gap-1.5 text-amber-700 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Wholesale: <strong className="font-semibold text-slate-900">{fmt(activePoint.wholesale)}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-red-700 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#d9232e]" />
                  Retail: <strong className="font-semibold text-slate-900">{fmt(activePoint.retail)}</strong>
                </span>
              </div>
            </div>

            {/* Pure SVG Wave Curve with Rich Colorful Gradients */}
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
            <div className="w-full min-w-[520px] sm:min-w-0 h-56 select-none pt-1">
              <svg 
                viewBox={`0 0 ${chartW} ${chartH}`} 
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Amber Area Gradient */}
                  <linearGradient id="lightWholesaleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Ruby Red Area Gradient */}
                  <linearGradient id="lightRetailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d9232e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#d9232e" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = chartH - padY - pct * (chartH - padY * 2);
                  return (
                    <g key={i}>
                      <line 
                        x1={padX} 
                        y1={y} 
                        x2={chartW - padX} 
                        y2={y} 
                        stroke="#f1f5f9" 
                        strokeWidth="1" 
                      />
                      <text 
                        x={padX - 8} 
                        y={y + 3} 
                        textAnchor="end" 
                        className="text-[11px] fill-slate-500 font-mono"
                      >
                        {fmt(pct * maxVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Wholesale Area & Line */}
                <path d={wholesaleArea} fill="url(#lightWholesaleGrad)" />
                <path 
                  d={wholesaleLine} 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />

                {/* Retail Area & Line */}
                <path d={retailArea} fill="url(#lightRetailGrad)" />
                <path 
                  d={retailLine} 
                  fill="none" 
                  stroke="#d9232e" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {chartData.map((d, i) => {
                  const ptW = getCoord(d.wholesale, i);
                  const ptR = getCoord(d.retail, i);
                  const isHover = hoveredIdx === i;

                  return (
                    <g 
                      key={i} 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onClick={() => setHoveredIdx(i)}
                    >
                      {isHover && (
                        <line 
                          x1={ptW.x} 
                          y1={padY} 
                          x2={ptW.x} 
                          y2={chartH - padY} 
                          stroke="#cbd5e1" 
                          strokeWidth="1.5" 
                          strokeDasharray="2 2" 
                        />
                      )}

                      <circle 
                        cx={ptW.x} 
                        cy={ptW.y} 
                        r={isHover ? 5.5 : 3.5} 
                        fill="#f59e0b" 
                        stroke="#ffffff" 
                        strokeWidth={2} 
                      />

                      <circle 
                        cx={ptR.x} 
                        cy={ptR.y} 
                        r={isHover ? 5.5 : 3.5} 
                        fill="#d9232e" 
                        stroke="#ffffff" 
                        strokeWidth={2} 
                      />

                      <text 
                        x={ptW.x} 
                        y={chartH - 4} 
                        textAnchor="middle" 
                        className={`text-[11px] font-normal ${isHover ? 'fill-slate-900 font-semibold' : 'fill-slate-500'}`}
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            </div>
          </div>

          {/* Right Column: Concentric Multi-Ring Radial Infographic (4 cols, Light Theme) */}
          <div className="lg:col-span-4 p-4 sm:p-6 flex flex-col justify-between space-y-4 relative z-10 bg-slate-50/60 min-w-0">
            <div>
              <h3 className="text-base font-semibold text-[#d9232e] tracking-tight">Sales Channels</h3>
            </div>

            {/* Custom Triple Concentric SVG Rings on Light Background */}
            <div className="relative w-48 h-48 mx-auto my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background tracks */}
                <circle cx="50" cy="50" r={rWholesale} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle cx="50" cy="50" r={rRetail} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle cx="50" cy="50" r={rStock} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />

                {/* Outer Ring: Wholesale (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r={rWholesale}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray={`${(metrics.wholesaleShare / 100) * cWholesale} ${cWholesale}`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Middle Ring: Retail (Ruby Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r={rRetail}
                  fill="none"
                  stroke="#d9232e"
                  strokeWidth="3.5"
                  strokeDasharray={`${(metrics.retailShare / 100) * cRetail} ${cRetail}`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Inner Ring: Inventory Health (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r={rStock}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray={`${(metrics.stockHealthRate / 100) * cStock} ${cStock}`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Centered Total KPI Readout - Spacious & Clean */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none px-2">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-1">
                  Gross Total
                </span>
                <span className="text-xl font-semibold text-slate-900 tracking-tight leading-none my-0.5">
                  {fmt(metrics.totalRev)}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                  {metrics.stockHealthRate}% In Stock
                </span>
              </div>
            </div>

            {/* Radial Legend Cards with Color Accents */}
            <div className="space-y-2 text-xs">
              <div 
                onClick={() => setActiveTab('wholesale-orders')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:bg-amber-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700 font-normal">Wholesale B2B ({metrics.wholesaleShare}%)</span>
                </div>
                <span className="font-semibold text-slate-900">{fmt(metrics.activeWholesaleRev)}</span>
              </div>

              <div 
                onClick={() => setActiveTab('retail-orders')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:bg-red-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d9232e]" />
                  <span className="text-slate-700 font-normal">Retail B2C ({metrics.retailShare}%)</span>
                </div>
                <span className="font-semibold text-slate-900">{fmt(metrics.activeRetailRev)}</span>
              </div>

              <div 
                onClick={() => setActiveTab('products')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:bg-emerald-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 font-normal">Stock Health ({metrics.stockHealthRate}%)</span>
                </div>
                <span className="font-semibold text-slate-900">{metrics.totalSkus} SKUs</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RECENT ORDERS (Pipeline Telemetry + Live Order Stream)                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[#d9232e] tracking-tight">Recent Orders</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600 max-w-full overflow-x-auto no-scrollbar">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  orderFilter === 'all' 
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Orders ({metrics.totalOrdersCount})
              </button>
              <button
                onClick={() => setOrderFilter('retail')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  orderFilter === 'retail' 
                    ? 'bg-white text-[#d9232e] shadow-2xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Retail ({effectiveRetailOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter('wholesale')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  orderFilter === 'wholesale' 
                    ? 'bg-white text-amber-700 shadow-2xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Wholesale ({effectiveWholesaleOrders.length})
              </button>
            </div>

            <button
              onClick={() => setActiveTab('retail-orders')}
              className="text-xs font-semibold text-[#d9232e] hover:underline transition-colors flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>



        {/* Live Latest Orders Stream Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full min-w-[680px] text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-medium border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Order</th>
                <th className="py-2.5 px-3.5">Buyer</th>
                <th className="py-2.5 px-3.5">Items Summary</th>
                <th className="py-2.5 px-3.5">Total Amount</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {recentOrdersList.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-slate-400">No orders yet. New orders appear here as customers check out.</td></tr>
              )}
              {recentOrdersList.map((order, idx) => {
                const isWholesale = order.orderType === 'wholesale';
                const statusColor = 
                  order.status === 'Delivered' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : order.status === 'Shipped' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <tr 
                    key={order.id || idx}
                    onClick={() => {
                      if (isWholesale && onSelectWholesaleOrder) {
                        onSelectWholesaleOrder(order);
                      } else if (!isWholesale && onSelectRetailOrder) {
                        onSelectRetailOrder(order);
                      } else {
                        setActiveTab(isWholesale ? 'wholesale-orders' : 'retail-orders');
                      }
                    }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                          isWholesale ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-[#d9232e]'
                        }`}>
                          {isWholesale ? 'B2B' : 'B2C'}
                        </span>
                        <span className="font-semibold text-slate-900 group-hover:text-[#d9232e] transition-colors whitespace-nowrap">
                          {order.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <p className="font-medium text-slate-800">{order.displayName}</p>
                      <p className="text-[10px] text-slate-400">{order.email || order.phone || (isWholesale ? 'Wholesale Partner' : 'Retail Shopper')}</p>
                    </td>
                    <td className="py-2.5 px-3.5 max-w-[220px]">
                      <p className="truncate text-slate-600">{order.itemSnippet}</p>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-semibold text-slate-900">{fmtPrecise(order.amountNum)}</span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-400 text-[11px]">
                      {order.date || 'Recent'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN GLIMPSE: CATEGORIES & LATEST PRODUCTS                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Categories Glimpse (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#d9232e] tracking-tight">Categories</h3>
            </div>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs font-semibold text-[#d9232e] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({effectiveCategories.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clean Category Cards with Photos & SKU Counts */}
          <div className="space-y-2.5 pt-1">
            {effectiveCategories.slice(0, 5).map((cat, idx) => {
              const catProds = effectiveProducts.filter(p => p.categoryId === cat.id);
              const count = catProds.length || cat.itemCount || 2;
              const pct = effectiveProducts.length > 0 ? Math.round((count / effectiveProducts.length) * 100) : 20;

              const spectrumGradients = [
                'from-rose-500 to-red-600',
                'from-amber-400 to-amber-600',
                'from-blue-400 to-indigo-600',
                'from-emerald-400 to-teal-600',
                'from-purple-400 to-fuchsia-600'
              ];
              const grad = spectrumGradients[idx % spectrumGradients.length];

              return (
                <div 
                  key={cat.id || idx}
                  onClick={() => setActiveTab('categories')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={cat.img || cat.image || '/images/cat_snacks.jpg'} 
                        alt={cat.title} 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 group-hover:text-[#d9232e] transition-colors block truncate">
                          {cat.title || cat.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {count} Products in catalog
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 shrink-0">
                      <span className="text-slate-900 font-semibold whitespace-nowrap">{pct}% share</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#d9232e] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.max(pct, 12)}%` }} 
                      className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Latest Products Glimpse (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#d9232e] tracking-tight">Products</h3>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-semibold text-[#d9232e] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({effectiveProducts.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product Cards with Photos, Pricing & Stock Status */}
          <div className="space-y-2.5 pt-1">
            {effectiveProducts.slice(0, 5).map((prod, idx) => {
              const retailP = Number(prod.retailPrice ?? prod.price ?? 0);
              const wholesaleP = Number(prod.b2bPrice ?? prod.wholesalePrice ?? 0);
              const stockCount = prod.stock;

              return (
                <div 
                  key={prod.id || idx}
                  onClick={() => setActiveTab('products')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-colors cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={prod.img || prod.image || '/images/koikeya_karamucho_hot_chili_snack.png'} 
                      alt={prod.title || prod.name} 
                      className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 group-hover:text-[#d9232e] transition-colors truncate text-xs">
                        {prod.title || prod.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-slate-400">{prod.categoryName || 'Import Snack'}</span>
                        <span className="text-slate-300">•</span>
                        <span className={prod.inStock === false ? 'text-rose-700 font-medium' : 'text-emerald-700 font-medium'}>
                          {prod.inStock === false ? 'Out of stock' : stockCount !== undefined ? `${stockCount} units in stock` : 'In stock'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-900">${retailP.toFixed(2)}</p>
                    <p className="text-[10px] text-amber-700 font-medium">B2B ${wholesaleP.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. CUSTOMERS GLIMPSE: RETAIL SHOPPERS & WHOLESALE B2B ACCOUNTS            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#d9232e] tracking-tight">Customers</h3>
          </div>
          <button
            onClick={() => setActiveTab('customers')}
            className="text-xs font-semibold text-[#d9232e] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All Accounts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          
          {/* Sub-Card 1: Retail Customers */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
              <span className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d9232e]" />
                Retail Shoppers ({effectiveRetailCustomers.length})
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Registered accounts</span>
            </div>

            <div className="space-y-2">
              {effectiveRetailCustomers.length === 0 && <p className="text-xs text-slate-400 py-2">No retail customers yet.</p>}
              {effectiveRetailCustomers.slice(0, 3).map((cust, idx) => (
                <div 
                  key={cust.id || idx}
                  onClick={() => setActiveTab('customers')}
                  className="p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:border-red-300 transition-all cursor-pointer flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-[160px] flex-1">
                    <div className="w-7 h-7 rounded-full bg-red-50 text-[#d9232e] flex items-center justify-center font-semibold text-xs shrink-0">
                      {(cust.name || cust.displayName || 'R')[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{cust.name || cust.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{cust.email || cust.phone}</p>
                    </div>
                  </div>

                  <div className="text-left xs:text-right shrink-0 pl-9 xs:pl-0">
                    {cust.isAgeVerified && (
                      <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Confirmed 21+
                      </span>
                    )}
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {(customerStats.get(cust.id)?.count || 0)} Orders • {fmtPrecise(customerStats.get(cust.id)?.spent || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Card 2: Wholesale B2B Accounts */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
              <span className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Wholesale Store Accounts ({effectiveWholesaleCustomers.length})
              </span>
              <span className="text-[10px] text-amber-800 font-normal">
                {effectiveWholesaleCustomers.filter(w => w.status === 'Pending').length} awaiting approval
              </span>
            </div>

            <div className="space-y-2">
              {effectiveWholesaleCustomers.length === 0 && <p className="text-xs text-slate-400 py-2">No wholesale applications yet.</p>}
              {effectiveWholesaleCustomers.slice(0, 3).map((store, idx) => (
                <div 
                  key={store.id || idx}
                  onClick={() => setActiveTab('customers')}
                  className="p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-[160px] flex-1">
                    <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-semibold text-xs shrink-0">
                      {(store.businessName || store.contactName || 'W')[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{store.businessName || store.dba}</p>
                      <p className="text-[10px] text-slate-400 truncate">{store.contactName || store.name}{store.email ? ` • ${store.email}` : ''}</p>
                    </div>
                  </div>

                  <div className="text-left xs:text-right shrink-0 pl-9 xs:pl-0">
                    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      store.status === 'Approved'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : store.status === 'Pending'
                          ? 'text-amber-800 bg-amber-50 border-amber-200'
                          : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}>
                      {store.status === 'Pending' ? 'Awaiting approval' : store.status || 'Pending'}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {(customerStats.get(store.id)?.count || 0)} Orders • {fmtPrecise(customerStats.get(store.id)?.spent || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
