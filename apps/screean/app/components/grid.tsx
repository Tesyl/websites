'use client';

// Storybook-style component browser. Sidebar nav on the left, one group's
// tiles in the content pane on the right. Ported from site/pages/components.ts.
//
// Why one group at a time (unchanged from the original): each tile owns a
// particle stage with a canvas, a force stack, and a bound scene. Mounting
// every group meant ~26 simultaneous stages — past the browser's per-page
// WebGL context limit of roughly 16, and a steady drag on the shared RAF
// ticker even on the Canvas2D fallback. One group is 3–7 tiles.
//
// Not yet ported: mountScreeanNav (the particle highlight that flew between
// sidebar items) and mountScreeanWipe (the chartreuse bar that masked the
// group swap). Group switching is therefore immediate rather than bridged
// by a 600ms wipe. Both are additive — reinstating them means restoring the
// handles and the `swapGroup`-at-midpoint timing, and deleting the
// active-state CSS compensation at the foot of globals.css.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_THEME } from '../../lib/themes';
import { fieldsGroup } from '../../stories/fields';
import { compositionGroup } from '../../stories/composition';
import { layoutGroup } from '../../stories/layout';
import { forcesGroup } from '../../stories/forces';
import { presetsGroup } from '../../stories/presets';
import { choreographyGroup } from '../../stories/choreography';
import { componentsGroup } from '../../stories/components';
import { easingGroup } from '../../stories/easing';
import { typeGroup } from '../../stories/type';
import { TILE_W, TILE_H, type TileDef, type TileGroup } from '../../stories/types';

// Slug derivation. Lower-cased, hyphens for spaces — URL-safe, and matches
// what `window.location.hash` returns minus the leading '#'.
const slugOf = (title: string): string => title.toLowerCase().replace(/\s+/g, '-');

const pad2 = (n: number): string => String(n).padStart(2, '0');

// Order matters — readers expect the engine vocabulary to flow primitive →
// composed → arranged → animated → composed-into-UI. Editing this list is
// how you reorder the sidebar; the group builders are order-agnostic.
const buildGroups = (): ReadonlyArray<TileGroup> => [
  componentsGroup(DEFAULT_THEME),
  fieldsGroup(DEFAULT_THEME),
  compositionGroup(DEFAULT_THEME),
  layoutGroup(DEFAULT_THEME),
  forcesGroup(DEFAULT_THEME),
  presetsGroup(DEFAULT_THEME),
  typeGroup(DEFAULT_THEME),
  choreographyGroup(DEFAULT_THEME),
  easingGroup(DEFAULT_THEME),
];

// One tile: a canvas the story mounts a Stage into, plus its caption and a
// click-to-copy snippet.
//
// The teardown order is load-bearing and matches the original: clear the
// interval, run the generic disposer, then dispose the Stage. A Stage
// disposed before its owner's disposer can leave the disposer touching a
// dead renderer.
const StoryTile = ({ tile }: { tile: TileDef }): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setup = tile.mount(canvas, TILE_W, TILE_H);
    return () => {
      if (setup.timer) clearInterval(setup.timer);
      setup.dispose?.();
      setup.stage?.dispose();
    };
  }, [tile]);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(tile.code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 900);
      },
      () => {
        /* clipboard denied — non-fatal */
      },
    );
  }, [tile.code]);

  return (
    <article className="surface-card story-card">
      <div className="story-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="story-canvas"
          style={{ width: `${TILE_W}px`, height: `${TILE_H}px` }}
        />
      </div>
      <div className="story-meta">
        <h3>{tile.name}</h3>
        <p>{tile.blurb}</p>
        <button
          className={copied ? 'story-code copied' : 'story-code'}
          type="button"
          title="Click to copy"
          onClick={copy}
        >
          {tile.code}
        </button>
      </div>
    </article>
  );
};

export const ComponentsGrid = (): React.JSX.Element => {
  // Built once. Each builder closes over theme tokens and allocates the
  // tile definitions; rebuilding on every render would hand StoryTile a new
  // `tile` identity each pass and remount every Stage.
  const groups = useMemo(buildGroups, []);
  const [activeIdx, setActiveIdx] = useState(0);

  const slugs = useMemo(() => groups.map((g) => slugOf(g.title)), [groups]);

  // Hash deep-links: /components#layout selects that group. Runs once for
  // the initial hash and then on every hashchange, same as the original.
  useEffect(() => {
    const syncFromHash = (): void => {
      const slug = window.location.hash.slice(1);
      if (!slug) return;
      const idx = slugs.indexOf(slug);
      if (idx >= 0) setActiveIdx(idx);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [slugs]);

  const select = useCallback(
    (idx: number): void => {
      setActiveIdx(idx);
      const slug = slugs[idx];
      if (!slug) return;
      // replaceState, not pushState — back/forward should not treat every
      // tab click as a history entry. Only the first /components visit and
      // any pasted deep-link belong in history.
      const url = `/components#${slug}`;
      if (window.location.pathname + window.location.hash !== url) {
        window.history.replaceState({}, '', url);
      }
    },
    [slugs],
  );

  const active = groups[activeIdx];

  return (
    <section className="doc-main">
      <aside className="doc-sidebar" aria-label="Component groups">
        <div className="doc-nav-wrap">
          <ol className="doc-nav">
            {groups.map((g, i) => (
              <li
                key={g.title}
                className={i === activeIdx ? 'doc-nav-item active' : 'doc-nav-item'}
              >
                <button
                  className="doc-nav-btn"
                  type="button"
                  aria-current={i === activeIdx ? 'true' : undefined}
                  onClick={() => select(i)}
                >
                  <span className="doc-nav-num">{pad2(i + 1)}</span>
                  <span className="doc-nav-name">{g.title}</span>
                  <span className="doc-nav-count">{pad2(g.tiles.length)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <div className="doc-content">
        {active ? (
          <>
            <header className="doc-group-head">
              <span className="doc-group-num">
                {pad2(activeIdx + 1)} / {pad2(groups.length)}
              </span>
              <h2>{active.title}</h2>
              <p>{active.blurb}</p>
            </header>
            <div className="doc-grid">
              {active.tiles.map((tile) => (
                // Keyed by group slug + tile name: switching groups must
                // unmount the previous group's tiles so their Stages are
                // disposed, rather than reusing them by position.
                <StoryTile key={`${slugs[activeIdx]}:${tile.name}`} tile={tile} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};
