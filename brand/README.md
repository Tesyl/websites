# Brand assets

Rendered from the sites, not drawn by hand — so they cannot drift from them.

| File | Size | Where it goes |
|---|---|---|
| `github-social-preview.png` | 1280×640 | `Tesyl/hapi` → Settings → General → Social preview |
| `screean-github-social-preview.png` | 1280×640 | `Tesyl/screean-components` → Settings → General → Social preview |

> The hapi file predates there being two, which is why only one carries a
> prefix. Renaming it to `hapi-github-social-preview.png` would make the pair
> symmetrical; it is left alone here so nothing that already points at it
> breaks.

Everything else is generated at request time by the apps and needs no file here.

## hapi — port 3100

| Route | Size | Purpose |
|---|---|---|
| `/icon.svg` | any | Favicon |
| `/apple-icon` | 180×180 | iOS home screen |
| `/opengraph-image` | 1200×630 | Link previews — Messages, Slack, Discord |
| `/github-image` | 1280×640 | Source for the file above |

## screean — port 3200

| Route | Size | Purpose |
|---|---|---|
| `/icon.svg` | any | Favicon |
| `/opengraph-image` | 1200×630 | Link previews — Messages, Slack, Discord |
| `/twitter-image` | 1200×630 | X — re-exports the Open Graph card |
| `/github-image` | 1280×640 | Source for the file above |

## Regenerating

```bash
cd apps/hapi && pnpm dev          # port 3100
curl -o ../../brand/github-social-preview.png http://localhost:3100/github-image
```

```bash
cd apps/screean && pnpm dev       # port 3200
curl -o ../../brand/screean-github-social-preview.png http://localhost:3200/github-image
```

GitHub's social preview is upload-only — there is no REST API for it — so these
files have to be committed and uploaded by hand whenever the slogan changes.

## Why the GitHub card is a separate route

GitHub wants a clean 2:1 at 1280×640; Open Graph wants 1200×630. Letting GitHub
scale the OG card crops the slogan. GitHub also composites its own chrome over
parts of the image in some surfaces, so content sits well inside the edges
rather than bleeding to them.

## Fonts

Both apps embed their own face, because Satori — the renderer behind `next/og` —
has no access to system fonts and will otherwise fall back to a default sans.
It reads ttf, otf and woff, but **not** woff2.

- **hapi** keeps `@fontsource/ibm-plex-sans` as a devDependency and reads the
  `.woff` from `node_modules`, probing both pnpm layouts.
- **screean** commits the two JetBrains Mono weights under
  `apps/screean/assets/fonts` (SIL OFL 1.1, licence alongside).

Same problem, opposite trade: no committed binaries there, no dependency on the
install layout here. Worth unifying if a third site appears.
