'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, PACKAGE_REPO } from '@tesyl/content/screean';

// Shared chrome — nav and footer. Ported from site/layout.ts, same class
// names so style.css applies unchanged. Two differences from the Vite site:
//
//   • The Experiments and Lab links are gone, because those routes are not
//     part of this site yet. They live in NAV_LINKS, so re-adding them is
//     a content edit, not a markup edit.
//   • The GitHub link pointed at a bare `https://github.com/` placeholder.
//     It now resolves to the real repository.
//
// Section anchors (the landing page's `01 PRIMITIVES` strip) are not
// ported — the minimal landing has no anchored sections to point at.

// `/docs` must read as active on `/docs/overview` too, so non-root links
// match on prefix. `/` would prefix-match everything, so it stays exact.
const isActive = (pathname: string, href: string): boolean =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export const SiteNav = (): React.JSX.Element => {
  const pathname = usePathname();
  return (
    <nav className="site-nav">
      <Link className="site-brand" href="/" aria-label="screean home">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-word">screean</span>
      </Link>
      <div className="site-nav-spacer" />
      <div className="site-nav-links">
        {NAV_LINKS.map((l) =>
          l.external ? (
            <a key={l.href} href={l.href} target="_blank" rel="noopener">
              {l.label}
            </a>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(pathname, l.href) ? 'active' : undefined}
            >
              {l.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
};

// The year is read at render time. This is a client component, so it
// renders on the server first — a January 1st boundary could briefly
// disagree with the client. Harmless for a footer, and it keeps the
// markup identical to the original.
export const SiteFooter = (): React.JSX.Element => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>screean</span>
      </div>
      <div className="footer-meta">
        <span>Engine for living UI · {new Date().getFullYear()}</span>
        <span className="dot">·</span>
        <Link href="/components">Components</Link>
        <span className="dot">·</span>
        <a href={PACKAGE_REPO} target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);
