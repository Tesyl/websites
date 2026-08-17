import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  SCREEAN_DOC_GROUPS,
  SCREEAN_DOC_ORDER,
  getScreeanDocGroupTitle,
  getScreeanDocHeadings,
  getScreeanDocNeighbours,
  getScreeanDocPage,
  getScreeanDocPages,
  headingId,
} from '@tesyl/content/screean-docs';
import { SiteFooter, SiteNav } from '../../chrome';
import { DocBlocks } from '../blocks';

// Every page is known at build time, so the whole docs tree prerenders as
// static HTML — samples included, readable without JavaScript.
export const generateStaticParams = () =>
  getScreeanDocPages().map((p) => ({ slug: p.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const page = getScreeanDocPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.lede };
};

const pad2 = (n: number): string => String(n).padStart(2, '0');

const DocPageRoute = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const page = getScreeanDocPage(slug);
  if (!page) notFound();

  const headings = getScreeanDocHeadings(page);
  const { previous, next } = getScreeanDocNeighbours(slug);
  const group = getScreeanDocGroupTitle(slug);
  const index = SCREEAN_DOC_ORDER.indexOf(slug);

  return (
    <>
      <div className="world-behind components-bg" aria-hidden="true" />
      <SiteNav />

      <section className="doc-head">
        <span className="doc-eyebrow">{group ?? 'docs'}</span>
        <h1>{page.title}</h1>
        <p>{page.lede}</p>
      </section>

      <section className="doc-main">
        <aside className="doc-sidebar" aria-label="Documentation">
          <div className="doc-nav-wrap">
            {SCREEAN_DOC_GROUPS.map((g) => (
              <div className="doc-nav-group" key={g.title}>
                <span className="doc-nav-group-title">{g.title}</span>
                <ol className="doc-nav">
                  {g.slugs.map((s) => {
                    const p = getScreeanDocPage(s);
                    if (!p) return null;
                    const active = s === slug;
                    return (
                      <li
                        key={s}
                        className={active ? 'doc-nav-item active' : 'doc-nav-item'}
                      >
                        <Link
                          className="doc-nav-btn"
                          href={`/docs/${s}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <span className="doc-nav-num">
                            {pad2(SCREEAN_DOC_ORDER.indexOf(s) + 1)}
                          </span>
                          <span className="doc-nav-name">{p.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </aside>

        <div className="doc-content">
          <header className="doc-group-head">
            <span className="doc-group-num">
              {pad2(index + 1)} / {pad2(SCREEAN_DOC_ORDER.length)}
            </span>
            <h2>{page.title}</h2>
          </header>

          {headings.length > 1 ? (
            <nav className="doc-rail" aria-label="On this page">
              <span className="doc-rail-title">On this page</span>
              <ul>
                {headings.map((h) => (
                  <li key={h}>
                    <a href={`#${headingId(h)}`}>{h}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <article className="doc-article">
            <DocBlocks blocks={page.blocks} />
          </article>

          <nav className="doc-pager" aria-label="Pagination">
            {previous ? (
              <Link className="doc-pager-link" href={`/docs/${previous.slug}`}>
                <span className="doc-pager-dir">← Previous</span>
                <span className="doc-pager-title">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="doc-pager-link doc-pager-next" href={`/docs/${next.slug}`}>
                <span className="doc-pager-dir">Next →</span>
                <span className="doc-pager-title">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>

      <SiteFooter />
    </>
  );
};

export default DocPageRoute;
