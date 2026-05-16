/** Routes where 401 should not trigger a hard redirect to login */
export const AUTH_PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/admin/login',
];

export function isAuthPublicPath(pathname: string): boolean {
  return AUTH_PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function isAuthApiRequest(url?: string): boolean {
  if (!url) return false;
  return /\/auth\/(login|register|forgot-password|reset-password)|\/admin\/auth\/login/.test(url);
}
