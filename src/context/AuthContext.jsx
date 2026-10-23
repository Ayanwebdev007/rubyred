import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  registerRetailUser, 
  loginUserWithFirebase, 
  submitB2BWholesaleApplication, 
  subscribeToB2BApplications, 
  updateB2BApplicationStatus, 
  logOutFirebase 
} from '../services/firebaseService';
import { isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext();

const INITIAL_APPLICANTS = [];

// Preset Demo Personas purged - real accounts only
export const DEMO_PERSONAS = [];

// Helper to filter out legacy dummy accounts
const isDummyAccount = (u) => {
  if (!u) return false;
  const dummyIds = ['usr-b2c-01', 'b2b-app-1', 'b2b-app-2', 'admin-01'];
  const dummyEmails = ['jessica.taylor@gmail.com', 'david@houstonmunchies.com', 'samir@harwingas.com', 'salim@rubyredhouston.com'];
  return dummyIds.includes(u.id) || dummyIds.includes(u.uid) || dummyEmails.includes(u.email?.toLowerCase());
};

export function AuthProvider({ children }) {
  // Purge any legacy dummy data from localStorage once
  useEffect(() => {
    try {
      const regAccounts = JSON.parse(localStorage.getItem('rubyred_registered_accounts') || '[]');
      const filteredReg = regAccounts.filter(u => !isDummyAccount(u));
      localStorage.setItem('rubyred_registered_accounts', JSON.stringify(filteredReg));

      const b2bApps = JSON.parse(localStorage.getItem('rubyred_b2b_applicants') || '[]');
      const filteredB2b = b2bApps.filter(u => !isDummyAccount(u));
      localStorage.setItem('rubyred_b2b_applicants', JSON.stringify(filteredB2b));
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
  }, []);

  // Current logged in user (defaults to Guest)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rubyred_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (isDummyAccount(parsed)) {
        localStorage.removeItem('rubyred_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Wholesaler applicants for admin approval workflow
  const [b2bApplicants, setB2bApplicants] = useState(() => {
    try {
      const saved = localStorage.getItem('rubyred_b2b_applicants');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(u => !isDummyAccount(u)) : [];
    } catch {
      return [];
    }
  });

  // Modal control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('chooser'); // 'chooser', 'retail', 'b2b', 'login'

  // Real-time Firestore subscription for B2B wholesale applications
  useEffect(() => {
    const unsubscribe = subscribeToB2BApplications((liveApplicants) => {
      if (liveApplicants && liveApplicants.length > 0) {
        setB2bApplicants(prev => {
          const map = new Map();
          // Keep existing/initial items
          prev.forEach(item => map.set(item.id, item));
          // Overlay live Firestore items
          liveApplicants.forEach(item => map.set(item.id, { ...map.get(item.id), ...item }));
          return Array.from(map.values());
        });
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('rubyred_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('rubyred_user');
      }
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('rubyred_b2b_applicants', JSON.stringify(b2bApplicants));
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [b2bApplicants]);

  const openAuthModal = (tab = 'chooser') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Switch quick demo persona
  const switchDemoPersona = (personaId) => {
    const found = DEMO_PERSONAS.find(p => p.id === personaId);
    if (found) {
      setCurrentUser(found.user);
    }
  };

  // Retail Registration with Real Persistence & Validation
  const registerRetail = async ({ name, email, phone, password, isAgeVerified }) => {
    if (!email) throw new Error('Email address is required');
    if (!password) throw new Error('Password is required');
    
    const user = await registerRetailUser(email, password, name, phone);

    const newUser = {
      id: user.uid || user.id,
      uid: user.uid || user.id,
      role: 'retail',
      name: name || user.displayName || user.name || 'Ruby Red Shopper',
      email: email.toLowerCase().trim(),
      phone: phone || '',
      isAgeVerified: Boolean(isAgeVerified),
      address: { street: '', city: 'Houston', state: 'TX', zip: '' },
      createdAt: user.createdAt || new Date().toISOString()
    };
    setCurrentUser(newUser);
    return newUser;
  };

  // B2B Wholesale Application Registration with Real Persistence & Validation
  const registerB2B = async (applicationData, file = null) => {
    if (!applicationData.businessName) throw new Error('Business Name is required');
    if (!applicationData.email) throw new Error('Business Email is required');
    if (!applicationData.password) throw new Error('Password is required for wholesale account');
    if (!applicationData.taxId) throw new Error('Texas Resale Tax ID is required');

    const savedApp = await submitB2BWholesaleApplication(applicationData, file);

    // Add to applicants list
    setB2bApplicants(prev => [savedApp, ...prev.filter(a => a.id !== savedApp.id)]);

    // Set logged-in state to registered B2B user
    const newUser = {
      id: savedApp.id,
      uid: savedApp.uid || savedApp.id,
      role: 'b2b',
      status: savedApp.status || 'Active',
      name: savedApp.contactName || savedApp.businessName,
      businessName: savedApp.businessName,
      storeType: savedApp.storeType,
      email: savedApp.email,
      phone: savedApp.phone,
      taxId: savedApp.taxId,
      monthlyVolume: savedApp.monthlyVolume,
      documentsCount: savedApp.documents ? savedApp.documents.length : 0
    };

    setCurrentUser(newUser);
    return savedApp;
  };

  // Login with Real Credential Verification
  const loginUser = async (emailOrPhone, password, roleHint = 'retail') => {
    if (!emailOrPhone || !emailOrPhone.trim()) {
      throw new Error('Please enter your email or phone number');
    }
    if (!password) {
      throw new Error('Please enter your password');
    }

    const cleanInput = emailOrPhone.toLowerCase().trim();

    // Authenticate with Firebase & persistent accounts store
    const user = await loginUserWithFirebase(cleanInput, password, roleHint);
    
    const authenticatedUser = {
      id: user.uid || user.id,
      uid: user.uid || user.id,
      role: user.role || roleHint,
      status: user.status || 'Active',
      name: user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Member'),
      businessName: user.businessName || '',
      email: user.email || cleanInput,
      phone: user.phone || '',
      taxId: user.taxId || '',
      isAgeVerified: user.isAgeVerified !== false,
      address: user.address || { street: '', city: 'Houston', state: 'TX', zip: '' }
    };

    setCurrentUser(authenticatedUser);
    return authenticatedUser;
  };

  // Admin approves B2B application
  const approveB2BApplicant = async (applicantId) => {
    setB2bApplicants(prev =>
      prev.map(a => a.id === applicantId ? { ...a, status: 'Approved' } : a)
    );

    // If currently logged-in user is this applicant, instantly elevate to Approved!
    setCurrentUser(prev => {
      if (prev && prev.id === applicantId) {
        return {
          ...prev,
          status: 'Approved',
          creditLimit: 5000,
          tier: 'Tier 1 (10% Off Case Packs)'
        };
      }
      return prev;
    });

    try {
      await updateB2BApplicationStatus(applicantId, 'Approved');
    } catch (e) {
      console.warn('Firestore update error:', e);
    }
  };

  // Admin rejects B2B application
  const rejectB2BApplicant = async (applicantId) => {
    setB2bApplicants(prev =>
      prev.map(a => a.id === applicantId ? { ...a, status: 'Rejected' } : a)
    );

    setCurrentUser(prev => {
      if (prev && prev.id === applicantId) {
        return { ...prev, status: 'Rejected' };
      }
      return prev;
    });

    try {
      await updateB2BApplicationStatus(applicantId, 'Rejected');
    } catch (e) {
      console.warn('Firestore update error:', e);
    }
  };

  const logout = async () => {
    try {
      await logOutFirebase();
    } catch (e) {
      console.warn('Firebase logout note:', e);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        b2bApplicants,
        isAuthModalOpen,
        authModalInitialTab,
        openAuthModal,
        closeAuthModal,
        switchDemoPersona,
        registerRetail,
        registerB2B,
        loginUser,
        approveB2BApplicant,
        rejectB2BApplicant,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
