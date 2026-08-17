import type { Metadata } from 'next';
import { Chivo, JetBrains_Mono } from 'next/font/google';
import { PACKAGE_NAME, PACKAGE_TAGLINE } from '@tesyl/content/hapi';
import './globals.css';

const shellSans = Chivo({
  subsets: ['latin'],
  variable: '--font-shell',
  display: 'swap',
});

const shellMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-shell-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${PACKAGE_NAME} — design directions`,
  description: PACKAGE_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${shellSans.variable} ${shellMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
