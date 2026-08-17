import { DOCS_SECTIONS } from '@tesyl/content/hapi';
import { Switcher } from '../../_review/Switcher';
import { Foot, Rack } from '../parts';

export default function PatchbayDocs() {
  return (
    <>
      <Rack active="docs" />

      <div className="wrap docs">
        <nav className="side" aria-label="On this page">
          <p className="side__t mono">On this page</p>
          {DOCS_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>

        <article className="doc">
          {DOCS_SECTIONS.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.title}</h2>
              <p className="doc__blurb mono">{s.blurb}</p>
              {s.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
              {s.code ? (
                <div className="codewrap">
                  {s.codeLabel ? (
                    <div className="codewrap__label mono">{s.codeLabel}</div>
                  ) : null}
                  <pre className="code">{s.code}</pre>
                </div>
              ) : null}
            </section>
          ))}
        </article>
      </div>

      <Foot />
      <Switcher current={1} docs />
    </>
  );
}
