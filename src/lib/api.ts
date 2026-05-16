import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { isAuthApiRequest, isAuthPublicPath } from '@/lib/auth-paths';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('auth_token');
  const guestToken = Cookies.get('guest_token');

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (guestToken) config.headers['X-Guest-Token'] = guestToken;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = error.config?.url ?? '';
    const hadToken = Boolean(Cookies.get('auth_token'));

    // Wrong password on login, etc. — let the form handle the error
    if (isAuthApiRequest(requestUrl)) {
      return Promise.reject(error);
    }

    // Guest or no session — no redirect
    if (!hadToken) {
      return Promise.reject(error);
    }

    Cookies.remove('auth_token');

    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const path = window.location.pathname;

    // Already on a public auth page — avoid reload loop
    if (isAuthPublicPath(path)) {
      return Promise.reject(error);
    }

    if (path.startsWith('/admin')) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const getStorageUrl = (path?: string | null) => {
  if (!path) return '/placeholder-product.svg';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace(/\/index\.php\/api\/v1\/?$/, '')
    .replace(/\/api\/v1\/?$/, '');
  return `${base}/storage/${path}`;
};
