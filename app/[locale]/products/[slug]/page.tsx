import type { ComponentType, HTMLAttributes } from 'react';
import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getTableOfContents } from 'fumadocs-core/content/toc';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import matter from 'gray-matter';
import { getMdxComponents } from '@/mdx-components';
import { i18n } from '@/lib/i18n';
import { products } from '@/data/products';
import { source } from '@/lib/source';

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
  const withClass = (base: string, className?: string) =>
    className ? `${base} ${className}` : base;
  const productMdxComponents = {
    ...getMdxComponents(),
    h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={withClass('scroll-m-20 text-4xl font-semibold tracking-tight', className)} {...props} />
    ),
    h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={withClass('scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight', className)} {...props} />
    ),
    h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className={withClass('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />
    ),
  };

  return (
    <DocsLayout tree={source.getPageTree(locale)} sidebar={{ enabled: false }}>
      <DocsPage
        toc={toc}
        tableOfContent={{
          style: 'clerk',
        }}
        tableOfContentPopover={{ enabled: false }}
        breadcrumb={{ enabled: false }}
        footer={{ enabled: false }}
        className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 [--fd-toc-width:0px] xl:[--fd-toc-width:18rem] 2xl:[--fd-toc-width:20rem]'
      >
        <DocsBody className="max-w-none text-fd-foreground/90 [&_h1]:tracking-tight [&_h2]:mt-10 [&_h3]:mt-8 [&_p]:leading-7">
          <Content components={productMdxComponents} />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}
