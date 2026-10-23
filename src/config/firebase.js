import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Official Ruby Red Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAMMWrOUIldja-Lz9p10npv0rQ4XvO1zDc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rubyred-564af.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rubyred-564af",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rubyred-564af.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1039753044968",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1039753044968:web:06f6936cd270f2dc2e3a5d"
};

export const isFirebaseConfigured = true;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Authentication credentials and media storage are maintained via Firestore and local project directory
const auth = null;
const storage = null;

console.log('[Firebase] Cloud Firestore connected to project:', firebaseConfig.projectId);

export { app, db, auth, storage };

