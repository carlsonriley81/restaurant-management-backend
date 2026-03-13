import type { Metadata } from 'next';
import '../styles/globals.css';
import { TopNav } from '@/components/shared/TopNav';

export const metadata: Metadata = {
  title: 'Restaurant Management System',
  description: 'Open-source restaurant management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <TopNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
