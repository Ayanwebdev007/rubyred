import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';
import AdminPanel from './AdminPanel';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('rubyred_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage('');

    setTimeout(() => {
      const cleanUser = userId.trim().toLowerCase();
      const cleanPass = password.trim();

      const validUsernames = [
        'admin', 
        'salim', 
        'admin@rubyred.com', 
        'salim@rubyred.com', 
        'admin@rubyredhouston.com',
        'gs3websolutions@gmail.com'
      ];
      const validPasswords = ['rubyred@2026', 'admin123', 'admin', 'password'];

      if (validUsernames.includes(cleanUser) && validPasswords.includes(cleanPass)) {
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem('rubyred_admin_auth', 'true');
        } catch (err) {
          console.error(err);
        }
      } else {
        setErrorMessage('Invalid User ID or Password. Please try again.');
      }
      setIsLoggingIn(false);
    }, 250);
  };

  const handleSignOut = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('rubyred_admin_auth');
    } catch (err) {
      console.error(err);
    }
    setUserId('');
    setPassword('');
    setErrorMessage('');
  };

  // If already authenticated as admin, display Admin Panel
  if (isAdminAuthenticated) {
    return <AdminPanel onSignOut={handleSignOut} />;
  }

  // Full-Page Edge-to-Edge Split Console: 50% Left Form, 50% Right Warehouse Image
  return (
    <div className="min-h-screen w-full bg-white text-slate-900 grid grid-cols-1 lg:grid-cols-2 selection:bg-[#d9232e] selection:text-white">
      
      {/* Left Column: Full-Height Form & Brand (50% Split) */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 min-h-screen bg-white">
        
        {/* Top Header: Logo & Storefront Return */}
        <div className="flex items-center justify-between pb-4">
          <div 
            className="cursor-pointer inline-block transition-transform hover:scale-102"
            onClick={() => navigate('/')}
            title="Return to Ruby Red Storefront"
          >
            <img 
              src="/images/logo.png" 
              alt="Ruby Red" 
              className="h-16 sm:h-20 w-auto object-contain object-left -ml-1.5 sm:-ml-2"
            />
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>

        {/* Center: Admin Sign In Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Sign In
            </h2>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                User ID or Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="admin@rubyred.com"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-3 focus:ring-red-100 transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-700 font-bold">
                  Password
                </label>
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
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#d9232e] focus:ring-3 focus:ring-red-100 transition-all text-xs"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 bg-[#d9232e] hover:bg-[#b91c1c] active:scale-[0.99] disabled:opacity-75 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoggingIn ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Access Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Sub-Footer in Left Column */}
        <div className="pt-4 text-xs text-slate-400">
          © 2026 Ruby Red Sales & Services LLC
        </div>
      </div>

      {/* Right Column: Full-Height Edge-to-Edge Image (50% Split) */}
      <div className="hidden lg:block relative w-full h-full min-h-screen bg-slate-900 overflow-hidden">
        <img 
          src="/images/vibrant_snack_warehouse_aisle.png" 
          alt="Ruby Red Snack Warehouse Aisle" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Soft, Subtle Gradient Layer from Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
