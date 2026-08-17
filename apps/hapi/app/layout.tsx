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

export const metadata: Metadata = {
  title: {
    default: `${PACKAGE_NAME} — ${PACKAGE_TAGLINE}`,
    template: `%s — ${PACKAGE_NAME}`,
  },
  description: PACKAGE_TAGLINE,
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
