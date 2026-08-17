import type { Metadata } from 'next';
import { Archivo, Archivo_Black, DM_Mono } from 'next/font/google';
import { PACKAGE_NAME } from '@tesyl/content/hapi';
import './design.css';

const display = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-d5-display',
  display: 'swap',
});
const sans = Archivo({ subsets: ['latin'], variable: '--font-d5', display: 'swap' });
const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-d5-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${PACKAGE_NAME} — Broadcast`,
  description: 'Direction 05: the type is the diagram.',
};

export default function DesignFiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-design="5" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
