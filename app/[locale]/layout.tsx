import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { Provider } from '@/components/provider';

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.languages.map((locale) => ({ locale }));
}

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
    },
    zh: {
      displayName: '简体中文',
      search: '搜索',
      searchNoResult: '未找到相关结果',
      toc: '目录',
      lastUpdate: '最后更新于',
      chooseLanguage: '选择语言',
      nextPage: '下一页',
      previousPage: '上一页',
    },
  },
});

type Locale = 'zh' | 'en';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  return (
    <Provider i18n={provider(locale)}>
      <HomeLayout {...baseOptions(locale)}>
        {children}
      </HomeLayout>
    </Provider>
  );
}