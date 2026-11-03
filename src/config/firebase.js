import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Local testing only: `VITE_FIRESTORE_EMULATOR=localhost:8085 npm run dev`
// points the app at the Firestore emulator under a "demo-" project id, which
// Firebase guarantees can never reach a real project.
const EMULATOR_HOST = import.meta.env.VITE_FIRESTORE_EMULATOR || '';

// Official Ruby Red Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAiizyrH_pX0q_Q5_8AVCPBalYFG2OQh4w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rubyred-4d5e1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rubyred-4d5e1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rubyred-4d5e1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "321534534071",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:321534534071:web:3bb3ef8048236c1c17c832"
};

export const isFirebaseConfigured = true;

if (EMULATOR_HOST) {
  firebaseConfig.projectId = 'demo-rubyred';
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

if (EMULATOR_HOST) {
  const [host, port] = EMULATOR_HOST.split(':');
  connectFirestoreEmulator(db, host, Number(port) || 8080);
  console.warn('[Firebase] Using the LOCAL Firestore emulator at', EMULATOR_HOST);
}

// Accounts live in Firestore (see src/services/authService.js); media in the project directory
const auth = null;
const storage = null;

export { app, db, auth, storage };

