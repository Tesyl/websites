import Link from 'next/link';
import {
  ERROR_TAGS,
  FEATURES,
  INSTALL_COMMAND,
  PACKAGE_REPO,
  SUBHEAD,
} from '@tesyl/content/hapi';
import { Switcher } from '../_review/Switcher';
import { Foot, Head, KeyRecord } from './parts';

export default function LedgerLanding() {
  return (
    <>
      <Head active="landing" />

      <main>
        <section className="wrap hero">
          <div>
            <p className="ref mono">Ref. 0.2.0 — cache identity</p>
            <h1 className="h1">
              Two resources. <mark>Two entries.</mark>
            </h1>
            <p className="lede">{SUBHEAD}</p>
            <div className="cta">
              <Link href="/4/docs" className="btn btn--fill">
                Reference
              </Link>
              <a href={PACKAGE_REPO} className="btn">
                Source
              </a>
            </div>
            <p className="cmd mono">{INSTALL_COMMAND}</p>
          </div>

          <KeyRecord />
        </section>

        <section className="wrap sec">
          <div className="sec__t">
            <h2 className="h2">Register of failures</h2>
            <span className="sec__n">8 entries · union closed</span>
          </div>
          <div className="ledger">
            <table>
              <thead>
                <tr>
                  <th scope="col">Tag</th>
                  <th scope="col">Condition</th>
                  <th scope="col">Carries</th>
                  <th scope="col">Retry</th>
                </tr>
              </thead>
              <tbody>
                {ERROR_TAGS.map((t) => (
                  <tr key={t.tag}>
                    <td className="mono">{t.tag}</td>
                    <td>{t.cause}</td>
                    <td className="mono" style={{ color: 'var(--steel)' }}>
                      {t.payload}
                    </td>
                    <td className="mono">{t.retryable ? 'permitted' : 'never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="wrap sec">
          <div className="sec__t">
            <h2 className="h2">Terms of the declaration</h2>
            <span className="sec__n">six clauses</span>
          </div>
          <div className="cols">
            {FEATURES.map((f) => (
              <article key={f.title} className="col">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                {f.code ? <pre className="snip">{f.code}</pre> : null}
              </article>
            ))}
          </div>
        </section>
      </main>

      <Foot />
      <Switcher current={4} />
    </>
  );
}
