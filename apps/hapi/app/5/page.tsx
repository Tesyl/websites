import Link from 'next/link';
import {
  FEATURES,
  INSTALL_COMMAND,
  PACKAGE_REPO,
  PACKAGE_VERSION,
  SUBHEAD,
} from '@tesyl/content/hapi';
import { Switcher } from '../_review/Switcher';
import { Foot, SwitchBlock, Top } from './parts';

export default function BroadcastLanding() {
  return (
    <>
      <Top active="landing" />

      <main>
        <section className="wrap hero">
          <div className="hero__meta mono">
            <span>v{PACKAGE_VERSION}</span>
            <span>TanStack Query 5</span>
            <span>8 error tags</span>
            <span>MIT</span>
          </div>

          <h1 className="mega display">
            <span>Every</span>
            <span className="out">failure</span>
            <span>
              has a <span className="o">name</span>
            </span>
          </h1>

          <div className="hero__grid">
            <p className="lede">{SUBHEAD}</p>
            <div className="side">
              <Link href="/5/docs" className="btn">
                Read the docs
              </Link>
              <a href={PACKAGE_REPO} className="btn btn--alt">
                View source
              </a>
              <code className="cmd mono">{INSTALL_COMMAND}</code>
            </div>
          </div>
        </section>

        <SwitchBlock />

        <section className="wrap sec">
          <h2 className="h2 display">Six things it does</h2>
          <div className="cells">
            {FEATURES.map((f, i) => (
              <article key={f.title} className="cell">
                <span className="cell__n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display">{f.title}</h3>
                <p>{f.body}</p>
                {f.code ? <pre className="snip">{f.code}</pre> : null}
              </article>
            ))}
          </div>
        </section>
      </main>

      <Foot />
      <Switcher current={5} />
    </>
  );
}
