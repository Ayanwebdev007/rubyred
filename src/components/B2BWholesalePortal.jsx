import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORE_INFO, INITIAL_PRODUCTS } from '../data/products';
import { Building2, ShieldCheck, DollarSign, Truck, FileCheck, Phone, CheckCircle2, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function B2BWholesalePortal({ onAddToCart }) {
  const navigate = useNavigate();
  const { currentUser, registerB2B } = useAuth();

  const [formData, setFormData] = useState({
    businessName: '',
    taxId: '',
    contactName: '',
    email: '',
    phone: '',
    storeType: 'Convenience Store',
    estimatedMonthlyCases: '50-100 Cases'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    registerB2B({
      businessName: formData.businessName,
      dba: formData.businessName,
      storeType: formData.storeType,
      address: 'Houston, TX',
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      taxId: formData.taxId,
      monthlyVolume: formData.estimatedMonthlyCases,
      documents: [
        { name: `Texas_Sales_Tax_Cert_${formData.taxId || 'Uploaded'}.pdf`, size: '1.4 MB', type: 'application/pdf', uploadedAt: 'Just now' }
      ]
    });
    setIsSubmitted(true);
  };

  return (
    <div className="py-8 space-y-10">
      {/* Hero Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            <Building2 className="w-4 h-4" /> B2B & Bulk Wholesale Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Direct Distributor Pricing for <span className="gradient-text-gold">Retailers & Store Owners</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ruby Red Sales & Services supplies convenience stores, Asian supermarkets, gas stations, and specialty snack shops across Houston & North America with bulk Ramune sodas and exotic imported snacks.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Houston Warehouse</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Pallet & Freight Shipping Available</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Up to 35% Wholesale Margin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Discount Matrix */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-amber-400" /> Wholesale Volume Tier Savings
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORE_INFO.b2bDiscountTiers.map((tier, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-2">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                Tier {idx+1} Volume
              </span>
              <div className="text-2xl font-black text-white">
                {tier.minCases}+ Cases
              </div>
              <div className="text-sm font-bold text-emerald-400">
                {tier.discount}
              </div>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                Applied automatically at checkout or via custom wholesale invoice.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Wholesale Registration / Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          {currentUser?.role === 'b2b' && currentUser?.status === 'Approved' ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                    Verified Wholesale Partner
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {currentUser.businessName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Resale Tax ID: <span className="font-mono text-slate-200">{currentUser.taxId}</span> • Net-30 Wholesale Terms Active
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Wholesale Tier</span>
                  <p className="font-black text-amber-400 text-sm">{currentUser.tier || 'Tier 2 (15% Off Cases)'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Available Credit Line</span>
                  <p className="font-black text-emerald-400 text-sm">${currentUser.creditLimit || '5,000.00'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Wholesale Quick Restock (Popular Cases)
                </h4>
                <div className="space-y-2">
                  {INITIAL_PRODUCTS.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded bg-slate-950 p-1" />
                        <div>
                          <p className="font-bold text-white text-xs truncate max-w-[180px]">{p.name}</p>
                          <p className="text-[10px] text-amber-400 font-semibold">${(p.b2bPrice * p.caseQty).toFixed(2)} / case of {p.caseQty}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onAddToCart && onAddToCart({ ...p, qty: p.caseQty, isCase: true, price: p.b2bPrice * p.caseQty })}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[10px] cursor-pointer"
                      >
                        + Add Case
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : currentUser?.role === 'b2b' && currentUser?.status === 'Pending' ? (
            <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-900/60 px-2.5 py-0.5 rounded-full">
                  Status: Pending Admin Review
                </span>
                <h4 className="text-lg font-bold text-white">Application Under Verification</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your B2B account for <strong className="text-white">{currentUser.businessName}</strong> (Tax ID: <span className="font-mono">{currentUser.taxId}</span>) is being verified against Texas Comptroller records.
                </p>
              </div>
              <a 
                href={`https://wa.me/${STORE_INFO.whatsappFormatted}?text=Hi%20Ruby%20Red!%20Checking%20on%20B2B%20verification%20for%20${encodeURIComponent(currentUser.businessName)}.`}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Message Houston B2B Desk to Fast-Track
              </a>
            </div>
          ) : isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Wholesale Application Received!</h4>
              <p className="text-xs text-slate-300">
                Our B2B team will review your Tax ID / Resale permit and contact you within 2 business hours.
              </p>
              <a 
                href={`https://wa.me/${STORE_INFO.whatsappFormatted}`}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                <Phone className="w-4 h-4" /> Message B2B Representative Now
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-400" /> Apply for B2B Wholesaler Account
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out this quick form or open our multi-step onboarding wizard.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
                >
                  Full Onboarding Page
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Business / Store Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Harwin Supermarket LLC"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Resale Tax ID / License # *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. TX-1948204-8"
                    value={formData.taxId}
                    onChange={e => setFormData({...formData, taxId: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Person Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Full name"
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Business Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="orders@store.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Business Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="832-XXX-XXXX"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Monthly Volume</label>
                  <select
                    value={formData.estimatedMonthlyCases}
                    onChange={e => setFormData({...formData, estimatedMonthlyCases: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option>10 - 50 Cases / month</option>
                    <option>50 - 100 Cases / month</option>
                    <option>100 - 500 Cases / month</option>
                    <option>500+ Cases (Full Pallet Distributor)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-950/40"
              >
                Submit B2B Wholesale Application
              </button>
            </form>
            </>
          )}
        </div>

        {/* Quick Contact & Direct Phone */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-white">Direct Wholesale Desk</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need immediate pallet quote or customized container delivery? Speak directly with our B2B sales operations manager at our Houston facility.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">B2B Phone Hotline</p>
                  <p className="text-base font-bold text-white">{STORE_INFO.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Houston Warehouse Address</p>
                  <p className="text-xs font-bold text-white">{STORE_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.whatsappFormatted}?text=Hi%20RUBY%20RED%20Wholesale%20Desk!%20I%20would%20like%20to%20request%20a%20B2B%20Case%20Price%20Quote.`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Phone className="w-4 h-4" /> Message B2B Desk on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
