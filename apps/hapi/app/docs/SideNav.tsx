'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOC_GROUPS, getDocPage } from '@tesyl/content/docs';

/**
 * Client-side only so the current page can be marked.
 *
 * Knowing where you are in a long sidebar is the difference between a nav and
 * a list of links.
 */
export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="dl__side" aria-label="Documentation">
      {DOC_GROUPS.map((group) => (
        <div key={group.title} className="dl__group">
          <p className="dl__gt">{group.title}</p>
          {group.slugs.map((slug) => {
            const page = getDocPage(slug);
            if (!page) return null;
            const href = `/docs/${slug}`;
            const current = pathname === href;
            return (
              <Link
                key={slug}
                href={href}
                className="dl__link"
                data-current={current}
                aria-current={current ? 'page' : undefined}
              >
                {page.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
