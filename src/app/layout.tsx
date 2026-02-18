import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Trading Personality Quiz - Discover Your Trading Type',
  description:
    'Take our free 2-minute quiz to discover your trading personality type and get a personalized report with strategies to improve your trading.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="w-full px-6 py-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-BoBe.svg" alt="BoBe" height={40} />
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
