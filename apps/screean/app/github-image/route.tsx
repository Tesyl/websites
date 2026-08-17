import { ImageResponse } from 'next/og';
import { HEADLINE, PACKAGE_NAME, SUBHEAD } from '@tesyl/content/screean';
import { OG_FONT_FAMILY, ogFonts } from '../og-font';

/**
 * GitHub's repository social preview.
 *
 * A separate route from the site's own card because the ratio differs: GitHub
 * asks for 1280×640 (a clean 2:1) against Open Graph's 1200×630. Rendering the
 * OG card and letting GitHub scale it would crop the headline.
 *
 * GitHub also composites its own header and footer over parts of this image in
 * some surfaces, so the content sits well inside the edges rather than
 * bleeding to them.
 *
 * The result is committed to `brand/` — GitHub's social preview is upload-only,
 * with no REST API, so it has to exist as a file somebody drags into a settings
 * page. See `brand/README.md`.
 */

// Prerendered at build time. The image never varies, and a dynamic route
// would read the font from disk per request — a `process.cwd()` read that
// Next's file tracing cannot see, so the assets might not ship. Rendering
// once at build sidesteps that entirely.
export const dynamic = 'force-static';

const INK = '#0b0b0b';
const CREAM = '#f4eeda';
const ACCENT = '#d4ff3a';

export async function GET() {
  return new ImageResponse(
    (
      // Satori supports flexbox only — no grid, and every container needs an
      // explicit display value.
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 42,
          background: INK,
          fontFamily: OG_FONT_FAMILY,
          padding: '0 96px',
        }}
      >
        {/* Wordmark: the chartreuse square in a cream keyline, as the site's
            nav and footer use it. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              background: ACCENT,
              border: `3px solid ${CREAM}`,
            }}
          />
          <div
            style={{
              display: 'flex',
              color: CREAM,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            {PACKAGE_NAME}
          </div>
        </div>

        {/* The headline in the hero chip. 54px keeps a 25-character line
            inside the 1088px of usable width — mono gives every glyph the
            same advance, so a size that fits a proportional face will not
            necessarily fit here. */}
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              background: ACCENT,
              color: INK,
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: -1,
              padding: '16px 28px',
              border: `3px solid ${CREAM}`,
              // The site's solid offset shadow, no blur.
              boxShadow: `12px 12px 0 ${CREAM}`,
            }}
          >
            {HEADLINE}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            maxWidth: 1000,
            color: CREAM,
            opacity: 0.85,
            fontSize: 23,
            lineHeight: 1.5,
          }}
        >
          {SUBHEAD}
        </div>
      </div>
    ),
    { width: 1280, height: 640, fonts: [...ogFonts()] },
  );
}
