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
    ez40004: {
      loader: () => import('@/content/zh/products/ez40004.mdx'),
      filePath: 'content/zh/products/ez40004.mdx',
    }
  },
  en: {
    ez40004: {
      loader: () => import('@/content/en/products/ez40004.mdx'),
      filePath: 'content/en/products/ez40004.mdx',
    }
  }
};

export const dynamicParams = false;

export function generateStaticParams() {
  return products.flatMap((p) =>
    i18n.languages.map((locale) => ({ locale, slug: p.slug }))
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
