export async function generateStaticParams() {
  return [{ orderNumber: '__static__' }];
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
