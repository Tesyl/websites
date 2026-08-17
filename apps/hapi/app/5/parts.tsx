import Link from 'next/link';
import { ERROR_TAGS, PACKAGE_NAME, PACKAGE_REPO, PACKAGE_VERSION } from '@tesyl/content/hapi';

export function Top({ active }: { active: 'landing' | 'docs' }) {
  return (
    <header className="top">
      <div className="top__in">
        <Link href="/5" style={{ fontWeight: 700 }}>
          {PACKAGE_NAME}
        </Link>
        <nav className="top__nav">
          <Link href="/5" data-on={active === 'landing'}>
            Index
          </Link>
          <Link href="/5/docs" data-on={active === 'docs'}>
            Docs
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
 * The eight tags set as one oversized switch statement. The claim the library
 * makes — that the union is closed — is easiest to believe when you can read
 * every branch at once, at a size that makes counting them unavoidable.
 */
export function SwitchBlock() {
  return (
    <section className="wrap switchblock">
      <p className="switchblock__t mono">Exhaustive. All eight branches, no default needed.</p>
      <div className="sw">
        <div className="sw__line">
          <span className="sw__kw">switch</span>
          <span>
            (err.<span className="sw__tag">tag</span>) {'{'}
          </span>
        </div>
        {ERROR_TAGS.map((t) => (
          <div className="sw__line" key={t.tag}>
            <span className="sw__kw">case</span>
            <span>
              <span className="sw__tag">&apos;{t.tag}&apos;</span>:
              <span className="sw__hint">{t.recovery}</span>
            </span>
          </div>
        ))}
        <div className="sw__line">
          <span />
          <span>{'}'}</span>
        </div>
      </div>
    </section>
  );
}

export function Foot() {
  return (
    <footer className="foot">
      <div className="foot__in">
        <span>
          {PACKAGE_NAME} v{PACKAGE_VERSION} — MIT
        </span>
        <span>
          <a href={PACKAGE_REPO}>Github</a> · <Link href="/">Other directions</Link>
        </span>
      </div>
    </footer>
  );
}
