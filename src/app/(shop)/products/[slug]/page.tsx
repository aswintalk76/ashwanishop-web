import { notFound } from 'next/navigation';
import { getProduct } from '@/services/products';
import { fetchAllProductSlugs } from '@/lib/static-export';
import { StorageImage } from '@/components/storage-image';
import { AddToCartButton } from './add-to-cart-button';
import { Star } from 'lucide-react';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await fetchAllProductSlugs();
  return slugs.length > 0 ? slugs : [{ slug: '__static__' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    return { title: product.name, description: product.description.slice(0, 160) };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const finalPrice = product.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <StorageImage
            path={product.images?.[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm text-orange-500">{product.category?.name}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating} ({product.review_count} reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">₹{finalPrice.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="text-xl text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <p className="mt-6 text-muted-foreground">{product.description}</p>
          <p className="mt-2 text-sm">SKU: {product.sku} | Stock: {product.stock}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
