'use client';

import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

/** Client-only auth/cart bootstrap — kept separate from ThemeProvider to avoid hydration issues */
export function AppInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (Cookies.get('auth_token')) {
      void fetchMe();
    }

    void fetchCart();
  }, [fetchMe, fetchCart]);

  return null;
}
