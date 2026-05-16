'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => api.get('/admin/orders').then((r) => setOrders(r.data.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const verifyPayment = async (orderNumber: string) => {
    try {
      await api.post(`/admin/orders/${orderNumber}/verify-payment`);
      toast.success('Payment verified');
      load();
    } catch {
      toast.error('Verification failed');
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-mono">{o.order_number}</TableCell>
              <TableCell>{(o as Order & { user?: { name: string } }).user?.name || '—'}</TableCell>
              <TableCell>₹{o.total}</TableCell>
              <TableCell><Badge variant="outline">{o.status}</Badge></TableCell>
              <TableCell className="space-x-2">
                {o.status === 'pending' && (
                  <Button size="sm" onClick={() => verifyPayment(o.order_number)} className="bg-green-600">
                    Verify Payment
                  </Button>
                )}
                <Link href={`/admin/orders/${o.order_number}`} className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm hover:bg-muted">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
