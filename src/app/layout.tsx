import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppInit } from '@/components/app-init';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Ashwani Shop - Premium E-Commerce',
    template: '%s | Ashwani Shop',
  },
  description: 'Premium online shopping with secure UPI payments, fast delivery, and curated products.',
  openGraph: {
    title: 'Ashwani Shop',
    description: 'Premium E-Commerce Platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans antialiased`}>
        <ThemeProvider>
          <AppInit />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
