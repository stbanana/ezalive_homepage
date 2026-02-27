import type { ComponentType } from 'react';
import { getMdxComponents } from '@/mdx-components';

type Locale = 'zh' | 'en';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const aboutMdxMap: Record<Locale, () => Promise<{ default: ComponentType<any> }>> = {
  zh: () => import('@/content/zh/about.mdx'),
  en: () => import('@/content/en/about.mdx')
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const Content = (await aboutMdxMap[locale]()).default;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="prose max-w-none">
        <Content components={getMdxComponents()} />
      </div>
    </main>
  );
}
