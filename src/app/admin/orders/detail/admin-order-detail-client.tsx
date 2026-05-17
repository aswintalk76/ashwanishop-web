'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusTimeline } from '@/components/orders/order-status-timeline';
import type { Order, OrderStatus } from '@/types';
import { toast } from 'sonner';

const nextActions: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  payment_verified: { label: 'Start processing', status: 'processing' },
  processing: { label: 'Mark as shipped', status: 'shipped' },
};

export function AdminOrderDetailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('order') ?? '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!orderNumber) return;
    setLoading(true);
    api
      .get<{ order: Order }>(`/admin/orders/${orderNumber}`)
      .then((r) => setOrder(r.data.order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!orderNumber) {
      router.replace('/admin/orders');
      return;
    }
    load();
  }, [orderNumber, router]);

  const updateStatus = async (status: OrderStatus) => {
    try {
      await api.patch(`/admin/orders/${orderNumber}/status`, { status });
      toast.success('Status updated');
      load();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Update failed';
      toast.error(msg);
    }
  };

  const verifyPayment = async () => {
    try {
      await api.post(`/admin/orders/${orderNumber}/verify-payment`);
      toast.success('Payment verified — customer can see delivery QR');
      load();
    } catch {
      toast.error('Verification failed');
    }
  };

  if (!orderNumber) return null;
  if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
  if (!order) return null;

  const action = nextActions[order.status];

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge variant="outline">{order.status.replace(/_/g, ' ')}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>₹{Number(item.total).toLocaleString()}</span>
              </div>
            ))}
            <p className="border-t pt-3 font-bold">Total: ₹{Number(order.total).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.status === 'pending' && (
              <Button onClick={verifyPayment} className="w-full bg-green-600">
                Verify payment
              </Button>
            )}
            {action && (
              <Button
                onClick={() => updateStatus(action.status)}
                className="w-full bg-orange-500"
              >
                {action.label}
              </Button>
            )}
            {order.status === 'shipped' && (
              <p className="text-sm text-muted-foreground">
                When the package arrives, scan the customer&apos;s delivery QR in{' '}
                <Link href="/admin/qr-scanner" className="text-orange-500 underline">
                  QR Scanner
                </Link>{' '}
                to mark delivered and completed.
              </p>
            )}
            <OrderStatusTimeline status={order.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
