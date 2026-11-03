/**
 * Push src/data/catalog.json (built by scripts/build_catalog.py) to Firestore.
 *
 *   node scripts/seed-firestore.mjs            # write categories + products
 *   node scripts/seed-firestore.mjs --dry-run  # show what would change
 *   node scripts/seed-firestore.mjs --keep-extra
 *        # don't delete Firestore categories/products that are not in catalog.json
 *
 * Firebase settings come from .env (VITE_FIREBASE_*), the same as the website.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs, doc, setDoc, writeBatch, serverTimestamp, terminate
} from 'firebase/firestore';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const KEEP_EXTRA = args.has('--keep-extra');

function loadEnv() {
  const env = { ...process.env };
  const file = path.join(ROOT, '.env');
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && env[match[1]] === undefined) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const env = loadEnv();
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID in .env');
  process.exit(1);
}

const catalog = JSON.parse(readFileSync(path.join(ROOT, 'src', 'data', 'catalog.json'), 'utf8'));
const db = getFirestore(initializeApp(firebaseConfig));

async function syncCollection(name, records) {
  const existing = await getDocs(collection(db, name));
  const existingIds = new Set(existing.docs.map(d => d.id));
  const wantedIds = new Set(records.map(r => r.id));
  const toDelete = KEEP_EXTRA ? [] : [...existingIds].filter(id => !wantedIds.has(id));
  const created = records.filter(r => !existingIds.has(r.id)).length;

  console.log(
    `${name}: ${records.length} to write (${created} new, ${records.length - created} updated)` +
    `, ${toDelete.length} to delete${toDelete.length ? ': ' + toDelete.join(', ') : ''}`
  );
  if (DRY_RUN) return;

  const ops = [
    ...records.map(r => batch => batch.set(doc(db, name, r.id), {
      ...r,
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    })),
    ...toDelete.map(id => batch => batch.delete(doc(db, name, id)))
  ];
  // Small batches with a pause keep us under Firestore's write-bandwidth limit
  const BATCH_SIZE = 50;
  for (let i = 0; i < ops.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    ops.slice(i, i + BATCH_SIZE).forEach(op => op(batch));
    await batch.commit();
    if (i + BATCH_SIZE < ops.length) await new Promise(r => setTimeout(r, 1500));
  }
}

try {
  console.log(`Project ${firebaseConfig.projectId} · catalog ${catalog.version}${DRY_RUN ? ' · DRY RUN' : ''}`);
  await syncCollection('categories', catalog.categories);
  await syncCollection('products', catalog.products);
  if (!DRY_RUN) {
    // Tell browsers with a cached catalog to download the new one
    await setDoc(doc(db, 'meta', 'catalog'), { version: Date.now(), updatedAt: new Date().toISOString() });
  }
  console.log(DRY_RUN ? 'Dry run finished, nothing written.' : 'Firestore catalog is up to date.');
} catch (err) {
  console.error('Seeding failed:', err.code || '', err.message);
  if (err.code === 'permission-denied') {
    console.error('Firestore security rules are blocking writes to categories/products.');
  }
  process.exitCode = 1;
} finally {
  await terminate(db);
}
