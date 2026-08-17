import type { Metadata } from 'next';
import {
  HEADLINE,
  PACKAGE_NAME,
  PACKAGE_TAGLINE,
  SUBHEAD,
} from '@tesyl/content/screean';
import { SITE_URL } from './constant';
import { ThemeBoot } from './theme-boot';
import './globals.css';

// The Acid tokens are also written statically in globals.css so the first
// server-rendered paint is correct; ThemeBoot re-applies them on mount so
// the runtime source of truth stays lib/themes.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `screean — ${PACKAGE_TAGLINE}`,
    template: '%s — screean',
  },
  description: SUBHEAD,
  openGraph: {
    title: HEADLINE,
    description: SUBHEAD,
    siteName: PACKAGE_NAME,
    type: 'website',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    {/* suppressHydrationWarning covers attributes browser extensions inject
        onto <body> before React hydrates (ColorZilla's cz-shortcut-listen,
        Grammarly's data-gr-*, and so on). It suppresses attribute mismatches
        on this element only — children still report normally. */}
    <body data-theme="acid" data-theme-id="2" suppressHydrationWarning>
      <ThemeBoot />
      <div id="app">{children}</div>
    </body>
  </html>
);

export default RootLayout;
