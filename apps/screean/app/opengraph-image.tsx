import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import {
  HEADLINE,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  SUBHEAD,
} from '@tesyl/content/screean';

// The card that renders when the link is shared — iMessage, Slack, Discord,
// X, LinkedIn all read `og:image`, which this file generates.
//
// 1200x630 is the ratio every one of those crops to. Anything important is
// kept away from the edges, because several of them round the corners and
// iMessage crops tighter than the rest.
//
// TYPEFACE: Satori has no access to system fonts — it renders only what is
// handed to it. The site's stack names JetBrains Mono first, so that is
// what gets embedded here, from @fontsource/jetbrains-mono (SIL OFL 1.1,
// redistributable). The latin subset is ~28KB per weight.
//
// The files are vendored under assets/fonts and read as a plain path.
// Resolving them out of node_modules instead hands Turbopack a specifier it
// tries to bundle as a browser module, which fails with `Unknown module
// type`. A filesystem read never reaches the bundler. See the README there.
//
// Note WOFF, not WOFF2: Satori supports ttf/otf/woff and cannot decode
// woff2. Fontsource ships both; picking the wrong one fails at build.

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${PACKAGE_NAME} — ${HEADLINE}`;

// Read at build time — the route is statically prerendered, so this runs
// once during `next build` and never per request.
const fontFile = (weight: 400 | 700): Buffer =>
  readFileSync(
    join(process.cwd(), 'assets/fonts', `jetbrains-mono-latin-${weight}-normal.woff`),
  );

const INK = '#0b0b0b';
const CREAM = '#f4eeda';
const ACCENT = '#d4ff3a';

const Image = () =>
  new ImageResponse(
    (
      // Satori supports flexbox only — no grid, and every container needs an
      // explicit display value.
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: INK,
          padding: 64,
          fontFamily: 'JetBrains Mono',
        }}
      >
        {/* Top rule: brand mark + package name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              background: ACCENT,
              border: `3px solid ${CREAM}`,
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 6,
              color: CREAM,
              textTransform: 'uppercase',
            }}
          >
            screean
          </div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div
            style={{
              display: 'flex',
              fontSize: 19,
              letterSpacing: 3,
              color: ACCENT,
            }}
          >
            v{PACKAGE_VERSION}
          </div>
        </div>

        {/* The headline, set in the chartreuse block the site uses for its
            hero chip — the single most recognisable element of the brand. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              background: ACCENT,
              color: INK,
              fontSize: 50,
              fontWeight: 700,
              letterSpacing: -1,
              padding: '14px 26px',
              border: `3px solid ${CREAM}`,
              // The site's solid offset shadow, no blur.
              boxShadow: `12px 12px 0 ${CREAM}`,
            }}
          >
            {HEADLINE}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 46,
              maxWidth: 900,
              fontSize: 21,
              lineHeight: 1.45,
              color: CREAM,
              opacity: 0.85,
            }}
          >
            {SUBHEAD}
          </div>
        </div>

        {/* Bottom rule: the install line, which is the actual call to action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            borderTop: `2px solid ${CREAM}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex', fontSize: 19, color: ACCENT }}>$</div>
          <div
            style={{
              display: 'flex',
              fontSize: 19,
              letterSpacing: 1,
              color: CREAM,
            }}
          >
            npm install {PACKAGE_NAME}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'JetBrains Mono', data: fontFile(400), weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: fontFile(700), weight: 700, style: 'normal' },
      ],
    },
  );

export default Image;
