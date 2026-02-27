import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

type Locale = 'zh' | 'en';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  return (
    <HomeLayout {...baseOptions(locale)}>
      {children}
    </HomeLayout>
  );
}
