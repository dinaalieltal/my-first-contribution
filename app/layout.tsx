import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Orchpad–Liner Sync',
  description: 'Connect your Liner account and keep documents synced in Orchpad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
