/**
 * Orders stored in the Firestore `orders` collection.
 *
 * Each order keeps structured line items plus a few flat summary fields
 * (customer, amount, date, itemsSummary, storeName, cases) that the admin
 * tables display directly.
 */
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { friendlyError, AuthError } from './authService';

const ORDERS = 'orders';
export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const pad = (n) => String(n).padStart(2, '0');
const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

/** e.g. RR-261104-7KQ2 (retail) / RW-261104-X9PA (wholesale). */
export function generateOrderId(channel) {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => alphabet[b % alphabet.length]).join('');
  return `${channel === 'wholesale' ? 'RW' : 'RR'}-${stamp}-${rand}`;
}

/**
 * Saves a new order for the signed-in customer.
 * @param {object} input
 * @param {object} input.account   signed-in account (from AuthContext)
 * @param {'retail'|'wholesale'} input.channel
 * @param {Array}  input.items     [{ id, name, image, qty, unitPrice, isCase, caseQty }]
 * @param {object} input.totals    { subtotal, discount, tax, shipping, total }
 * @param {object} input.fulfillment { method: 'pickup'|'delivery', address, phone, notes }
 * @param {string} [input.promoCode]
 * @param {string} [input.source]  'checkout' | 'whatsapp'
 */
export async function placeOrder({ account, channel, items, totals, fulfillment, promoCode = '', source = 'checkout' }) {
  if (!account?.id) throw new AuthError('Please sign in to place an order.');
  if (!items?.length) throw new AuthError('Your cart is empty.');
  if (fulfillment.method === 'delivery' && !(fulfillment.address || '').trim()) {
    throw new AuthError('Please enter a delivery address.');
  }

  const now = new Date();
  const id = generateOrderId(channel);
  const isWholesale = channel === 'wholesale';
  const lineItems = items.map((item) => {
    const qty = Math.max(1, Number(item.qty) || 1);
    const unitPrice = round2(item.unitPrice);
    return {
      id: String(item.id),
      name: item.name || 'Product',
      image: item.image || '',
      qty,
      unitPrice,
      total: round2(unitPrice * qty),
      unitLabel: item.isCase || isWholesale ? 'Cases' : 'Units',
      caseQty: Number(item.caseQty) || 1
    };
  });
  const totalQty = lineItems.reduce((sum, i) => sum + i.qty, 0);
  const itemsSummary = lineItems.map((i) => `${i.qty}x ${i.name}`).join(', ');

  const record = {
    id,
    channel,
    type: isWholesale ? 'Wholesale (B2B)' : 'Retail (B2C)',
    source,
    status: 'Processing',
    statusHistory: [{ status: 'Processing', at: now.toISOString() }],

    userId: account.id,
    customer: account.name || '',
    email: account.email || '',
    phone: (fulfillment.phone || account.phone || '').trim(),
    ...(isWholesale
      ? {
          storeName: account.businessName || account.name || '',
          contact: account.contactName || account.name || '',
          cases: `${totalQty} Case${totalQty === 1 ? '' : 's'}`
        }
      : {}),

    items: lineItems,
    itemsSummary,
    itemCount: totalQty,

    subtotal: round2(totals.subtotal),
    discount: round2(totals.discount),
    tax: round2(totals.tax),
    shipping: round2(totals.shipping),
    total: round2(totals.total),
    amount: round2(totals.total),
    promoCode: promoCode || '',

    deliveryMethod: fulfillment.method === 'delivery' ? 'Delivery' : 'Store Pickup',
    address: fulfillment.method === 'delivery' ? fulfillment.address.trim() : 'Store pickup: 9909-A Harwin Dr, Houston, TX 77036',
    notes: (fulfillment.notes || '').trim(),
    paymentMethod: 'Pay on pickup / delivery',

    date: formatDate(now),
    createdAt: now.toISOString(),
    serverTime: serverTimestamp()
  };

  try {
    await setDoc(doc(db, ORDERS, id), record);
  } catch (err) {
    throw friendlyError(err);
  }
  return record;
}

const byNewest = (a, b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || '');

function snapshotToOrders(snap) {
  return snap.docs.map((d) => {
    const { serverTime, ...data } = d.data();
    return { ...data, id: d.id };
  });
}

/** Live list of one customer's orders (newest first). Returns an unsubscribe fn. */
export function subscribeToCustomerOrders(userId, onChange, onError) {
  if (!userId) {
    onChange([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, ORDERS), where('userId', '==', userId)),
    (snap) => onChange(snapshotToOrders(snap).sort(byNewest)),
    (err) => onError?.(friendlyError(err))
  );
}

/** All orders for the admin panel, split by channel. */
export async function fetchAllOrders() {
  try {
    const orders = snapshotToOrders(await getDocs(collection(db, ORDERS))).sort(byNewest);
    const isWholesale = (o) => o.channel === 'wholesale' || (o.type || '').includes('Wholesale');
    return {
      retail: orders.filter((o) => !isWholesale(o)),
      wholesale: orders.filter(isWholesale)
    };
  } catch (err) {
    throw friendlyError(err);
  }
}

export async function updateOrderStatus(orderId, status) {
  if (!ORDER_STATUSES.includes(status)) throw new AuthError(`Unknown order status "${status}".`);
  const at = new Date().toISOString();
  try {
    await updateDoc(doc(db, ORDERS, orderId), {
      status,
      updatedAt: at,
      statusHistory: arrayUnion({ status, at })
    });
  } catch (err) {
    throw friendlyError(err);
  }
}
