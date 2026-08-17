/**
 * The real content for @tesyl/hapi.
 *
 * Every design renders this same module. Designs differ in how they present
 * the material, never in what the material says — otherwise you would be
 * comparing copy, not design.
 */

export type ErrorTagEntry = {
  readonly tag: string;
  readonly title: string;
  readonly cause: string;
  readonly payload: string;
  readonly recovery: string;
  readonly retryable: boolean;
};

export type PipelinePhase = {
  readonly index: number;
  readonly name: string;
  readonly hook: string | null;
  readonly summary: string;
};

export type Feature = {
  readonly title: string;
  readonly body: string;
  readonly code?: string;
};

export type DocsSection = {
  readonly id: string;
  readonly title: string;
  readonly blurb: string;
  readonly body: ReadonlyArray<string>;
  readonly code?: string;
  readonly codeLabel?: string;
};

export const PACKAGE_NAME = '@tesyl/hapi';
export const PACKAGE_VERSION = '0.5.0';
export const PACKAGE_TAGLINE = 'A typed pipeline over TanStack Query.';
export const PACKAGE_REPO = 'https://github.com/Tesyl/hapi';
export const PACKAGE_LICENSE = 'MIT';

export const HEADLINE = 'Every failure has a name.';
export const SUBHEAD =
  'hapi wraps TanStack Query so an endpoint is declared once and every way of calling it — hook, promise, mutation, infinite query — comes back typed, validated, and cancellable.';

export const INSTALL_COMMAND = 'npm install @tesyl/hapi @tanstack/react-query';

/** Eight tags, closed. This is the material the whole library is built around. */
export const ERROR_TAGS: ReadonlyArray<ErrorTagEntry> = [
  {
    tag: 'http',
    title: 'Server answered, badly',
    cause: 'A non-ok status came back.',
    payload: 'status, statusText, url, responseBody',
    recovery: 'Branch on the status. 404 is often not an error.',
    retryable: true,
  },
  {
    tag: 'transport',
    title: 'Never reached the server',
    cause: 'Offline, DNS failure, or CORS.',
    payload: 'cause, url',
    recovery: 'Retry with backoff. The original error is kept on cause.',
    retryable: true,
  },
  {
    tag: 'abort',
    title: 'Stopped on purpose',
    cause: 'A caller cancelled, or a timeout elapsed.',
    payload: 'reason, timedOut',
    recovery: 'Not a failure. Skips onError entirely.',
    retryable: false,
  },
  {
    tag: 'request-validation',
    title: 'Bad input, body',
    cause: 'The request body failed its schema.',
    payload: 'failure.issues',
    recovery: 'Fix the caller. Never retry.',
    retryable: false,
  },
  {
    tag: 'path-validation',
    title: 'Bad input, path',
    cause: 'A path parameter failed its schema.',
    payload: 'failure.issues',
    recovery: 'Caught before the request is sent.',
    retryable: false,
  },
  {
    tag: 'response-validation',
    title: 'Schema drift',
    cause: 'The response did not match its schema.',
    payload: 'failure.issues, rawResponse',
    recovery: 'The server changed. rawResponse shows what arrived.',
    retryable: false,
  },
  {
    tag: 'configuration',
    title: 'Your mistake, not theirs',
    cause: 'An async schema in a synchronous position.',
    payload: 'reason',
    recovery: 'Fix the declaration. Retrying cannot help.',
    retryable: false,
  },
  {
    tag: 'unknown',
    title: 'Anything else',
    cause: 'A hook threw something unforeseen.',
    payload: 'cause',
    recovery: 'The union stays closed. The original is on cause.',
    retryable: false,
  },
];

/** The request lifecycle, and where you can intervene. */
export const PIPELINE_PHASES: ReadonlyArray<PipelinePhase> = [
  { index: 1, name: 'Resolve headers', hook: null, summary: 'Static headers merge with async providers. Providers receive the abort signal.' },
  { index: 2, name: 'Build request', hook: 'onRequest', summary: 'Rewrite the body or the headers before anything is validated.' },
  { index: 3, name: 'Validate path', hook: 'onRequestValidationError', summary: 'Path params are checked before substitution, so a bad id never reaches the URL.' },
  { index: 4, name: 'Validate request', hook: 'onRequestValidated', summary: 'The body is parsed. Validation is always synchronous.' },
  { index: 5, name: 'Transport', hook: null, summary: 'The fetcher receives the origin, the resolved path, and the composed signal.' },
  { index: 6, name: 'Handle status', hook: 'onHttpError', summary: 'Offer a fallback, or force a rethrow. Every hook runs; rethrow wins.' },
  { index: 7, name: 'Read response', hook: 'onResponse', summary: 'Reshape the body. Response headers are available here.' },
  { index: 8, name: 'Validate response', hook: 'onResponseValidated', summary: 'Parse, or suppress and pass the raw body through.' },
];

