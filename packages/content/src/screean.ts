/**
 * The real content for @tesyl/screean and @tesyl/screean-components.
 *
 * Data only. Presentation lives in apps/screean. Same rule as hapi.ts:
 * every design renders this module, so designs differ in how the material
 * is presented, never in what it says.
 */

export type NavLink = {
  readonly href: string;
  readonly label: string;
  /** External links open in a new tab and skip active-state matching. */
  readonly external?: boolean;
};

export type Feature = {
  readonly title: string;
  readonly body: string;
  readonly code?: string;
};

export type DocsSection = {
  readonly id: string;
  readonly title: string;
  readonly blurb: string;
  readonly body: ReadonlyArray<string>;
  readonly code?: string;
  readonly codeLabel?: string;
};

export const PACKAGE_NAME = '@tesyl/screean-components';
export const ENGINE_PACKAGE_NAME = '@tesyl/screean';
export const PACKAGE_VERSION = '0.3.0';
export const PACKAGE_TAGLINE = 'Components that dissolve into particles and reform.';
export const PACKAGE_REPO = 'https://github.com/Tesyl/screean-components';
export const ENGINE_REPO = 'https://github.com/Tesyl/screean';
export const PACKAGE_LICENSE = 'MIT';

export const HEADLINE = 'Real DOM. Until it isn’t.';
export const SUBHEAD =
  'A headless component library where every component is a real DOM element — focusable, accessible, yours to style — that dissolves into a particle cloud on activation and reforms on the other side.';

export const INSTALL_COMMAND =
  'npm install @tesyl/screean-components @tesyl/screean';

/** The site’s primary navigation. Experiments and the lab are not
 *  published yet — add them here when those routes ship. */
export const NAV_LINKS: ReadonlyArray<NavLink> = [
  { href: '/', label: 'Home' },
  { href: '/components', label: 'Components' },
  { href: PACKAGE_REPO, label: 'GitHub', external: true },
];

export const FEATURES: ReadonlyArray<Feature> = [
  {
    title: 'DOM-first, always',
    body: 'The real element is the single source of truth. Particles are a transition artifact, never the thing you interact with. Screen readers, keyboard focus, and form semantics keep working because nothing was replaced.',
  },
  {
    title: 'One transition engine',
    body: 'Every dissolve and swap goes through a single screen controller. There is no second implementation to drift out of sync, and tuning is shared across every component at once.',
    code: 'const screen = createScreenController({ canvas, feel: \'magnetic\' })',
  },
  {
    title: 'Discrete and continuous, split at compile time',
    body: 'Buttons rasterize away on activation. Sliders and text fields stay live DOM throughout, because rasterizing away an in-progress drag or IME composition breaks it. A role-to-strategy table makes the compiler enforce the difference.',
    code: 'RENDER_STRATEGY_BY_ROLE[\'slider\'] // \'live-dom\'',
  },
  {
    title: 'Headless by default',
    body: 'Ship the default inline skin or pass `unstyled` and bring your own classes. The only constraint comes from the rasterizer: no cross-origin url() assets, and fonts must be ready before a dissolve.',
  },
];

export const QUICK_START_CODE = `import { headlessButton, createScreenController }
  from '@tesyl/screean-components/components'

const screen = createScreenController({ canvas })
const btn = headlessButton({
  label: 'DISSOLVE ME',
  onClick: () => screen.dissolve(btn.element),
})
document.body.appendChild(btn.element)`;

export const DOCS_SECTIONS: ReadonlyArray<DocsSection> = [
  {
    id: 'install',
    title: 'Install',
    blurb: 'Two packages: the components and the engine they run on.',
    body: [
      'The engine is a peer dependency, so install it alongside the component library. React and react-dom are optional peers — install them only if you use the ./react subpath.',
      'Every entry ships as ESM with a blanket ‘use client’ banner. The package is browser-only, so in a server-rendered framework each import must sit behind a client boundary.',
    ],
    code: INSTALL_COMMAND,
    codeLabel: 'shell',
  },
  {
    id: 'entries',
    title: 'Three entry points',
    blurb: 'Pick the surface that matches your framework.',
    body: [
      'The package root exports the six-ink GPU hero and background.',
      'The ./components subpath exports the nine vanilla headless factories plus the transition core. This is the framework-agnostic surface.',
      'The ./react subpath exports component wrappers over those same factories, plus the SixInkBackground component.',
    ],
    code: `import { mount } from '@tesyl/screean-components'
import { headlessButton } from '@tesyl/screean-components/components'
import { ScreeanButton } from '@tesyl/screean-components/react'`,
    codeLabel: 'typescript',
  },
  {
    id: 'quick-start',
    title: 'Quick start',
    blurb: 'One controller, one component, one dissolve.',
    body: [
      'A screen controller owns the particle canvas and the transition timing. Create one per screen and share it across every component on that screen — one engine, many components.',
      'The activation contract for a discrete component is fixed: flip state, repaint, fire onChange, then dissolve. Dissolving before the repaint captures the old pixels.',
    ],
    code: QUICK_START_CODE,
    codeLabel: 'typescript',
  },
  {
    id: 'components',
    title: 'The nine factories',
    blurb: 'Every component the library ships.',
    body: [
      'Discrete (rasterize on activation): headlessButton, headlessLabel, headlessCard, headlessCheckbox, headlessToggle, createRadioGroup, headlessImage.',
      'Continuous (stay live DOM): headlessSlider, headlessTextField. These never rasterize away mid-interaction, because a drag or an IME composition would be destroyed by it.',
      'Each factory returns a handle carrying the real element, a dispose function, and role-appropriate state accessors.',
    ],
  },
  {
    id: 'styling',
    title: 'Styling',
    blurb: 'Default skin, or your own.',
    body: [
      'The default skins are inline and safe inside the rasterizer’s foreignObject context. Pass `unstyled` with your own `className` to take over completely.',
      'Two constraints come from the rasterizer, not from us. Cross-origin url() assets will not paint into the particle field, and web fonts must be loaded before a dissolve or the captured pixels will show the fallback face.',
    ],
  },
];
