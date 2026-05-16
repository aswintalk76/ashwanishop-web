'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';

export function AddToCartButton({ productId }: { productId: number }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      className="mt-6 bg-orange-500 hover:bg-orange-600"
      size="lg"
      onClick={async () => {
        try {
          await addItem(productId);
          toast.success('Added to cart');
        } catch {
          toast.error('Failed to add');
        }
      }}
    >
      Add to Cart
    </Button>
  );
}
