'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountPage() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p>Please <Link href="/login" className="text-orange-500">sign in</Link> to view your account.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <LinkButton href="/orders" variant="outline">My Orders</LinkButton>
            <LinkButton href="/wishlist" variant="outline">Wishlist</LinkButton>
            <LinkButton href="/cart" variant="outline">Cart</LinkButton>
            <Button variant="destructive" onClick={() => logout()}>Logout</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
