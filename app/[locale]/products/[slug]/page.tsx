import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { getMdxComponents } from '@/mdx-components';
import CdsButton from '@/components/ui/cds-button';
import { i18n } from '@/lib/i18n';
import { products } from '@/data/products';

type Locale = 'zh' | 'en';

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

const productMdxMap: Record<Locale, Record<string, () => Promise<{ default: ComponentType<any> }>>> = {
  zh: {
    ez40004: () => import('@/content/zh/products/ez40004.mdx')
  },
  en: {
    ez40004: () => import('@/content/en/products/ez40004.mdx')
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
  const loader = productMdxMap[locale]?.[slug];
  if (!loader) {
    notFound();
  }

  const Content = (await loader()).default;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="prose max-w-none">
        <Content components={getMdxComponents()} />
      </div>
    </main>
  );
}
