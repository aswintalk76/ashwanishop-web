import { Suspense } from 'react';
import { AdminOrderDetailClient } from './admin-order-detail-client';

export default function AdminOrderDetailPage() {
  return (
    <Suspense fallback={<p className="p-8 text-muted-foreground">Loading...</p>}>
      <AdminOrderDetailClient />
    </Suspense>
  );
}
