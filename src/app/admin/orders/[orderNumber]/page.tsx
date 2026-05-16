import { AdminOrderDetailClient } from './admin-order-detail-client';

export async function generateStaticParams() {
  return [{ orderNumber: '__static__' }];
}

export default function AdminOrderDetailPage() {
  return <AdminOrderDetailClient />;
}
