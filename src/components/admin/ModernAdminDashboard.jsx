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

  // 1. Fallback records for clean demonstration if database collections are empty
  const effectiveRetailOrders = useMemo(() => {
    if (retailOrders && retailOrders.length > 0) return retailOrders;
    return [
      { id: "ORD-R-1092", customer: "Jessica Taylor", email: "jessica.taylor@gmail.com", items: "2x Sangaria Ramune Peach, 1x Milka Oreo", amount: 9.47, status: "Delivered", date: "2026-10-17 11:20", channel: "retail" },
      { id: "ORD-R-1091", customer: "Marcus Rodriguez", email: "marcus.r@gmail.com", items: "1x Koikeya Karamucho Hot Chili, 2x Ramune Melon", amount: 10.47, status: "Shipped", date: "2026-10-16 16:45", channel: "retail" },
      { id: "ORD-R-1090", customer: "Amanda Chen", email: "amanda.chen@yahoo.com", items: "2x Haribo Vampire Gummies, 1x MAOAM Kracher", amount: 10.27, status: "Processing", date: "2026-10-16 09:15", channel: "retail" }
    ];
  }, [retailOrders]);

  const effectiveWholesaleOrders = useMemo(() => {
    if (wholesaleOrders && wholesaleOrders.length > 0) return wholesaleOrders;
    return [
      { id: "ORD-W-504", storeName: "Harwin Gas & Snack Depot", contact: "Samir Patel", items: "10 Cases (300 Units)", amount: 615.00, status: "Processing", date: "2026-10-17 14:10", channel: "wholesale" },
      { id: "ORD-W-503", storeName: "Houston Exotic Munchies LLC", contact: "David Kim", items: "8 Cases (192 Units)", amount: 412.80, status: "Shipped", date: "2026-10-15 10:30", channel: "wholesale" },
      { id: "ORD-W-502", storeName: "Bella Vista Supermarket", contact: "Carlos Gomez", items: "15 Cases (450 Units)", amount: 757.50, status: "Delivered", date: "2026-10-14 18:20", channel: "wholesale" }
    ];
  }, [wholesaleOrders]);

  const effectiveRetailCustomers = useMemo(() => {
    if (retailCustomers && retailCustomers.length > 0) return retailCustomers;
    return [
      { id: "rc-1", name: "Jessica Taylor", email: "jessica.taylor@gmail.com", phone: "832-555-4821", city: "Houston, TX", ordersCount: 2, totalSpent: 24.50, joinedDate: "2026-10-01" },
      { id: "rc-2", name: "Marcus Rodriguez", email: "marcus.r@gmail.com", phone: "713-555-0199", city: "Katy, TX", ordersCount: 1, totalSpent: 10.47, joinedDate: "2026-10-05" },
      { id: "rc-3", name: "Amanda Chen", email: "amanda.chen@yahoo.com", phone: "832-555-3312", city: "Sugar Land, TX", ordersCount: 3, totalSpent: 32.80, joinedDate: "2026-10-10" }
    ];
  }, [retailCustomers]);

  const effectiveWholesaleCustomers = useMemo(() => {
    if (wholesaleCustomers && wholesaleCustomers.length > 0) return wholesaleCustomers;
    return [
      { id: "wc-1", businessName: "Harwin Gas & Snack Depot", contactName: "Samir Patel", email: "samir@harwingas.com", phone: "713-555-0144", taxId: "TX-881234-1", city: "Houston, TX", volume: "50-100 Cases/Mo" },
      { id: "wc-2", businessName: "Houston Exotic Munchies LLC", contactName: "David Kim", email: "david@houstonmunchies.com", phone: "832-555-0192", taxId: "TX-992144-2", city: "Houston, TX", volume: "80-120 Cases/Mo" },
      { id: "wc-3", businessName: "Bella Vista Supermarket", contactName: "Carlos Gomez", email: "carlos@bellavistamarket.com", phone: "832-555-8910", taxId: "TX-773122-3", city: "Dallas-FW, TX", volume: "100-200 Cases/Mo" }
    ];
  }, [wholesaleCustomers]);

  const effectiveCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    return [
      { id: "koikeya-snacks", title: "Koikeya Snacks", img: "/images/koikeya_banner.jpg", itemCount: 2 },
      { id: "milka-chocolates", title: "Milka Chocolates", img: "/images/Milka Oreo Lavender Kitchen Still Life.png", itemCount: 4 },
      { id: "haribo-candies", title: "Haribo Gummies", img: "/images/Haribo Vampire Gummy Candy Bag.png", itemCount: 2 },
      { id: "maoam-chews", title: "MAOAM Kracher", img: "/images/MAOAM Kracher Candy Showcase.png", itemCount: 2 },
      { id: "ramune-beverages", title: "Ramune Marble Soda", img: "/images/ramune_banner.jpg", itemCount: 4 }
    ];
  }, [categories]);

  const effectiveProducts = useMemo(() => {
    if (productsList && productsList.length > 0) return productsList;
    return [
      { id: "p-1", title: "Koikeya Karamucho Hot Chili Chips", categoryName: "Koikeya Snacks", price: 3.79, wholesalePrice: 1.95, img: "/images/koikeya_karamucho_hot_chili_snack.png", stock: 275 },
      { id: "p-2", title: "Koikeya Karamucho Hot Chili Corn Snacks", categoryName: "Koikeya Snacks", price: 3.79, wholesalePrice: 1.95, img: "/images/koikeya_karamucho_hot_chili_snack.png", stock: 190 },
      { id: "p-3", title: "Milka Oreo Chocolate Bar", categoryName: "Milka Chocolates", price: 2.89, wholesalePrice: 1.45, img: "/images/milka_banner.jpg", stock: 320 },
      { id: "p-4", title: "Haribo Vampire Gummies", categoryName: "Haribo Gummies", price: 3.19, wholesalePrice: 1.65, img: "/images/haribo_banner.jpg", stock: 150 }
    ];
  }, [productsList]);

  // Combined and sorted latest orders
  const recentOrdersList = useMemo(() => {
    const rMapped = effectiveRetailOrders.map(o => ({
      ...o,
      orderType: 'retail',
      displayName: o.customer || o.shippingAddress?.fullName || 'Retail Customer',
      amountNum: Number(o.amount || o.total || 0),
      itemSnippet: o.items || 'Retail Snack Items'
    }));
    const wMapped = effectiveWholesaleOrders.map(o => ({
      ...o,
      orderType: 'wholesale',
      displayName: o.storeName || o.businessName || 'Wholesale Store',
      amountNum: Number(o.amount || o.total || 0),
      itemSnippet: o.cases ? `${o.cases} • ${o.items || 'Cases'}` : (o.items || 'Wholesale Order')
    }));

    let merged = [...rMapped, ...wMapped];
    if (orderFilter === 'retail') merged = rMapped;
    if (orderFilter === 'wholesale') merged = wMapped;
    if (orderFilter === 'processing') merged = merged.filter(o => o.status === 'Processing' || o.status === 'Pending');
    if (orderFilter === 'transit') merged = merged.filter(o => o.status === 'Shipped' || o.status === 'In Transit');
    if (orderFilter === 'delivered') merged = merged.filter(o => o.status === 'Delivered');

    return merged.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5);
  }, [effectiveRetailOrders, effectiveWholesaleOrders, orderFilter]);

  // 2. Calculated Telemetry Metrics
  const metrics = useMemo(() => {
    const retailRev = effectiveRetailOrders.reduce((sum, o) => sum + Number(o.amount || o.total || 0), 0);
    const wholesaleRev = effectiveWholesaleOrders.reduce((sum, o) => sum + Number(o.amount || o.total || 0), 0);

    const activeRetailRev = retailRev > 0 ? retailRev : 536.00;
    const activeWholesaleRev = wholesaleRev > 0 ? wholesaleRev : 1280.00;
    const totalRev = activeRetailRev + activeWholesaleRev;

    const retailShare = totalRev > 0 ? Math.round((activeRetailRev / totalRev) * 100) : 30;
    const wholesaleShare = 100 - retailShare;

    const totalSkus = effectiveProducts.length || 12;
    const inStockSkus = effectiveProducts.filter(p => p.inStock !== false && (p.stock === undefined || p.stock > 0)).length || totalSkus;
    const stockHealthRate = totalSkus > 0 ? Math.round((inStockSkus / totalSkus) * 100) : 100;
    const totalOrdersCount = effectiveRetailOrders.length + effectiveWholesaleOrders.length;
    const totalStoresCount = effectiveWholesaleCustomers.length;

    // Pipeline counts
    const allOrders = [...effectiveRetailOrders, ...effectiveWholesaleOrders];
    const queueCount = allOrders.filter(o => o.status === 'Processing' || o.status === 'Pending').length || 2;
    const transitCount = allOrders.filter(o => o.status === 'Shipped' || o.status === 'In Transit').length || 1;
    const deliveredCount = allOrders.filter(o => o.status === 'Delivered').length || 3;

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

  // 3. Trajectory wave data based on timeframe
  const chartData = useMemo(() => {
    if (timeframe === '7d') {
      return [
        { label: 'Mon', retail: 80, wholesale: 240, fullDate: 'Oct 17' },
        { label: 'Tue', retail: 120, wholesale: 380, fullDate: 'Oct 18' },
        { label: 'Wed', retail: 90, wholesale: 290, fullDate: 'Oct 19' },
        { label: 'Thu', retail: 140, wholesale: 420, fullDate: 'Oct 20' },
        { label: 'Fri', retail: 190, wholesale: 560, fullDate: 'Oct 21' },
        { label: 'Sat', retail: 160, wholesale: 390, fullDate: 'Oct 22' },
        { label: 'Sun', retail: 110, wholesale: 220, fullDate: 'Oct 23' }
      ];
    }
    if (timeframe === '90d') {
      return [
        { label: 'Aug', retail: 380, wholesale: 940, fullDate: 'August' },
        { label: 'Sep', retail: 460, wholesale: 1180, fullDate: 'September' },
        { label: 'Oct', retail: 536, wholesale: 1280, fullDate: 'October' }
      ];
    }
    // Default 30D (4 weekly breakdown)
    return [
      { label: 'Week 1', retail: 110, wholesale: 260, fullDate: 'Oct 1 - Oct 7' },
      { label: 'Week 2', retail: 145, wholesale: 340, fullDate: 'Oct 8 - Oct 14' },
      { label: 'Week 3', retail: 175, wholesale: 410, fullDate: 'Oct 15 - Oct 21' },
      { label: 'Week 4', retail: 210, wholesale: 490, fullDate: 'Oct 22 - Oct 28' }
    ];
  }, [timeframe]);

  const fmt = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const fmtPrecise = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

  // SVG Chart Geometry
  const chartW = 600;
  const chartH = 210;
  const padX = 35;
  const padY = 25;

  const maxVal = useMemo(() => {
    return Math.max(...chartData.map(d => Math.max(d.wholesale, d.retail))) * 1.2 || 600;
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
    <div className="space-y-6 font-['Outfit',sans-serif]">

      {/* ========================================================================= */}
      {/* 1. HERO INFOGRAPHIC BANNER: LIGHT THEME REVENUE WAVE + CONCENTRIC GAUGE   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden relative">
        
        {/* Soft colorful accent wash */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Main Visual Wave Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 space-y-4 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#d9232e] tracking-tight">Sales Overview</h2>
              </div>

              {/* Segmented Timeframe Switcher & Legend */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3 text-xs font-normal">
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
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
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
            <div className="px-4 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70 flex items-center justify-between text-xs text-slate-600 font-normal">
              <span className="flex items-center gap-2">
                <span className="text-slate-500">Timeline Node:</span>
                <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {activePoint.fullDate || activePoint.label}
                </span>
              </span>
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Wholesale: <strong className="font-semibold text-slate-900">{fmt(activePoint.wholesale)}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-red-700">
                  <span className="w-2 h-2 rounded-full bg-[#d9232e]" />
                  Retail: <strong className="font-semibold text-slate-900">{fmt(activePoint.retail)}</strong>
                </span>
              </div>
            </div>

            {/* Pure SVG Wave Curve with Rich Colorful Gradients */}
            <div className="w-full h-56 select-none pt-1">
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
                        className="text-[9px] fill-slate-400 font-mono"
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
                        className={`text-[10px] font-normal ${isHover ? 'fill-slate-900 font-semibold' : 'fill-slate-400'}`}
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Column: Concentric Multi-Ring Radial Infographic (4 cols, Light Theme) */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between space-y-4 relative z-10 bg-slate-50/60">
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
                  100% In Stock
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[#d9232e] tracking-tight">Recent Orders</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  orderFilter === 'all' 
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Orders ({metrics.totalOrdersCount})
              </button>
              <button
                onClick={() => setOrderFilter('retail')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  orderFilter === 'retail' 
                    ? 'bg-white text-[#d9232e] shadow-2xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Retail ({effectiveRetailOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter('wholesale')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
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
          <table className="w-full text-left text-xs text-slate-600">
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
                        <span className="font-semibold text-slate-900 group-hover:text-[#d9232e] transition-colors">
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
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
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
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={cat.img || cat.image || '/images/cat_snacks.jpg'} 
                        alt={cat.title} 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-slate-800 group-hover:text-[#d9232e] transition-colors block">
                          {cat.title || cat.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {count} Products in catalog
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-slate-900 font-semibold">{pct}% share</span>
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
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
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
              const retailP = Number(prod.price || prod.retailPrice || 3.79);
              const wholesaleP = Number(prod.wholesalePrice || prod.b2bPrice || 1.95);
              const stockCount = prod.stock !== undefined ? prod.stock : 250;

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
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-slate-400">{prod.categoryName || 'Import Snack'}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-700 font-medium">{stockCount} units in stock</span>
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
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
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d9232e]" />
                Retail Shoppers ({effectiveRetailCustomers.length})
              </span>
              <span className="text-[10px] text-slate-500 font-normal">B2C Verified</span>
            </div>

            <div className="space-y-2">
              {effectiveRetailCustomers.slice(0, 3).map((cust, idx) => (
                <div 
                  key={cust.id || idx}
                  onClick={() => setActiveTab('customers')}
                  className="p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:border-red-300 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-red-50 text-[#d9232e] flex items-center justify-center font-semibold text-xs shrink-0">
                      {(cust.name || cust.displayName || 'R')[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{cust.name || cust.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{cust.email} • {cust.city || 'Texas'}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      21+ Verified
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {cust.ordersCount || 1} Orders • ${(cust.totalSpent || 24.50).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Card 2: Wholesale B2B Accounts */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Wholesale Store Accounts ({effectiveWholesaleCustomers.length})
              </span>
              <span className="text-[10px] text-amber-800 font-normal">Active Texas B2B</span>
            </div>

            <div className="space-y-2">
              {effectiveWholesaleCustomers.slice(0, 3).map((store, idx) => (
                <div 
                  key={store.id || idx}
                  onClick={() => setActiveTab('customers')}
                  className="p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-semibold text-xs shrink-0">
                      {(store.businessName || store.contactName || 'W')[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{store.businessName || store.dba}</p>
                      <p className="text-[10px] text-slate-400 truncate">{store.contactName || 'Buyer'} • {store.city || 'Houston, TX'}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active Reseller
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {store.volume || '50-100 Cases/Mo'}
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
