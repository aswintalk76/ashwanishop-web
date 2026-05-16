'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { useCartStore } from '@/store/cart-store';
import { StorageImage } from '@/components/storage-image';
import { Minus, Plus, Trash2 } from 'lucide-react';

function itemPrice(price: number, discount: number) {
  return discount > 0 ? price - (price * discount) / 100 : price;
}

export default function CartPage() {
  const { items, subtotal, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading) return <p className="container py-12 text-center">Loading cart...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
          <LinkButton href="/products" className="mt-4 bg-orange-500">Continue Shopping</LinkButton>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const price = itemPrice(item.product.price, item.product.discount);
              return (
                <div key={item.id} className="flex gap-4 rounded-xl border p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <StorageImage path={item.product.images?.[0]} alt={item.product.name} fill />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.product.slug}`} className="font-medium hover:text-orange-500">{item.product.name}</Link>
                    <p className="text-lg font-bold">₹{price.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus className="h-4 w-4" /></Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border p-6 h-fit">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="mt-4 flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <LinkButton href="/checkout" className="mt-6 w-full bg-orange-500 hover:bg-orange-600">Proceed to Checkout</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
