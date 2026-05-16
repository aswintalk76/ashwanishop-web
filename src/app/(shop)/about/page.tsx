import { StaticPage } from '@/components/static-page';

export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <StaticPage title="About Ashwani Shop">
      <p>Ashwani Shop is a premium e-commerce platform offering curated products with secure UPI payments, verified delivery via QR codes, and exceptional customer service.</p>
      <p>We believe in transparency, quality, and building trust with every order.</p>
    </StaticPage>
  );
}
