'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/products/product-card';
import type { Product } from '@/types';
import Link from 'next/link';

export default function WishlistPage() {
  const [items, setItems] = useState<{ product: Product }[]>([]);

  useEffect(() => {
    api.get('/wishlist').then((r) => setItems(r.data.items || [])).catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Your wishlist is empty. <Link href="/login" className="text-orange-500">Sign in</Link> to save items.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => <ProductCard key={i.product.id} product={i.product} />)}
        </div>
      )}
    </div>
  );
}
