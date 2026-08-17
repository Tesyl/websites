import Link from 'next/link';
import { ERROR_TAGS, FEATURES, INSTALL_COMMAND, SUBHEAD } from '@tesyl/content/hapi';
import { Switcher } from '../_review/Switcher';
import { Foot, Plate } from './parts';

/**
 * The signature element.
 *
 * A dichotomous key — the device a field guide uses to narrow an observation
 * to exactly one species. It works here because hapi's union genuinely is
 * exhaustive: answer four questions and you land on one tag, every time.
 */
const KEY_STEPS = [
  {
    n: '1a',
    q: 'The request never left, or the connection failed.',
    a: 'transport',
  },
  {
    n: '1b',
    q: 'The request completed, or was stopped deliberately.',
    a: 'go to 2',
  },
  {
    n: '2a',
    q: 'A caller cancelled, or a timeout elapsed.',
    a: 'abort',
  },
  {
    n: '2b',
    q: 'Nothing cancelled it.',
    a: 'go to 3',
  },
  {
    n: '3a',
    q: 'A schema rejected the value.',
    a: 'go to 4',
  },
  {
    n: '3b',
    q: 'The server answered with a non-ok status.',
    a: 'http',
  },
  {
    n: '4a',
    q: 'The value came from the caller — a body or a path parameter.',
    a: 'request-validation · path-validation',
  },
  {
    n: '4b',
    q: 'The value came from the server, or the schema itself is unusable.',
    a: 'response-validation · configuration',
  },
];

export default function FieldGuideLanding() {
  return (
    <>
      <Plate active="landing" />

      <main>
        <section className="wrap hero">
          <div>
            <p className="taxon">Family — HapiError · 8 species · union closed</p>
            <h1 className="h1 display">
              A field guide to <i>everything that can go wrong.</i>
            </h1>
            <p className="lede">{SUBHEAD}</p>
            <div className="cta">
              <Link href="/3/docs">Read the handbook</Link>
              <span style={{ color: 'var(--ink-3)', textTransform: 'none', letterSpacing: 0 }}>
                or start with the key →
              </span>
            </div>
            <p className="spec mono">{INSTALL_COMMAND}</p>
          </div>

          <div className="key">
            <p className="key__t">Key to the failure modes</p>
            <p className="key__s">
              Begin at 1. Follow whichever statement is true until it names a tag.
            </p>
            {KEY_STEPS.map((s) => (
              <div key={s.n} className="step">
                <span className="step__n mono">{s.n}</span>
                <p className="step__q">
                  {s.q}
                  <span className="step__a mono">
                    {s.a.startsWith('go to') ? (
                      <>— {s.a}</>
                    ) : (
                      <>
                        — <b>{s.a}</b>
                      </>
                    )}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap sec">
          <div className="sec__t">
            <h2 className="h2 display">Plate I — the eight species</h2>
            <span className="sec__n">described in full</span>
          </div>
          <div className="specimens">
            {ERROR_TAGS.map((t, i) => (
              <article key={t.tag} className="card">
                <span className="card__no mono">{String(i + 1).padStart(2, '0')}</span>
                <p className="card__latin mono">{t.tag}</p>
                <h3 className="card__t display">{t.title}</h3>
                <p className="card__c">{t.cause}</p>
                <p className="card__c" style={{ marginBottom: 0 }}>
                  {t.recovery}
                </p>
                <p className="card__row mono">
                  <span>
                    <b>carries</b> {t.payload}
                  </span>
                </p>
                <p className="card__row mono" style={{ border: 0, paddingTop: '0.3rem' }}>
                  <span>
                    <b>retry</b> {t.retryable ? 'yes' : 'never'}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap sec">
          <div className="sec__t">
            <h2 className="h2 display">Plate II — habits and behaviour</h2>
            <span className="sec__n">six field marks</span>
          </div>
          <div className="habits">
            {FEATURES.map((f) => (
              <article key={f.title} className="habit">
                <h3 className="display">{f.title}</h3>
                <p>{f.body}</p>
                {f.code ? <pre className="snip">{f.code}</pre> : null}
              </article>
            ))}
          </div>
        </section>
      </main>

      <Foot />
      <Switcher current={3} />
    </>
  );
}
