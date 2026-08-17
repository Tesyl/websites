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
  { href: '/docs', label: 'Docs' },
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
  screen,
  label: 'DISSOLVE ME',
  onClick: () => console.log('clicked'),
})

document.body.appendChild(btn.el)`;
