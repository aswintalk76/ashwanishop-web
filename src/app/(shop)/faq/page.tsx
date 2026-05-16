import { StaticPage } from '@/components/static-page';

export const metadata = { title: 'FAQ' };

export default function FaqPage() {
  return (
    <StaticPage title="Frequently Asked Questions">
      <h2 className="text-lg font-semibold text-foreground">How do I pay?</h2>
      <p>Scan the UPI QR code at checkout, complete payment in your UPI app, then submit your transaction ID.</p>
      <h2 className="text-lg font-semibold text-foreground">When is my order confirmed?</h2>
      <p>After admin verifies your payment, you will receive an email with order confirmation and delivery QR code.</p>
      <h2 className="text-lg font-semibold text-foreground">How does delivery verification work?</h2>
      <p>Show the QR code from your email at delivery. Our team scans it to confirm successful delivery.</p>
    </StaticPage>
  );
}
