export async function generateStaticParams() {
  return [{ orderNumber: '__static__' }];
}

export default function AdminOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
