'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StorageImage } from '@/components/storage-image';
import { useCartStore } from '@/store/cart-store';
import type { Product } from '@/types';
import { toast } from 'sonner';

function getPrice(product: Product) {
  if (product.discount > 0) {
    return product.price - (product.price * product.discount) / 100;
  }
  return product.price;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const finalPrice = getPrice(product);

  const handleAdd = async () => {
    try {
      await addItem(product.id);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        <StorageImage
          path={product.images?.[0]}
          alt={product.name}
          fill
          className="transition-transform group-hover:scale-105"
        />
        {product.discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-orange-500">
            {product.discount}% OFF
          </Badge>
        )}
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-medium leading-snug hover:text-orange-500">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{product.rating}</span>
          <span>({product.review_count})</span>
        </div>
        <motion.div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">₹{finalPrice.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <Button size="sm" onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
