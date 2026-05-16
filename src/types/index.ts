export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  roles?: { name: string }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  final_price?: number;
  sku: string;
  stock: number;
  rating: number;
  review_count: number;
  images?: string[];
  primary_image?: string;
  status: string;
  category?: Category;
  category_id: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface DeliveryQr {
  order_number: string;
  token: string;
  qr_payload?: string;
  qr_image_base64?: string;
  expires_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
  notes?: string;
  items: OrderItem[];
  payment?: Payment;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  price: number;
  quantity: number;
  total: number;
  product?: Product;
}

export interface Payment {
  id: number;
  transaction_id?: string;
  screenshot?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export type OrderStatus =
  | 'pending'
  | 'payment_verified'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PublicSettings {
  site_name?: string;
  site_tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  payment_qr_image?: string;
}
