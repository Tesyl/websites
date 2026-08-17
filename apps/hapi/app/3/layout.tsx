import type { Metadata } from 'next';
import { Newsreader, Karla, Courier_Prime } from 'next/font/google';
import { PACKAGE_NAME } from '@tesyl/content/hapi';
import './design.css';

const display = Newsreader({ subsets: ['latin'], variable: '--font-d3', display: 'swap' });
const body = Karla({ subsets: ['latin'], variable: '--font-d3-body', display: 'swap' });
const mono = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-d3-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${PACKAGE_NAME} — Field Guide`,
  description: 'Direction 03: an identification key for failure.',
};

export default function DesignThreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-design="3" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
