// X/Twitter reads `twitter:image` in preference to `og:image`. Re-exporting
// the same generator keeps one design rather than two that drift.
export { default, size, contentType, alt } from './opengraph-image';
