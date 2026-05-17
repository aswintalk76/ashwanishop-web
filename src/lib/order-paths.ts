/** Static-export friendly order URLs (no dynamic [orderNumber] segment). */
export function shopOrderPath(orderNumber: string) {
  return `/orders/detail?order=${encodeURIComponent(orderNumber)}`;
}

export function adminOrderPath(orderNumber: string) {
  return `/admin/orders/detail?order=${encodeURIComponent(orderNumber)}`;
}
