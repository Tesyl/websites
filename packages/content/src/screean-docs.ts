/**
 * Documentation for @tesyl/screean-components.
 *
 * Reuses the DocBlock model in ./docs-types — same renderer, same page
 * shape as the hapi docs. Only the writing differs.
 *
 * Every code sample here is written against the real published signatures
 * (0.3.0). If a signature changes, the sample changes with it — a doc that
 * does not compile is worse than no doc.
 */

import type { DocGroup, DocPage } from './docs-types.js';

export type { DocBlock, DocGroup, DocPage } from './docs-types.js';

/**
 * The sidebar.
 *
 * Three tiers, in the order a reader needs them: orient, learn, look up.
 * `important-defaults` leads the guides on purpose — a default you discover
 * during an incident is a bad default.
 */
export const SCREEAN_DOC_GROUPS: ReadonlyArray<DocGroup> = [
  {
    title: 'Getting started',
    slugs: ['overview', 'installation', 'quick-start'],
  },
  {
    title: 'Guides & concepts',
    slugs: ['important-defaults', 'dissolve-contract', 'render-strategy', 'styling', 'react'],
  },
  {
    title: 'API reference',
    slugs: ['screen-controller', 'components-reference'],
  },
];

const IMPORTANT_DEFAULTS: DocPage = {
  slug: 'important-defaults',
  title: 'Important defaults',
  lede: 'What the library decides for you, stated before anything depends on it.',
  blocks: [
    {
      kind: 'p',
      text: 'Every default here is a deliberate choice, and every one of them will eventually surprise somebody. A default you discover while debugging is a bad default, so they are all listed up front.',
    },
    { kind: 'h3', text: 'Dissolving is opt-out, not opt-in' },
    {
      kind: 'p',
      text: 'Every interactive component transitions on activation unless you say otherwise. `dissolveOnActivate`, `dissolveOnChange`, `dissolveOnCommit` and `dissolveOnSelect` all default to **true**. This is the signature interaction of the library, so it is on by default — but it means adding a component to a dense list gives you a dissolve you may not have asked for.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `// Opt out per component.
headlessButton({ screen, label: 'SAVE', dissolveOnActivate: false, onClick })`,
    },
    { kind: 'h3', text: 'Your business logic runs before the transition' },
    {
      kind: 'p',
      text: 'The activation order is fixed: flip state, repaint, run your handler, then dissolve. Your `onClick` fires on the **live** element, before any particles exist, so it can read the DOM and it can throw without leaving the screen mid-transition.',
    },
    { kind: 'h3', text: 'Re-entrancy is per element, not global' },
    {
      kind: 'p',
      text: 'While one component transitions, every **other** component stays fully interactive. One dissolving button never freezes the screen. The consequence is that `screen.phase()` — which is global — is the wrong thing to gate interaction on; use the component’s own `isTransitioning()`.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Gating on the global phase blocks unrelated components',
      text: 'It looks correct in a single-component demo and starts dropping clicks the moment a second component exists.',
    },
    { kind: 'h3', text: 'Continuous controls never rasterize mid-gesture' },
    {
      kind: 'p',
      text: 'Sliders and text fields stay live DOM throughout the interaction. This is enforced by the role-to-strategy table at compile time, not by convention, because rasterizing away a drag or an IME composition destroys it. A text field therefore dissolves on **commit** — blur or Enter — and not on every keystroke.',
    },
    { kind: 'h3', text: 'Radios defer to their group' },
    {
      kind: 'p',
      text: 'An individual radio does not dissolve on its own; `createRadioGroup` decides via `dissolveOnSelect`. Otherwise selecting an option would dissolve both the radio being turned off and the one being turned on. For the same reason, calling `select()` programmatically does not dissolve anything — only user activation does.',
    },
    { kind: 'h3', text: 'The controller runs its own clock' },
    {
      kind: 'p',
      text: '`ownLoop` defaults to true, so each controller drives its own animation frame loop. Two controllers means two loops — which is one reason to create one controller per screen and share it, rather than one per component.',
    },
    { kind: 'h3', text: 'Particle counts cascade' },
    {
      kind: 'p',
      text: 'Three levels, most specific wins: the value you pass to a component, then that component’s own default scaled to its silhouette, then the engine default of **6000**. Passing `particleCount` to the controller does not override a component that carries its own.',
    },
    { kind: 'h3', text: 'The default feel is soft' },
    {
      kind: 'p',
      text: 'Not `magnetic` — `soft`. If transitions feel looser than you expected, that is why. Pass `feel` to pick another preset, or `feelOverrides` to adjust individual constants.',
    },
    { kind: 'h3', text: 'The canvas must not take pointer events' },
    {
      kind: 'p',
      text: 'The particle canvas is an overlay stacked above your content. Without `pointer-events: none` it swallows every click and nothing underneath is reachable — the components still render, they just stop responding.',
    },
    { kind: 'h3', text: 'Rasterization cannot reach the network' },
    {
      kind: 'p',
      text: 'The capture happens inside an SVG `foreignObject`, which is sandboxed. Cross-origin `url()` assets will not paint, and a web font that has not finished loading is captured as its fallback face. Await `document.fonts.ready` before the first transition.',
    },
    { kind: 'h3', text: 'Frame time is clamped' },
    {
      kind: 'p',
      text: 'The simulation clamps `dt` to **50ms**. A backgrounded tab that returns after thirty seconds resumes smoothly instead of integrating one enormous step and flinging every particle off screen. It also means a genuinely slow frame runs in slow motion rather than skipping ahead.',
    },
  ],
};

const OVERVIEW: DocPage = {
  slug: 'overview',
  title: 'Overview',
  lede: 'What the library is, and the one idea the whole thing rests on.',
  blocks: [
    {
      kind: 'p',
      text: 'A component in this library is a real DOM element. Not a canvas drawing of an element, not a scene-graph node with a hidden DOM twin — the actual `<button>`, `<input>`, or `<img>` you would have written by hand. It is the accessibility surface, the event surface, and the thing your CSS targets.',
    },
    {
      kind: 'p',
      text: 'Particles enter only during a transition. On activation the element is rasterized into a bitmap field, the element hides, particles spawn bound to that field and disperse, then spring back and the element fades in again. At rest there are no particles at all.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Why this matters',
      text: 'Because the element is never replaced, screen readers, keyboard focus, form submission, and browser autofill all keep working. A particle system that owned the UI would have to reimplement every one of those.',
    },
    { kind: 'h3', text: 'The two packages' },
    {
      kind: 'table',
      head: ['Package', 'Role'],
      rows: [
        ['@tesyl/screean', 'The particle engine and the transition core. A peer dependency.'],
        ['@tesyl/screean-components', 'The component factories and React wrappers.'],
      ],
    },
    { kind: 'h3', text: 'Three entry points' },
    {
      kind: 'code',
      label: 'typescript',
      code: `// The six-ink GPU hero / background.
import { mount } from '@tesyl/screean-components'

// Framework-agnostic factories + the transition core.
import { headlessButton, createScreenController }
  from '@tesyl/screean-components/components'

// React wrappers over the same factories.
import { ScreeanButton } from '@tesyl/screean-components/react'`,
    },
  ],
};

const INSTALLATION: DocPage = {
  slug: 'installation',
  title: 'Installation',
  lede: 'Two packages, one peer dependency, and one thing to know about server rendering.',
  blocks: [
    { kind: 'code', label: 'shell', code: 'npm install @tesyl/screean-components @tesyl/screean' },
    {
      kind: 'p',
      text: 'The engine is a peer dependency, so it must be installed alongside. `react` and `react-dom` are optional peers — install them only if you use the `./react` subpath.',
    },
    { kind: 'h3', text: 'Server rendering' },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Every entry is browser-only',
      text: 'The factories touch `document` at construction time and the renderer needs WebGL or WebGPU. Every published entry carries a `use client` banner, so in the Next.js App Router the importing module must sit behind a client boundary.',
    },
    {
      kind: 'code',
      label: 'app/components/dissolving-button.tsx',
      code: `'use client'

import { useEffect, useRef } from 'react'
import { createScreenController, headlessButton }
  from '@tesyl/screean-components/components'

export const DissolvingButton = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const screen = createScreenController({ canvas })
    const btn = headlessButton({
      screen,
      label: 'DISSOLVE ME',
      onClick: () => console.log('clicked'),
    })
    host.appendChild(btn.el)

    // Teardown order matters: the component first, then the controller.
    return () => {
      btn.dispose()
      screen.dispose()
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={hostRef} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}`,
    },
  ],
};

const QUICK_START: DocPage = {
  slug: 'quick-start',
  title: 'Quick start',
  lede: 'One controller, one canvas, one component that dissolves.',
  blocks: [
    {
      kind: 'p',
      text: 'A screen controller owns the particle canvas and the transition timing. Create one per screen and share it across every component on that screen — one engine, many components. Creating a controller per component is the most common mistake and it costs you a WebGL context each time.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `import { createScreenController, headlessButton }
  from '@tesyl/screean-components/components'

// The canvas is an overlay. It must not intercept pointer events —
// the real DOM element underneath is what the user clicks.
const canvas = document.querySelector('canvas')!
const screen = createScreenController({ canvas })

const btn = headlessButton({
  screen,
  label: 'DISSOLVE ME',
  onClick: () => console.log('clicked'),
})

document.body.appendChild(btn.el)`,
    },
    { kind: 'h3', text: 'The canvas overlay' },
    {
      kind: 'p',
      text: 'Particles are drawn on a canvas stacked above your content. It needs `pointer-events: none` so clicks reach the components underneath, and it should cover the region your components occupy.',
    },
    {
      kind: 'code',
      label: 'css',
      code: `.screen {
  position: relative;
}

.screen > canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Above the content, below any modal chrome. */
  z-index: 1;
}`,
    },
    { kind: 'h3', text: 'Driving the clock' },
    {
      kind: 'p',
      text: 'By default the controller runs its own animation frame loop. If you already have a render loop — a game, an existing engine, a shared ticker — pass `ownLoop: false` and call `tick` yourself so there is one loop rather than two.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `const screen = createScreenController({ canvas, ownLoop: false })

const frame = (now: number) => {
  screen.tick(now)
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)`,
    },
    { kind: 'h3', text: 'Cleaning up' },
    {
      kind: 'p',
      text: 'Dispose the components before the controller. A component disposed after its controller can leave a listener pointing at a dead renderer.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `btn.dispose()      // removes listeners, detaches the element
screen.dispose()   // releases the renderer and its GPU context`,
    },
  ],
};

