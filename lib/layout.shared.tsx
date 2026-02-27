
import ProductMenuNav from '@/components/ProductMenuNav';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

type Locale = 'zh' | 'en';

const labels = {
  zh: {
    home: '首页',
    products: '产品中心',
    about: '关于我们',
    contact: '联系',
    switch: 'English'
  },
  en: {
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    switch: '中文'
  }
};

export function baseOptions(locale: Locale): BaseLayoutProps {
  const otherLocale = locale === 'zh' ? 'en' : 'zh';

  return {
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
        text: labels[locale].home,
        url: `/${locale}`,
        active: 'url'
      },
      {
        type: 'custom',
        children: <ProductMenuNav locale={locale} />,
      },
      {
        text: labels[locale].about,
        url: `/${locale}/about`,
        active: 'url'
      },
      {
        text: labels[locale].contact,
        url: `/${locale}/contact`,
        active: 'url'
      },
      {
        text: labels[locale].switch,
        url: `/${otherLocale}`,
        secondary: true
      }
    ]
  };
}
