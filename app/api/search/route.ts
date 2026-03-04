import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  localeMap: {
    en: 'english',
    zh: 'english', // Fallback as Orama does not have native 'zh' in its stemmers by default
  },
  buildIndex: (page) => ({
    id: page.url,
    title: page.data.title || '',
    description: page.data.description,
    url: page.url,
    structuredData: (page.data as any).structuredData ?? { headings: [], contents: [] },
    breadcrumbs: [],
  })
});
