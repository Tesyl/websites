import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

// Server-side syntax highlighting.
//
// This runs at build time inside a server component, so the highlighted
// markup ships in the static HTML and no highlighter reaches the browser.
// Prism's grammars are the whole cost and they stay on the server.
//
// The output is trusted: the input is our own documentation content from
// packages/content, never user input, and Prism escapes the source text it
// tokenizes. That is what makes dangerouslySetInnerHTML acceptable here —
// it would not be for anything a reader could supply.

// Doc labels are written for humans ("app/foo.tsx", "shell"), so they are
// mapped to grammars rather than used directly. Anything unrecognised
// renders unhighlighted, which is the correct failure: plain but readable.
const GRAMMAR_BY_LABEL: Readonly<Record<string, string>> = {
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  javascript: 'javascript',
  js: 'javascript',
  css: 'css',
  shell: 'bash',
  bash: 'bash',
  sh: 'bash',
  json: 'json',
};

// A label like `app/components/dissolving-button.tsx` is a filename; the
// extension is the real signal.
const grammarNameFor = (label: string | undefined): string | undefined => {
  if (!label) return undefined;
  const lower = label.toLowerCase();
  const direct = GRAMMAR_BY_LABEL[lower];
  if (direct) return direct;
  const dot = lower.lastIndexOf('.');
  return dot === -1 ? undefined : GRAMMAR_BY_LABEL[lower.slice(dot + 1)];
};

export type Highlighted = {
  /** Prism markup when a grammar matched; null means render as plain text. */
  readonly html: string | null;
};

export const highlight = (code: string, label: string | undefined): Highlighted => {
  const name = grammarNameFor(label);
  if (!name) return { html: null };
  const grammar = Prism.languages[name];
  if (!grammar) return { html: null };
  return { html: Prism.highlight(code, grammar, name) };
};
