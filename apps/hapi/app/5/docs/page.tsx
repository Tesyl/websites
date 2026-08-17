import { DOCS_SECTIONS } from '@tesyl/content/hapi';
import { Switcher } from '../../_review/Switcher';
import { Foot, Top } from '../parts';

export default function BroadcastDocs() {
  return (
    <>
      <Top active="docs" />

      <div className="wrap docs">
        <nav className="nav" aria-label="Docs sections">
          <p className="nav__t">Contents</p>
          {DOCS_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>

        <article className="doc">
          {DOCS_SECTIONS.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="display">{s.title}</h2>
              <p className="doc__b mono">{s.blurb}</p>
              {s.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
              {s.code ? (
                <div className="doc__code">
                  <p>{s.codeLabel ?? 'example'}</p>
                  <pre className="snip">{s.code}</pre>
                </div>
              ) : null}
            </section>
          ))}
        </article>
      </div>

      <Foot />
      <Switcher current={5} docs />
    </>
  );
}
