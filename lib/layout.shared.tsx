
import ProductMenuNav from '@/components/ProductMenuNav';
import AboutMenuNav from '@/components/AboutMenuNav';
import StaticMenuNav from '@/components/StaticMenuNav';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from '@/lib/i18n';

type Locale = 'zh' | 'en';

const labels = {
  zh: {
    home: '首页',
    products: '产品中心',
    about: '关于我们',
    news: '新闻动态',
    contact: '联系',
    switch: 'English'
  },
  en: {
    home: 'Home',
    products: 'Products',
    about: 'About',
    news: 'News',
    contact: 'Contact',
    switch: '中文'
  }
};

export function baseOptions(locale: Locale): BaseLayoutProps {
  const otherLocale = locale === 'zh' ? 'en' : 'zh';

  return {
    i18n,
    nav: {
      title: (
        <img
          src="/品牌logo.png"
          alt="brand logo"
          style={{
            height: 28,
            width: 'auto',
            maxHeight: 'calc(100% - 2px)',
            objectFit: 'contain',
            display: 'block',
            padding: '1px 0'
          }}
        />
      ),
      url: `/${locale}`,
      transparentMode: 'top'
    },
    links: [
      {
        type: 'custom',
        children: <StaticMenuNav locale={locale} type="home" />,
      },
      {
        type: 'custom',
        children: <ProductMenuNav locale={locale} />,
      },
      {
        type: 'custom',
        children: <AboutMenuNav locale={locale} />,
      },
      {
        type: 'custom',
        children: <StaticMenuNav locale={locale} type="contact" />,
      },
      {
        text: labels[locale].switch,
        url: `/${otherLocale}`,
        secondary: true
      }
    ]
  };
}
