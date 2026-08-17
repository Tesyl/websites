import Link from 'next/link';
import { DESIGNS, PACKAGE_NAME, PACKAGE_VERSION } from '@tesyl/content/hapi';

export default function ChooserPage() {
  return (
    <main className="shell">
      <p className="shell__eyebrow">
        {PACKAGE_NAME} v{PACKAGE_VERSION} — design review
      </p>
      <h1 className="shell__title">Five directions for the same library.</h1>
      <p className="shell__lede">
        Every design renders identical content from one shared module, so what changes between
        them is the point of view, not the copy. Each has a landing page and a real docs page —
        an aesthetic that works in a hero does not always survive a sidebar and a code block.
      </p>

      <div className="shell__grid">
        {DESIGNS.map((design) => (
          <article key={design.id} className="card">
            <span className="card__num">DIRECTION {String(design.id).padStart(2, '0')}</span>
            <h2 className="card__name">{design.name}</h2>
            <div className="card__swatches" aria-hidden="true">
              {design.palette.map((hex) => (
                <span key={hex} className="card__swatch" style={{ background: hex }} />
              ))}
            </div>
            <p className="card__concept">{design.concept}</p>
            <p className="card__sig">
              <strong style={{ color: '#c3cad9', fontWeight: 500 }}>Signature. </strong>
              {design.signature}
            </p>
            <div className="card__links">
              <Link href={`/${design.id}`}>landing →</Link>
              <Link href={`/${design.id}/docs`}>docs →</Link>
            </div>
          </article>
        ))}
      </div>

      <p className="shell__foot">
        Content is shared from @tesyl/content. Designs share no styles — each is scoped under its
        own data-design attribute.
      </p>
    </main>
  );
}
