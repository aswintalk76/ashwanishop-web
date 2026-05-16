import { create } from 'zustand';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  guestToken: string | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  guestToken: Cookies.get('guest_token') || null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      if (data.guest_token) Cookies.set('guest_token', data.guest_token, { expires: 30 });
      set({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        guestToken: data.guest_token,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { product_id: productId, quantity });
    if (data.guest_token) Cookies.set('guest_token', data.guest_token, { expires: 30 });
    await get().fetchCart();
  },

  updateQuantity: async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (id) => {
    await api.delete(`/cart/${id}`);
    await get().fetchCart();
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
