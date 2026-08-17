import Link from 'next/link';
import { PACKAGE_NAME, PACKAGE_REPO, PACKAGE_VERSION } from '@tesyl/content/hapi';

export function Plate({ active }: { active: 'landing' | 'docs' }) {
  return (
    <header className="plate">
      <div className="plate__in">
        <Link href="/3" className="plate__name display">
          {PACKAGE_NAME} <span>v{PACKAGE_VERSION}</span>
        </Link>
        <nav className="plate__nav">
          <Link href="/3" data-on={active === 'landing'}>
            Plates
          </Link>
          <Link href="/3/docs" data-on={active === 'docs'}>
            Handbook
          </Link>
          <a href={PACKAGE_REPO}>Source</a>
        </nav>
      </div>
    </header>
  );
}

export function Foot() {
  return (
    <footer className="foot wrap">
      <span>
        {PACKAGE_NAME} v{PACKAGE_VERSION} — MIT. Eight species of failure, fully described.
      </span>
      <span>
        <a href={PACKAGE_REPO}>github</a> · <Link href="/">other directions</Link>
      </span>
    </footer>
  );
}
