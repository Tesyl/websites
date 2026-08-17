import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * IBM Plex Sans, loaded from disk for the share cards.
 *
 * Satori has no access to the browser's fonts, so a card renders in a default
 * sans unless the bytes are handed to it. Reading from `@fontsource` rather
 * than fetching from Google keeps the build offline and deterministic — a
 * build-time network call is a build that can fail for reasons unrelated to
 * the code.
 *
 * The file is located with `fs`, not `require.resolve`. Resolving a `.woff`
 * through the module system makes Turbopack try to bundle it as a module and
 * fail with "Unknown module type", because a font is an asset rather than
 * code. Two candidates cover both pnpm layouts: hoisted to the workspace root,
 * or installed inside the app.
 */
const FONT_DIRS: ReadonlyArray<string> = [
  join(process.cwd(), 'node_modules/@fontsource/ibm-plex-sans/files'),
  join(process.cwd(), '../../node_modules/@fontsource/ibm-plex-sans/files'),
];

const findFontDir = (): string => {
  const dir = FONT_DIRS.find((d) => existsSync(d));
  if (!dir) {
    throw new Error(
      'IBM Plex Sans not found. Run `pnpm install` — @fontsource/ibm-plex-sans is a devDependency of this app.',
    );
  }
  return dir;
};

/** Satori reads ttf, otf, and woff. It cannot read woff2. */
const fontFile = (weight: 400 | 600): Buffer =>
  readFileSync(join(findFontDir(), `ibm-plex-sans-latin-${weight}-normal.woff`));

export type OgFont = {
  readonly name: string;
  readonly data: Buffer;
  readonly weight: 400 | 600;
  readonly style: 'normal';
};

/**
 * The two weights the cards use: 600 for the wordmark and the slogan, 400 for
 * the supporting line. Loading more would only add bytes to every render.
 */
export const ogFonts = (): ReadonlyArray<OgFont> => [
  { name: 'IBM Plex Sans', data: fontFile(400), weight: 400, style: 'normal' },
  { name: 'IBM Plex Sans', data: fontFile(600), weight: 600, style: 'normal' },
];

/** Applied on the root element of each card so every child inherits it. */
export const OG_FONT_FAMILY = 'IBM Plex Sans';
