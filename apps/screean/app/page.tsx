import Link from 'next/link';
import {
  ENGINE_PACKAGE_NAME,
  FEATURES,
  HEADLINE,
  INSTALL_COMMAND,
  PACKAGE_NAME,
  PACKAGE_TAGLINE,
  PACKAGE_VERSION,
  QUICK_START_CODE,
  SUBHEAD,
} from '@tesyl/content/screean';
import { SiteFooter, SiteNav } from './chrome';
import { HeroCanvas } from './hero-canvas';

// Minimal landing. Deliberately not a port of site/pages/landing.ts (753
// lines: specsheet, pillars, Force Playground, Choreography Reel, CTA) —
// those sections repeat what the storybook already demonstrates. The CSS
// for all of them still ships in globals.css, so reinstating any one of
// them later is markup only.
//
// The hero markup follows the contract style.css expects:
//   .hero-canvas  — the particle band, absolutely positioned behind
//   .hero-frame   — four decorative corner marks
//   .hero-title   — VISUALLY HIDDEN. The canvas paints the visible word;
//                   the h1 exists for the document outline and for
//                   screen readers.
//   .hero-blurb   — the short chartreuse chip
//   .hero-deck    — the muted supporting paragraph
// Putting long copy in .hero-blurb turns the chip into a giant block —
// the deck is where prose belongs.

const LandingPage = () => (
  <>
    <div className="world-behind" aria-hidden="true" />
    <SiteNav />

    <section className="hero" id="hero">
      <HeroCanvas />
      <div className="hero-frame">
        <span className="hero-mark hero-mark-tl">[ SCREEAN ]</span>
        <span className="hero-mark hero-mark-tr">v{PACKAGE_VERSION}</span>
        <span className="hero-mark hero-mark-bl">DOM FIRST / PARTICLES SECOND</span>
        <span className="hero-mark hero-mark-br">MOVE THE CURSOR</span>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{HEADLINE}</h1>
        <p className="hero-blurb">{PACKAGE_TAGLINE}</p>
        <p className="hero-deck">{SUBHEAD}</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/components">
            Browse components →
          </Link>
          <a className="btn btn-ghost" href="#start">
            Quick start
          </a>
        </div>
      </div>
    </section>

    <section className="pillars">
      <div className="section-head">
        <span className="doc-eyebrow">
          {PACKAGE_NAME} · v{PACKAGE_VERSION}
        </span>
        <h2>What it is</h2>
      </div>
      {FEATURES.map((f) => (
        <article className="surface-card pillar" key={f.title}>
          <h3>{f.title}</h3>
          <p>{f.body}</p>
          {f.code ? <code className="story-code">{f.code}</code> : null}
        </article>
      ))}
    </section>

    <section className="cta" id="start">
      <div className="surface-card cta-card">
        <h2>Quick start</h2>
        <p>
          Install the components and the engine they run on — {ENGINE_PACKAGE_NAME}{' '}
          is a peer dependency.
        </p>
        <pre className="story-code">{INSTALL_COMMAND}</pre>
        <pre className="story-code">{QUICK_START_CODE}</pre>
        <Link className="btn btn-primary" href="/components">
          See every component
        </Link>
      </div>
    </section>

    <SiteFooter />
  </>
);

export default LandingPage;
