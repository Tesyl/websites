import { ImageResponse } from 'next/og';
import { MARK_INK, MARK_PAPER, markDataUri } from './Mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** iOS home-screen icon. PNG rather than SVG, because iOS will not render SVG here. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: MARK_INK,
        }}
      >
        <img src={markDataUri({ field: 'transparent', dots: MARK_PAPER })} width={150} height={150} />
      </div>
    ),
    size,
  );
}
