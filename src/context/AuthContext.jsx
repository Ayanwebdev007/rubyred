import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  fetchAccount,
  registerAccount,
  registerWholesaleAccount,
  signIn,
  updateProfile
} from '../services/authService';

const AuthContext = createContext();
const SESSION_KEY = 'rubyred_user';

// Kept for older components that still import it.
export const DEMO_PERSONAS = [];

// Older builds kept every account (with plain-text passwords) in localStorage.
try {
  localStorage.removeItem('rubyred_registered_accounts');
  localStorage.removeItem('rubyred_b2b_applicants');
} catch {
  /* storage unavailable */
}

function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return saved && saved.id ? saved : null;
  } catch {
    return null;
  }
}

function writeSession(account) {
  try {
    if (account) localStorage.setItem(SESSION_KEY, JSON.stringify(account));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(readSession);

  const setCurrentUser = useCallback((valueOrUpdater) => {
    setCurrentUserState((prev) => {
      const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
      writeSession(next);
      return next;
    });
  }, []);

  /** Re-reads the account so status changes (e.g. wholesale approval) take effect. */
  const refreshAccount = useCallback(async () => {
    const session = readSession();
    if (!session) return null;
    try {
      const latest = await fetchAccount(session.id);
      if (!latest || latest.status === 'Rejected' || latest.status === 'Suspended') {
        setCurrentUser(null);
        return null;
      }
      setCurrentUser(latest);
      return latest;
    } catch (err) {
      // Offline / quota: keep the cached session.
      console.warn('[Auth] Could not refresh account:', err?.message || err);
      return session;
    }
  }, [setCurrentUser]);

  useEffect(() => {
    refreshAccount();
  }, [refreshAccount]);

  // Keep tabs in sync (sign in/out in one tab applies to the others)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) setCurrentUserState(readSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const registerRetail = async ({ name, email, phone, password, isAgeVerified }) => {
    const account = await registerAccount({
      role: 'retail',
      name,
      email,
      phone,
      password,
      isAgeVerified: Boolean(isAgeVerified)
    });
    setCurrentUser(account);
    return account;
  };

  /** Wholesale application → Pending account (signed in so they can track status). */
  const registerB2B = async (application, certificateFile = null) => {
    const account = await registerWholesaleAccount({ ...application, certificateFile });
    setCurrentUser(account);
    return account;
  };

  const loginUser = async (emailOrPhone, password, roleHint = 'retail') => {
    const account = await signIn(emailOrPhone, password, roleHint);
    setCurrentUser(account);
    return account;
  };

  const saveProfile = async (changes) => {
    if (!currentUser) return;
    await updateProfile(currentUser.id, changes);
    setCurrentUser((prev) => ({ ...prev, ...changes }));
  };

  const logout = async () => {
    setCurrentUser(null);
  };

  const isApprovedWholesale = currentUser?.role === 'b2b' && currentUser?.status === 'Approved';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isApprovedWholesale,
        registerRetail,
        registerB2B,
        loginUser,
        refreshAccount,
        saveProfile,
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
