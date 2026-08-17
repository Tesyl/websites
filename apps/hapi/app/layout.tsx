import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { PACKAGE_NAME, PACKAGE_TAGLINE } from '@tesyl/content/hapi';
import './globals.css';
import './site.css';

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

/**
 * Absolute URLs are required for share cards — a relative og:image is ignored
 * by every scraper. Set SITE_URL at deploy time; the fallback keeps local
 * builds working.
 */
const SITE_URL = process.env['SITE_URL'] ?? 'http://localhost:3100';

const TITLE = `${PACKAGE_NAME} — ${PACKAGE_TAGLINE}`;
const DESCRIPTION =
  'Declare an endpoint once. Every way of calling it — hook, promise, mutation, infinite query — comes back typed, validated, and cancellable.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s — ${PACKAGE_NAME}` },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: PACKAGE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
  },
  twitter: {
    // Messages and Slack both read this; summary_large_image is what makes the
    // card render wide instead of as a thumbnail beside the text.
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <div className="site">{children}</div>
      </body>
    </html>
  );
}
