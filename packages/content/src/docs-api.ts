import type { DocPage } from './docs-types';

export const API_PAGES: ReadonlyArray<DocPage> = [
  {
    slug: 'create-api',
    title: 'createApi',
    lede: 'Compose services into one client, cascading shared configuration.',
    blocks: [
      {
        kind: 'code',
        code: `const api = createApi(config, fetcher?);`,
      },
      { kind: 'h3', text: 'Options' },
      {
        kind: 'api',
        name: 'services',
        type: 'Record<string, ServiceConfig>',
        required: true,
        body: [
          'The services to expose. Each key becomes a property on the returned client.',
          'Author these with `defineService` so their literal types survive.',
        ],
      },
      {
        kind: 'api',
        name: 'baseUrl',
        type: 'string',
        defaultsTo: "'' (relative requests)",
        body: [
          'The origin for every request. Reaches the fetcher through `FetcherCallContext.baseUrl` rather than being folded into the path.',
          'Because it is not in the path, it is not in your cache keys — so keys survive a change of environment.',
        ],
      },
      {
        kind: 'api',
        name: 'headers',
        type: 'HeadersProvider | HeadersProvider[]',
        body: [
          'Static records, or functions resolved per request. Functions receive `{ signal }`.',
          'Applied before service and endpoint headers; the last writer of a name wins.',
        ],
      },
      {
        kind: 'api',
        name: 'hooks',
        type: 'Partial<PipelineHooks>',
        body: [
          'Lifecycle hooks applied to every endpoint in every service.',
          'These run first, before service and endpoint hooks.',
        ],
      },
      {
        kind: 'api',
        name: 'defaultOptions',
        type: 'WithOptionsConfig',
        body: [
          'Defaults merged into every endpoint — `staleTime`, `gcTime`, `timeout`, `queryKeyPrefix`, and any TanStack option.',
          'Endpoint-level options win over service, which win over these.',
        ],
      },
      { kind: 'h3', text: 'Second argument' },
      {
        kind: 'api',
        name: 'fetcher',
        type: 'EndpointFetcher',
        defaultsTo: 'defaultFetcher',
        body: ['The transport used by every endpoint. See `createFetcher`.'],
      },
      { kind: 'h3', text: 'Returns' },
      {
        kind: 'api',
        name: 'ApiClient',
        type: '{ [service]: { queryKey } & { [endpoint]: UnifiedEndpoint } }',
        body: [
          'One property per service. Each carries a `queryKey` of `[serviceName]`, useful as an invalidation prefix, plus every endpoint.',
        ],
      },
    ],
  },

  {
    slug: 'create-endpoint',
    title: 'createEndpoint',
    lede: 'Build a single endpoint without a service or an API object.',
    blocks: [
      { kind: 'code', code: `const endpoint = createEndpoint(config, fetcher?);` },
      {
        kind: 'p',
        text: 'Use this for a one-off endpoint. Inside a `createApi` tree you never call it — `createApi` does, after cascading configuration down.',
      },
      { kind: 'h3', text: 'Config' },
      {
        kind: 'api',
        name: 'endpoint',
        type: 'string',
        required: true,
        body: ['Name of the endpoint. Appears in cache keys and error messages.'],
      },
      {
        kind: 'api',
        name: 'method',
        type: "'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'",
        required: true,
        body: [
          'Gates capabilities at compile time: a non-GET endpoint has `useQuery` typed `never`.',
          'GET and DELETE send parameters as a query string; the rest send a JSON body.',
        ],
      },
      {
        kind: 'api',
        name: 'path',
        type: 'string',
        required: true,
        body: [
          'Relative to the origin. `:name` is a required segment, `:name?` an optional one.',
          'Never put the origin here — that is `baseUrl`.',
        ],
      },
      {
        kind: 'api',
        name: 'service',
        type: 'string',
        defaultsTo: "''",
        body: ['Leading segment of the cache key. Set for you by `createApi`.'],
      },
      {
        kind: 'api',
        name: 'baseUrl',
        type: 'string',
        body: ['Origin for this endpoint. Passed to the fetcher on every call.'],
      },
      {
        kind: 'api',
        name: 'requestSchema',
        type: 'AnyValidator<TReq>',
        body: [
          'Validates the request body or query parameters, and gives the request its type.',
          'Must be synchronous.',
        ],
      },
      {
        kind: 'api',
        name: 'responseSchema',
        type: 'AnyValidator<TResp> | { schema, mode: \'async\' }',
        body: [
          'Validates the response and gives the result its type.',
          'Declare `mode: \'async\'` to resolve data immediately and validate in a detached promise.',
        ],
      },
      {
        kind: 'api',
        name: 'pathParamsSchema',
        type: 'AnyValidator<TPath>',
        body: [
          'Validates bound path parameters before the URL is built, and types `withPathParams`.',
          'A failure raises a `path-validation` error and reaches `onRequestValidationError` with `source: \'path\'`.',
        ],
      },
      {
        kind: 'api',
        name: 'getNextPageParam',
        type: '(lastPage, allPages) => Partial<TReq> | null | undefined',
        body: [
          'Declaring this unlocks `useInfiniteQuery` and the suspense variant.',
          'Return `null` or `undefined` when there are no more pages.',
        ],
      },
      {
        kind: 'api',
        name: 'maxPages',
        type: 'number',
        body: ['Caps how many pages are retained, passed to TanStack unchanged.'],
      },
    ],
  },

  {
    slug: 'endpoint',
    title: 'Endpoint members',
    lede: 'Everything a built endpoint carries.',
    blocks: [
      { kind: 'h3', text: 'Calling' },
      {
        kind: 'api',
        name: 'useQuery',
        type: '(request?, options?) => UseQueryResult<TData, HapiError>',
        body: [
          'Available on GET endpoints with every required path parameter bound; `never` otherwise.',
          '`options` is TanStack’s own option type with the error channel pinned. `select` may reshape the result.',
        ],
      },
      {
        kind: 'api',
        name: 'useSuspenseQuery',
        type: '(request?, options?) => UseSuspenseQueryResult<TData, HapiError>',
        body: ['As above, for Suspense. `data` is never undefined.'],
      },
      {
        kind: 'api',
        name: 'useMutation',
        type: '(options?) => UseMutationResult<TResp, HapiError, TReq> & { abort() }',
        body: [
          'Available whenever path parameters are bound, including on GET endpoints.',
          '`abort()` stops the attempt in flight. Cancellation on unmount requires `withOptions({ cancelOnUnmount: true })`.',
        ],
      },
      {
        kind: 'api',
        name: 'useInfiniteQuery',
        type: '(request?, options?) => UseInfiniteQueryResult<InfiniteData<TResp>, HapiError>',
        body: ['Present only when `getNextPageParam` was declared.'],
      },
      {
        kind: 'api',
        name: 'fetch',
        type: '(request?, options?: { signal?, timeout? }) => Promise<TResp>',
        body: [
          'Runs the full pipeline with no React involved. Rejects with a `HapiError`.',
          'The options bag is present on every arity, so a bound endpoint can still be cancelled.',
        ],
      },
      { kind: 'h3', text: 'Composing' },
      {
        kind: 'api',
        name: 'queryOptions',
        type: '(request?) => HapiTaggedQueryOptions<TResp>',
        body: [
          'Feed this to `useQueries`, `prefetchQuery`, or `fetchQuery`.',
          'Its `queryKey` carries TanStack’s `DataTag`, so `getQueryData` returns the response type instead of `unknown`.',
        ],
      },
      {
        kind: 'api',
        name: 'mutationOptions',
        type: '(options?) => HapiMutationOptions<TResp, TReq>',
        body: ['For composing a mutation outside a component.'],
      },
      {
        kind: 'api',
        name: 'queryKey / mutationKey',
        type: 'ReadonlyArray<unknown>',
        body: [
          'The key for the current bindings: `[...prefix, service, endpoint, resolvedPath, params?]`.',
          'Deliberately untagged, because it is used as an invalidation prefix as often as a whole key.',
        ],
      },
      {
        kind: 'api',
        name: 'queryKeyFor / mutationKeyFor',
        type: '(request?) => ReadonlyArray<unknown>',
        body: ['The key that a specific request would produce, without calling it.'],
      },
      {
        kind: 'api',
        name: 'resolvedConfig',
        type: '() => { method, path, url, headers, params, pathParams }',
        body: [
          'What this endpoint would send right now. Useful in tests and logs.',
          '`url` includes the origin; `path` does not.',
        ],
      },
      { kind: 'h3', text: 'Chaining' },
      {
        kind: 'p',
        text: 'Each of these returns a **new** endpoint. The original is never mutated.',
      },
      {
        kind: 'table',
        head: ['Method', 'Binds'],
        rows: [
          ['withParams(p)', 'Request parameters, partially or fully'],
          ['withPathParams(p)', 'Path parameters — unlocks capabilities'],
          ['withOptions(o)', 'staleTime, timeout, cancelOnUnmount, queryKeyPrefix, any TanStack option'],
          ['withHeaders(h)', 'A record or an async provider'],
          ['onRequest, onResponse, onHttpError, onError, …', 'A lifecycle hook'],
        ],
      },
    ],
  },

  {
    slug: 'create-fetcher',
    title: 'createFetcher',
    lede: 'The transport, and how to replace it.',
    blocks: [
      { kind: 'code', code: `const fetcher = createFetcher({ baseUrl?, defaultHeaders?, serializeParams? });` },
      {
        kind: 'api',
        name: 'baseUrl',
        type: 'string',
        defaultsTo: "''",
        body: [
          'A **fallback** origin, used only when the call context supplies none.',
          'An endpoint’s own `baseUrl` always wins, so setting both does not double the origin.',
        ],
      },
      {
        kind: 'api',
        name: 'defaultHeaders',
        type: 'Record<string, string>',
        body: ['Merged under the headers the pipeline resolved, so pipeline headers win.'],
      },
      {
        kind: 'api',
        name: 'serializeParams',
        type: '(params) => string',
        defaultsTo: 'defaultSerializeParams',
        body: [
          'Controls query-string encoding. The default encodes arrays as repeated keys and nested objects as JSON.',
          'Replace it if your backend expects bracket or dot notation.',
        ],
      },
      { kind: 'h3', text: 'Writing your own' },
      {
        kind: 'p',
        text: 'A fetcher is a function. Implement it to route through your own client, to mock in tests, or to add transport-level retries.',
      },
      {
        kind: 'code',
        code: `const fetcher: EndpointFetcher = async (request, headers, ctx) => {
  const res = await myClient(ctx.method, \`\${ctx.baseUrl ?? ''}\${ctx.path}\`, {
    body: request,
    headers,
    signal: ctx.signal,
  });
  return {
    data: res.body,
    status: res.status,
    statusText: res.statusText,
    ok: res.status < 400,
    headers: res.headers,   // optional, lower-cased
  };
};`,
      },
      {
        kind: 'note',
        tone: 'info',
        title: 'headers is optional',
        text: 'Existing custom fetchers that omit it keep working. Supply it if consumers need `Link`, `ETag`, or rate-limit headers in `onResponse`.',
      },
    ],
  },

  {
    slug: 'error-guards',
    title: 'Error guards',
    lede: 'Narrowing a HapiError without instanceof.',
    blocks: [
      {
        kind: 'p',
        text: 'Every variant has a guard, and `isHapiError` covers the union. Guards test the `tag` field rather than the prototype chain, so they work across realms and after serialization.',
      },
      {
        kind: 'code',
        code: `import {
  isApiHttpError, isApiTransportError, isApiAbortError,
  isApiRequestValidationError, isApiPathValidationError,
  isApiResponseValidationError, isApiConfigurationError,
  isApiUnknownError, isHapiError,
} from '@tesyl/hapi';`,
      },
      {
        kind: 'p',
        text: 'Prefer a `switch` on `err.tag` when you handle several cases — the compiler checks exhaustiveness for you. Reach for a guard when you care about exactly one.',
      },
      { kind: 'h3', text: 'Constructing errors' },
      {
        kind: 'p',
        text: 'The `makeApi*Error` factories are exported for tests and for custom fetchers that want to raise a tagged failure directly. They take an `ErrorContext` of `{ service, endpoint, method, path }`.',
      },
      { kind: 'h3', text: 'toHapiError' },
      {
        kind: 'api',
        name: 'toHapiError',
        type: '(e: unknown, context: ErrorContext, signal?: AbortSignal) => HapiError',
        body: [
          'The normaliser the pipeline uses at its outer boundary. Returns an existing `HapiError` unchanged, recognises aborts by name, and tags everything else as `unknown` with the original on `cause`.',
          'Exported so a custom transport can guarantee the same closed union.',
        ],
      },
    ],
  },
];
