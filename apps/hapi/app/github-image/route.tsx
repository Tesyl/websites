import { ImageResponse } from 'next/og';
import { PACKAGE_NAME } from '@tesyl/content/hapi';
import { MARK_INK, MARK_PAPER, MARK_YELLOW, markDataUri } from '../Mark';

/**
 * GitHub's repository social preview.
 *
 * A separate route from the site's own card because the ratio differs: GitHub
 * asks for 1280×640 (a clean 2:1) against Open Graph's 1200×630. Rendering the
 * OG card and letting GitHub scale it would crop the slogan.
 *
 * GitHub also composites its own header and footer over parts of this image in
 * some surfaces, so the content sits well inside the edges rather than
 * bleeding to them.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 34,
          background: MARK_INK,
          padding: '0 96px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <img src={markDataUri({ field: 'transparent', dots: MARK_PAPER })} width={80} height={80} />
          <span style={{ color: MARK_PAPER, fontSize: 40, letterSpacing: -0.5 }}>
            {PACKAGE_NAME}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: MARK_PAPER, fontSize: 104, lineHeight: 1.04, letterSpacing: -3.5 }}>
            Hapi types,
          </span>
          <div style={{ display: 'flex' }}>
            <span
              style={{
                color: MARK_INK,
                background: MARK_YELLOW,
                fontSize: 104,
                lineHeight: 1.04,
                letterSpacing: -3.5,
                padding: '2px 18px',
                borderRadius: 10,
              }}
            >
              happy life!
            </span>
          </div>
        </div>

        <span style={{ color: '#9aa2b8', fontSize: 32, maxWidth: 940, lineHeight: 1.35 }}>
          Declare an endpoint once — every call shape comes back typed, validated, and cancellable.
        </span>
      </div>
    ),
    { width: 1280, height: 640 },
  );
}
