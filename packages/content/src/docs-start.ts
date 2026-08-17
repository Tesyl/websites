import type { DocPage } from './docs-types';

export const START_PAGES: ReadonlyArray<DocPage> = [
  {
    slug: 'overview',
    title: 'Overview',
    lede: 'What hapi is, and what it is not.',
    blocks: [
      {
        kind: 'p',
        text: 'hapi is a typed pipeline over TanStack Query. You declare an endpoint once — method, path, and schemas — and get back one object carrying every way you might call it: the query hook, the suspense hook, the mutation, the infinite query, the options object for prefetching, and a plain promise for code that has no React in it.',
      },
      {
        kind: 'p',
        text: 'It does not replace TanStack Query. Every option you pass to `useQuery` still reaches TanStack unchanged, and every key-driven API — `invalidateQueries`, `useQueries`, `prefetchQuery`, `useMutationState` — works on the keys hapi produces. hapi adds a declaration layer and a validated request pipeline underneath the parts you already use.',
      },
      { kind: 'h3', text: 'What it adds' },
      {
        kind: 'list',
        items: [
          'One declaration per endpoint, with every call shape derived from it.',
          'Request, response, and path-parameter validation, with any Zod-shaped or Standard Schema validator.',
          'A closed error union of eight tags, so error handling is a `switch` rather than a chain of `instanceof` checks.',
          'Cancellation and timeouts everywhere, including outside React.',
          'Cache keys that carry the resolved path, so two resources cannot share an entry.',
          'Eight lifecycle hooks, cascading from API to service to endpoint.',
        ],
      },
      { kind: 'h3', text: 'What it deliberately does not do' },
      {
        kind: 'list',
        items: [
          'Wrap `QueryClient`. You create and configure it yourself.',
          'Re-export TanStack hooks. Import those from TanStack.',
          'Normalise validation issues. A `ZodError` reaches you intact.',
          'Put headers in the cache key. See Cache keys for why, and what to do instead.',
        ],
      },
      {
        kind: 'note',
        tone: 'info',
        title: 'Start here',
        text: 'If you read one page after this, read Important defaults. It lists the behaviours that surprise people, before they surprise you.',
      },
    ],
  },

  {
    slug: 'installation',
    title: 'Installation',
    lede: 'One package, two peer dependencies, one optional.',
    blocks: [
      { kind: 'code', label: 'shell', code: 'npm install @tesyl/hapi @tanstack/react-query' },
      {
        kind: 'p',
        text: '`@tanstack/react-query` and `react` are peer dependencies. `zod` is optional — hapi accepts any validator implementing `safeParse` or Standard Schema V1, so Zod is the most familiar option rather than a requirement.',
      },
      {
        kind: 'table',
        head: ['Peer', 'Range', 'Required'],
        rows: [
          ['@tanstack/react-query', '^5.0.0', 'yes'],
          ['react', '^18 || ^19', 'yes'],
          ['zod', '^3.22 || ^4', 'no'],
        ],
      },
      { kind: 'h3', text: 'Using a different validator' },
      {
        kind: 'p',
        text: 'Anything implementing Standard Schema V1 works with no extra adapter and no dependency on hapi’s side.',
      },
      {
        kind: 'code',
        label: 'any of these',
        code: `responseSchema: z.object({ name: z.string() })          // Zod
responseSchema: v.object({ name: v.string() })          // Valibot
responseSchema: type({ name: 'string' })                // ArkType
responseSchema: Schema.standardSchemaV1(User)           // Effect Schema`,
      },
    ],
  },

  {
    slug: 'quick-start',
    title: 'Quick start',
    lede: 'A working endpoint in three steps.',
    blocks: [
      { kind: 'h3', text: '1. Declare a service' },
      {
        kind: 'p',
        text: '`defineService` is an identity function. It exists to preserve the literal types of your config, which is what lets everything downstream be inferred.',
      },
      {
        kind: 'code',
        label: 'api.ts',
        code: `import { defineService, createApi } from '@tesyl/hapi';
import { z } from 'zod';

const userSchema = z.object({ id: z.string(), name: z.string() });

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
    update: {
      endpoint: 'update',
      method: 'PATCH',
      path: '/:id',
      pathParamsSchema: z.object({ id: z.string() }),
      requestSchema: z.object({ name: z.string() }),
      responseSchema: userSchema,
    },
  },
});`,
      },
      { kind: 'h3', text: '2. Compose the API' },
      {
        kind: 'p',
        text: '`createApi` cascades `baseUrl`, `headers`, `hooks`, and `defaultOptions` down through every service and endpoint.',
      },
      {
        kind: 'code',
        label: 'api.ts',
        code: `export const api = createApi({
  baseUrl: 'https://api.example.com',
  services: { users },
});`,
      },
      { kind: 'h3', text: '3. Call it' },
      {
        kind: 'code',
        label: 'UserProfile.tsx',
        code: `function UserProfile({ id }: { id: string }) {
  const { data } = api.users.detail.withPathParams({ id }).useQuery();
  //      ^? User | undefined

  const save = api.users.update.withPathParams({ id }).useMutation();

  if (!data) return <Skeleton />;
  return (
    <>
      <h1>{data.name}</h1>
      <button onClick={() => save.mutate({ name: 'Ada' })}>Rename</button>
    </>
  );
}`,
      },
      {
        kind: 'note',
        tone: 'info',
        title: 'No QueryClientProvider here?',
        text: 'You still need one, exactly as you would without hapi. hapi produces options and keys; it does not own your client.',
      },
    ],
  },

  {
    slug: 'typescript',
    title: 'TypeScript',
    lede: 'Where the types come from, and what to do when inference surprises you.',
    blocks: [
      {
        kind: 'p',
        text: 'Every type at a call site is derived from the endpoint declaration. `responseSchema` gives you the result type, `requestSchema` the argument type, and `pathParamsSchema` the shape `withPathParams` accepts. You should not need to annotate anything.',
      },
      { kind: 'h3', text: 'Capabilities are gated at compile time' },
      {
        kind: 'p',
        text: 'Members that would be wrong are typed `never` rather than missing. A `POST` endpoint has no usable `useQuery`, and an endpoint with an unbound required path parameter has no usable `fetch`, because the URL could not be built.',
      },
      {
        kind: 'code',
        code: `api.users.update.useQuery;
//               ^? never — update is a PATCH

api.users.detail.fetch;
//               ^? never — :id is not bound yet

api.users.detail.withPathParams({ id: '1' }).fetch;
//                                           ^? (request?, options?) => Promise<User>`,
      },
      { kind: 'h3', text: 'Transforms resolve to their output type' },
      {
        kind: 'p',
        text: 'A schema that transforms gives you the type after the transform, not before. This holds for both supported protocols.',
      },
      {
        kind: 'code',
        code: `responseSchema: z.string().transform(Number)
// data is number, not string`,
      },
      { kind: 'h3', text: 'Reading the cache with types' },
      {
        kind: 'p',
        text: 'Use `queryOptions().queryKey` when you want a typed cache read. It carries TanStack’s `DataTag` brand, so `getQueryData` returns the response type. The plain `queryKey` member is deliberately untagged, because it is used as an invalidation prefix as often as a whole key.',
      },
      {
        kind: 'code',
        code: `qc.getQueryData(ep.queryOptions().queryKey);
//  ^? User | undefined

qc.getQueryData(ep.queryKey);
//  ^? unknown — this is a prefix, not a key`,
      },
      {
        kind: 'note',
        tone: 'warn',
        title: 'If inference collapses to unknown',
        text: 'Check that the service config went through `defineService` and that you did not annotate it with a wider type. An explicit `: ServiceConfig` annotation discards the literal types the inference depends on.',
      },
    ],
  },
];
