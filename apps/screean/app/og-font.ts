import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * JetBrains Mono, loaded from disk for the share cards.
 *
 * Satori has no access to the browser's fonts, so a card renders in a default
 * sans unless the bytes are handed to it. The site's stack names JetBrains
 * Mono first, so that is what the cards use — a share card set in a different
 * face than the page it links to reads as somebody else's link.
 *
 * The bytes live in `assets/fonts`, committed, rather than being read out of
 * `node_modules`. Resolving a `.woff` through the module system makes
 * Turbopack try to bundle it as a module and fail with "Unknown module type",
 * because a font is an asset rather than code; and reading it from
 * `node_modules` by path means guessing the pnpm layout. A committed file has
 * neither problem. See `assets/fonts/README.md` for provenance and licence.
 *
 * NOTE: the sibling hapi app solves this by keeping `@fontsource/ibm-plex-sans`
 * as a devDependency and probing two candidate `node_modules` paths. Same
 * problem, different trade: no committed binaries there, no dependency on the
 * install layout here. Worth unifying if a third site appears.
 */
const FONT_DIR = join(process.cwd(), 'assets/fonts');

/** Satori reads ttf, otf, and woff. It cannot read woff2. */
const fontFile = (weight: 400 | 700): Buffer =>
  readFileSync(join(FONT_DIR, `jetbrains-mono-latin-${weight}-normal.woff`));

export const OG_FONT_FAMILY = 'JetBrains Mono';

export type OgFont = {
  readonly name: string;
  readonly data: Buffer;
  readonly weight: 400 | 700;
  readonly style: 'normal';
};

/**
 * The two weights the cards use: 700 for the wordmark and the headline, 400
 * for the supporting copy. Loading more would only add bytes to every render.
 */
export const ogFonts = (): ReadonlyArray<OgFont> => [
  { name: OG_FONT_FAMILY, data: fontFile(400), weight: 400, style: 'normal' },
  { name: OG_FONT_FAMILY, data: fontFile(700), weight: 700, style: 'normal' },
];
