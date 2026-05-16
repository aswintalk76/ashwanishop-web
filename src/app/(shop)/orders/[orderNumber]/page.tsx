import { OrderDetailClient } from './order-detail-client';

export async function generateStaticParams() {
  return [{ orderNumber: '__static__' }];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
