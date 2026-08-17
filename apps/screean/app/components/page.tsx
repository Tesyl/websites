import type { Metadata } from 'next';
import { SiteFooter, SiteNav } from '../chrome';
import { ComponentsGrid } from './grid';

export const metadata: Metadata = {
  title: 'Components',
  description:
    'Every primitive screean ships, in isolation — fields, composition, layout, forces, feel presets, type, choreography, and easing.',
};

const ComponentsPage = () => (
  <>
    <div className="world-behind components-bg" aria-hidden="true" />
    <SiteNav />
    <section className="doc-head">
      <span className="doc-eyebrow">storybook</span>
      <h1>Components</h1>
      <p>
        Every primitive screean ships, in isolation. Pick a category in the
        sidebar; click any snippet to copy.
      </p>
    </section>
    <ComponentsGrid />
    <SiteFooter />
  </>
);

export default ComponentsPage;
