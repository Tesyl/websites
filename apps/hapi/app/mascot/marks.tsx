/**
 * Mascot candidates.
 *
 * Each is a pure function of size, drawn on a 100×100 viewBox so it scales
 * without a second asset. The constraint that matters is the favicon: a mark
 * that stops reading at 16px is not a mark, it is an illustration.
 */

type MarkProps = { readonly size?: number; readonly onDark?: boolean };

const INK = '#12141c';
const YELLOW = '#ffe066';
const DEEP = '#f59f00';

/**
 * 01 — Twoslash
 *
 * The eyes are the `^` of a twoslash type query — the marker already used in
 * every code sample on this site to point at an inferred type. It says
 * "inference" and "smile" with the same two strokes.
 */
export function Twoslash({ size = 96, onDark = false }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="hapi">
      <circle cx="50" cy="50" r="46" fill={YELLOW} />
      <g
        stroke={onDark ? INK : INK}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M26 44 L34 34 L42 44" />
        <path d="M58 44 L66 34 L74 44" />
        <path d="M32 62 Q50 78 68 62" />
      </g>
    </svg>
  );
}

/**
 * 02 — Marker — CHOSEN. Lives in app/Mark.tsx now; re-exported so this sheet
 * still records what was compared.
 */
import { Mark as Marker } from '../Mark';

export { Marker };

/**
 * 03 — Chip
 *
 * A rounded square, so it survives being an app icon, a favicon, and an
 * avatar. The mouth is cut out of the field rather than drawn on it, which
 * holds up better when the mark gets small.
 */
export function Chip({ size = 96, onDark = false }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="hapi">
      <rect x="4" y="4" width="92" height="92" rx="24" fill={onDark ? YELLOW : INK} />
      <g fill={onDark ? INK : YELLOW}>
        <circle cx="35" cy="40" r="7" />
        <circle cx="65" cy="40" r="7" />
      </g>
      <path
        d="M30 60 Q50 78 70 60"
        stroke={onDark ? INK : YELLOW}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * 04 — Optional
 *
 * The left eye is a `?`. In this library a `?` is what makes a thing optional,
 * and the joke lands for exactly the audience being addressed. Riskier: it is
 * asymmetric, and asymmetry is the first thing to break at small sizes.
 */
export function Optional({ size = 96, onDark = false }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="hapi">
      <circle cx="50" cy="50" r="46" fill={onDark ? INK : YELLOW} />
      <g fill={onDark ? YELLOW : INK}>
        <text
          x="34"
          y="50"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="34"
          fontWeight="500"
        >
          ?
        </text>
        <circle cx="66" cy="40" r="6" />
      </g>
      <path
        d="M32 62 Q50 77 68 62"
        stroke={onDark ? YELLOW : INK}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * 05 — Return
 *
 * The mouth is an arrow returning into itself — a value coming back. The most
 * abstract of the five, and the only one that would still work if the brand
 * later stopped being yellow.
 */
export function Return({ size = 96, onDark = false }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="hapi">
      <circle cx="50" cy="50" r="46" fill="none" stroke={onDark ? YELLOW : INK} strokeWidth="7" />
      <g fill={onDark ? YELLOW : INK}>
        <circle cx="36" cy="40" r="6" />
        <circle cx="64" cy="40" r="6" />
      </g>
      <path
        d="M30 60 Q50 78 70 60"
        stroke={DEEP}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M70 60 l-2 -9 l10 4 z" fill={DEEP} />
    </svg>
  );
}

export const MARKS = [
  {
    id: 1,
    name: 'Twoslash',
    Mark: Twoslash,
    idea: 'Eyes are the `^` of a twoslash type query — the marker already in every code sample here.',
    risk: 'Reads as a face first and a type query second. The joke needs the code samples nearby to land.',
  },
  {
    id: 2,
    name: 'Marker',
    Mark: Marker,
    idea: 'No new vocabulary: it is the headline highlighter stroke, curved.',
    risk: 'Two dots and a stroke is the most generic smiley there is. It depends entirely on the wordmark beside it.',
  },
  {
    id: 3,
    name: 'Chip',
    Mark: Chip,
    idea: 'A rounded square survives being an app icon, an avatar, and a favicon.',
    risk: 'The most conventional of the five. Safe, and says nothing about types.',
  },
  {
    id: 4,
    name: 'Optional',
    Mark: Optional,
    idea: 'The left eye is a `?` — the character that makes a thing optional.',
    risk: 'Asymmetric, so it is the first to break when small. Check the 16px row.',
  },
  {
    id: 5,
    name: 'Return',
    Mark: Return,
    idea: 'The mouth is an arrow returning into itself — a value coming back.',
    risk: 'Most abstract. Also the only one that still works if the brand stops being yellow.',
  },
] as const;
