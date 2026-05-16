import { api } from '@/lib/api';
import type { DeliveryQr, Order, PaginatedResponse } from '@/types';

export async function createOrder(payload: Record<string, string | number>) {
  const { data } = await api.post<{ order: Order }>('/orders', payload);
  return data.order;
}

export async function getOrders(page = 1) {
  const { data } = await api.get<PaginatedResponse<Order>>('/orders', { params: { page } });
  return data;
}

export async function getOrder(orderNumber: string) {
  const { data } = await api.get<{ order: Order; delivery_qr: DeliveryQr | null }>(
    `/orders/${orderNumber}`
  );
  return { order: data.order, deliveryQr: data.delivery_qr };
}

export async function submitPaymentProof(
  orderNumber: string,
  formData: FormData
) {
  const { data } = await api.post(`/orders/${orderNumber}/payment-proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
