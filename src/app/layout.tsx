import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { StorefrontShell } from './StorefrontShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://electricpartsonline.com'),
  title: {
    default: 'Commercial Equipment & Kitchen Parts in Pakistan | Usman Traders',
    template: '%s | Usman Traders Pakistan',
  },
  description:
    'Genuine commercial kitchen equipment parts, deep fryer heating elements, thermostats, commercial gas valves & fittings in Pakistan. Fast delivery from Usman Traders. Helpline: 0321-8888872.',
  keywords: [
    'commercial kitchen parts',
    'fryer heating elements',
    'commercial gas valves',
    'ice machine control boards',
    'commercial oven thermostats',
    'water dispenser pumps',
    'electrical contactors',
    'Usman Traders',
    'ElectricPartsOnline',
    'commercial kitchen parts Pakistan',
    'fryer parts Lahore',
    'commercial spare parts Karachi',
  ],
  alternates: {
    canonical: 'https://electricpartsonline.com',
  },
  openGraph: {
    title: 'Commercial Equipment & Kitchen Parts in Pakistan | Usman Traders',
    description:
      'Genuine commercial kitchen equipment parts, deep fryer heating elements, thermostats, commercial gas valves & fittings in Pakistan. Fast delivery from Usman Traders.',
    url: 'https://electricpartsonline.com',
    siteName: 'Usman Traders - ElectricPartsOnline',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Usman Traders ElectricPartsOnline Logo',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Equipment & Kitchen Parts in Pakistan | Usman Traders',
    description:
      'Genuine commercial kitchen equipment parts, deep fryer heating elements, thermostats, commercial gas valves & fittings in Pakistan.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

const globalSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Store',
      '@id': 'https://electricpartsonline.com/#store',
      'name': 'Usman Traders - ElectricPartsOnline.com',
      'alternateName': 'Usman Traders Commercial Parts',
      'url': 'https://electricpartsonline.com',
      'logo': 'https://electricpartsonline.com/icon.png',
      'image': 'https://electricpartsonline.com/icon.png',
      'description': 'Wholesale and retail supplier of genuine commercial equipment parts, kitchen appliance spares, heating elements, valves, thermostats, and controls in Pakistan.',
      'telephone': '+92-321-8888872',
      'priceRange': 'PKR',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Lahore',
        'addressRegion': 'Punjab',
        'addressCountry': 'PK',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 31.5204,
        'longitude': 74.3587,
      },
      'sameAs': [
        'https://www.facebook.com/share/18dJmrRRcu/',
        'https://www.instagram.com/usmantraders.electric',
        'https://www.tiktok.com/@usmantraders_electric',
        'https://maps.app.goo.gl/QA89GdbJBnTMPgou7',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://electricpartsonline.com/#website',
      'url': 'https://electricpartsonline.com',
      'name': 'ElectricPartsOnline - Usman Traders',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://electricpartsonline.com/products/?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalSchema),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
  const SITE_KEY = "site_electricpartson";
  const SUPABASE_URL = "https://pggolsqtamtkafrpigfo.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZ29sc3F0YW10a2FmcnBpZ2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDE3ODgsImV4cCI6MjEwMDgxNzc4OH0.98_YWbdZ6hlpMiujbiWLYPRYlrvnx2_I31FyGILixHs";
  const WHATSAPP_NUM = "03222685868";
  const WHATSAPP_LINK = "https://wa.me/923222685868?text=Hi%20Nader%20Habib,%20I%20want%20to%20unlock%20my%20website.";
  const isTestLock = typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('lock=true');

  async function checkAccess() {
    if (isTestLock) {
      execLockOverlay('monthly');
      return;
    }

    try {
      const url = \`\${SUPABASE_URL}/rest/v1/client_websites?site_key=eq.\${encodeURIComponent(SITE_KEY)}&select=*\`;
      const res = await fetch(url, {
        headers: { 
          'apikey': SUPABASE_KEY, 
          'Authorization': 'Bearer ' + SUPABASE_KEY 
        }
      });
      if (!res.ok) return;
      const data = await res.json();
      
      if (data && data.length > 0) {
        const item = data[0];
        const now = new Date();
        const expiry = new Date(item.expiry_date);
        const isExpired = now > expiry;
        const isDisabled = item.status === false;

        if (isExpired || isDisabled) {
          execLockOverlay(item.billing_cycle || 'monthly');
        }
      }
    } catch (e) {
      console.error('[Website-Controller] Access check failed:', e);
    }
  }

  function execLockOverlay(billingCycle) {
    function inject() {
      if (document.getElementById('nader-habib-lock-overlay')) return;
      document.documentElement.style.overflow = 'hidden';
      if (document.body) document.body.style.overflow = 'hidden';

      const overlay = document.createElement('div');
      overlay.id = 'nader-habib-lock-overlay';
      overlay.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:#030712!important;color:#ffffff!important;z-index:999999999!important;display:flex!important;align-items:center!important;justify-content:center!important;font-family:system-ui,-apple-system,sans-serif!important;text-align:center!important;padding:20px!important;box-sizing:border-box!important;';

      const cycle = billingCycle === 'yearly' ? 'Yearly' : 'Monthly';

      overlay.innerHTML = \`
        <div style="max-width:520px;width:100%;background:rgba(17,24,39,0.95);border:1px solid rgba(239,68,68,0.4);border-radius:24px;padding:40px 32px;box-shadow:0 25px 50px -12px rgba(239,68,68,0.25);backdrop-filter:blur(16px);">
          <div style="width:72px;height:72px;margin:0 auto 24px;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.5);border-radius:50%;display:flex;align-items:center;justify-content:center;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <span style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.3);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:6px 14px;border-radius:9999px;display:inline-block;margin-bottom:16px;">
            Website Access Locked • \${cycle} Payment Remaining
          </span>
          <h1 style="font-size:26px;font-weight:800;color:#ffffff;margin:0 0 12px 0;">Nader Habib Payment Remaining</h1>
          <p style="font-size:15px;color:#9ca3af;line-height:1.6;margin:0 0 24px 0;">
            Your hosting subscription access is locked. Please contact Nader Habib on WhatsApp to pay remaining dues and restore access.
          </p>
          <div style="background:#1f2937;border:1px solid #374151;border-radius:16px;padding:16px;margin-bottom:24px;">
            <div style="font-size:13px;color:#9ca3af;margin-bottom:4px;">Direct WhatsApp Support</div>
            <div style="font-size:20px;font-weight:700;color:#10b981;">\${WHATSAPP_NUM}</div>
          </div>
          <a href="\${WHATSAPP_LINK}" target="_blank" rel="noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#10b981;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 24px;border-radius:14px;box-shadow:0 10px 20px -5px rgba(16,185,129,0.4);">
            Contact Nader Habib on WhatsApp
          </a>
        </div>
      \`;
      document.documentElement.appendChild(overlay);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  }

  checkAccess();
})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white text-slate-900">
        <CartProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  );
}
