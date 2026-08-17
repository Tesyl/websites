import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import { PACKAGE_NAME } from '@tesyl/content/hapi';
import './design.css';

const sans = Space_Grotesk({ subsets: ['latin'], variable: '--font-d4', display: 'swap' });
const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-d4-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${PACKAGE_NAME} — Ledger`,
  description: 'Direction 04: the cache key as an archival record.',
};

export default function DesignFourLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-design="4" className={`${sans.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
