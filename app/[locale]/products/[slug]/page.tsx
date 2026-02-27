import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { getMdxComponents } from '@/mdx-components';

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
  return [
    { locale: 'zh', slug: 'ez40004' },
    { locale: 'en', slug: 'ez40004' }
  ];
}

export default async function ProductDetailPage({ params }: PageProps) {
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
