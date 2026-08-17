import { DOCS_SECTIONS } from '@tesyl/content/hapi';
import { Switcher } from '../../_review/Switcher';
import { Foot, Plate } from '../parts';

export default function FieldGuideDocs() {
  return (
    <>
      <Plate active="docs" />

      <div className="wrap docs">
        <nav className="index" aria-label="Contents">
          <p className="index__t">Handbook</p>
          {DOCS_SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} data-n={`§${i + 1}`}>
              {s.title}
            </a>
          ))}
        </nav>

        <article className="doc">
          {DOCS_SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id}>
              <h2 className="display">
                <span className="mono" style={{ fontSize: '0.7em', color: 'var(--moss)' }}>
                  §{i + 1}{' '}
                </span>
                {s.title}
              </h2>
              <p className="doc__b">{s.blurb}</p>
              {s.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
              {s.code ? (
                <figure className="fig">
                  <figcaption>{s.codeLabel ?? 'example'}</figcaption>
                  <pre className="snip">{s.code}</pre>
                </figure>
              ) : null}
            </section>
          ))}
        </article>
      </div>

      <Foot />
      <Switcher current={3} docs />
    </>
  );
}
