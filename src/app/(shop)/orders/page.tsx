'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { shopOrderPath } from '@/lib/order-paths';
import { getOrders } from '@/services/orders';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders().then((r) => setOrders(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <Link key={o.id} href={shopOrderPath(o.order_number)} className="block rounded-xl border p-4 transition hover:shadow-md">
            <div className="flex justify-between">
              <span className="font-mono font-medium">{o.order_number}</span>
              <Badge variant="outline">{o.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">₹{o.total} · {new Date(o.created_at).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
