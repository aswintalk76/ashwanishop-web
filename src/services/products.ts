import { api } from '@/lib/api';
import type { PaginatedResponse, Product } from '@/types';

export async function getProducts(params?: Record<string, string | number>) {
  const { data } = await api.get<PaginatedResponse<Product>>('/products', { params });
  return data;
}

export async function getProduct(slug: string) {
  const { data } = await api.get<{ product: Product }>(`/products/${slug}`);
  return data.product;
}
