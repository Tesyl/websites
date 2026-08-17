import type { Metadata } from 'next';
import { Chivo, JetBrains_Mono } from 'next/font/google';
import { PACKAGE_NAME } from '@tesyl/content/hapi';
import './design.css';

const sans = Chivo({ subsets: ['latin'], variable: '--font-d1', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-d1-mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${PACKAGE_NAME} — Patchbay`,
  description: 'Direction 01: the request lifecycle as signal flow.',
};

export default function DesignOneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-design="1" className={`${sans.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
