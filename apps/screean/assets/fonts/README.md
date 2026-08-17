# Vendored fonts

Two weights of JetBrains Mono, latin subset, used **only** to render the
Open Graph share card (`app/opengraph-image.tsx`). The site itself loads no
web fonts — its stack is entirely system fonts.

| File | Weight | Size |
|---|---|---|
| `jetbrains-mono-latin-400-normal.woff` | 400 | ~27KB |
| `jetbrains-mono-latin-700-normal.woff` | 700 | ~28KB |

## Why these are committed rather than installed

They were copied from `@fontsource/jetbrains-mono@5.3.0`, which is no longer
a dependency. Reading them out of `node_modules` did not work: resolving the
path through `require.resolve` gives Turbopack a specifier it tries to
bundle as a browser module, and it fails with `Unknown module type` — after
globbing every `.woff` in the package, because the path was built from a
template literal. Reading a plain file path sidesteps the bundler entirely,
which is also what the Next docs do for this exact case.

## Why WOFF and not WOFF2

Satori — the renderer behind `next/og` — supports ttf, otf and woff. It
cannot decode woff2. Fontsource ships both; the woff2 files are half the
size and will fail at build.

## Updating

```
npm pack @fontsource/jetbrains-mono
```

then copy `files/jetbrains-mono-latin-{400,700}-normal.woff` here, along
with `LICENSE`.

## Licence

SIL Open Font License 1.1 — see `LICENSE-JetBrainsMono.txt`. Redistribution
is permitted; the licence must travel with the files, which is why it is
committed alongside them.
