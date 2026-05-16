import { Suspense } from 'react';
import { ProductsPageClient } from './products-page-client';

export const metadata = { title: 'Products' };

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="container mx-auto px-4 py-8">Loading products...</p>}>
      <ProductsPageClient />
    </Suspense>
  );
}