export const FEATURES: ReadonlyArray<Feature> = [
  {
    title: 'One declaration, every call shape',
    body: 'Declare method, path, and schemas once. Get the hook, the suspense hook, the mutation, the infinite query, the options object, and a plain promise — all typed from the same source.',
    code: `const user = api.users.detail.withPathParams({ id });

user.useQuery();          // React
user.useSuspenseQuery();  // Suspense
await user.fetch();       // no React at all`,
  },
  {
    title: 'A closed error channel',
    body: 'Eight tags, exhaustively. A hook that throws a plain Error is normalised rather than escaping untagged, so switching on err.tag is safe to rely on.',
    code: `switch (err.tag) {
  case 'http':      return err.status === 404 ? null : retry();
  case 'abort':     return err.timedOut ? retry() : ignore();
  case 'transport': return offline();
}`,
  },
  {
    title: 'Cancellable everywhere',
    body: 'A signal or a timeout on any call, including outside React. Timeouts use AbortSignal.timeout, so the request actually stops rather than being abandoned.',
    code: `await api.users.list.fetch(
  { page: 1 },
  { timeout: 5_000 },
);`,
  },
  {
    title: 'Cache keys that cannot collide',
    body: 'Keys carry the resolved path, so two calls that differ only by path parameter are separate entries. Service and endpoint stay at the front, so prefix invalidation still works.',
    code: `['users', 'detail', '/users/42']
['users', 'detail', '/users/43']
// two resources, two entries`,
  },
  {
    title: 'Bring your own validator',
    body: 'Zod, Effect Schema, Valibot, ArkType — anything implementing safeParse or Standard Schema V1. Zod is an optional peer dependency, not a requirement.',
    code: `responseSchema: z.object({ name: z.string() })
responseSchema: Schema.standardSchemaV1(User)
responseSchema: v.object({ name: v.string() })`,
  },
  {
    title: 'Eight places to intervene',
    body: 'Hooks at every lifecycle phase, cascading from API to service to endpoint. Every hook runs, even after one has decided the outcome — so telemetry never gets skipped.',
    code: `api.users.detail
  .onRequest((ctx) => trace(ctx))
  .onHttpError(() => ({ fallback: EMPTY_USER }));`,
  },
];

export const HERO_CODE = `import { defineService, createApi } from '@tesyl/hapi';

const users = defineService({
  service: 'users',
  basePath: '/users',
  endpoints: {
    detail: {
      endpoint: 'detail',
      method: 'GET',
      path: '/:id',
      pathParamsSchema: z.object({ id: z.string() }),
      responseSchema: userSchema,
    },
  },
});

export const api = createApi({
  baseUrl: 'https://api.example.com',
  services: { users },
});`;

export const USAGE_CODE = `function UserProfile({ id }: { id: string }) {
  const { data } = api.users.detail
    .withPathParams({ id })
    .useQuery();
  //     ^? User | undefined

  return <h1>{data?.name}</h1>;
}`;

