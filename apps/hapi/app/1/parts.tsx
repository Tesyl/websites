import Link from 'next/link';
import {
  PACKAGE_NAME,
  PACKAGE_REPO,
  PACKAGE_VERSION,
  PIPELINE_PHASES,
} from '@tesyl/content/hapi';

/** Cables are polychrome on purpose — a patchbay is never one colour. */
const CABLES = ['var(--c-orange)', 'var(--c-amber)', 'var(--c-mint)', 'var(--c-violet)'] as const;

export const cableFor = (n: number): string => CABLES[n % CABLES.length] ?? CABLES[0];

export function Rack({ active }: { active: 'landing' | 'docs' }) {
  return (
    <header className="rack">
      <div className="rack__in">
        <Link href="/1" className="rack__mark" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span>{PACKAGE_NAME}</span>
          <span className="rack__ver mono">v{PACKAGE_VERSION}</span>
        </Link>
        <nav className="rack__nav">
          <Link href="/1" style={{ color: active === 'landing' ? 'var(--ink)' : undefined }}>
            Overview
          </Link>
          <Link href="/1/docs" style={{ color: active === 'docs' ? 'var(--ink)' : undefined }}>
            Docs
          </Link>
          <a href={PACKAGE_REPO}>GitHub</a>
        </nav>
      </div>
    </header>
  );
}

/**
 * The signature element.
 *
 * Eight phases on one vertical cable run. A phase with a hook gets a live
 * jack in its cable colour; a phase without one stays dark. The structure
 * encodes the real lifecycle — the numbering is a sequence because the
 * request genuinely passes through these in order.
 */
export function Patchbay() {
  return (
    <div className="bay">
      <div className="bay__head">
        <span className="mono">request pipeline — 8 stages, 8 patch points</span>
        <span className="bay__leds" aria-hidden="true">
          <span className="led" style={{ background: 'var(--c-orange)' }} />
          <span className="led" style={{ background: 'var(--c-amber)' }} />
          <span className="led" style={{ background: 'var(--c-mint)' }} />
        </span>
      </div>
      <div className="bay__rows">
        {PIPELINE_PHASES.map((phase, i) => (
          <div
            key={phase.index}
            className={`row${phase.hook ? ' row--hooked' : ''}`}
            style={{ ['--cable' as string]: cableFor(i) }}
          >
            <span className="row__idx mono">{String(phase.index).padStart(2, '0')}</span>
            <span className="jack" aria-hidden="true" />
            <div>
              <p className="row__name">{phase.name}</p>
              <p className="row__desc">{phase.summary}</p>
            </div>
            {phase.hook ? (
              <code className="row__hook mono">{phase.hook}</code>
            ) : (
              <span className="row__hook mono" style={{ borderColor: 'var(--rule)', color: 'var(--ink-faint)', background: 'none' }}>
                no patch
              </span>
            )}
          </div>
        ))}
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
