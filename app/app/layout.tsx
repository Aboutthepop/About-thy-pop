import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'About Thy Pop — Funko Catalog',
  description: 'Collector catalog for About Thy Pop — Funko Pop figures, exclusives, and release dates.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
