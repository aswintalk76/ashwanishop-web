import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetailClient } from './order-detail-client';

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto space-y-4 px-4 py-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      }
    >
      <OrderDetailClient />
    </Suspense>
  );
}
