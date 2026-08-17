import { redirect } from 'next/navigation';
import { SCREEAN_DOC_ORDER } from '@tesyl/content/screean-docs';

// /docs has no content of its own — the first page in reading order IS the
// overview. Redirecting keeps one canonical URL per page rather than
// duplicating the overview at two addresses.
const DocsIndex = () => {
  redirect(`/docs/${SCREEAN_DOC_ORDER[0] ?? 'overview'}`);
};

export default DocsIndex;