const DISSOLVE_CONTRACT: DocPage = {
  slug: 'dissolve-contract',
  title: 'The activation contract',
  lede: 'Flip state, repaint, notify, dissolve — in that order, every time.',
  blocks: [
    {
      kind: 'p',
      text: 'A dissolve captures the element as pixels. That means the element must already look the way you want it remembered before the capture happens. The factories enforce the order for you; you only need to know it when you drive a dissolve by hand.',
    },
    {
      kind: 'list',
      items: [
        'Flip the component state (checked, selected, value).',
        'Let the DOM repaint so the new state is on screen.',
        'Fire your `onChange` / `onClick` so business logic runs on the live element.',
        'Dissolve — the capture now shows the new state.',
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Dissolving before the repaint captures stale pixels',
      text: 'A checkbox that dissolves before its tick mark paints will reform showing the old state, then snap to the new one. The pop is subtle and maddening to track down.',
    },
    { kind: 'h3', text: 'Driving a transition yourself' },
    {
      kind: 'p',
      text: 'Every component exposes `dissolve()` for the round trip and `swapTo()` to morph one silhouette into another. The target of a swap should start hidden — it fades in during the reform phase.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `// Round trip: element → particles → element.
await btn.dissolve()

// Morph one component into another.
const next = headlessLabel({ screen, text: 'SENT' })
next.el.style.opacity = '0'
host.appendChild(next.el)

await btn.swapTo(next)`,
    },
    { kind: 'h3', text: 'Opting out of the automatic dissolve' },
    {
      kind: 'p',
      text: 'Set `dissolveOnActivate: false` (or `dissolveOnChange` / `dissolveOnCommit`, depending on the component) when you want the click handled without the transition — a button inside a tight list, for instance.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `const quiet = headlessButton({
  screen,
  label: 'NO DISSOLVE',
  dissolveOnActivate: false,
  onClick: () => submit(),
})`,
    },
    { kind: 'h3', text: 'Re-entrancy' },
    {
      kind: 'p',
      text: 'Each component guards its own cycle. While one is mid-transition it ignores repeat activation, but other components stay fully interactive — one dissolving button never freezes the rest of the screen. Read it with `isTransitioning()`.',
    },
  ],
};

const RENDER_STRATEGY: DocPage = {
  slug: 'render-strategy',
  title: 'Discrete vs continuous',
  lede: 'Why a slider must never rasterize away, and how the compiler enforces it.',
  blocks: [
    {
      kind: 'p',
      text: 'Some interactions are instantaneous: a click, a toggle, a selection. The element can safely vanish into particles because the interaction is already over. Others run over time: a slider drag, typing, an IME composition. Rasterizing those away mid-gesture destroys them.',
    },
    {
      kind: 'p',
      text: 'The library encodes this as a role-to-strategy table, so the distinction is a compile-time fact rather than a convention someone has to remember.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `import { RENDER_STRATEGY_BY_ROLE, renderStrategyOf }
  from '@tesyl/screean-components/components'

RENDER_STRATEGY_BY_ROLE['button']  // 'rasterize'
RENDER_STRATEGY_BY_ROLE['slider']  // 'live-dom'

renderStrategyOf('textbox')        // 'live-dom'`,
    },
    {
      kind: 'table',
      head: ['Strategy', 'Behaviour', 'Components'],
      rows: [
        [
          'rasterize',
          'Element hides and becomes particles on activation.',
          'button · label · card · checkbox · switch · radio · img',
        ],
        [
          'live-dom',
          'Element stays live throughout; particles never replace it mid-gesture.',
          'slider · textbox',
        ],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Live-dom still dissolves',
      text: 'A text field dissolves on commit, not on every keystroke — the transition happens at the end of the interaction rather than during it. A slider reports each change through `onChange` while staying live the whole time.',
    },
  ],
};

const STYLING: DocPage = {
  slug: 'styling',
  title: 'Styling',
  lede: 'Default skin, your own classes, and the two rules the rasterizer imposes.',
  blocks: [
    {
      kind: 'p',
      text: 'Every factory ships an inline default skin so a component looks reasonable with no work. Pass `className` to layer your own styles on top, or `unstyled: true` to drop the default skin entirely and take full control.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `// Default skin, plus a class of your own.
headlessButton({ screen, label: 'SEND', className: 'btn', onClick })

// No default skin at all.
headlessButton({
  screen,
  label: 'SEND',
  unstyled: true,
  className: 'my-button',
  onClick,
})

// Inline overrides merged over the default skin.
// NOTE: this is Partial<CSSStyleDeclaration>, not React.CSSProperties —
// numeric values need units.
headlessButton({
  screen,
  label: 'SEND',
  style: { borderRadius: '2px', fontSize: '14px' },
  onClick,
})`,
    },
    { kind: 'h3', text: 'The rasterizer input contract' },
    {
      kind: 'p',
      text: 'A dissolve captures the element by rendering it through an SVG `foreignObject`. That sandbox cannot reach out to the network, which produces two hard rules.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'No cross-origin url() assets',
      text: 'Background images, masks, and fonts loaded from another origin will not paint into the particle field. Inline them as data URIs, or serve them same-origin.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Fonts must be ready before the first dissolve',
      text: 'If a web font is still loading, the capture records the fallback face and the particles spell the component in the wrong typeface. Await `document.fonts.ready` before enabling transitions.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `await document.fonts.ready
const screen = createScreenController({ canvas })`,
    },
    { kind: 'h3', text: 'CSS custom properties' },
    {
      kind: 'p',
      text: 'Custom properties resolve against the document, not the foreignObject sandbox. A colour written as `var(--accent)` may not survive the capture — use literal values for anything that must appear in the particle field.',
    },
  ],
};

const REACT: DocPage = {
  slug: 'react',
  title: 'React',
  lede: 'Wrappers over the same factories, with the controller supplied by context.',
  blocks: [
    {
      kind: 'p',
      text: 'The `./react` subpath wraps each factory in a component. Props mirror the factory options exactly, minus `screen` — which comes from the engine’s `ScreenProvider` context, or from an explicit `screen` prop when you need to override it.',
    },
    {
      kind: 'code',
      label: 'tsx',
      code: `'use client'

import { ScreenProvider } from '@tesyl/screean/react'
import { ScreeanButton, ScreeanSlider }
  from '@tesyl/screean-components/react'

export const Panel = () => (
  <ScreenProvider>
    <ScreeanButton label="SEND" onClick={() => send()} />
    <ScreeanSlider
      ariaLabel="Volume"
      min={0}
      max={100}
      onChange={(v) => setVolume(v)}
    />
  </ScreenProvider>
)`,
    },
    { kind: 'h3', text: 'Imperative handles' },
    {
      kind: 'p',
      text: 'Each wrapper forwards a ref to the underlying component handle, so you can drive a transition from outside the component.',
    },
    {
      kind: 'code',
      label: 'tsx',
      code: `import { useRef } from 'react'
import { ScreeanButton, type ScreeanButtonHandle }
  from '@tesyl/screean-components/react'

const ref = useRef<ScreeanButtonHandle | null>(null)

<ScreeanButton ref={ref} label="SEND" onClick={send} />

// Later:
await ref.current?.dissolve()`,
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Inline callbacks are safe',
      text: 'Handlers are routed through a latest-ref, so passing a new inline arrow on every render does not tear down and rebuild the underlying component.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'style is not React.CSSProperties',
      text: 'The `style` prop follows the factory contract, `Partial<CSSStyleDeclaration>`. Numeric values stringify without units, so write `fontSize: "14px"` rather than `fontSize: 14`.',
    },
  ],
};

const SCREEN_CONTROLLER: DocPage = {
  slug: 'screen-controller',
  title: 'createScreenController',
  lede: 'The one transition engine. Every dissolve and swap goes through it.',
  blocks: [
    {
      kind: 'code',
      label: 'typescript',
      code: `const screen = createScreenController({
  canvas,
  feel: 'magnetic',
  particleCount: 6000,
})`,
    },
    { kind: 'h3', text: 'Options' },
    {
      kind: 'api',
      name: 'canvas',
      type: 'HTMLCanvasElement',
      required: true,
      body: ['The overlay the particles draw into. Give it `pointer-events: none` so clicks reach the components beneath it.'],
    },
    {
      kind: 'api',
      name: 'feel',
      type: 'FeelName',
      defaultsTo: "'soft'",
      body: ['Named force preset governing how particles move — spring stiffness, drag, repulsion. Try `calm`, `crisp`, `dreamy`, `soft`, `taut`, `balanced`.'],
    },
    {
      kind: 'api',
      name: 'feelOverrides',
      type: 'Partial<FeelPreset>',
      body: ['Per-constant overrides merged over the chosen preset, for when a preset is nearly right.'],
    },
    {
      kind: 'api',
      name: 'particleCount',
      type: 'number',
      defaultsTo: '6000',
      body: [
        'Particles spawned per transition. Each component also carries its own default scaled to its silhouette, which takes precedence over this one.',
        'Lower it for dense grids; raise it for large, detailed components.',
      ],
    },
    {
      kind: 'api',
      name: 'particlePhaseMs',
      type: 'number',
      body: ['How long the particles stay dispersed before reforming.'],
    },
    {
      kind: 'api',
      name: 'disperseKick',
      type: 'number',
      body: ['Outward impulse applied at the moment of dissolve. Higher reads as a harder shatter.'],
    },
    {
      kind: 'api',
      name: 'fadeMs',
      type: 'number',
      body: ['Crossfade duration between the element and the particle field.'],
    },
    {
      kind: 'api',
      name: 'originOf',
      type: '(el: HTMLElement) => { x: number; y: number }',
      body: ['Maps an element to canvas-local coordinates. Override it when the canvas is not the element’s offset parent — a scrolling container, or a canvas mounted at a different origin.'],
    },
    {
      kind: 'api',
      name: 'minView',
      type: '{ w: number; h: number }',
      body: ['Floor for the simulated viewport, so transitions in a very small container still behave.'],
    },
    {
      kind: 'api',
      name: 'ownLoop',
      type: 'boolean',
      defaultsTo: 'true',
      body: ['When true the controller runs its own animation frame loop. Set false and call `tick(now)` yourself to fold it into an existing render loop.'],
    },
    { kind: 'h3', text: 'Returns' },
    {
      kind: 'api',
      name: 'dissolve',
      type: '(el, overrides?) => Promise<void>',
      body: ['Round-trips an element through the particle field. Resolves once it has reformed and settled.'],
    },
    {
      kind: 'api',
      name: 'swap',
      type: '(from, into, overrides?) => Promise<void>',
      body: ['Morphs one element’s silhouette into another’s. The target should start at opacity 0; it fades in during the reform.'],
    },
    {
      kind: 'api',
      name: 'thwack',
      type: '(x, y, strength?) => void',
      body: ['Pushes live particles away from a point. A play gesture — it only has an effect while particles exist, so it reads best mid-transition.'],
    },
    {
      kind: 'api',
      name: 'fieldOf',
      type: '(el) => Promise<BitmapField>',
      body: ['Rasterizes an element to a bitmap field without transitioning. Useful for warming the cache before a transition that must not stutter.'],
    },
    {
      kind: 'api',
      name: 'phase',
      type: '() => TransitionPhaseKind',
      body: ['The controller’s current global phase. For gating interaction, prefer a component’s own `isTransitioning()`.'],
    },
    {
      kind: 'api',
      name: 'tick',
      type: '(now: number) => void',
      body: ['Advances the simulation. Call it yourself only when `ownLoop` is false.'],
    },
    {
      kind: 'api',
      name: 'dispose',
      type: '() => void',
      body: ['Releases the renderer and its GPU context. Dispose components first.'],
    },
  ],
};

const COMPONENTS_REFERENCE: DocPage = {
  slug: 'components-reference',
  title: 'Components',
  lede: 'The nine factories, their options, and what each one returns.',
  blocks: [
    {
      kind: 'p',
      text: 'Every factory takes `screen` plus its own options, and returns a handle carrying the real element. These options are shared by all of them.',
    },
    {
      kind: 'table',
      head: ['Option', 'Type', 'Notes'],
      rows: [
        ['screen', 'ScreenController', 'Required. The shared transition core.'],
        ['ariaLabel', 'string', 'Accessible name. Defaults from the visible label where there is one.'],
        ['disabled', 'boolean', 'Blocks activation.'],
        ['unstyled', 'boolean', 'Drop the default inline skin entirely.'],
        ['className', 'string', 'Class hook, with or without the default skin.'],
        ['style', 'Partial<CSSStyleDeclaration>', 'Inline overrides. Not React.CSSProperties — units required.'],
        ['particleCount', 'number', 'Per-component particle budget.'],
      ],
    },
    {
      kind: 'p',
      text: 'And every handle carries the same surface.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `type ElementComponent = {
  el: HTMLElement              // the real element — append it anywhere
  role: AriaRole
  strategy: 'rasterize' | 'live-dom'
  isTransitioning: () => boolean
  dissolve: () => Promise<void>
  swapTo: (into: ElementComponent) => Promise<void>
  dispose: () => void
}`,
    },
    { kind: 'h3', text: 'headlessButton' },
    {
      kind: 'code',
      label: 'typescript',
      code: `const btn = headlessButton({
  screen,
  label: 'SEND',
  onClick: (e) => submit(),
  dissolveOnActivate: true,   // default
})`,
    },
    { kind: 'h3', text: 'headlessToggle' },
    {
      kind: 'code',
      label: 'typescript',
      code: `const toggle = headlessToggle({
  screen,
  ariaLabel: 'Dark mode',     // required — no visible text
  checked: false,
  onChange: (checked) => setDark(checked),
})

toggle.checked()              // boolean
toggle.setChecked(true)       // drive it externally`,
    },
    { kind: 'h3', text: 'headlessCheckbox' },
    {
      kind: 'code',
      label: 'typescript',
      code: `const box = headlessCheckbox({
  screen,
  label: 'Remember me',
  checked: false,
  onChange: (checked) => setRemember(checked),
})`,
    },
    { kind: 'h3', text: 'createRadioGroup' },
    {
      kind: 'p',
      text: 'Radios are created as a group rather than individually — the group owns mutual exclusivity, keyboard navigation, and the `role="radiogroup"` container.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `const group = createRadioGroup({
  screen,
  options: [
    { label: 'Small',  value: 'sm' },
    { label: 'Medium', value: 'md', checked: true },
    { label: 'Large',  value: 'lg' },
  ],
  onChange: (value) => setSize(value),
})

host.appendChild(group.el)

group.selected()     // 'md' | null
group.select('lg')   // programmatic, does not dissolve`,
    },
    { kind: 'h3', text: 'headlessSlider' },
    {
      kind: 'p',
      text: 'Continuous — stays live DOM through the whole drag. `value` seeds the position; the slider echoes its own visuals during the gesture and reports through `onChange`.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `const slider = headlessSlider({
  screen,
  ariaLabel: 'Volume',
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  onChange: (value) => setVolume(value),
})

slider.value()          // number
slider.setValue(80)`,
    },
    { kind: 'h3', text: 'headlessTextField' },
    {
      kind: 'p',
      text: 'Continuous. `onInput` fires per keystroke; `onCommit` fires on blur or Enter, and that is when the dissolve happens.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `const field = headlessTextField({
  screen,
  ariaLabel: 'Email',           // required — a placeholder is not a name
  placeholder: 'you@example.com',
  value: '',
  onInput: (v) => setDraft(v),
  onCommit: (v) => save(v),
  dissolveOnCommit: true,       // default
})

field.value()
field.setValue('hi@example.com')`,
    },
    { kind: 'h3', text: 'headlessLabel' },
    {
      kind: 'code',
      label: 'typescript',
      code: `const title = headlessLabel({
  screen,
  text: 'SETTINGS',
  heading: true,      // renders as a heading rather than a span
})`,
    },
    { kind: 'h3', text: 'headlessCard' },
    {
      kind: 'p',
      text: 'A container. Pass `children` as real elements. Adding `onClick` makes it activate — and dissolve — like a button.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `const card = headlessCard({
  screen,
  children: [title.el, body.el],
  onClick: () => open(),      // optional
})`,
    },
    { kind: 'h3', text: 'headlessImage' },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Same-origin images only',
      text: 'A cross-origin image cannot be rasterized into the particle field. Serve it from your own origin or inline it as a data URI.',
    },
    {
      kind: 'code',
      label: 'typescript',
      code: `const img = headlessImage({
  screen,
  src: '/hero.png',
  alt: 'Product hero',    // required — decorative images pass alt: ''
  width: 320,
  height: 200,
})`,
    },
  ],
};

const ALL_PAGES: ReadonlyArray<DocPage> = [
  OVERVIEW,
  INSTALLATION,
  QUICK_START,
  IMPORTANT_DEFAULTS,
  DISSOLVE_CONTRACT,
  RENDER_STRATEGY,
  STYLING,
  REACT,
  SCREEN_CONTROLLER,
  COMPONENTS_REFERENCE,
];

const BY_SLUG: ReadonlyMap<string, DocPage> = new Map(ALL_PAGES.map((p) => [p.slug, p]));

/** Reading order, flattened from the sidebar — what previous/next follow. */
export const SCREEAN_DOC_ORDER: ReadonlyArray<string> = SCREEAN_DOC_GROUPS.flatMap((g) => g.slugs);

export const getScreeanDocPage = (slug: string): DocPage | undefined => BY_SLUG.get(slug);

export const getScreeanDocPages = (): ReadonlyArray<DocPage> => ALL_PAGES;

export type DocNeighbours = {
  readonly previous: DocPage | undefined;
  readonly next: DocPage | undefined;
};

/** The pages either side of this one in reading order. */
export const getScreeanDocNeighbours = (slug: string): DocNeighbours => {
  const i = SCREEAN_DOC_ORDER.indexOf(slug);
  if (i === -1) return { previous: undefined, next: undefined };
  const at = (n: number): DocPage | undefined => {
    const s = SCREEAN_DOC_ORDER[n];
    return s === undefined ? undefined : BY_SLUG.get(s);
  };
  return { previous: at(i - 1), next: at(i + 1) };
};

/** Which group a slug belongs to, for the breadcrumb. */
export const getScreeanDocGroupTitle = (slug: string): string | undefined =>
  SCREEAN_DOC_GROUPS.find((g) => g.slugs.includes(slug))?.title;

/** Headings a page will render, for the "on this page" rail. */
export const getScreeanDocHeadings = (page: DocPage): ReadonlyArray<string> =>
  page.blocks.filter((b) => b.kind === 'h3').map((b) => (b as { text: string }).text);

/** Stable id for a heading, shared by the rail and the heading itself. */
export const headingId = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
