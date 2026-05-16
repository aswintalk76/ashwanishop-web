import { fetchAllProductSlugs } from '@/lib/static-export';

export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  return slugs.length > 0 ? slugs : [{ slug: '__static__' }];
}

export default function ProductSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
