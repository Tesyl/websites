import type { DocPage } from './docs-types';

export const GUIDE_PAGES: ReadonlyArray<DocPage> = [
  {
    slug: 'important-defaults',
    title: 'Important defaults',
    lede: 'The behaviours that surprise people. Read this before you get bitten.',
    blocks: [
      {
        kind: 'p',
        text: 'hapi makes a handful of choices that are defensible but not obvious. They are gathered here rather than scattered through the guides, because a default you discover during an incident is a bad default.',
      },
      { kind: 'h3', text: 'Aborts are not failures' },
      {
        kind: 'p',
        text: 'An aborted request rejects with an `abort`-tagged error and **does not** fire `onError`. A user navigating away is a normal end of life for a request, not something your telemetry should record as a failure. Use `err.timedOut` to separate a timeout from a cancellation.',
      },
      { kind: 'h3', text: 'Mutation cancellation is off' },
      {
        kind: 'p',
        text: 'Mutations are not cancelled on unmount unless you ask with `withOptions({ cancelOnUnmount: true })`. Cancelling a mutation is not an undo — the server may already have committed the write — so on by default it would silently drop saves whenever someone navigated mid-edit.',
      },
      { kind: 'h3', text: 'Every hook runs, even after one decides' },
      {
        kind: 'p',
        text: 'When several `onHttpError` hooks are registered, all of them run even after one has supplied a fallback. This is what lets a logging hook fire regardless of what an earlier hook decided. Two consequences: the **last** fallback wins, and `rethrow` from any hook beats a fallback from any other.',
      },
      {
        kind: 'note',
        tone: 'warn',
        title: 'One exception',
        text: '`onRequestValidationError` is the only loop that stops early. The first hook to return `suppress` decides, and later hooks do not run.',
      },
      { kind: 'h3', text: 'Request validation is always synchronous' },
      {
        kind: 'p',
        text: 'A Standard Schema whose `validate` returns a promise raises a `configuration` error rather than being awaited. Awaiting it would make the whole pipeline async and change hook ordering for every user of the library.',
      },
      { kind: 'h3', text: 'Headers are not in the cache key' },
      {
        kind: 'p',
        text: 'If a header provider injects a per-user token, two users will share a cache entry. Put the identity in `queryKeyPrefix`, or use one `QueryClient` per session.',
      },
      { kind: 'h3', text: 'Response validation throws by default' },
      {
        kind: 'p',
        text: 'If the server drifts from your schema the query errors, rather than passing the raw body through. An `onResponseValidationError` hook returning `{ suppress: true }` reverses that for a specific endpoint.',
      },
    ],
  },

  {
    slug: 'endpoints',
    title: 'Endpoints and services',
    lede: 'How a declaration becomes a callable object.',
    blocks: [
      {
        kind: 'p',
        text: 'An endpoint config is a plain object. `defineEndpoint` and `defineService` are identity functions whose only job is preserving literal types — they do no work at runtime.',
      },
      {
        kind: 'code',
        code: `const detail = {
  endpoint: 'detail',
  method: 'GET',
  path: '/:id',
  pathParamsSchema: z.object({ id: z.string() }),
  responseSchema: userSchema,
};`,
      },
      { kind: 'h3', text: 'Paths are relative' },
      {
        kind: 'p',
        text: 'The `path` is relative to the origin. A service `basePath` folds into it because that is routing; `baseUrl` does not, because that is transport. Folding the origin into the path would put your environment inside every cache key and would double up against a fetcher that carries its own `baseUrl`.',
      },
      {
        kind: 'table',
        head: ['Set on', 'Field', 'Ends up in'],
        rows: [
          ['createApi', 'baseUrl', 'FetcherCallContext.baseUrl'],
          ['defineService', 'basePath', 'the endpoint path'],
          ['endpoint', 'path', 'the endpoint path'],
        ],
      },
      { kind: 'h3', text: 'Path parameters' },
      {
        kind: 'p',
        text: 'Use `:name` for required segments and `:name?` for optional ones. A required segment that is never bound throws before the request is sent. An optional one that is missing disappears from the URL along with its slash.',
      },
      { kind: 'h3', text: 'Cascade order' },
      {
        kind: 'p',
        text: '`createApi` merges headers, hooks, and default options in the order API → service → endpoint. Later wins for scalar options; for headers and hooks, all of them apply in that order.',
      },
    ],
  },

  {
    slug: 'calling',
    title: 'Calling an endpoint',
    lede: 'Six call shapes, one declaration.',
    blocks: [
      {
        kind: 'p',
        text: 'Every endpoint carries every call shape its method and bindings permit. The ones that would be wrong are typed `never`.',
      },
      {
        kind: 'table',
        head: ['Member', 'Use it for', 'Available when'],
        rows: [
          ['useQuery', 'Reading in a component', 'GET, path params bound'],
          ['useSuspenseQuery', 'Reading under Suspense', 'GET, path params bound'],
          ['queryOptions', 'Prefetch, useQueries, typed cache reads', 'GET, path params bound'],
          ['useMutation', 'Writing from a component', 'path params bound'],
          ['mutationOptions', 'Composing a mutation elsewhere', 'path params bound'],
          ['useInfiniteQuery', 'Paginated reads', 'getNextPageParam declared'],
          ['fetch', 'Anywhere without React', 'path params bound'],
        ],
      },
      { kind: 'h3', text: 'The chain is immutable' },
      {
        kind: 'p',
        text: 'Every `withX` and `onX` returns a **new** endpoint. The original is never mutated, so a shared endpoint stays reusable no matter what a call site binds or instruments.',
      },
      {
        kind: 'code',
        code: `const traced = api.users.detail
  .withHeaders({ 'X-Trace': 'on' })
  .onRequest((ctx) => log(ctx));

// api.users.detail is untouched.`,
      },
      { kind: 'h3', text: 'Passing TanStack options through' },
      {
        kind: 'p',
        text: 'The second argument of `useQuery` is TanStack’s own option type with the error channel pinned to `HapiError`. Everything you know still works, including `select`, which may reshape the result.',
      },
      {
        kind: 'code',
        code: `const { data } = api.users.list.useQuery(undefined, {
  staleTime: 30_000,
  select: (d) => d.items.length,
});
//    ^? number | undefined`,
      },
      {
        kind: 'note',
        tone: 'info',
        title: 'fetch takes two arguments',
        text: 'The request is first and cancellation options are second, so a call with no request but a signal reads `fetch(undefined, { signal })`. The options bag is present on every endpoint, bound or not.',
      },
    ],
  },

  {
    slug: 'validation',
    title: 'Validation',
    lede: 'Three schemas, two protocols, one invariant.',
    blocks: [
      {
        kind: 'table',
        head: ['Schema', 'Validates', 'Runs'],
        rows: [
          ['pathParamsSchema', 'Bound path parameters', 'Before the URL is built'],
          ['requestSchema', 'The request body or query params', 'Before the request is sent'],
          ['responseSchema', 'The response body', 'After the response arrives'],
        ],
      },
      { kind: 'h3', text: 'Two protocols, checked in order' },
      {
        kind: 'p',
        text: 'hapi accepts anything with `safeParse` and anything implementing Standard Schema V1. `safeParse` is tested first, because Zod satisfies both and that path is always synchronous.',
      },
      { kind: 'h3', text: 'Issues are not normalised' },
      {
        kind: 'p',
        text: '`failure.issues` is typed `unknown` on purpose. A `ZodError` and a Standard Schema issue array both reach you intact — flattening them would lose information only the originating library can interpret.',
      },
      { kind: 'h3', text: 'Deferring response validation' },
      {
        kind: 'p',
        text: 'For a large response where parsing would block a render, declare the schema as async. The data resolves immediately and validation runs in a detached promise, reporting failures through `onResponseValidationError` without throwing.',
      },
      {
        kind: 'code',
        code: `responseSchema: { schema: bigSchema, mode: 'async' }`,
      },
      {
        kind: 'note',
        tone: 'warn',
        title: 'Only responses may be async',
        text: 'Request validation is synchronous by design. A Standard Schema that validates asynchronously in a request position raises a `configuration` error naming the schema and its vendor.',
      },
    ],
  },

  {
    slug: 'errors',
    title: 'Errors',
    lede: 'Eight tags, closed union, exhaustive switch.',
    blocks: [
      {
        kind: 'p',
        text: 'Every rejection from an endpoint is a member of `HapiError`. That includes a plain `Error` thrown by one of your own hooks, which is normalised to `unknown` with the original preserved as `cause`. Without that guard the union would be a lie and a `switch` could silently fall through.',
      },
      {
        kind: 'table',
        head: ['Tag', 'Means', 'Retry?'],
        rows: [
          ['http', 'The server answered with a non-ok status', 'sometimes'],
          ['transport', 'The request never completed — offline, DNS, CORS', 'yes'],
          ['abort', 'Cancelled by a caller or a timeout', 'no'],
          ['request-validation', 'The request body failed its schema', 'never'],
          ['path-validation', 'A path parameter failed its schema', 'never'],
          ['response-validation', 'The response failed its schema', 'never'],
          ['configuration', 'A declaration is unusable', 'never'],
          ['unknown', 'Anything unforeseen, `cause` preserved', 'never'],
        ],
      },
      {
        kind: 'code',
        label: 'errors.ts',
        code: `switch (err.tag) {
  case 'http':
    if (err.status === 404) return null;
    throw err;
  case 'abort':
    return err.timedOut ? retry() : undefined;
  case 'response-validation':
    report('schema drift', err.rawResponse);
    return null;
  default:
    throw err;
}`,
      },
      { kind: 'h3', text: 'Retry predicates can read the tag' },
      {
        kind: 'p',
        text: 'Because the error channel is typed, a TanStack retry predicate can express things its own `retry: 3` cannot — such as retrying a transport failure but never a 422.',
      },
      {
        kind: 'code',
        code: `useQuery(undefined, {
  retry: (n, err) => err.tag === 'transport' && n < 3,
});`,
      },
      { kind: 'h3', text: 'onError is the terminal hook' },
      {
        kind: 'p',
        text: 'It fires once for every failure that escapes, and receives a tagged error. It does not fire for aborts, and it does not fire when another hook supplied a fallback — nothing escaped.',
      },
    ],
  },

  {
    slug: 'cancellation',
    title: 'Cancellation and timeouts',
    lede: 'Including outside React.',
    blocks: [
      {
        kind: 'code',
        code: `// A signal you control
const controller = new AbortController();
await ep.fetch(undefined, { signal: controller.signal });

// A timeout, per call
await ep.fetch({ page: 1 }, { timeout: 5_000 });

// Or as an endpoint default
const impatient = ep.withOptions({ timeout: 5_000 });`,
      },
      {
        kind: 'p',
        text: 'A per-call timeout overrides an endpoint default. Signals compose rather than replace: if you pass a signal **and** a timeout, whichever fires first wins.',
      },
      { kind: 'h3', text: 'Why not a promise race' },
      {
        kind: 'p',
        text: 'Timeouts are built on `AbortSignal.timeout`. Racing a timer against the request promise settles your promise but leaves the real request running, holding a connection-pool slot — about six per host in Chrome — until the server eventually answers.',
      },
      { kind: 'h3', text: 'Mutations' },
      {
        kind: 'p',
        text: 'Opt in with `cancelOnUnmount`, and call `abort()` on the result to stop the attempt in flight.',
      },
      {
        kind: 'code',
        code: `const save = api.users.update
  .withOptions({ cancelOnUnmount: true })
  .useMutation();

save.mutate({ name: 'Ada' });
save.abort();`,
      },
      {
        kind: 'note',
        tone: 'warn',
        title: 'Cancelling is not undoing',
        text: 'The server may already have committed the write. Cancelling only stops the client waiting for the answer.',
      },
    ],
  },

  {
    slug: 'cache-keys',
    title: 'Cache keys and invalidation',
    lede: 'What the key contains, and why each position is where it is.',
    blocks: [
      { kind: 'code', code: `[...queryKeyPrefix, service, endpoint, resolvedPath, params?]` },
      {
        kind: 'list',
        items: [
          '`service` and `endpoint` lead, so prefix invalidation keeps working.',
          '`resolvedPath` follows, so two calls differing only by path parameter are separate entries.',
          '`params` is omitted when empty, and keys whose value is `undefined` are dropped — TanStack hashes with `JSON.stringify`, which drops them anyway, so keeping them would split the cache between two identical requests.',
        ],
      },
      {
        kind: 'code',
        label: 'invalidate.ts',
        code: `// Everything under the users service
qc.invalidateQueries({ queryKey: api.users.queryKey });

// Every call of users.detail, whatever the path params
qc.invalidateQueries({ queryKey: ['users', 'detail'] });

// One resource
qc.invalidateQueries({
  queryKey: api.users.detail.withPathParams({ id: '42' }).queryKey,
});
// ['users', 'detail', '/users/42']`,
      },
      {
        kind: 'p',
        text: 'An endpoint with unbound path parameters keeps its placeholder — `[\'users\', \'detail\', \'/users/:id\']` — so it cannot collide with a bound one.',
      },
      { kind: 'h3', text: 'Mutation keys match' },
      {
        kind: 'p',
        text: '`mutationKey` uses the same builder, so `useMutationState` can tell two mutations on different resources apart.',
      },
      {
        kind: 'note',
        tone: 'warn',
        title: 'Identity belongs in the key',
        text: 'Headers are not part of the key. If a provider injects a per-user token, add the user or tenant to `queryKeyPrefix`, or give each session its own QueryClient.',
      },
    ],
  },

  {
    slug: 'hooks',
    title: 'Lifecycle hooks',
    lede: 'Eight places to intervene, and the precedence rules between them.',
    blocks: [
      {
        kind: 'table',
        head: ['Hook', 'Fires', 'Can'],
        rows: [
          ['onRequest', 'Before validation', 'Rewrite request or headers'],
          ['onRequestValidated', 'After the body parses', 'Observe'],
          ['onRequestValidationError', 'Body or path failed', 'Suppress with a fallback'],
          ['onResponse', 'Before response validation', 'Reshape the body'],
          ['onResponseValidated', 'After the body parses', 'Observe'],
          ['onResponseValidationError', 'Response failed', 'Suppress, or supply a fallback'],
          ['onHttpError', 'Non-ok status', 'Supply a fallback, or force a rethrow'],
          ['onError', 'Any escaping failure', 'Observe'],
        ],
      },
      { kind: 'h3', text: 'Precedence' },
      {
        kind: 'list',
        items: [
          'Every hook runs — the loops do not break, so telemetry still fires after another hook decided.',
          'The **last** fallback wins; a hook returning nothing does not clear an earlier one.',
          '`rethrow` beats `fallback`, in either order.',
          'On response validation, a fallback outranks a suppress.',
          '`onRequestValidationError` is the exception: the first `suppress` returns immediately.',
        ],
      },
      { kind: 'h3', text: 'Path failures share the request hook' },
      {
        kind: 'p',
        text: 'A path-parameter failure reaches `onRequestValidationError` with `source: \'path\'`. There is no ninth hook: both mean the caller sent bad input, so they share one extension point while keeping distinct error tags.',
      },
      {
        kind: 'code',
        code: `ep.onRequestValidationError((ctx) => {
  if (ctx.source === 'path') return { suppress: true, fallback: EMPTY };
  report(ctx.failure.issues);
});`,
      },
    ],
  },

  {
    slug: 'headers',
    title: 'Headers and auth',
    lede: 'Static values, async providers, and the cache trap.',
    blocks: [
      {
        kind: 'p',
        text: 'Headers can be a plain record or a function. Functions are resolved per request, which is what makes them suitable for tokens that expire.',
      },
      {
        kind: 'code',
        code: `createApi({
  baseUrl,
  headers: [
    { 'X-Client': 'web' },
    async ({ signal }) => ({ Authorization: \`Bearer \${await token(signal)}\` }),
  ],
  services: { users },
});`,
      },
      {
        kind: 'p',
        text: 'Providers receive the request’s abort signal, so a token refresh can abandon its work when the request that asked for it has already been cancelled. The parameter is optional, so existing zero-argument providers still type-check.',
      },
      { kind: 'h3', text: 'Precedence' },
      {
        kind: 'p',
        text: 'Headers merge API → service → endpoint, and the last writer of a given name wins. `withHeaders` on a chain appends after all of them.',
      },
      {
        kind: 'note',
        tone: 'warn',
        title: 'Auth and the cache',
        text: 'Because headers are not in the cache key, two users of the same page share entries. This is the single most common way to leak data between sessions. Scope it with `queryKeyPrefix`, or use a QueryClient per session.',
      },
    ],
  },
];
