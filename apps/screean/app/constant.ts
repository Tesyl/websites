// The canonical origin, in one place.
//
// `metadataBase`, the sitemap and robots.txt all need it, and they must
// agree — a sitemap on one host and Open Graph URLs on another is worse
// than having neither.
//
// Read server-side only (layout metadata, sitemap, robots), so it is a
// plain `SITE_URL` rather than `NEXT_PUBLIC_SITE_URL` — the value has no
// business in the browser bundle. Matches the hapi app's variable name so
// both sites are configured the same way.
//
// Production needs no value: the default is the real domain, so share
// cards resolve even when the build has no environment. Set it only on a
// preview deploy whose cards should point at itself.
export const SITE_URL = process.env['SITE_URL'] ?? 'https://screean.tesyl.tech';
