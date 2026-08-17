// The canonical origin, in one place.
//
// `metadataBase`, the sitemap and robots.txt all need it, and they must
// agree — a sitemap on one host and Open Graph URLs on another is worse
// than having neither.
//
// Override at build time with NEXT_PUBLIC_SITE_URL when the deploy target
// differs (a preview URL, or a domain change) so the value never has to be
// edited in source to ship somewhere else.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://screean.tesyl.tech';
