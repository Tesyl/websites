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
// TYPEFACE: this renders through Satori, which has no access to system
// fonts — it uses only what is handed to it, and falls back to the sans
// that next/og bundles. The site's mono stack (`ui-monospace`, SF Mono,
// JetBrains Mono) is all system fonts, so there is no file here to embed
// and matching the site's typography would mean vendoring a font.
//
// Rather than half-match it, the card leans on the parts of the Acid
// vocabulary that survive a font substitution: ink ground, chartreuse
// block, hairline keylines, the offset shadow, wide uppercase tracking.
// If exact mono ever matters more than a hermetic build, vendor
// JetBrains Mono (SIL OFL) and pass it via the `fonts` option.

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${PACKAGE_NAME} — ${HEADLINE}`;

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
              fontSize: 26,
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
              fontSize: 20,
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
              fontSize: 76,
              fontWeight: 800,
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
              fontSize: 27,
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
          <div style={{ display: 'flex', fontSize: 22, color: ACCENT }}>$</div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 1,
              color: CREAM,
            }}
          >
            npm install {PACKAGE_NAME}
          </div>
        </div>
      </div>
    ),
    size,
  );

export default Image;
