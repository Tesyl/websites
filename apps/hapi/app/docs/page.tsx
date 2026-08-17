import { redirect } from 'next/navigation';
import { DOC_ORDER } from '@tesyl/content/docs';

/** /docs has no page of its own; it opens on the first one in reading order. */
export default function DocsIndex() {
  redirect(`/docs/${DOC_ORDER[0]}`);
}
