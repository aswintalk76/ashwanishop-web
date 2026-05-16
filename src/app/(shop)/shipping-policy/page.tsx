import { StaticPage } from '@/components/static-page';
export const metadata = { title: 'Shipping Policy' };
export default function ShippingPolicyPage() {
  return (
    <StaticPage title="Shipping Policy">
      <p>Orders are typically delivered within 3–7 business days after payment verification. Delivery times may vary by location. You will receive email updates at each stage.</p>
    </StaticPage>
  );
}
