import Link from 'next/link';
import { DESIGN_ROUTES } from '@tesyl/content/hapi';

/**
 * A review tool, not part of any design.
 *
 * It sits above every design page so you can flip between directions without
 * going back to the index. It is deliberately neutral — it must not read as
 * belonging to whichever design is underneath it.
 */
export function Switcher({ current, docs = false }: { current: number; docs?: boolean }) {
  return (
    <nav className="switcher" aria-label="Design directions">
      <span className="switcher__label">design</span>
      {DESIGN_ROUTES.map((id) => (
        <Link
          key={id}
          href={docs ? `/${id}/docs` : `/${id}`}
          data-active={id === current}
          aria-current={id === current ? 'page' : undefined}
        >
          {id}
        </Link>
      ))}
      <span className="switcher__sep" />
      <Link href={docs ? `/${current}` : `/${current}/docs`} style={{ width: 'auto', padding: '0 0.7rem' }}>
        {docs ? 'landing' : 'docs'}
      </Link>
      <Link href="/" style={{ width: 'auto', padding: '0 0.7rem' }}>
        index
      </Link>
    </nav>
  );
}
