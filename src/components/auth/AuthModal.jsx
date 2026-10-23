import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  UploadCloud, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useAuth, DEMO_PERSONAS } from '../../context/AuthContext';
import { STORE_INFO } from '../../data/products';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalInitialTab, 
    registerRetail, 
    registerB2B, 
    loginUser, 
    switchDemoPersona,
    currentUser 
  } = useAuth();

  // Active view: 'chooser', 'retail', 'b2b', 'login', 'otp', 'retail-success', 'b2b-success'
  const [view, setView] = useState('chooser');
  
  // Retail form state
  const [retailForm, setRetailForm] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    isAgeVerified: true
  });
  const [otpCode, setOtpCode] = useState(['8', '4', '9', '2', '0', '1']);

  // B2B Multi-step wizard state
  const [b2bStep, setB2bStep] = useState(1);
  const [b2bForm, setB2bForm] = useState({
    businessName: '',
    dba: '',
    storeType: 'Convenience Store',
    address: '',
    city: 'Houston',
    state: 'TX',
    zip: '77081',
    contactName: '',
    email: '',
    phone: '',
    taxId: '',
    permitNumber: '',
    monthlyVolume: '50-100 Cases',
    documents: [
      { name: 'TX_Resale_Tax_Certificate_2026.pdf', size: '1.4 MB', type: 'application/pdf', uploadedAt: 'Just now' }
    ]
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setView(authModalInitialTab || 'chooser');
      setB2bStep(1);
      setErrorMessage('');
    }
  }, [isAuthModalOpen, authModalInitialTab]);

  if (!isAuthModalOpen) return null;

  // Handle Retail Form Submit -> Move to OTP
  const handleRetailSubmit = (e) => {
    e.preventDefault();
    if (!retailForm.emailOrPhone) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }
    setErrorMessage('');
    setView('otp');
  };

  // Handle OTP Verify
  const handleOtpVerify = () => {
    registerRetail({
      name: retailForm.name || 'Ruby Red Shopper',
      email: retailForm.emailOrPhone.includes('@') ? retailForm.emailOrPhone : `${retailForm.emailOrPhone}@phone.rubyred`,
      phone: !retailForm.emailOrPhone.includes('@') ? retailForm.emailOrPhone : '832-555-0199',
      isAgeVerified: retailForm.isAgeVerified
    });
    setView('retail-success');
    setTimeout(() => {
      closeAuthModal();
    }, 2000);
  };

  // Handle B2B Application Submit
  const handleB2bSubmit = (e) => {
    e.preventDefault();
    if (!b2bForm.businessName || !b2bForm.taxId || !b2bForm.contactName) {
      setErrorMessage('Please fill out all required fields');
      return;
    }
    registerB2B({
      ...b2bForm,
      address: `${b2bForm.address}, ${b2bForm.city}, ${b2bForm.state} ${b2bForm.zip}`
    });
    setView('b2b-success');
  };

  // Handle Standard Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.emailOrPhone) {
      setErrorMessage('Please enter email or phone');
      return;
    }
    loginUser(loginForm.emailOrPhone, loginForm.password);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">


        {/* Modal Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            {view !== 'chooser' && (
              <button
                onClick={() => setView('chooser')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Back to options"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <img 
              src="/images/logo.png" 
              alt="Ruby Red" 
              className="h-9 w-auto object-contain"
            />
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: CHOOSER (BRD Page 10 Screen Mockup) */}
        {/* ============================================================ */}
        {view === 'chooser' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-black tracking-widest text-[#d9232e] uppercase">
                Official Account Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome to Ruby Red
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Shop your store wholesale or discover exotic global snacks for yourself.
              </p>
            </div>

            {/* Account Type Option Cards */}
            <div className="space-y-3 pt-2">
              {/* Option A: B2B Wholesaler Account */}
              <button
                onClick={() => setView('b2b')}
                className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-slate-200 hover:border-[#d9232e] hover:bg-red-50/30 transition-all flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-[#d9232e] group-hover:text-white transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#d9232e] transition-colors">
                        Retail Store Account (B2B)
                      </h3>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Wholesale
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage your store, track pallet orders, and get direct case pricing
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#d9232e] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Option B: Retail Consumer Account */}
              <button
                onClick={() => setView('retail')}
                className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-slate-950 transition-colors">
                        Shop as an Individual (B2C)
                      </h3>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Retail
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Browse, order and enjoy your favorite exotic snacks, drinks & Ramune
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 text-center space-y-3">
              <button
                onClick={() => setView('login')}
                className="text-xs text-slate-600 hover:text-[#d9232e] font-bold transition-colors cursor-pointer"
              >
                Already have an account? <span className="underline font-black text-[#d9232e]">Log In</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: RETAIL (B2C) REGISTRATION */}
        {/* ============================================================ */}
        {view === 'retail' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <User className="w-3.5 h-3.5" />
                <span>Retail Shopper Onboarding</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Create Retail Account
              </h2>
              <p className="text-xs text-slate-500">
                Join to track exotic snack orders and save favorites.
              </p>
            </div>

            <form onSubmit={handleRetailSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Taylor"
                  value={retailForm.name}
                  onChange={e => setRetailForm({...retailForm, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address or Mobile Phone</label>
                <input
                  type="text"
                  required
                  placeholder="name@email.com or (832) 555-0100"
                  value={retailForm.emailOrPhone}
                  onChange={e => setRetailForm({...retailForm, emailOrPhone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create a secure password"
                  value={retailForm.password}
                  onChange={e => setRetailForm({...retailForm, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="ageCheck"
                  checked={retailForm.isAgeVerified}
                  onChange={e => setRetailForm({...retailForm, isAgeVerified: e.target.checked})}
                  className="mt-0.5 rounded text-[#d9232e] focus:ring-[#d9232e]"
                />
                <label htmlFor="ageCheck" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                  <span className="font-bold text-slate-800">Age Verification Gate (21+): </span>
                  I certify that I am at least 21 years old as required for age-restricted novelty & beverage categories.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: OTP VERIFICATION (Simulated Code) */}
        {/* ============================================================ */}
        {view === 'otp' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-[#d9232e] mx-auto flex items-center justify-center">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Verify Your Account
              </h2>
              <p className="text-xs text-slate-500">
                We sent a 6-digit confirmation code to{' '}
                <span className="font-bold text-slate-800">{retailForm.emailOrPhone || 'your contact'}</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otpCode];
                    newOtp[idx] = e.target.value;
                    setOtpCode(newOtp);
                  }}
                  className="w-11 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#d9232e] focus:bg-white focus:outline-none"
                />
              ))}
            </div>

            <div className="text-[11px] text-slate-500">
              Demo code automatically filled. Click button below to complete.
            </div>

            <button
              onClick={handleOtpVerify}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Activate Account</span>
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: RETAIL SUCCESS */}
        {/* ============================================================ */}
        {view === 'retail-success' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Account Ready!</h2>
            <p className="text-xs text-slate-600">
              Welcome to Ruby Red, <span className="font-bold text-slate-900">{retailForm.name || 'Shopper'}</span>! You can now browse exotic snacks and check out seamlessly.
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: B2B WHOLESALER ONBOARDING (Multi-Step Form) */}
        {/* ============================================================ */}
        {view === 'b2b' && (
          <div className="p-6 sm:p-8 space-y-5">
            {/* Header & Step Tracker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  <Building2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Wholesale Store Registration</span>
                </div>
                <span className="text-xs font-black text-slate-400">
                  Step {b2bStep} of 3
                </span>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#d9232e] h-full transition-all duration-300"
                  style={{ width: `${(b2bStep / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleB2bSubmit} className="space-y-4 text-xs">
              
              {/* STEP 1: Business Profile */}
              {b2bStep === 1 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900">Business Profile</h3>
                    <p className="text-[11px] text-slate-500">Provide legal entity details for wholesale verification.</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Legal Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metro Convenience Mart LLC"
                      value={b2bForm.businessName}
                      onChange={e => setB2bForm({...b2bForm, businessName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">DBA / Store Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Metro Food Store"
                        value={b2bForm.dba}
                        onChange={e => setB2bForm({...b2bForm, dba: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Store Classification *</label>
                      <select
                        value={b2bForm.storeType}
                        onChange={e => setB2bForm({...b2bForm, storeType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                      >
                        <option>Convenience Store</option>
                        <option>Travel Center / Truck Stop</option>
                        <option>Supermarket / Grocery</option>
                        <option>Specialty Asian Snack Shop</option>
                        <option>Gas Station Mart</option>
                        <option>Smoke / Vape / Novelty Shop</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Store Physical Address (Texas/US) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Street Address (e.g. 5420 Westheimer Rd)"
                      value={b2bForm.address}
                      onChange={e => setB2bForm({...b2bForm, address: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        value={b2bForm.city}
                        onChange={e => setB2bForm({...b2bForm, city: e.target.value})}
                        placeholder="City"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={b2bForm.state}
                        onChange={e => setB2bForm({...b2bForm, state: e.target.value})}
                        placeholder="State"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={b2bForm.zip}
                        onChange={e => setB2bForm({...b2bForm, zip: e.target.value})}
                        placeholder="ZIP"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!b2bForm.businessName) {
                        setErrorMessage('Please enter your business name');
                        return;
                      }
                      setErrorMessage('');
                      setB2bStep(2);
                    }}
                    className="w-full mt-2 py-2.5 px-4 bg-[#d9232e] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#b91c1c]"
                  >
                    <span>Next: Contact & Tax Info</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Contact & Tax Info */}
              {b2bStep === 2 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900">Contact & Resale Tax Details</h3>
                    <p className="text-[11px] text-slate-500">Required for sales tax exemption and account management.</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Authorized Contact / Buyer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Kim (Store Owner / Manager)"
                      value={b2bForm.contactName}
                      onChange={e => setB2bForm({...b2bForm, contactName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Business Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="orders@store.com"
                        value={b2bForm.email}
                        onChange={e => setB2bForm({...b2bForm, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Direct Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="832-555-0100"
                        value={b2bForm.phone}
                        onChange={e => setB2bForm({...b2bForm, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Texas Resale Tax ID # *</label>
                      <input
                        type="text"
                        required
                        placeholder="TX-1234567-8"
                        value={b2bForm.taxId}
                        onChange={e => setB2bForm({...b2bForm, taxId: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Tobacco/Vape Permit (if applicable)</label>
                      <input
                        type="text"
                        placeholder="TOB-TX-9921"
                        value={b2bForm.permitNumber}
                        onChange={e => setB2bForm({...b2bForm, permitNumber: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#d9232e]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setB2bStep(1)}
                      className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!b2bForm.contactName || !b2bForm.email || !b2bForm.phone || !b2bForm.taxId) {
                          setErrorMessage('Please fill out all contact and tax fields');
                          return;
                        }
                        setErrorMessage('');
                        setB2bStep(3);
                      }}
                      className="w-2/3 py-2.5 px-4 bg-[#d9232e] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#b91c1c]"
                    >
                      <span>Next: Compliance Documents</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Compliance Document Upload */}
              {b2bStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900">Upload Resale Certificate</h3>
                    <p className="text-[11px] text-slate-500">Upload your Texas Sales and Use Tax Resale Certificate or permit.</p>
                  </div>

                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#d9232e] bg-slate-50 rounded-2xl p-4 text-center space-y-2 cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-[#d9232e] mx-auto flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Drop certificate file here, or browse
                      </p>
                      <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  {/* Uploaded File Chip */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-900">{b2bForm.documents[0].name}</p>
                        <p className="text-[10px] text-slate-500">{b2bForm.documents[0].size} • Ready for verification</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Attached
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      What happens after submission?
                    </p>
                    <p className="text-slate-600">
                      Your application will be set to <strong className="text-amber-900">Pending Review</strong>. The Ruby Red warehouse team in Houston usually approves accounts within 2 hours, unlocking wholesale case pricing.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setB2bStep(2)}
                      className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Submit Wholesale Application</span>
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 6: B2B APPLICATION SUBMISSION SUCCESS */}
        {/* ============================================================ */}
        {view === 'b2b-success' && (
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Application Received • Status: Pending Review
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Application Under Review!
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for applying for a Ruby Red B2B account for <strong className="text-slate-900">{b2bForm.businessName}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Business Entity:</span>
                <span className="font-bold text-slate-900">{b2bForm.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Resale Tax ID:</span>
                <span className="font-mono font-bold text-slate-900">{b2bForm.taxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-amber-600">Pending Admin Approval</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappFormatted}?text=Hi%20Ruby%20Red!%20I%20just%20submitted%20a%20B2B%20Wholesale%20application%20for%20${encodeURIComponent(b2bForm.businessName)}.%20Please%20expedite%20my%20review.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Expedite via Houston B2B WhatsApp Desk</span>
              </a>

              <button
                onClick={closeAuthModal}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Continue Browsing Storefront (Pending Mode)
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 7: DIRECT LOGIN / SIGN IN */}
        {/* ============================================================ */}
        {view === 'login' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Log In to Ruby Red
              </h2>
              <p className="text-xs text-slate-500">
                Enter your credentials or choose a pre-configured demo account below.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email or Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="samir@harwingas.com or jessica@gmail.com"
                  value={loginForm.emailOrPhone}
                  onChange={e => setLoginForm({...loginForm, emailOrPhone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#d9232e]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#d9232e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#d9232e] hover:bg-[#b91c1c] text-white font-extrabold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
