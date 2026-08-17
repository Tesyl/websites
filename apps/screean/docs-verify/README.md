# docs-verify

Every code sample in the docs, transcribed into compilable TypeScript and
checked against the **published** `@tesyl/screean-components` and
`@tesyl/screean` types.

A documentation sample that does not compile is worse than no sample: the
reader copies it, it fails, and they stop trusting the rest of the page.
This directory makes that failure a build error instead.

Run it with `npm run verify:docs` (it is also part of `npm run typecheck`).

## Why it exists

It immediately caught a real error. The `createScreenController` reference
documented a `reformSpeed` option that does not exist in the published
0.3.0 — the published package takes `stagger` instead. The wrong name came
from reading the type in `../screean-components/node_modules`, which is a
`file:` link to the sibling repo's **dev build**, ahead of what npm ships.
Both call themselves 0.3.0.

The lesson: the site consumes the npm tarball, so the docs must be checked
against the tarball, never against the local working copy.

## Keeping it in sync

The samples here are copies, not the source of truth — the source is
`packages/content/src/screean-docs.ts`. When a sample changes there, change
it here too. The duplication is deliberate: the content package stays pure
data with no toolchain, and this directory carries the compiler.

| File | Covers |
|---|---|
| `samples.ts` | Vanilla factories, the controller options and its returns, the `ElementComponent` surface, styling, render strategy |
| `react-samples.tsx` | The `./react` subpath — wrappers, `ScreenProvider`, imperative handles |
| `entries-samples.tsx` | The three entry points and the Next.js client-component pattern |
