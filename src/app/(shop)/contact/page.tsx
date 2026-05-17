import { StaticPage } from '@/components/static-page';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <StaticPage title="Contact Us">
      <p><strong>Email:</strong> aswintalk76@gmail.com</p>
      <p><strong>Phone:</strong> +91 7619850994</p>
      <p><strong>Hours:</strong> Mon–Sat, 9 AM – 6 PM IST</p>
    </StaticPage>
  );
}
