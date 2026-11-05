import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  User, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  UploadCloud, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  AlertCircle,
  Lock,
  Mail,
  Package,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STORE_INFO } from '../data/products';
import { MIN_PASSWORD_LENGTH, validateCertificateFile } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentUser, 
    registerRetail, 
    registerB2B, 
    loginUser, 
    refreshAccount,
    logout 
  } = useAuth();

  // Active customer flow tab: 'retail' | 'b2b'
  const [accountType, setAccountType] = useState('retail');
  
  // Sub-mode for retail: 'signin' | 'register'
  const [retailMode, setRetailMode] = useState('signin');
  
  // Sub-mode for b2b: 'signin' | 'apply'
  const [b2bMode, setB2bMode] = useState('signin');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Retail Form State
  const [retailForm, setRetailForm] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    isAgeVerified: true
  });

  // B2B Form State (Cleaned, streamlined, includes password for instant login)
  const [b2bForm, setB2bForm] = useState({
    businessName: '',
    dba: '',
    storeType: 'Convenience Store',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    taxId: '',
    monthlyVolume: ''
  });

  const [selectedB2bFile, setSelectedB2bFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const b2bFileInputRef = useRef(null);

  // Login credentials state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Arriving from the Wholesale page's quick form: open the application pre-filled
  useEffect(() => {
    const prefill = location.state?.b2bApplication;
    if (prefill) {
      setAccountType('b2b');
      setB2bMode('apply');
      setB2bForm(prev => ({ ...prev, ...prefill }));
    }
  }, [location.state]);

  // Pick up admin approval while the account page is open
  useEffect(() => {
    if (currentUser?.role === 'b2b') refreshAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forgotPasswordHref = `https://wa.me/${STORE_INFO.whatsappFormatted}?text=${encodeURIComponent(
    `Hi Ruby Red! I forgot the password for my account (${loginEmail.trim() || 'email / phone'}). Please help me reset it.`
  )}`;

  // Handle Retail Sign In
  const handleRetailSignIn = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter both your email/phone and password');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await loginUser(loginEmail, loginPassword, 'retail');
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Retail Registration
  const handleRetailRegister = async (e) => {
    e.preventDefault();
    if (!retailForm.name.trim() || !retailForm.emailOrPhone.trim() || !retailForm.password) {
      setErrorMessage('Please fill in all fields to create an account');
      return;
    }
    if (retailForm.password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const identifier = retailForm.emailOrPhone.trim();
      const isEmail = identifier.includes('@');
      await registerRetail({
        name: retailForm.name,
        email: isEmail ? identifier : '',
        phone: isEmail ? '' : identifier,
        password: retailForm.password,
        isAgeVerified: retailForm.isAgeVerified
      });
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle B2B Application Submit (Simple single-view form with password)
  const handleB2bSubmit = async (e) => {
    e.preventDefault();
    if (!b2bForm.businessName.trim() || !b2bForm.taxId.trim() || !b2bForm.contactName.trim() || !b2bForm.email.trim() || !b2bForm.password) {
      setErrorMessage('Please complete all required fields including password');
      return;
    }
    if (b2bForm.password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await registerB2B(b2bForm, selectedB2bFile);
      setB2bMode('signin');
    } catch (err) {
      setErrorMessage(err.message || 'Application submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle B2B Wholesaler Sign In
  const handleB2bSignIn = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter both your business email and password');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await loginUser(loginEmail, loginPassword, 'b2b');
      navigate('/wholesale');
    } catch (err) {
      setErrorMessage(err.message || 'Sign in failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden relative selection:bg-[#d9232e] selection:text-white">
      
      {/* ============================================================ */}
      {/* SLIDING DUAL-PANEL WRAPPER                                    */}
      {/* Desktop: When Wholesale is selected, Form slides to the right */}
      {/* and Image slides to the left with a smooth swipe transition.  */}
      {/* ============================================================ */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row relative">

        {/* ------------------------------------------------------------ */}
        {/* FORM PANEL (50% on lg, swipes left-to-right on Wholesale)    */}
        {/* ------------------------------------------------------------ */}
        <div 
          className={`w-full lg:w-1/2 min-h-screen max-h-screen overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white z-20 transition-transform duration-700 ease-in-out ${
            accountType === 'b2b' ? 'lg:translate-x-full' : 'lg:translate-x-0'
          }`}
        >
          {/* Top Header: Minimal Logo & Return */}
          <div className="flex items-center justify-between pb-3">
            <div 
              className="cursor-pointer transition-transform hover:scale-102"
              onClick={() => navigate('/')}
              title="Return to Store"
            >
              <img 
                src="/images/logo.png" 
                alt="Ruby Red" 
                className="h-12 sm:h-14 w-auto object-contain object-left -ml-1"
              />
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
          </div>

          {/* Center Form Container */}
          <div className="w-full max-w-md mx-auto my-auto py-4 space-y-5">

            {/* Authenticated State */}
            {currentUser ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back, {currentUser.name?.split(' ')[0] || 'User'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">Manage orders and store account</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d9232e] text-white flex items-center justify-center text-sm font-black">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-xs">{currentUser.name}</h2>
                      <p className="text-[11px] text-slate-500">{currentUser.email || currentUser.phone}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentUser.role === 'b2b' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {currentUser.role === 'b2b' ? 'Wholesale' : 'Retail'}
                  </span>
                </div>

                {currentUser.role === 'b2b' && currentUser.status !== 'Approved' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 shrink-0" /> Wholesale application under review
                    </p>
                    <p>
                      Thanks{currentUser.businessName ? `, ${currentUser.businessName}` : ''}! Our team is verifying your resale
                      certificate{currentUser.taxId ? ` (${currentUser.taxId})` : ''}. Wholesale case pricing unlocks as soon as
                      your account is approved. You can shop at retail prices meanwhile.
                    </p>
                    {currentUser.documentsUploadFailed && (
                      <p className="font-semibold text-red-700">
                        Your certificate file did not upload. Please send it to us on WhatsApp.
                      </p>
                    )}
                    <a
                      href={`https://wa.me/${STORE_INFO.whatsappFormatted}?text=${encodeURIComponent(`Hi Ruby Red! Checking on the wholesale application for ${currentUser.businessName || currentUser.email}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" /> Ask about my application
                    </a>
                  </div>
                )}

                {currentUser.role === 'b2b' && currentUser.status === 'Approved' && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> Approved wholesale account. Case pricing is active in your cart.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <button
                    onClick={() => navigate('/orders')}
                    className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-slate-800 text-left transition-all hover:border-[#d9232e] cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-[#d9232e] mb-1" />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-slate-800 text-left transition-all hover:border-[#d9232e] cursor-pointer"
                  >
                    {currentUser.role === 'b2b' ? (
                      <>
                        <Building2 className="w-4 h-4 text-amber-600 mb-1" />
                        <span>B2B Portal</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 text-emerald-600 mb-1" />
                        <span>Browse Store</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => logout()}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#d9232e] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              /* Non-authenticated flows */
              <div className="space-y-5 animate-in fade-in duration-300">
                
                {/* Minimal Segmented Switcher: Retail vs Wholesale */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('retail');
                      setErrorMessage('');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountType === 'retail'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Retail
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('b2b');
                      setErrorMessage('');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountType === 'b2b'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Wholesale (B2B)
                  </button>
                </div>

                {/* Heading & Subtitle (Clean & Minimal) */}
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {accountType === 'retail' 
                      ? (retailMode === 'signin' ? 'Sign In' : 'Create Account')
                      : (b2bMode === 'signin' ? 'Wholesale Sign In' : 'Wholesale Application')
                    }
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {accountType === 'retail'
                      ? (retailMode === 'signin' ? 'Sign in to your retail account' : 'Register for fast ordering and tracking')
                      : (b2bMode === 'signin' ? 'Access wholesale distributor pricing' : 'Simple application for store owners')
                    }
                  </p>
                </div>

                {/* Submode Switcher Tabs */}
                {accountType === 'retail' && (
                  <div className="flex items-center gap-5 border-b border-slate-100 pb-2">
                    <button
                      type="button"
                      onClick={() => { setRetailMode('signin'); setErrorMessage(''); }}
                      className={`text-xs font-bold pb-1.5 relative transition-all cursor-pointer ${
                        retailMode === 'signin' ? 'text-[#d9232e]' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Sign In
                      {retailMode === 'signin' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9232e] rounded-full" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRetailMode('register'); setErrorMessage(''); }}
                      className={`text-xs font-bold pb-1.5 relative transition-all cursor-pointer ${
                        retailMode === 'register' ? 'text-[#d9232e]' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Create Account
                      {retailMode === 'register' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9232e] rounded-full" />
                      )}
                    </button>
                  </div>
                )}

                {accountType === 'b2b' && (
                  <div className="flex items-center gap-5 border-b border-slate-100 pb-2">
                    <button
                      type="button"
                      onClick={() => { setB2bMode('signin'); setErrorMessage(''); }}
                      className={`text-xs font-bold pb-1.5 relative transition-all cursor-pointer ${
                        b2bMode === 'signin' ? 'text-[#d9232e]' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Sign In
                      {b2bMode === 'signin' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9232e] rounded-full" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setB2bMode('apply'); setErrorMessage(''); }}
                      className={`text-xs font-bold pb-1.5 relative transition-all cursor-pointer ${
                        b2bMode === 'apply' ? 'text-[#d9232e]' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Apply for Account
                      {b2bMode === 'apply' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9232e] rounded-full" />
                      )}
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#d9232e]" />
                    <span className="font-semibold">{errorMessage}</span>
                  </div>
                )}

                {/* ======================================================== */}
                {/* RETAIL: SIGN IN FORM                                     */}
                {/* ======================================================== */}
                {accountType === 'retail' && retailMode === 'signin' && (
                  <form onSubmit={handleRetailSignIn} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Email or Phone</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="name@example.com or mobile phone"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 font-bold">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div className="text-right -mt-1">
                      <a
                        href={forgotPasswordHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-slate-500 hover:text-[#d9232e] transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-500/15 flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-wait"
                    >
                      {isSubmitting ? <span>Signing In...</span> : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ======================================================== */}
                {/* RETAIL: CREATE ACCOUNT FORM (Simple, Minimal)            */}
                {/* ======================================================== */}
                {accountType === 'retail' && retailMode === 'register' && (
                  <form onSubmit={handleRetailRegister} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={retailForm.name}
                        onChange={(e) => setRetailForm({...retailForm, name: e.target.value})}
                        className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Email or Mobile Phone</label>
                      <input
                        type="text"
                        required
                        placeholder="email@example.com or (832) 555-0100"
                        value={retailForm.emailOrPhone}
                        onChange={(e) => setRetailForm({...retailForm, emailOrPhone: e.target.value})}
                        className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 font-bold">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={`Create a password (min ${MIN_PASSWORD_LENGTH} characters)`}
                        autoComplete="new-password"
                        value={retailForm.password}
                        onChange={(e) => setRetailForm({...retailForm, password: e.target.value})}
                        className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="retailAgeCheck"
                        checked={retailForm.isAgeVerified}
                        onChange={(e) => setRetailForm({...retailForm, isAgeVerified: e.target.checked})}
                        className="rounded text-[#d9232e] focus:ring-[#d9232e] cursor-pointer"
                      />
                      <label htmlFor="retailAgeCheck" className="text-[11px] text-slate-600 cursor-pointer">
                        I am 21 years of age or older
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-500/15 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-wait"
                    >
                      <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                      {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                )}

                {/* ======================================================== */}
                {/* WHOLESALE: SIGN IN FORM                                  */}
                {/* ======================================================== */}
                {accountType === 'b2b' && b2bMode === 'signin' && (
                  <form onSubmit={handleB2bSignIn} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Business Email</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="orders@store.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 font-bold">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div className="text-right -mt-1">
                      <a
                        href={forgotPasswordHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-slate-500 hover:text-[#d9232e] transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-500/15 flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-wait"
                    >
                      {isSubmitting ? <span>Signing In...</span> : (
                        <>
                          <span>Sign In to Wholesale</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ======================================================== */}
                {/* WHOLESALE: APPLICATION FORM (Simple, Single-View UI)     */}
                {/* ======================================================== */}
                {accountType === 'b2b' && b2bMode === 'apply' && (
                  <form onSubmit={handleB2bSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Business Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Metro Mart LLC"
                        value={b2bForm.businessName}
                        onChange={e => setB2bForm({...b2bForm, businessName: e.target.value})}
                        className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Contact Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contact Full Name"
                          value={b2bForm.contactName}
                          onChange={e => setB2bForm({...b2bForm, contactName: e.target.value})}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Resale Tax ID *</label>
                        <input
                          type="text"
                          required
                          placeholder="Tax ID / Permit #"
                          value={b2bForm.taxId}
                          onChange={e => setB2bForm({...b2bForm, taxId: e.target.value})}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Business Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="orders@store.com"
                          value={b2bForm.email}
                          onChange={e => setB2bForm({...b2bForm, email: e.target.value})}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="832-555-0100"
                          value={b2bForm.phone}
                          onChange={e => setB2bForm({...b2bForm, phone: e.target.value})}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 font-bold">Create Account Password *</label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder={`Create password (min ${MIN_PASSWORD_LENGTH} characters)`}
                          autoComplete="new-password"
                          value={b2bForm.password}
                          onChange={e => setB2bForm({...b2bForm, password: e.target.value})}
                          className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-red-100 transition-all text-xs"
                        />
                      </div>
                    </div>

                    {/* Minimal Resale Certificate Upload */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Resale Certificate (PDF / Image)</label>
                      <input
                        type="file"
                        ref={b2bFileInputRef}
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            validateCertificateFile(file);
                            setSelectedB2bFile(file);
                            setErrorMessage('');
                          } catch (err) {
                            setSelectedB2bFile(null);
                            setErrorMessage(err.message);
                          }
                          e.target.value = '';
                        }}
                      />
                      <div 
                        onClick={() => b2bFileInputRef.current?.click()}
                        className="border border-dashed border-slate-300 hover:border-[#d9232e] bg-slate-50/70 rounded-xl p-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4 text-[#d9232e]" />
                        <span className="text-[11px] font-bold text-slate-700">
                          {selectedB2bFile ? `${selectedB2bFile.name} (${Math.ceil(selectedB2bFile.size / 1024)} KB)` : 'Upload Resale Certificate (PDF or photo, max 700 KB)'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-500/15 flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                    </button>
                  </form>
                )}


              </div>
            )}

          </div>

          {/* Minimal Sub-Footer */}
          <div className="pt-3 text-[11px] text-slate-400">
            © 2026 Ruby Red Sales & Services LLC
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* IMAGE PANEL (Swipes right-to-left when Wholesale is active)  */}
        {/* ------------------------------------------------------------ */}
        <div 
          className={`hidden lg:block absolute top-0 bottom-0 right-0 w-1/2 h-full bg-slate-900 overflow-hidden z-10 transition-transform duration-700 ease-in-out ${
            accountType === 'b2b' ? 'lg:-translate-x-full' : 'lg:translate-x-0'
          }`}
        >
          <img 
            src="/images/ruby_red_warehouse.jpg" 
            alt="Ruby Red Snack Warehouse" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />
          
          {/* Clean, Minimal Caption */}
          <div className="absolute bottom-8 left-8 right-8 text-white z-10 pointer-events-none">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-red-400 bg-red-950/70 px-2 py-0.5 rounded-full border border-red-500/20">
              {accountType === 'b2b' ? 'B2B Wholesale' : 'Retail & Consumer'}
            </span>
            <h3 className="text-xl xl:text-2xl font-black tracking-tight text-white mt-1.5 drop-shadow-sm">
              {accountType === 'b2b' ? 'Direct Wholesale Distributor' : 'Exotic Snack Warehouse'}
            </h3>
          </div>
        </div>

      </div>

    </div>
  );
}
