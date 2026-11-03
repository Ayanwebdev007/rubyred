/**
 * Customer accounts (retail + wholesale) stored in the Firestore `users` collection.
 *
 * Passwords are never stored: each account keeps a salted PBKDF2-SHA256 hash
 * (Web Crypto). Accounts created by older builds that still hold a plain-text
 * `password` field are upgraded to a hash the first time they sign in.
 *
 * Document id = lower-cased email, or `<10 digits>@phone.rubyred` for accounts
 * registered with a phone number only.
 */
import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS = 'users';
const B2B_DOCUMENTS = 'b2bDocuments';
const PBKDF2_ITERATIONS = 150000;
export const MIN_PASSWORD_LENGTH = 8;
// Firestore documents are capped at 1 MiB; base64 adds ~33%.
export const MAX_CERTIFICATE_BYTES = 700 * 1024;

export class AuthError extends Error {}

const SENSITIVE_FIELDS = ['password', 'passwordHash', 'passwordSalt', 'passwordIterations', 'serverTime'];

export const normalizeEmail = (value) => (value || '').trim().toLowerCase();

/** US phone numbers → 10 digits (drops a leading country code 1). */
export function phoneDigits(value) {
  let digits = (value || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  return digits;
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const phoneAccountId = (digits) => `${digits}@phone.rubyred`;

/** Firestore rejects `undefined`; drop those keys (shallow). */
function clean(record) {
  return Object.fromEntries(Object.entries(record).filter(([, v]) => v !== undefined));
}

export function friendlyError(err) {
  if (err instanceof AuthError) return err;
  const code = err?.code || '';
  console.error('[Accounts]', err);
  if (code === 'resource-exhausted') {
    return new AuthError('Our servers have reached their limit for today. Please try again later or message us on WhatsApp.');
  }
  if (code === 'unavailable' || code === 'deadline-exceeded') {
    return new AuthError('Cannot reach the server. Please check your internet connection and try again.');
  }
  if (code === 'permission-denied') {
    return new AuthError('The server refused this request. Please contact Ruby Red support.');
  }
  return new AuthError('Something went wrong. Please try again.');
}

// ---------------------------------------------------------------------------
// Password hashing
// ---------------------------------------------------------------------------
const toBase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));
const fromBase64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

export async function hashPassword(password, saltBase64 = null, iterations = PBKDF2_ITERATIONS) {
  if (!globalThis.crypto?.subtle) {
    throw new AuthError('This browser cannot sign in securely. Please use an up-to-date browser over HTTPS.');
  }
  const salt = saltBase64 ? fromBase64(saltBase64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return { passwordHash: toBase64(bits), passwordSalt: toBase64(salt), passwordIterations: iterations };
}

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyPassword(account, password) {
  if (account.passwordHash && account.passwordSalt) {
    const { passwordHash } = await hashPassword(password, account.passwordSalt, account.passwordIterations || PBKDF2_ITERATIONS);
    return { ok: constantTimeEqual(passwordHash, account.passwordHash), legacy: false };
  }
  if (typeof account.password === 'string') {
    return { ok: constantTimeEqual(account.password, password), legacy: true };
  }
  return { ok: false, legacy: false };
}

export function validatePassword(password) {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }
}

