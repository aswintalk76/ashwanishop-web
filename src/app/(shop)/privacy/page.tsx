import { StaticPage } from '@/components/static-page';
export const metadata = { title: 'Privacy Policy' };
export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>We collect personal information to process orders and improve your experience. We do not sell your data to third parties. Payment proofs are stored securely for verification purposes only.</p>
    </StaticPage>
  );
}
