import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { PACKAGE_NAME } from '@tesyl/content/hapi';
import './design.css';

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-d2',
  display: 'swap',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-d2-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${PACKAGE_NAME} — Quick Info`,
  description: 'Direction 02: the page as an editor.',
};

export default function DesignTwoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-design="2" className={`${sans.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
