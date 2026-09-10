import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zen Virtual Assistance',
  description: 'Reliable virtual assistance that helps your business work smarter.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
