import { useEffect, useState } from 'react';
import {
  getCatalog,
  subscribeToCatalog,
  INITIAL_REAL_CATEGORIES,
  INITIAL_REAL_PRODUCTS
} from '../services/firebaseService';

let lastCatalog = null;

/**
 * Categories and products for the storefront.
 * Renders immediately from the bundled catalog, then switches to the Firestore
 * data (which includes admin edits) once it has loaded.
 */
export default function useCatalog() {
  const [catalog, setCatalog] = useState(() => ({
    categories: lastCatalog?.categories || INITIAL_REAL_CATEGORIES,
    products: lastCatalog?.products || INITIAL_REAL_PRODUCTS,
    loading: !lastCatalog
  }));

  useEffect(() => {
    let active = true;
    const apply = (data) => {
      lastCatalog = data;
      if (active) setCatalog({ ...data, loading: false });
    };
    getCatalog().then(apply);
    const unsubscribe = subscribeToCatalog(apply);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return catalog;
}

/** Spreads featured picks across categories so the home page shows a mix. */
export function pickFeatured(products, limit = 12) {
  const featured = products.filter(p => p.featured);
  const pool = featured.length > 0 ? featured : products;
  const byCategory = new Map();
  pool.forEach(p => {
    if (!byCategory.has(p.categoryId)) byCategory.set(p.categoryId, []);
    byCategory.get(p.categoryId).push(p);
  });
  const queues = Array.from(byCategory.values());
  const result = [];
  while (result.length < limit && queues.some(q => q.length > 0)) {
    queues.forEach(q => {
      if (q.length > 0 && result.length < limit) result.push(q.shift());
    });
  }
  return result;
}
