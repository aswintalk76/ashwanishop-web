'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LinkButton } from '@/components/ui/link-button';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Ashwani<span className="text-orange-500">Shop</span>
        </Link>

        <form
          className="hidden flex-1 max-w-md md:flex"
          action="/products"
          method="get"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border bg-muted/50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <LinkButton href="/wishlist" variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </LinkButton>

          <LinkButton href="/cart" variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </LinkButton>

          <LinkButton href={user ? '/account' : '/login'} variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </LinkButton>

          <Sheet>
            <SheetTrigger className="lg:hidden" render={<Button variant="ghost" size="icon"><Menu className="h-4 w-4" /></Button>} />
            <SheetContent side="right">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
