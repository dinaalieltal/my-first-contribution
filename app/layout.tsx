import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Orchpad – Liner Sync',
  description: 'Connect your Liner account and sync documents into Orchpad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
