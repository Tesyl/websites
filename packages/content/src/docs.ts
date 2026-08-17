import type { DocGroup, DocPage } from './docs-types';
import { START_PAGES } from './docs-start';
import { GUIDE_PAGES } from './docs-guides';
import { API_PAGES } from './docs-api';

export type { DocBlock, DocGroup, DocPage } from './docs-types';

/**
 * The sidebar.
 *
 * Three tiers, in the order a reader needs them: orient, learn, look up.
 * `important-defaults` leads the guides on purpose — a default you discover
 * during an incident is a bad default.
 */
export const DOC_GROUPS: ReadonlyArray<DocGroup> = [
  {
    title: 'Getting started',
    slugs: ['overview', 'installation', 'quick-start', 'typescript'],
  },
  {
    title: 'Guides & concepts',
    slugs: [
      'important-defaults',
      'endpoints',
      'calling',
      'validation',
      'errors',
      'cancellation',
      'cache-keys',
      'hooks',
      'headers',
    ],
  },
  {
    title: 'API reference',
    slugs: ['create-api', 'create-endpoint', 'endpoint', 'create-fetcher', 'error-guards'],
  },
];

const ALL_PAGES: ReadonlyArray<DocPage> = [...START_PAGES, ...GUIDE_PAGES, ...API_PAGES];

const BY_SLUG: ReadonlyMap<string, DocPage> = new Map(ALL_PAGES.map((p) => [p.slug, p]));

/** Reading order, flattened from the sidebar — this is what previous/next follow. */
export const DOC_ORDER: ReadonlyArray<string> = DOC_GROUPS.flatMap((g) => g.slugs);

export const getDocPage = (slug: string): DocPage | undefined => BY_SLUG.get(slug);

export const getDocPages = (): ReadonlyArray<DocPage> => ALL_PAGES;

export type DocNeighbours = {
  readonly previous: DocPage | undefined;
  readonly next: DocPage | undefined;
};

/** The pages either side of this one in reading order. */
export const getDocNeighbours = (slug: string): DocNeighbours => {
  const i = DOC_ORDER.indexOf(slug);
  if (i === -1) return { previous: undefined, next: undefined };
  const at = (n: number): DocPage | undefined => {
    const s = DOC_ORDER[n];
    return s === undefined ? undefined : BY_SLUG.get(s);
  };
  return { previous: at(i - 1), next: at(i + 1) };
};

/** Which group a slug belongs to, for the breadcrumb. */
export const getDocGroupTitle = (slug: string): string | undefined =>
  DOC_GROUPS.find((g) => g.slugs.includes(slug))?.title;

/** Headings a page will render, for the "on this page" rail. */
export const getDocHeadings = (page: DocPage): ReadonlyArray<string> =>
  page.blocks.filter((b) => b.kind === 'h3').map((b) => (b as { text: string }).text);

/** Stable id for a heading, shared by the rail and the heading itself. */
export const headingId = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
