'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { getProducts } from '@/services/products';
import type { Product } from '@/types';

export function ProductsPageClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);
    getProducts({
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
      sort,
      per_page: 24,
    })
      .then((res) => setProducts(res.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">All Products</h1>
      {search && (
        <p className="mb-4 text-muted-foreground">Results for &quot;{search}&quot;</p>
      )}
      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Loading products...</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {!products.length && (
            <p className="py-12 text-center text-muted-foreground">No products found.</p>
          )}
        </>
      )}
    </div>
  );
}
