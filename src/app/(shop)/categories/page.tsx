import Link from 'next/link';
import { api } from '@/lib/api';

export const metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  let categories: { id: number; name: string; slug: string; description?: string }[] = [];
  try {
    const { data } = await api.get('/categories');
    categories = data.categories || [];
  } catch { /* API offline */ }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.slug}`} className="rounded-xl border p-8 transition hover:border-orange-500 hover:shadow-md">
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
