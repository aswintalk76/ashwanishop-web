const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/** Product slugs to pre-render when using `output: 'export'`. */
export async function fetchAllProductSlugs(): Promise<{ slug: string }[]> {
  const slugs: { slug: string }[] = [];
  let page = 1;
  let lastPage = 1;

  try {
    while (page <= lastPage) {
      const res = await fetch(`${API_URL}/products?per_page=100&page=${page}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) break;

      const data = (await res.json()) as {
        data?: { slug: string }[];
        last_page?: number;
      };

      for (const product of data.data ?? []) {
        if (product.slug) slugs.push({ slug: product.slug });
      }

      lastPage = data.last_page ?? 1;
      page += 1;
    }
  } catch {
    // Build continues; product pages can still work via client navigation if API was down.
  }

  return slugs;
}
