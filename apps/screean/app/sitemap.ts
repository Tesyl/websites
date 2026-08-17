import type { MetadataRoute } from 'next';
import { getScreeanDocPages } from '@tesyl/content/screean-docs';
import { SITE_URL } from './constant';

// Every route is static and known at build time, so the sitemap is derived
// rather than maintained by hand — adding a doc page adds a sitemap entry.
const sitemap = (): MetadataRoute.Sitemap => [
  { url: SITE_URL, priority: 1 },
  { url: `${SITE_URL}/docs`, priority: 0.9 },
  { url: `${SITE_URL}/components`, priority: 0.8 },
  ...getScreeanDocPages().map((p) => ({
    url: `${SITE_URL}/docs/${p.slug}`,
    priority: 0.7,
  })),
];

export default sitemap;
