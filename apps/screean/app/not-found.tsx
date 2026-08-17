import Link from 'next/link';
import { SiteFooter, SiteNav } from './chrome';

// A 404 inside the site chrome, so a wrong URL still leaves the reader
// somewhere they can navigate from. The two links are the two things
// anyone landing here actually wants.
const NotFound = () => (
  <>
    <div className="world-behind components-bg" aria-hidden="true" />
    <SiteNav />
    <section className="doc-head">
      <span className="doc-eyebrow">404</span>
      <h1>Not here</h1>
      <p>
        That page does not exist. It may have been renamed, or the link may
        have been wrong to begin with.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-primary" href="/docs">
          Read the docs
        </Link>
        <Link className="btn btn-ghost" href="/components">
          Browse components
        </Link>
      </div>
    </section>
    <SiteFooter />
  </>
);

export default NotFound;
