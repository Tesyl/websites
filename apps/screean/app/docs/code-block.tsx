'use client';

import { useCallback, useState } from 'react';

// A copyable code sample.
//
// The point of the docs page is that a reader can take the code away, so
// the copy affordance is always visible rather than revealed on hover —
// a hover-only control is invisible on touch, which is where a lot of
// people read documentation.
//
// The <pre> keeps the sample selectable for anyone who would rather drag
// than click; the button is an addition, not a replacement.
//
// `html` is Prism markup produced on the server (see highlight.ts). It is
// generated from our own content, never from anything a reader supplies,
// and Prism escapes the source it tokenizes. `code` stays the raw text so
// what lands on the clipboard is source, not markup.

export const CodeBlock = ({
  code,
  label,
  html,
}: {
  code: string;
  label?: string | undefined;
  html?: string | null | undefined;
}): React.JSX.Element => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      },
      () => {
        /* clipboard denied — the sample is still selectable */
      },
    );
  }, [code]);

  return (
    <figure className="code-block">
      <figcaption className="code-block-head">
        <span className="code-block-label">{label ?? 'code'}</span>
        <button
          type="button"
          className={copied ? 'code-block-copy copied' : 'code-block-copy'}
          onClick={copy}
          // The label changes on copy, so screen-reader users get the same
          // confirmation the visual state gives everyone else.
          aria-label={copied ? 'Copied to clipboard' : `Copy ${label ?? 'code'} to clipboard`}
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </figcaption>
      <pre className="code-block-body">
        {html ? (
          <code dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </figure>
  );
};
