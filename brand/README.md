# Brand assets

Rendered from the site, not drawn by hand — so they cannot drift from it.

| File | Size | Where it goes |
|---|---|---|
| `github-social-preview.png` | 1280×640 | GitHub → repo Settings → General → Social preview |

Everything else is generated at request time by the hapi app and needs no file here:

| Route | Size | Purpose |
|---|---|---|
| `/icon.svg` | any | Favicon |
| `/apple-icon` | 180×180 | iOS home screen |
| `/opengraph-image` | 1200×630 | Link previews — Messages, Slack, Discord |
| `/github-image` | 1280×640 | Source for the file above |

## Regenerating

```bash
cd apps/hapi && pnpm dev          # port 3100
curl -o ../../brand/github-social-preview.png http://localhost:3100/github-image
```

GitHub's social preview is upload-only — there is no REST API for it — so this
file has to be committed and uploaded by hand whenever the slogan changes.
