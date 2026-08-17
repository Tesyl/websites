'use client';

import { useEffect, useRef } from 'react';
import { circle, node, text } from '@tesyl/screean';
import type { SceneNode } from '@tesyl/screean';
import { Stage, windowPointer } from '../lib/embed';
import { DEFAULT_THEME, THEMES } from '../lib/themes';

// The landing hero: the word SCREEAN bound as a particle cloud over the
// hero band, with the cursor acting as an attractor. One Stage, driven by
// the shared RAF ticker in lib/embed.ts.
//
// The class sits on the <canvas> itself, not on a wrapper — `.hero-canvas`
// is `position: absolute; inset: 0`, so it must BE the canvas to fill the
// band behind `.hero-content`.
//
// Stage options mirror site/pages/landing.ts: 8000 particles spawning from
// the edges at 360, trailAlpha 0.16, cursor attractor at 4500. The renderer
// keeps its default opaque dark background, which is the house look — the
// same one the easing and forces tiles use against the cream page.
//
// A ResizeObserver rebuilds on layout change because the font size is
// derived from the band's dimensions, so a resize has to rebuild the field
// rather than merely resize the renderer.

const HERO_WORD = 'SCREEAN';
const HERO_PARTICLE_COUNT = 8000;
const HERO_MIN_W = 320;
const HERO_MIN_H = 360;

// Falls back to a circle where OffscreenCanvas is unavailable — the text
// field is rasterized through it. Same guard the Type story uses.
const buildHeroField = (font: string, fallbackR: number): SceneNode =>
  typeof OffscreenCanvas === 'undefined'
    ? node(circle({ r: fallbackR }))
    : node(text({ text: HERO_WORD, font }));

export const HeroCanvas = (): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const band = canvas?.parentElement;
    if (!canvas || !band) return;

    const theme = THEMES[DEFAULT_THEME];
    let stage: Stage | null = null;

    const build = (): void => {
      const box = band.getBoundingClientRect();
      const w = Math.max(HERO_MIN_W, Math.round(box.width));
      const h = Math.max(HERO_MIN_H, Math.round(box.height));
      stage?.dispose();
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      stage = new Stage({
        canvas,
        width: w,
        height: h,
        feel: theme.feel,
        palette: theme.palette,
        particleCount: HERO_PARTICLE_COUNT,
        spawnFrom: 'edge',
        spawnSpeed: 360,
        pointerProvider: windowPointer,
        pointerStrength: 4500,
        portal: false,
        particleSize: 1.0,
        trailAlpha: 0.16,
      });
      // `min(w, h) * 0.18` is the original landing's proven ratio. Do not
      // raise it: the text field is rasterized through an OffscreenCanvas,
      // and a seven-letter word at a much larger size overruns the buffer
      // and silently binds no targets — the particles just sit where they
      // spawned, at the edges. The second term keeps the word inside a
      // narrow viewport, using ~0.62em as the mono advance width.
      const widthCap = (w * 0.9) / (0.62 * HERO_WORD.length);
      const fontSize = Math.round(Math.min(Math.min(w, h) * 0.18, widthCap));
      const font = `${theme.fontWeight} ${fontSize}px ${theme.tokens.fontHead}`;
      const fallback = Math.min(w, h) * 0.3;
      stage.setScene(() => buildHeroField(font, fallback));
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(band);

    return () => {
      ro.disconnect();
      stage?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
};
