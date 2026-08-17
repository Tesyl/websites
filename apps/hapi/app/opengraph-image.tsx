import { ImageResponse } from 'next/og';
import { PACKAGE_NAME, PACKAGE_TAGLINE } from '@tesyl/content/hapi';
import { MARK_INK, MARK_PAPER, MARK_YELLOW, markDataUri } from './Mark';

export const alt = `${PACKAGE_NAME} — ${PACKAGE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The card shown when the link is pasted into Messages, Slack, or anywhere
 * else that reads Open Graph.
 *
 * Dark field on purpose: link previews sit inside someone else's white chat
 * bubble, and a light card dissolves into it. The mark and the slogan are the
 * whole payload — a share card is read at thumbnail size, so anything smaller
 * than the slogan is wasted.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: MARK_INK,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Satori renders images, not React SVG components. */}
          <img src={markDataUri({ field: 'transparent', dots: MARK_PAPER })} width={72} height={72} />
          <span style={{ color: MARK_PAPER, fontSize: 34, letterSpacing: -0.5 }}>
            {PACKAGE_NAME}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: MARK_PAPER, fontSize: 96, lineHeight: 1.05, letterSpacing: -3 }}>
            Hapi types,
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <span
              style={{
                color: MARK_INK,
                background: MARK_YELLOW,
                fontSize: 96,
                lineHeight: 1.05,
                letterSpacing: -3,
                padding: '2px 16px',
                borderRadius: 8,
              }}
            >
              happy life!
            </span>
          </div>
        </div>

        <span style={{ color: '#9aa2b8', fontSize: 30, maxWidth: 900, lineHeight: 1.35 }}>
          {PACKAGE_TAGLINE} Declare an endpoint once — every call shape comes back typed,
          validated, and cancellable.
        </span>
      </div>
    ),
    size,
  );
}
