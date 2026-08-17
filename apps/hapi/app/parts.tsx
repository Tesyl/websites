import Link from 'next/link';
import { PACKAGE_NAME, PACKAGE_REPO, PACKAGE_VERSION } from '@tesyl/content/hapi';

export function Bar({ active }: { active: 'landing' | 'docs' | 'article' | 'mascot' }) {
  return (
    <header className="bar">
      <div className="bar__in">
        <Link href="/" className="tab mono">
          {PACKAGE_NAME}
        </Link>
        <Link href="/" className="tab" data-on={active === 'landing'}>
          overview.tsx
        </Link>
        <Link href="/docs/overview" className="tab" data-on={active === 'docs'}>
          docs.mdx
        </Link>
        <Link href="/article" className="tab" data-on={active === 'article'}>
          design-notes.md
        </Link>
        <Link href="/mascot" className="tab" data-on={active === 'mascot'}>
          mascot.svg
        </Link>
        <span className="bar__sp" />
        <span className="bar__meta mono">
          <span>v{PACKAGE_VERSION}</span>
          <span>TypeScript 5.9</span>
          <a href={PACKAGE_REPO} style={{ color: 'inherit' }}>
            source
          </a>
        </span>
      </div>
    </header>
  );
}

/**
 * The signature element.
 *
 * An identifier you can hover to read its inferred type — the same gesture an
 * editor gives you, because inference is what the library is selling. Focusable
 * as well as hoverable, so it works from the keyboard.
 */
export function Id({
  children,
  signature,
  doc,
}: {
  children: React.ReactNode;
  signature: string;
  doc?: string;
}) {
  return (
    <span className="id" tabIndex={0}>
      {children}
      <span className="qi" role="tooltip">
        <code className="qi__sig mono">{signature}</code>
        {doc ? <span className="qi__doc">{doc}</span> : null}
      </span>
    </span>
  );
}

export function Foot() {
  return (
    <footer className="foot wrap">
      <span className="mono">
        {PACKAGE_NAME} v{PACKAGE_VERSION} · MIT
      </span>
      <span className="mono">
        <a href={PACKAGE_REPO}>github</a> · <Link href="/article">the write-up</Link>
      </span>
    </footer>
  );
}
