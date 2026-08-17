# @tesyl/websites

Frontend sites for tesyl libraries.

```
apps/
  hapi/        Next.js 16 site for @tesyl/hapi           :3100
  screean/     Next.js 16 site for @tesyl/screean-components  :3200
packages/
  content/     Shared, typed page content — one source per library
brand/         Generated PNGs that have to exist as files (GitHub previews)
```

## Running it

```bash
pnpm install
pnpm dev        # turbo runs every app: hapi :3100, screean :3200
pnpm build      # static export of every app
pnpm typecheck
```

## Stack

Next.js 16 (App Router), React 19, Tailwind 4, TypeScript 5.9, pnpm workspaces, Turborepo.
Every page prerenders as static content — a docs site has no reason to run a server.

## The screean site

Documents `@tesyl/screean-components` — a headless component library whose components are
real DOM elements that dissolve into particle clouds and reform.

| Route | What it is |
|---|---|
| `/` | Landing. The hero is a live particle field that binds the wordmark |
| `/docs/*` | 10 pages in the same three tiers as hapi |
| `/components` | Storybook grid — nine groups of live particle demos, one group mounted at a time |

The design is **Acid**: cream ground, electric chartreuse, mono throughout, 2px radii,
hairline borders and solid offset shadows. It was ported wholesale from the showcase site in
`../screean-components/site`, so `app/globals.css` is that stylesheet nearly verbatim.

Two things about it are load-bearing:

- **Only one storybook group is mounted at a time.** Each tile owns a particle stage with its
  own canvas and force stack; mounting every group meant ~26 simultaneous stages, past the
  browser's per-page WebGL context limit of roughly 16.
- **Every canvas needs a teardown.** Tiles return `{ stage, timer, dispose }` and all three run
  on unmount, in that order — a stage disposed before its owner's disposer leaves the disposer
  touching a dead renderer.

Code samples in the docs are verified: `apps/screean/docs-verify` compiles every documented
sample against the **published** package types, and runs as part of `pnpm typecheck`. It has
already caught an option that did not exist in the published tarball and two wrong defaults.

## The hapi site

| Route | What it is |
|---|---|
| `/` | Landing. The hero is a live editor pane: hover any identifier to read its inferred type |
| `/docs/*` | 18 pages in three tiers — see below |
| `/article` | Long-form design notes — ergonomics, readability, and the closures underneath |

The direction is **Quick Info**: the page behaves like an editor, because type inference is what
the library sells. Light ground, IBM Plex Sans and Mono, and chroma reserved entirely for syntax.
Styles are scoped under `.site` in `app/site.css`.

Four other directions were built and compared before this one was chosen — Patchbay, Field Guide,
Ledger, and Broadcast. They were removed in the commit that promoted this one and remain in git
history if you want to look back at them.

## Docs structure

Modelled on TanStack Query's information architecture, which is the best-organised
documentation in this corner of the ecosystem.

| Tier | For | Pages |
|---|---|---|
| Getting started | Orienting | Overview, Installation, Quick start, TypeScript |
| Guides & concepts | Learning one idea at a time | Important defaults, Endpoints, Calling, Validation, Errors, Cancellation, Cache keys, Hooks, Headers |
| API reference | Looking something up | createApi, createEndpoint, Endpoint members, createFetcher, Error guards |

Three patterns worth keeping:

- **One concept per page.** A page you can read in three minutes gets read.
- **Important defaults leads the guides.** TanStack does this and it is their single best
  idea — a default you discover during an incident is a bad default.
- **API pages have a fixed shape**: signature, then options as `name · type · Required ·
  defaults to`, then returns. Consistency is what makes a reference scannable.

Pages are data, not JSX. `packages/content/src/docs-*.ts` holds the writing as typed
`DocBlock` unions; `app/docs/DocBlocks.tsx` is the only file that knows about markup. Adding a
page is one object plus one slug in `DOC_GROUPS` — previous/next, the "on this page" rail, and
`generateStaticParams` all follow from that.

## Why there is still no `packages/ui`

There is a shared **content** package and no shared **component** package. The second site has
now landed and has produced no real duplicate: hapi is IBM Plex on light ground with chroma
reserved for syntax, screean is mono-and-chartreuse brutalism. They share a content *model*, not
components. The share-card font loaders are the closest thing to a duplicate and they differ on
purpose — see `brand/README.md`. A `ui` package still has nothing to hold.

## Conventions worth keeping

- **Never use the `padding` shorthand on a class that composes with a width wrapper.** `.hero { padding: 4rem 0 }`
  silently resets the horizontal padding `.wrap` just set, and the content goes flush to the
  viewport edge. Use `padding-block`.
- **A reading measure on `.doc p` will leak into code labels.** Anything inside a docs section that
  is not prose needs `max-width: none`.
- `typedRoutes` is off in the hapi app on purpose. Its routes are generated by mapping over a list
  of numbers, so the hrefs are template literals that typed routes cannot narrow. Turn it back on
  if the app ever gets hand-written routes.

## Adding a library site

1. `mkdir -p apps/<name>` and copy `apps/hapi/{package.json,next.config.ts,postcss.config.mjs,tsconfig.json}`.
2. Rename the package to `@tesyl/site-<name>` and give it its own dev port.
3. Add `packages/content/src/<name>.ts` and export it from the package `exports` map.
4. `pnpm install`.

## Deploying

Both sites are static Next builds, so any host that serves the output works.

Each app is a **separate Vercel project** pointed at the same repository. The setting that
matters is the root directory — everything else is inherited.

| Site | Domain | Root directory |
|---|---|---|
| hapi | `hapi.tesyl.tech` | `apps/hapi` |
| screean | `screean.tesyl.tech` | `apps/screean` |

`SITE_URL` needs no value in production — each app defaults to its own real domain, so share
cards resolve even when the build has no environment. Set it only on a preview deploy whose
cards should point at itself. It is deliberately **not** `NEXT_PUBLIC_`: it is read server-side
only, by the layout metadata, the sitemap and robots.txt.

Two things to get right on a fresh Vercel project:

- **Root directory must be the app, not the repo root.** Pointed at the root, Vercel builds
  the workspace and finds no Next app to serve.
- **Do not enable "Include files outside the root directory" off.** The build needs
  `packages/content` and the lockfile above it; Vercel handles this by default for pnpm
  workspaces, but the setting exists and turning it off breaks the build.
