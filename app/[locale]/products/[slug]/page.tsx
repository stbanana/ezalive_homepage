import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getTableOfContents } from 'fumadocs-core/content/toc';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import matter from 'gray-matter';
import { getMdxComponents } from '@/mdx-components';
import { i18n } from '@/lib/i18n';
import { products } from '@/data/products';


type Locale = 'zh' | 'en';

type ProductPageConfig = {
  loader: () => Promise<{ default: ComponentType<any> }>;
  filePath: string;
};

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

const productMdxMap: Record<Locale, Record<string, ProductPageConfig>> = {
  zh: {
    EZ4000x: {
      loader: () => import('@/content/zh/products/EZ4000x.mdx'),
      filePath: 'content/zh/products/EZ4000x.mdx',
    }
  },
  en: {
    EZ4000x: {
      loader: () => import('@/content/en/products/EZ4000x.mdx'),
      filePath: 'content/en/products/EZ4000x.mdx',
    }
  }
};

export const dynamicParams = false;

export function generateStaticParams() {
  const uniqueSlugs = Array.from(new Set(products.map((product) => product.slug)));
  return uniqueSlugs.flatMap((slug) =>
    i18n.languages.map((locale) => ({ locale, slug }))
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const pageConfig = productMdxMap[locale]?.[slug];
  if (!pageConfig) {
    notFound();
  }

  const mdxSource = await readFile(join(process.cwd(), pageConfig.filePath), 'utf-8');
  const { content: markdownContent } = matter(mdxSource);
  const toc = getTableOfContents(markdownContent);
  const Content = (await pageConfig.loader()).default;
  return (
    <DocsPage
      toc={toc}
      tableOfContent={{
        style: 'clerk',
      }}
      breadcrumb={{ enabled: false }}
      footer={{ enabled: false }}
      container={{
        className: '[--fd-toc-width:0px] xl:[--fd-toc-width:19rem] 2xl:[--fd-toc-width:21rem]',
      }}
      article={{
        className: 'px-6 py-12 md:px-8',
      }}
    >
      <DocsBody className="max-w-none text-fd-foreground/90">
        <Content components={getMdxComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
