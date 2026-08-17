import Link from 'next/link';
import {
  ERROR_TAGS,
  FEATURES,
  INSTALL_COMMAND,
  PACKAGE_REPO,
  SUBHEAD,
} from '@tesyl/content/hapi';
import { Switcher } from '../_review/Switcher';
import { Foot, Patchbay, Rack, cableFor } from './parts';

export default function PatchbayLanding() {
  return (
    <>
      <Rack active="landing" />

      <main>
        <section className="wrap hero">
          <div>
            <p className="hero__eyebrow mono">typed pipeline over tanstack query</p>
            <h1 className="hero__h1">
              Patch into <em>any stage</em> of a request.
            </h1>
            <p className="hero__lede">{SUBHEAD}</p>
            <div className="hero__cta">
              <Link href="/1/docs" className="btn btn--primary">
                Read the docs
              </Link>
              <a href={PACKAGE_REPO} className="btn btn--ghost">
                Source
              </a>
            </div>
            <div className="install mono">
              <span>$</span>
              <span>{INSTALL_COMMAND}</span>
            </div>
          </div>
          <Patchbay />
        </section>

        <section className="wrap sec">
          <div className="sec__head">
            <span className="sec__kicker mono">01 — what you get</span>
            <h2 className="sec__h2">Declared once. Available six ways.</h2>
            <p className="sec__sub">
              The declaration is the single source of truth. Every call shape, and every type at
              every call site, is derived from it.
            </p>
          </div>
          <div className="feats">
            {FEATURES.map((f) => (
              <article key={f.title} className="feat">
                <h3 className="feat__t">{f.title}</h3>
                <p className="feat__b">{f.body}</p>
                {f.code ? <pre className="code">{f.code}</pre> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="wrap sec">
          <div className="sec__head">
            <span className="sec__kicker mono">02 — failure modes</span>
            <h2 className="sec__h2">Eight tags. Nothing escapes untagged.</h2>
            <p className="sec__sub">
              A hook that throws a plain Error is normalised rather than leaking through, so a
              switch on the tag is exhaustive and stays that way.
            </p>
          </div>
          <div className="tags">
            {ERROR_TAGS.map((t, i) => (
              <article
                key={t.tag}
                className="tag"
                style={{ ['--cable' as string]: cableFor(i) }}
              >
                <p className="tag__n mono">{t.tag}</p>
                <p className="tag__t">{t.title}</p>
                <p className="tag__c">{t.cause}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Foot />
      <Switcher current={1} />
    </>
  );
}
