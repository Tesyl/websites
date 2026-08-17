/**
 * The content model for documentation pages.
 *
 * Pages are data, not JSX, so the renderer stays in the app and the writing
 * stays here. Every block kind exists because a real page needed it — resist
 * adding kinds speculatively.
 */

export type DocBlock =
  /** A paragraph. Inline `code` spans are written with backticks. */
  | { readonly kind: 'p'; readonly text: string }
  /** A subheading inside a page. */
  | { readonly kind: 'h3'; readonly text: string }
  /** A code sample. `label` names the file or language. */
  | { readonly kind: 'code'; readonly label?: string; readonly code: string }
  /** A bulleted list. */
  | { readonly kind: 'list'; readonly items: ReadonlyArray<string> }
  /** A callout for something surprising or easy to get wrong. */
  | { readonly kind: 'note'; readonly tone: 'info' | 'warn'; readonly title: string; readonly text: string }
  /** A comparison or lookup table. */
  | { readonly kind: 'table'; readonly head: ReadonlyArray<string>; readonly rows: ReadonlyArray<ReadonlyArray<string>> }
  /**
   * One entry in an options or returns list.
   *
   * This is the shape every good API reference converges on: name and type,
   * whether it is required, what it defaults to, then the behaviour.
   */
  | {
      readonly kind: 'api';
      readonly name: string;
      readonly type: string;
      readonly required?: boolean;
      readonly defaultsTo?: string;
      readonly body: ReadonlyArray<string>;
    };

export type DocPage = {
  readonly slug: string;
  readonly title: string;
  /** One line under the title. Says what the page is for, not what it contains. */
  readonly lede: string;
  readonly blocks: ReadonlyArray<DocBlock>;
};

export type DocGroup = {
  readonly title: string;
  readonly slugs: ReadonlyArray<string>;
};