/** Account data that is safe to keep in the browser / show in the UI. */
export function toPublicAccount(id, data = {}) {
  const publicData = { ...data };
  SENSITIVE_FIELDS.forEach((key) => delete publicData[key]);
  const name = data.name || data.displayName || data.contactName || (data.email ? data.email.split('@')[0] : 'Member');
  return {
    ...publicData,
    id,
    uid: id,
    name,
    // Older builds stored phone-only accounts with a placeholder "<digits>@phone.rubyred" email
    email: [data.email, id].find((e) => e && !e.endsWith('@phone.rubyred')) || '',
    phone: data.phone || '',
    role: data.role || 'retail',
    status: data.status || (data.role === 'b2b' ? 'Pending' : 'Active')
  };
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
/**
 * Creates a retail or wholesale account. Wholesale accounts start as "Pending"
 * until an admin approves them.
 */
export async function registerAccount({ role = 'retail', name, email, phone, password, ...profile }) {
  const cleanEmail = normalizeEmail(email);
  const digits = phoneDigits(phone);
  const displayName = (name || '').trim();

  if (!displayName) throw new AuthError('Please enter your name.');
  if (!cleanEmail && !digits) throw new AuthError('Please enter an email address or mobile number.');
  if (cleanEmail && !isValidEmail(cleanEmail)) throw new AuthError('Please enter a valid email address.');
  if (role === 'b2b' && !cleanEmail) throw new AuthError('A business email address is required.');
  if (digits && digits.length !== 10) throw new AuthError('Please enter a valid 10-digit US phone number.');
  validatePassword(password);

  const id = cleanEmail || phoneAccountId(digits);
  const now = new Date().toISOString();
  const record = clean({
    ...profile,
    role,
    name: displayName,
    displayName,
    email: cleanEmail,
    phone: (phone || '').trim(),
    phoneDigits: digits,
    status: role === 'b2b' ? 'Pending' : 'Active',
    createdAt: now,
    joinedDate: now.slice(0, 10),
    ...(await hashPassword(password)),
    serverTime: serverTimestamp()
  });

  try {
    if (digits) {
      const samePhone = await getDocs(query(collection(db, USERS), where('phoneDigits', '==', digits), limit(1)));
      if (!samePhone.empty && samePhone.docs[0].id !== id) {
        throw new AuthError('An account with this phone number already exists. Please sign in instead.');
      }
    }
    await runTransaction(db, async (tx) => {
      const ref = doc(db, USERS, id);
      const existing = await tx.get(ref);
      if (existing.exists()) {
        throw new AuthError(
          cleanEmail
            ? 'An account with this email already exists. Please sign in instead.'
            : 'An account with this phone number already exists. Please sign in instead.'
        );
      }
      tx.set(ref, record);
    });
  } catch (err) {
    throw friendlyError(err);
  }

  return toPublicAccount(id, record);
}

/** Reads a File as a data: URL. */
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new AuthError('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

export function validateCertificateFile(file) {
  if (!file) return;
  const okType = file.type === 'application/pdf' || file.type.startsWith('image/');
  if (!okType) throw new AuthError('The resale certificate must be a PDF or an image.');
  if (file.size > MAX_CERTIFICATE_BYTES) {
    throw new AuthError('The resale certificate file is too large (max 700 KB). Please upload a smaller PDF or photo.');
  }
}

/** Wholesale application: creates a Pending b2b account and stores the certificate. */
export async function registerWholesaleAccount({ certificateFile, ...application }) {
  if (!(application.businessName || '').trim()) throw new AuthError('Please enter your business name.');
  if (!(application.taxId || '').trim()) throw new AuthError('Please enter your resale tax ID / permit number.');
  validateCertificateFile(certificateFile);

  const documents = certificateFile
    ? [{ name: certificateFile.name, size: certificateFile.size, type: certificateFile.type, uploadedAt: new Date().toISOString() }]
    : [];

  const account = await registerAccount({
    role: 'b2b',
    name: application.contactName,
    email: application.email,
    phone: application.phone,
    password: application.password,
    contactName: (application.contactName || '').trim(),
    businessName: application.businessName.trim(),
    dba: (application.dba || application.businessName).trim(),
    storeType: application.storeType || 'Convenience Store',
    taxId: application.taxId.trim(),
    address: (application.address || '').trim(),
    monthlyVolume: application.monthlyVolume || '',
    documents
  });

  if (certificateFile) {
    try {
      const dataUrl = await readFileAsDataUrl(certificateFile);
      await setDoc(doc(db, B2B_DOCUMENTS, account.id), {
        accountId: account.id,
        name: certificateFile.name,
        type: certificateFile.type,
        size: certificateFile.size,
        dataUrl,
        uploadedAt: new Date().toISOString()
      });
    } catch (err) {
      // The account exists; flag the missing file so the admin can ask for it.
      console.error('[Accounts] certificate upload failed', err);
      await updateDoc(doc(db, USERS, account.id), { documentsUploadFailed: true }).catch(() => {});
      return { ...account, documentsUploadFailed: true };
    }
  }
  return account;
}

export async function fetchCertificate(accountId) {
  try {
    const snap = await getDoc(doc(db, B2B_DOCUMENTS, accountId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    throw friendlyError(err);
  }
}

// ---------------------------------------------------------------------------
// Sign in
// ---------------------------------------------------------------------------
const BAD_CREDENTIALS = 'Incorrect email/phone or password. Please try again.';

async function findAccount(identifier) {
  const raw = (identifier || '').trim();
  if (raw.includes('@')) {
    const id = normalizeEmail(raw);
    const snap = await getDoc(doc(db, USERS, id));
    return snap.exists() ? { id: snap.id, data: snap.data() } : null;
  }

  const digits = phoneDigits(raw);
  if (digits.length !== 10) throw new AuthError('Please enter a valid email address or 10-digit phone number.');
  const byId = await getDoc(doc(db, USERS, phoneAccountId(digits)));
  if (byId.exists()) return { id: byId.id, data: byId.data() };
  const byPhone = await getDocs(query(collection(db, USERS), where('phoneDigits', '==', digits), limit(1)));
  return byPhone.empty ? null : { id: byPhone.docs[0].id, data: byPhone.docs[0].data() };
}

/**
 * Verifies credentials. `expectedRole` is the tab the user signed in from:
 * wholesale sign-in only accepts wholesale accounts.
 */
export async function signIn(identifier, password, expectedRole = 'retail') {
  if (!(identifier || '').trim()) throw new AuthError('Please enter your email or phone number.');
  if (!password) throw new AuthError('Please enter your password.');

  let found;
  try {
    found = await findAccount(identifier);
  } catch (err) {
    throw friendlyError(err);
  }
  if (!found) throw new AuthError(BAD_CREDENTIALS);

  const { ok, legacy } = await verifyPassword(found.data, password);
  if (!ok) throw new AuthError(BAD_CREDENTIALS);

  const account = toPublicAccount(found.id, found.data);

  if (expectedRole === 'b2b' && account.role !== 'b2b') {
    throw new AuthError('This is a retail account. Please use the Retail tab to sign in, or apply for a wholesale account.');
  }
  if (account.status === 'Rejected') {
    throw new AuthError('Your wholesale application was not approved. Please contact Ruby Red on WhatsApp for details.');
  }
  if (account.status === 'Suspended') {
    throw new AuthError('This account has been suspended. Please contact Ruby Red support.');
  }

  const updates = { lastLoginAt: new Date().toISOString() };
  if (legacy) {
    // Replace the old plain-text password with a hash before continuing
    Object.assign(updates, await hashPassword(password), { password: deleteField() });
    await updateDoc(doc(db, USERS, found.id), updates).catch((err) => console.warn('[Accounts] password upgrade failed', err));
  } else {
    updateDoc(doc(db, USERS, found.id), updates).catch((err) => console.warn('[Accounts] login bookkeeping failed', err));
  }

  return account;
}

/** Latest copy of an account (e.g. to pick up an admin approval). null if deleted. */
export async function fetchAccount(id) {
  const snap = await getDoc(doc(db, USERS, id));
  return snap.exists() ? toPublicAccount(snap.id, snap.data()) : null;
}

export async function updateProfile(id, changes) {
  const allowed = clean({
    name: changes.name?.trim(),
    displayName: changes.name?.trim(),
    phone: changes.phone?.trim(),
    phoneDigits: changes.phone !== undefined ? phoneDigits(changes.phone) : undefined,
    address: changes.address
  });
  try {
    await updateDoc(doc(db, USERS, id), allowed);
  } catch (err) {
    throw friendlyError(err);
  }
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export async function listAccounts() {
  try {
    const snap = await getDocs(collection(db, USERS));
    const accounts = snap.docs.map((d) => toPublicAccount(d.id, d.data()));
    return {
      retail: accounts.filter((a) => a.role === 'retail'),
      wholesale: accounts.filter((a) => a.role === 'b2b')
    };
  } catch (err) {
    throw friendlyError(err);
  }
}

export async function setAccountStatus(id, status) {
  const now = new Date().toISOString();
  try {
    await updateDoc(doc(db, USERS, id), {
      status,
      statusUpdatedAt: now,
      ...(status === 'Approved' ? { approvedAt: now } : {})
    });
  } catch (err) {
    throw friendlyError(err);
  }
}
