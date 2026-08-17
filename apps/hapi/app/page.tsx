import Link from 'next/link';
import {
  ERROR_TAGS,
  FEATURES,
  INSTALL_COMMAND,
  PACKAGE_REPO,
  SUBHEAD,
} from '@tesyl/content/hapi';
import { Bar, Foot, Id } from './parts';

const LINES = Array.from({ length: 9 }, (_, i) => i + 1);

export default function LandingPage() {
  return (
    <>
      <Bar active="landing" />

      <main>
        <section className="wrap hero">
          <div>
            <p className="kicker mono">inference, not annotation</p>
            <h1 className="h1">
              The types are already <u>there</u>.
            </h1>
            <p className="lede">{SUBHEAD}</p>
            <div className="row-cta">
              <Link href="/docs" className="btn btn--go">
                Read the docs
              </Link>
              <a href={PACKAGE_REPO} className="btn">
                View source
              </a>
            </div>
            <div className="cmd mono">{INSTALL_COMMAND}</div>
          </div>

          <div className="pane">
            <div className="pane__head">
              <span className="mono">UserProfile.tsx</span>
              <span className="pane__hint mono">hover a name to see its type</span>
            </div>
            <div className="code">
              <div className="code__gutter">
                {LINES.map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>
              <pre className="code__body">
                <span className="t-key">function</span>{' '}
                <span className="t-fn">UserProfile</span>({'{ id }'}:{' '}
                {'{ id: '}
                <span className="t-key">string</span>
                {' }'}) {'{'}
                {'\n'}  <span className="t-key">const</span> {'{ '}
                <Id
                  signature="const data: User | undefined"
                  doc="Narrowed from the endpoint's responseSchema. No annotation was written anywhere."
                >
                  data
                </Id>
                {', '}
                <Id
                  signature="const error: HapiError | null"
                  doc="A closed union of eight tags, not Error. Switching on error.tag is exhaustive."
                >
                  error
                </Id>
                {' } = api.users.'}
                <Id
                  signature="(property) detail: UnifiedEndpoint<DetailConfig>"
                  doc="Every call shape hangs off this one object: useQuery, useMutation, fetch, and the options builders."
                >
                  detail
                </Id>
                {'\n'}    .
                <Id
                  signature="withPathParams<{ id: string }>(p: { id: string }): UnifiedEndpoint<…>"
                  doc="Returns a new endpoint. The original is never mutated, so api.users.detail stays reusable."
                >
                  withPathParams
                </Id>
                ({'{ id }'})
                {'\n'}    .
                <Id
                  signature="useQuery<TData = User>(request?, options?): UseQueryResult<TData, HapiError>"
                  doc="Available only because the method is GET and every required path param is bound. On a POST endpoint this member is never."
                >
                  useQuery
                </Id>
                ();
                {'\n\n'}  <span className="t-com">{'// data is User | undefined — nothing was annotated'}</span>
                {'\n'}  <span className="t-key">if</span> ({'!'}data) <span className="t-key">return</span>{' '}
                <span className="t-fn">{'<Skeleton />'}</span>;
                {'\n'}  <span className="t-key">return</span>{' '}
                <span className="t-fn">{'<h1>'}</span>
                {'{data.'}
                <Id
                  signature="(property) name: string"
                  doc="Read straight off the validated response. If the server drifts, response validation catches it before this line runs."
                >
                  name
                </Id>
                {'}'}
                <span className="t-fn">{'</h1>'}</span>;
                {'\n'}
                {'}'}
              </pre>
            </div>
          </div>
        </section>

        <section className="wrap sec">
          <div className="sec__h">
            <h2 className="h2">What the declaration buys you</h2>
            <span className="sec__note mono">6 capabilities, 1 source of truth</span>
          </div>
          <div className="grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="card">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                {f.code ? <pre className="snip">{f.code}</pre> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="wrap sec">
          <div className="sec__h">
            <h2 className="h2">Problems</h2>
            <span className="sec__note mono">8 tags · union is closed</span>
          </div>
          <div className="diag">
            {ERROR_TAGS.map((t) => (
              <div key={t.tag} className="diag__row">
                <span
                  className="dot"
                  style={{ background: t.retryable ? 'var(--amber)' : 'var(--pink)' }}
                  aria-hidden="true"
                />
                <code className="diag__tag mono">{t.tag}</code>
                <span className="diag__cause">{t.cause}</span>
                <span className="diag__flag mono">{t.retryable ? 'retryable' : 'do not retry'}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Foot />
    </>
  );
}
