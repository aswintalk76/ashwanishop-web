import Link from 'next/link';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { LinkButton } from '@/components/ui/link-button';
import { ProductCard } from '@/components/products/product-card';
import { getProducts } from '@/services/products';
import { api } from '@/lib/api';

async function getFeatured() {
  try {
    return await getProducts({ per_page: 8, sort: 'rating' });
  } catch {
    return { data: [] };
  }
}

async function getCategories() {
  try {
    const { data } = await api.get('/categories');
    return data.categories || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeatured(), getCategories()]);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-orange-900 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-orange-300">
              New Collection 2026
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Shop Premium.<br />Pay Securely.<br />Deliver Fast.
            </h1>
            <p className="mt-6 text-lg text-zinc-300">
              Discover curated products with UPI payment, QR delivery verification, and real-time order tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href="/products" size="lg" className="bg-orange-500 hover:bg-orange-600">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton href="/categories" size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Categories
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-3">
        {[
          { icon: Truck, title: 'Fast Delivery', desc: 'Track your order in real-time' },
          { icon: Shield, title: 'Secure UPI Pay', desc: 'QR-based verified payments' },
          { icon: Headphones, title: '24/7 Support', desc: 'We are here to help you' },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-4 rounded-xl border p-6">
            <f.icon className="h-8 w-8 text-orange-500" />
            <div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.slice(0, 6).map((cat: { id: number; name: string; slug: string }) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-xl border bg-gradient-to-r from-muted to-muted/50 p-8 text-center font-semibold transition hover:border-orange-500 hover:shadow-md"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-sm text-orange-500 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
