import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: (user, token) => {
        Cookies.set('auth_token', token, { expires: 7 });
        set({ user, token });
        void useCartStore.getState().fetchCart();
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          /* ignore */
        }
        Cookies.remove('auth_token');
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        if (!Cookies.get('auth_token')) {
          set({ user: null, token: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, isLoading: false });
        } catch {
          set({ user: null, token: null, isLoading: false });
          Cookies.remove('auth_token');
        }
      },

      isAdmin: () => {
        const user = get().user;
        return user?.roles?.some((r) => r.name === 'admin') ?? false;
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ token: s.token }) }
  )
);
