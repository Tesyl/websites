/**
 * The hapi mark.
 *
 * A highlighter stroke curved into a smile, with two dots above it. It reuses
 * the one element the brand already owns — the marker behind "happy life!" in
 * the headline — so the logo and the typography say the same thing.
 *
 * Drawn on a 100×100 grid with no fixed background, so it can sit inline in a
 * header. The favicon and share-card variants add their own field, because a
 * transparent mark with dark dots disappears on a dark browser tab.
 */

export const MARK_YELLOW = '#ffe066';
export const MARK_INK = '#12141c';
export const MARK_PAPER = '#f5f6fa';

type MarkProps = {
  readonly size?: number;
  /** Light dots instead of dark ones, for placing on a dark field. */
  readonly onDark?: boolean;
  readonly title?: string;
};

export function Mark({ size = 28, onDark = false, title = 'hapi' }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      focusable="false"
    >
      <path
        d="M16 50 Q50 88 84 50"
        stroke={MARK_YELLOW}
        strokeWidth="19"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="34" cy="30" r="6" fill={onDark ? MARK_PAPER : MARK_INK} />
      <circle cx="66" cy="30" r="6" fill={onDark ? MARK_PAPER : MARK_INK} />
    </svg>
  );
}

/**
 * The same mark as a standalone SVG document string.
 *
 * Share cards are rendered by Satori, which does not accept React SVG
 * components — it takes an image source. Keeping one string here means the
 * card and the header cannot drift apart.
 */
export const markSvg = ({
  field,
  dots,
}: {
  field: string;
  dots: string;
}): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="22" fill="${field}"/>
  <path d="M16 52 Q50 90 84 52" stroke="${MARK_YELLOW}" stroke-width="19" stroke-linecap="round" fill="none"/>
  <circle cx="34" cy="32" r="6" fill="${dots}"/>
  <circle cx="66" cy="32" r="6" fill="${dots}"/>
</svg>`;

/** Data URI form, for anywhere an `<img src>` is required. */
export const markDataUri = (opts: { field: string; dots: string }): string =>
  `data:image/svg+xml;base64,${Buffer.from(markSvg(opts)).toString('base64')}`;
