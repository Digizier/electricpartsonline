import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { StorefrontShell } from './StorefrontShell';

export const metadata: Metadata = {
  title: 'Quality Commercial Equipment Parts | Usman Traders / ElectricPartsOnline.com',
  description:
    'Electrical, Plumbing, Hardware & Kitchen Parts — your one-stop shop for commercial equipment fittings, fixtures, and genuine OEM supplies.',
  keywords: [
    'commercial kitchen parts',
    'fryer heating elements',
    'commercial gas valves',
    'ice machine control boards',
    'water pumps',
    'electrical contactors',
    'Usman Traders',
    'ElectricPartsOnline',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="antialiased min-h-screen bg-white text-slate-900">
        <CartProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  );
}