export const DOCS_SECTIONS: ReadonlyArray<DocsSection> = [
  {
    id: 'install',
    title: 'Install',
    blurb: 'One package, one peer dependency.',
    body: [
      'TanStack Query and React are peer dependencies. Zod is optional — hapi accepts any validator implementing safeParse or Standard Schema V1.',
    ],
    code: INSTALL_COMMAND,
    codeLabel: 'shell',
  },
  {
    id: 'declare',
    title: 'Declare an endpoint',
    blurb: 'Method, path, schemas. Once.',
    body: [
      'An endpoint config is a plain object. defineService preserves the literal types, and createApi cascades baseUrl, headers, hooks, and default options down through service and endpoint.',
      'The path stays relative. The origin belongs to baseUrl and reaches the fetcher separately — folding it into the path would put your environment inside every cache key.',
    ],
    code: HERO_CODE,
    codeLabel: 'api.ts',
  },
  {
    id: 'call',
    title: 'Call it',
    blurb: 'Six call shapes, one declaration.',
    body: [
      'Every chain method returns a new endpoint. The original is never mutated, so api.users.detail stays reusable no matter what a call site binds.',
      'Capabilities are gated by type: useQuery on a non-GET endpoint is never, not a runtime warning.',
    ],
    code: USAGE_CODE,
    codeLabel: 'UserProfile.tsx',
  },
  {
    id: 'errors',
    title: 'Handle failures',
    blurb: 'Eight tags, closed union.',
    body: [
      'Every rejection is a member of HapiError — including a plain Error thrown by one of your own hooks, which is normalised to unknown with the original kept as cause. That is what makes switching on the tag safe.',
      'onError is the terminal hook. It fires once per escaping failure, and not at all for aborts, which end a request normally rather than failing it.',
    ],
    code: `try {
  await api.users.detail.withPathParams({ id }).fetch();
} catch (e) {
  const err = e as HapiError;
  switch (err.tag) {
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
  }
}`,
    codeLabel: 'errors.ts',
  },
  {
    id: 'cancel',
    title: 'Cancel and time out',
    blurb: 'Including outside React.',
    body: [
      'Timeouts are built on AbortSignal.timeout, never a promise race. A race settles your promise and leaves the real request running, holding a connection-pool slot until the server answers.',
      'Cancelling a mutation is not an undo — the server may already have committed. That is why cancel-on-unmount is opt-in.',
    ],
    code: `await api.users.list.fetch({ page: 1 }, { timeout: 5_000 });

const save = api.users.update
  .withOptions({ cancelOnUnmount: true })
  .useMutation();

save.abort();`,
    codeLabel: 'cancel.ts',
  },
  {
    id: 'keys',
    title: 'Invalidate precisely',
    blurb: 'Keys carry the resolved path.',
    body: [
      'The shape is [...prefix, service, endpoint, resolvedPath, params?]. Service and endpoint lead, so a prefix still matches everything under them. The resolved path follows, so two resources cannot share an entry.',
      'Headers are deliberately absent from the key. If a provider injects a per-user token, put the identity in queryKeyPrefix or use one QueryClient per session — otherwise two users share a cache entry.',
    ],
    code: `qc.invalidateQueries({ queryKey: ['users', 'detail'] });

qc.invalidateQueries({
  queryKey: api.users.detail.withPathParams({ id: '42' }).queryKey,
});
// ['users', 'detail', '/users/42']`,
    codeLabel: 'invalidate.ts',
  },
];

export const DESIGN_ROUTES = [1, 2, 3, 4, 5] as const;
export type DesignRoute = (typeof DESIGN_ROUTES)[number];

export type DesignMeta = {
  readonly id: DesignRoute;
  readonly name: string;
  readonly concept: string;
  readonly palette: ReadonlyArray<string>;
  readonly signature: string;
};

export const DESIGNS: ReadonlyArray<DesignMeta> = [
  {
    id: 1,
    name: 'Patchbay',
    concept: 'The request lifecycle as a modular-synth patchbay. Hooks are patch points; the pipeline is signal flow.',
    palette: ['#1a1b1e', '#e8623c', '#f2b134', '#4cc9b0', '#8b7fd4'],
    signature: 'An interactive patchbay where hovering a hook lights its cable through all eight phases.',
  },
  {
    id: 2,
    name: 'Quick Info',
    concept: 'The page as an editor. Type inference is the product, so the page reveals types the way an IDE does.',
    palette: ['#fbfbfd', '#12141c', '#3b5bdb', '#0b7285', '#c2255c'],
    signature: 'Hover any identifier in the code and its inferred type appears in a real quick-info panel.',
  },
  {
    id: 3,
    name: 'Field Guide',
    concept: 'A naturalist identification key for failure. Eight tags, keyed and labelled like specimens.',
    palette: ['#eae6da', '#2f3b2f', '#7d8c6a', '#8c2f2f', '#c9b896'],
    signature: 'A dichotomous key that walks you from a thrown value down to exactly one tag.',
  },
  {
    id: 4,
    name: 'Ledger',
    concept: 'The cache key as an archival record. Cold, precise, catalogued.',
    palette: ['#eef1f4', '#0f1b2d', '#3d6b8c', '#b4552d', '#94a3ae'],
    signature: 'A live key builder: bind path params and watch the array recompute — with the collision bug toggleable.',
  },
  {
    id: 5,
    name: 'Broadcast',
    concept: 'Swiss poster energy. The type is the diagram; scale carries the argument.',
    palette: ['#0d0d0d', '#f5f2eb', '#ff4d17', '#1d4ed8', '#facc15'],
    signature: 'A hero where the eight error tags are set as a single oversized typographic block you can read as a switch.',
  },
];
