import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToCustomerOrders } from '../services/orderService';

/** Live list of the signed-in customer's orders (newest first). */
export default function useMyOrders() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || null;
  const [state, setState] = useState({ orders: [], loading: Boolean(userId), error: '' });

  useEffect(() => {
    if (!userId) {
      setState({ orders: [], loading: false, error: '' });
      return undefined;
    }
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    return subscribeToCustomerOrders(
      userId,
      (orders) => setState({ orders, loading: false, error: '' }),
      (err) => setState((prev) => ({ ...prev, loading: false, error: err.message }))
    );
  }, [userId]);

  return state;
}
