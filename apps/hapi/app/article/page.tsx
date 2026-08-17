import type { Metadata } from 'next';
import { PACKAGE_NAME, PACKAGE_VERSION } from '@tesyl/content/hapi';
import { Bar, Foot } from '../parts';
import './article.css';

export const metadata: Metadata = {
  title: 'What an API layer is actually for',
  description:
    'Ergonomics, readability, and the closures underneath — how @tesyl/hapi is built, and why.',
};

const SECTIONS = [
  { id: 'what', title: '1. What it actually does' },
  { id: 'ergonomics', title: '2. Ergonomics is a cost measurement' },
  { id: 'readability', title: '3. Readability is a naming problem' },
  { id: 'closures', title: '4. The closures underneath' },
  { id: 'lifetime', title: '5. The bug that taught the lesson' },
  { id: 'cost', title: '6. What it costs' },
];

export default function ArticlePage() {
  return (
    <>
      <Bar active="article" />

      <nav className="art__toc" aria-label="Sections">
        <p>Contents</p>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.title}
          </a>
        ))}
      </nav>

      <article className="art">
        <p className="art__kicker mono">Design notes</p>
        <h1 className="art__h1">What an API layer is actually for</h1>
        <p className="art__deck">
          Most API layers are judged on what they can do. The more useful question is what they
          cost you on the path you walk a hundred times a day. Here is how {PACKAGE_NAME} answers
          that — and the closures doing the work underneath.
        </p>
        <div className="art__meta mono">
          <span>{PACKAGE_NAME} v{PACKAGE_VERSION}</span>
          <span>·</span>
          <span>12 min read</span>
          <span>·</span>
          <span>Ergonomics · Readability · Closures</span>
        </div>

        <p>
          Every frontend eventually grows a folder called <code>api/</code>. It starts as a thin
          wrapper over <code>fetch</code>. Then someone adds retries. Then someone adds a Zod
          parse, but only on the endpoints they were working on that week. Then someone adds a
          React Query hook per endpoint, and the hooks drift from the promises, and now there are
          two ways to call the same thing that disagree about what comes back.
        </p>
        <p>
          The folder is not badly written. It is just the accumulated residue of everyone solving
          their own problem at their own call site. Nothing forces the pieces to agree.
        </p>

        <blockquote>
          <p>
            An API layer earns its place when calling an endpoint the obvious way is also calling
            it the correct way.
          </p>
        </blockquote>

        <h2 id="what">1. What it actually does</h2>
        <p className="art__sub">Functionality, stated plainly.</p>

        <p>
          You declare an endpoint once — method, path, and the schemas for its request, response,
          and path parameters. In return you get one object carrying every way you might call it:
          the React hook, the suspense hook, the mutation, the infinite query, the options object
          for prefetching, and a plain promise for the code that has no React in it at all.
        </p>

        <pre>
{`const users = defineService({
  service: 'users',
  basePath: '/users',
  endpoints: {
    detail: {
      endpoint: 'detail',
      method: `}<u>{`'GET'`}</u>{`,
      path: `}<u>{`'/:id'`}</u>{`,
      pathParamsSchema: z.object({ id: z.string() }),
      responseSchema: userSchema,
    },
  },
});`}
        </pre>

        <p>
          Underneath, one function does all the work. <code>executePipeline</code> is the only
          thing in the codebase that <em>does</em> anything; everything else is configuration
          assembly and type derivation. A request passes eight stages — resolve headers, build the
          request, validate the path, validate the body, transport, handle the status, read the
          response, validate the response — with eight hooks placed along the way.
        </p>
        <p>
          That concentration is deliberate. If one function is the only thing with side effects,
          then making that one function&apos;s contract honest — what it can throw, when it stops,
          and who can stop it — makes the whole library honest.
        </p>

        <h2 id="ergonomics">2. Ergonomics is a cost measurement</h2>
        <p className="art__sub">Not &ldquo;is it nice&rdquo;. What does the common path cost?</p>

        <p>
          &ldquo;Developer ergonomics&rdquo; gets used as a synonym for pleasant, which makes it
          impossible to argue about. A more useful definition: <strong>ergonomics is the total
          cost of doing the most common thing correctly</strong> — keystrokes, decisions,
          lookups, and the ways you can get it subtly wrong.
        </p>
        <p>
          Measure the common path. A component needs one user by id. In the accumulated{' '}
          <code>api/</code> folder that is: import the hook, remember whether it takes an object or
          a positional argument, remember whether the response is parsed, annotate the result
          because inference gave up somewhere, and write an error branch against{' '}
          <code>Error</code> with no idea what shapes actually arrive.
        </p>

        <pre>
{`const { data } = api.users.detail
  .withPathParams({ id })
  .useQuery();
`}<i>{`//      ^? User | undefined`}</i>
        </pre>

        <p>
          Three decisions, no annotations, and no lookup — because the shape of the endpoint object
          is the documentation. The saving is not the characters. It is that there is no longer a
          moment where you have to <em>remember</em> something.
        </p>

        <h3>Making the wrong call impossible rather than discouraged</h3>
        <p>
          The stronger ergonomic move is not making the right thing easy. It is making the wrong
          thing unrepresentable. If an endpoint is declared <code>POST</code>, its{' '}
          <code>useQuery</code> member is not missing — it is typed <code>never</code>. If a path
          parameter is still unbound, <code>fetch</code> is <code>never</code> too, because the URL
          could not be built.
        </p>
        <p>
          The same idea gives the chain its shape. <code>withPathParams</code> returns an endpoint
          whose type records what is now bound, so the capabilities that appear are the ones the
          binding just unlocked. You are not reading a manual about which calls are legal. The
          autocomplete list <em>is</em> the manual, and it is never out of date.
        </p>

        <div className="aside">
          <span className="aside__t">Worth noticing</span>
          <p>
            Both of those are compile-time facts, so they cost nothing at runtime and cannot drift
            from the implementation. A runtime warning that says &ldquo;useQuery is not valid on a
            POST endpoint&rdquo; is a worse version of the same idea: it arrives later, and only if
            you happened to execute that line.
          </p>
        </div>

        <h2 id="readability">3. Readability is a naming problem</h2>
        <p className="art__sub">And a shape problem.</p>

        <p>
          Readable code is code where you can predict what a thing does before you read its body.
          Two decisions in hapi do most of that work.
        </p>

        <h3>Name functions for what they do, and mark the ones that lie</h3>
        <p>
          Pure functions get plain names: <code>substitutePathParams</code>,{' '}
          <code>composeSignal</code>, <code>decideHttpError</code>. When a function cannot be pure,
          the name says so — <code>substitutePathParamsForKey</code> exists precisely because the
          strict version throws on an unbound parameter, and cache keys are built before anything
          is bound. Two names, two contracts, no flag argument that you have to look up.
        </p>

        <h3>A closed union turns error handling into a switch</h3>
        <p>
          This is the largest readability win in the library, and it is worth being precise about
          why. TanStack Query&apos;s error channel is unconstrained: it hands back whatever
          rejected. So error handling becomes a chain of <code>instanceof</code> checks and
          property sniffing, and every one of those checks is a small act of guessing.
        </p>
        <p>
          hapi normalises every rejection into one of eight tagged variants — including a plain{' '}
          <code>Error</code> thrown by one of your own hooks, which becomes <code>unknown</code>{' '}
          with the original preserved as <code>cause</code>. That last part is what makes the union
          honest rather than decorative:
        </p>

        <pre>
{`switch (err.tag) {
  case `}<u>{`'http'`}</u>{`:                return err.status === 404 ? null : rethrow(err);
  case `}<u>{`'abort'`}</u>{`:               return err.timedOut ? retry() : ignore();
  case `}<u>{`'transport'`}</u>{`:           return offline();
  case `}<u>{`'request-validation'`}</u>{`:
  case `}<u>{`'path-validation'`}</u>{`:     return report(err.failure.issues);
  case `}<u>{`'response-validation'`}</u>{`: return schemaDrift(err.rawResponse);
  case `}<u>{`'configuration'`}</u>{`:      throw err; `}<i>{`// your bug, not theirs`}</i>{`
  case `}<u>{`'unknown'`}</u>{`:            throw err;
}`}
        </pre>

        <p>
          You can read that and know it is complete, because the compiler knows it is complete. No
          comment claims it. Nothing has to be kept in sync.
        </p>

        <h2 id="closures">4. The closures underneath</h2>
        <p className="art__sub">Where the ergonomics actually come from.</p>

        <p>
          A closure is a function plus the variables it captured from where it was defined. That
          sounds academic until you notice that hapi&apos;s entire fluent API is one closure
          pattern applied consistently.
        </p>

        <h3>An endpoint is a bag of closures over one state</h3>
        <p>
          <code>buildUnifiedEndpoint</code> takes a state — the pipeline, the config, the fetcher —
          and returns an object whose every member captured that state:
        </p>

        <pre>
{`const buildUnifiedEndpoint = (state) => {
  const { `}<b>{`pipeline`}</b>{`, `}<b>{`config`}</b>{`, `}<b>{`fetcher`}</b>{` } = state;

  `}<i>{`// every member below closes over those three`}</i>{`
  const runRequest = (request, signal) =>
    executePipeline({ `}<b>{`pipeline`}</b>{`, request, fetcher: `}<b>{`fetcher`}</b>{`, ... });

  const queryKey    = buildEndpointKey(`}<b>{`pipeline`}</b>{`);
  const fetchFn     = (req, opts) => runRequest(req, composeSignal(...));
  const queryOptions = (req) => ({ queryKey: ..., queryFn: ... });

  return { queryKey, fetch: fetchFn, queryOptions, useQuery, ... };
};`}
        </pre>

        <p>
          This is why the call site needs no arguments repeated. <code>fetch()</code> already knows
          its path, its schemas, its headers, and its bound parameters, because those live in the
          scope it was born in. The ergonomics you feel at the call site are the captured variables
          you are not typing.
        </p>

        <h3>Immutability is closure replacement</h3>
        <p>
          So what does <code>.withPathParams({ '{ id }' })</code> do? It cannot mutate{' '}
          <code>pipeline</code> — the other closures already captured it, and changing it would
          change them from underneath. Instead it builds a <em>new</em> pipeline and calls{' '}
          <code>buildUnifiedEndpoint</code> again, producing a whole new set of closures over the
          new state:
        </p>

        <pre>
{`const derive = (state, next) =>
  buildUnifiedEndpoint({ ...state, pipeline: next });

withPathParams: (pathParams) =>
  derive(state, PipelineOps.bindPathParams(`}<b>{`pipeline`}</b>{`, pathParams));`}
        </pre>

        <p>
          That is the whole trick behind &ldquo;every chain method returns a new endpoint&rdquo;.
          It is not defensive copying bolted on for safety; it falls out of the fact that closures
          capture variables, so the only honest way to change the state is to build new functions
          over new state. <code>api.users.detail</code> stays pristine no matter how many call
          sites bind, instrument, or specialise it.
        </p>

        <h3>Curried factories: capture instead of branch</h3>
        <p>
          The hook operations are one function specialised eight times by capture rather than eight
          near-identical functions or one function with a switch:
        </p>

        <pre>
{`const addHook = (`}<b>{`key`}</b>{`) => (ctx, hook) => ({
  ...ctx,
  hooks: { ...ctx.hooks, [`}<b>{`key`}</b>{`]: [...ctx.hooks[`}<b>{`key`}</b>{`], hook] },
});

export const PipelineOps = {
  onRequest:  addHook(`}<u>{`'onRequest'`}</u>{`),
  onResponse: addHook(`}<u>{`'onResponse'`}</u>{`),
  onHttpError: addHook(`}<u>{`'onHttpError'`}</u>{`),
  `}<i>{`// …`}</i>{`
};`}
        </pre>

        <p>
          Each of those captured a different <code>key</code>. There is one implementation to get
          right and one place to fix, and adding a ninth hook is one line.
        </p>

        <h3>Closures as adapters</h3>
        <p>
          The same shape appears where hapi accepts more than one validator protocol.{' '}
          <code>normalizeValidator</code> takes any schema and returns a function with the shape the
          pipeline expects, having captured the original schema and the error context:
        </p>

        <pre>
{`const normalizeValidator = (validator, `}<b>{`context`}</b>{`, `}<b>{`label`}</b>{`) => {
  if (hasSafeParse(validator)) return validator;
  const `}<b>{`standard`}</b>{` = validator['~standard'];

  return {
    safeParse: (x) => {            `}<i>{`// closes over standard, context, label`}</i>{`
      const result = `}<b>{`standard`}</b>{`.validate(x);
      if (isThenable(result)) throw makeApiConfigurationError({ `}<b>{`context`}</b>{`, ... });
      return result.issues === undefined
        ? { success: true, data: result.value }
        : { success: false, error: result.issues };
    },
  };
};`}
        </pre>

        <p>
          The pipeline never learns that Effect Schema or Valibot exist. It calls{' '}
          <code>safeParse</code>. One adapter closure absorbs the whole difference, which is why
          supporting four more validator libraries cost no runtime dependency and no branching in
          the hot path.
        </p>

        <h2 id="lifetime">5. The bug that taught the lesson</h2>
        <p className="art__sub">Closures capture variables, not values — and lifetime matters.</p>

        <p>
          Here is where closures stop being an elegance argument and start being a correctness one.
        </p>
        <p>
          TanStack Query does not give mutations an abort signal, so hapi has to create its own{' '}
          <code>AbortController</code>. The obvious place is beside the other captured state:
        </p>

        <pre>
{`const controller = new AbortController();      `}<i>{`// ← wrong`}</i>{`

const mutationOptions = () => ({
  mutationFn: (variables) =>
    runRequest(variables, controller.signal),
});`}
        </pre>

        <p>
          That reads fine and works once. It is broken on the second attempt. The controller was
          captured when the endpoint was built, so every invocation shares it — and once it has
          aborted, it stays aborted forever. TanStack retries a mutation through the same{' '}
          <code>mutationFn</code>, and also resumes one that was paused while the browser was
          offline. Attempt two gets a signal that is already in the aborted state, and the request
          dies instantly with no obvious cause.
        </p>
        <p>The fix is to move where the capture happens:</p>

        <pre>
{`const mutationOptions = () => ({
  mutationFn: (variables) => {
    const `}<b>{`controller`}</b>{` = new AbortController();   `}<i>{`// ← per attempt`}</i>{`
    publish?.(`}<b>{`controller`}</b>{`);
    return runRequest(variables, composeSignal([`}<b>{`controller`}</b>{`.signal], timeout));
  },
});`}
        </pre>

        <div className="aside">
          <span className="aside__t">The general rule</span>
          <p>
            Capture at the lifetime of the thing you are capturing. Configuration lives as long as
            the endpoint, so capturing it at build time is right. A cancellation token lives as
            long as <em>one attempt</em>, so it must be created inside the function that runs an
            attempt.
          </p>
          <p>
            Getting this wrong does not produce a type error or a crash. It produces a request that
            silently fails the second time, which is the kind of bug that survives a code review
            and reaches production.
          </p>
        </div>

        <h2 id="cost">6. What it costs</h2>
        <p className="art__sub">Because a design note that only lists benefits is marketing.</p>

        <p>
          Rebuilding every closure on every chain call is real work. <code>.withPathParams()</code>{' '}
          allocates a new pipeline object and a new object carrying about twenty functions. That is
          cheap but not free.
        </p>
        <p>
          It is the right trade here because of <em>where</em> it happens. Endpoints are declared
          once at module scope, and a chain call in a component body runs on render — which is
          exactly where React expects allocation. If you were chaining inside a tight loop over ten
          thousand rows, this design would be the wrong one, and you would hoist the bound endpoint
          out of the loop. That is the same advice you would give about any allocation in a loop.
        </p>
        <p>
          The second cost is conceptual. The type machinery that makes{' '}
          <code>useQuery</code> disappear on a <code>POST</code> endpoint is genuinely intricate,
          and when it goes wrong the error messages are about conditional types rather than about
          your API. That complexity is concentrated in two files and paid once by whoever maintains
          the library, rather than every day by everyone using it — but it is not free, and
          pretending otherwise would be dishonest.
        </p>

        <hr />

        <p>
          The through-line is that all four of these are the same argument. Functionality decides
          what is possible; ergonomics decides what the common path costs; readability decides
          whether the next person can predict the code without running it; and closures are the
          mechanism that lets a call site carry its whole context without repeating it.
        </p>
        <p>
          Get the capture boundaries right and the API feels effortless. Get one of them wrong —
          one controller captured a scope too high — and it fails on the second try, quietly.
        </p>
      </article>

      <Foot />
    </>
  );
}
