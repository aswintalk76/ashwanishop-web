import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">AshwaniShop</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Premium shopping experience with secure UPI payments and fast delivery.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/categories">Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/shipping-policy">Shipping</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Ashwani Shop. All rights reserved.</p>
        <p className="mt-2">
          <Link href="/admin/login" className="text-orange-500 hover:underline">
            Admin Login
          </Link>
          <span className="mx-2">·</span>
          <Link href="/admin" className="hover:underline">
            Admin Dashboard
          </Link>
        </p>
      </div>
    </footer>
  );
}
