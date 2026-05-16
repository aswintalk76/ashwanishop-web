'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import {
  LayoutDashboard, Package, FolderTree, ShoppingBag, Users,
  Star, Settings, QrCode, LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/qr-scanner', label: 'QR Scanner', icon: QrCode },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchMe, logout, isAdmin } = useAuthStore();

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (!Cookies.get('auth_token')) {
      router.push('/admin/login');
      return;
    }
    fetchMe().then(() => {
      if (!Cookies.get('auth_token') || !useAuthStore.getState().isAdmin()) {
        router.push('/admin/login');
      }
    });
  }, [pathname, fetchMe, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-zinc-950 text-white">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
        </div>
        <nav className="space-y-1 px-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                pathname === link.href ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => logout().then(() => router.push('/admin/login'))}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 bg-muted/20 p-8">{children}</main>
    </div>
  );
}
