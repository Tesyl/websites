import Link from 'next/link';
import { PACKAGE_NAME, PACKAGE_REPO, PACKAGE_VERSION } from '@tesyl/content/hapi';

export function Head({ active }: { active: 'landing' | 'docs' }) {
  return (
    <header className="head">
      <div className="head__in">
        <Link href="/4" className="head__mark">
          {PACKAGE_NAME} <em className="mono">CAT. v{PACKAGE_VERSION}</em>
        </Link>
        <nav className="head__nav">
          <Link href="/4" data-on={active === 'landing'}>
            Record
          </Link>
          <Link href="/4/docs" data-on={active === 'docs'}>
            Reference
          </Link>
          <a href={PACKAGE_REPO}>Source</a>
        </nav>
      </div>
    </header>
  );
}

/**
 * The signature element.
 *
 * A catalogue record for one cache key. The point it makes is specific and
 * true: before v0.2.0 the resolved path was missing from the key, so two
 * different resources shared one entry. Showing the defective record beside
 * the corrected one is more convincing than describing it.
 */
export function KeyRecord() {
  return (
    <div className="rec">
      <div className="rec__head">
        <span>Catalogue record — query key</span>
        <span>Form 0.2.0</span>
      </div>
      <div className="rec__body">
        <div className="fields">
          <div className="field">
            <span className="field__k">Service</span>
            <span className="field__v mono">users</span>
          </div>
          <div className="field">
            <span className="field__k">Endpoint</span>
            <span className="field__v mono">detail</span>
          </div>
          <div className="field">
            <span className="field__k">Declared path</span>
            <span className="field__v mono">/users/:id</span>
          </div>
          <div className="field">
            <span className="field__k">Bound params</span>
            <span className="field__v mono">{'{ id: "42" }'}</span>
          </div>
          <div className="field">
            <span className="field__k">Resolved</span>
            <span className="field__v mono seg--path">/users/42</span>
          </div>
        </div>

        <p
          className="mono"
          style={{
            fontSize: '0.64rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
            margin: '0 0 0.4rem',
          }}
        >
          Issued key
        </p>
        <div className="keyline mono">
          [<span className="seg">&apos;users&apos;</span>,{' '}
          <span className="seg">&apos;detail&apos;</span>,{' '}
          <span className="seg--path">&apos;/users/42&apos;</span>]
        </div>

        <p
          className="mono"
          style={{
            fontSize: '0.64rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
            margin: '0.9rem 0 0.4rem',
          }}
        >
          Superseded — before 0.2.0
        </p>
        <div className="keyline keyline--bad mono">
          [<span className="seg">&apos;users&apos;</span>,{' '}
          <span className="seg">&apos;detail&apos;</span>]
        </div>

        <p className="note">
          The old form omitted the resolved path, so <b>/users/42</b> and <b>/users/43</b> were
          filed under one entry. Whichever answered last won, and the other component rendered the
          wrong record.
        </p>
        <span className="stamp mono">Withdrawn from use</span>
      </div>
    </div>
  );
}

export function Foot() {
  return (
    <footer className="foot wrap">
      <span className="mono">
        {PACKAGE_NAME} v{PACKAGE_VERSION} — MIT
      </span>
      <span className="mono">
        <a href={PACKAGE_REPO}>github</a> · <Link href="/">other directions</Link>
      </span>
    </footer>
  );
}
