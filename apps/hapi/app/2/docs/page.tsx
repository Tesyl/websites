import { DOCS_SECTIONS } from '@tesyl/content/hapi';
import { Switcher } from '../../_review/Switcher';
import { Bar, Foot } from '../parts';

export default function QuickInfoDocs() {
  return (
    <>
      <Bar active="docs" />

      <div className="wrap docs">
        <nav className="tree" aria-label="Contents">
          <p className="tree__t mono">Contents</p>
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
                <div className="filebar">
                  <div className="filebar__n mono">{s.codeLabel ?? 'example'}</div>
                  <pre className="snip">{s.code}</pre>
                </div>
              ) : null}
            </section>
          ))}
        </article>
      </div>

      <Foot />
      <Switcher current={2} docs />
    </>
  );
}
