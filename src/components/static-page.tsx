export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{title}</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
