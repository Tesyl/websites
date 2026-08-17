import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  DOC_ORDER,
  getDocGroupTitle,
  getDocHeadings,
  getDocNeighbours,
  getDocPage,
  headingId,
} from '@tesyl/content/docs';
import { DocBlocks } from '../DocBlocks';

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return DOC_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.lede };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();

  const headings = getDocHeadings(page);
  const { previous, next } = getDocNeighbours(slug);
  const group = getDocGroupTitle(slug);

  return (
    <>
      <article className="dl__main">
        {group ? <p className="dl__crumb mono">{group}</p> : null}
        <h1 className="dl__h1">{page.title}</h1>
        <p className="dl__lede">{page.lede}</p>

        <DocBlocks blocks={page.blocks} />

        <nav className="dl__pager" aria-label="Nearby pages">
          {previous ? (
            <Link href={`/docs/${previous.slug}`} className="dl__pg" data-dir="prev">
              <span className="mono">← previous</span>
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/docs/${next.slug}`} className="dl__pg" data-dir="next">
              <span className="mono">next →</span>
              <strong>{next.title}</strong>
            </Link>
          ) : null}
        </nav>
      </article>

      <aside className="dl__rail" aria-label="On this page">
        {headings.length > 0 ? (
          <>
            <p className="dl__railt mono">On this page</p>
            {headings.map((h) => (
              <a key={h} href={`#${headingId(h)}`}>
                {h}
              </a>
            ))}
          </>
        ) : null}
      </aside>
    </>
  );
}
