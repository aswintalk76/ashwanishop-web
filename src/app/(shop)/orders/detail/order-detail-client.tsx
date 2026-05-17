'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusTimeline } from '@/components/orders/order-status-timeline';
import { DeliveryQrCard } from '@/components/orders/delivery-qr-card';
import { shopOrderPath } from '@/lib/order-paths';
import { getOrder, submitPaymentProof } from '@/services/orders';
import { useAuthStore } from '@/store/auth-store';
import type { DeliveryQr, Order } from '@/types';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  payment_verified: 'bg-blue-500/10 text-blue-600',
  processing: 'bg-purple-500/10 text-purple-600',
  shipped: 'bg-indigo-500/10 text-indigo-600',
  delivered: 'bg-green-500/10 text-green-600',
  completed: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

export function OrderDetailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('order') ?? '';
  const user = useAuthStore((s) => s.user);

  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryQr, setDeliveryQr] = useState<DeliveryQr | null>(null);
  const [loading, setLoading] = useState(true);
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadOrder = () => {
    if (!orderNumber) return;
    setLoading(true);
    getOrder(orderNumber)
      .then(({ order: o, deliveryQr: qr }) => {
        setOrder(o);
        setDeliveryQr(qr);
      })
      .catch(() => {
        toast.error('Order not found');
        router.push('/orders');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!orderNumber) {
      router.replace('/orders');
      return;
    }
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(shopOrderPath(orderNumber))}`);
      return;
    }
    loadOrder();
  }, [user, orderNumber, router]);

  const handlePaymentProof = async () => {
    if (!txnId.trim()) {
      toast.error('Enter transaction ID');
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append('transaction_id', txnId);
    if (screenshot) formData.append('screenshot', screenshot);
    try {
      await submitPaymentProof(orderNumber, formData);
      toast.success('Payment proof submitted!');
      loadOrder();
      setTxnId('');
      setScreenshot(null);
    } catch {
      toast.error('Failed to submit payment proof');
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderNumber || !user) return null;

  if (loading) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) return null;

  const showPaymentForm = order.status === 'pending' && order.payment?.status !== 'verified';

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge className={statusColors[order.status] || ''}>
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.product_sku} × {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{Number(item.total).toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-500">₹{Number(order.total).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {showPaymentForm && (
            <Card>
              <CardHeader>
                <CardTitle>Submit payment proof</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Complete UPI payment and enter your transaction ID below.
                </p>
                <div>
                  <Label>Transaction ID / UTR</Label>
                  <Input
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="UPI transaction reference"
                  />
                </div>
                <div>
                  <Label>Screenshot (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                  />
                </div>
                <Button
                  onClick={handlePaymentProof}
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {submitting ? 'Submitting...' : 'Submit Payment Proof'}
                </Button>
              </CardContent>
            </Card>
          )}

          {order.payment?.transaction_id && (
            <Card>
              <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Transaction ID:</span> {order.payment.transaction_id}</p>
                <p><span className="text-muted-foreground">Status:</span> {order.payment.status}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {deliveryQr && <DeliveryQrCard deliveryQr={deliveryQr} />}

          <Card>
            <CardHeader><CardTitle>Order tracking</CardTitle></CardHeader>
            <CardContent>
              <OrderStatusTimeline status={order.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Shipping address</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
              <p className="mt-2">Phone: {order.shipping_phone}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
