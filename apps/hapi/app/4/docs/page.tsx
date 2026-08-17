import { DOCS_SECTIONS } from '@tesyl/content/hapi';
import { Switcher } from '../../_review/Switcher';
import { Foot, Head } from '../parts';

export default function LedgerDocs() {
  return (
    <>
      <Head active="docs" />

      <div className="wrap docs">
        <nav className="toc" aria-label="Reference sections">
          <p className="toc__t">Sections</p>
          {DOCS_SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          ))}
        </nav>

        <article className="doc">
          {DOCS_SECTIONS.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.title}</h2>
              <p className="doc__b mono">{s.blurb}</p>
              {s.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
              {s.code ? (
                <div className="doc__code">
                  <p className="mono">{s.codeLabel ?? 'example'}</p>
                  <pre className="snip">{s.code}</pre>
                </div>
              ) : null}
            </section>
          ))}
        </article>
      </div>

      <Foot />
      <Switcher current={4} docs />
    </>
  );
}
