import type { ComponentType } from 'react';
import LanguageNotice from '@/components/LanguageNotice';
import HeroSection from '@/components/home/HeroSection';
import HomeProductsSection from '@/components/home/HomeProductsSection';
import { getMdxComponents } from '@/mdx-components';
import { getDictionary } from '@/lib/dictionaries';
import { i18n } from '@/lib/i18n';
import {
  getHomepageProducts,
  getLocalizedProduct,
  HOME_PRODUCT_LIMIT,
} from '@/data/products';

type Locale = 'zh' | 'en';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const homeMdxMap: Record<Locale, () => Promise<{ default: ComponentType<any> }>> = {
  zh: () => import('@/content/zh/home.mdx'),
  en: () => import('@/content/en/home.mdx')
};

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.languages.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const Content = (await homeMdxMap[locale]()).default;
  const dict = await getDictionary(locale);
  const homepageProducts = getHomepageProducts(HOME_PRODUCT_LIMIT);
  const localizedHomepageProducts = homepageProducts.map((product) => {
    const localizedProduct = getLocalizedProduct(product, locale);

    return {
      slug: product.slug,
      model: product.model,
      name: localizedProduct.name,
      summary: localizedProduct.summary,
      coreSpecs: localizedProduct.coreSpecs,
    };
  });
  const placeholderCount = Math.max(0, HOME_PRODUCT_LIMIT - homepageProducts.length);

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `radial-gradient(circle at top, color-mix(in oklab, var(--color-fd-primary) 12%, transparent) 0%, transparent 55%)`
        }}
      />

      <main className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <LanguageNotice locale={locale} />

        <div className="space-y-10">
          <HeroSection
            locale={locale}
            title={dict.home.hero.title}
            description={dict.home.hero.description}
            exploreBtn={dict.home.hero.exploreBtn}
            contactBtn={dict.home.hero.contactBtn}
            brandLogoAlt={dict.common.brandLogoAlt}
          />

          <section className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <div className="grid gap-6 md:grid-cols-3">
              {dict.home.features.map((item) => (
                <div key={item.title} className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-5">
                  <h3 className="text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-fd-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <HomeProductsSection
            locale={locale}
            title={dict.home.products.title}
            viewAll={dict.home.products.viewAll}
            details={dict.home.products.details}
            comingSoon={dict.home.products.comingSoon}
            products={localizedHomepageProducts}
            placeholderCount={placeholderCount}
          />

          <section className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <div className="prose max-w-none text-fd-foreground">
              <Content components={getMdxComponents()} />
            </div>
          </section>

          <section id="contact" className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <h2>
              {dict.home.contact.title}
            </h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              {dict.home.contact.description}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
                <div className="text-sm text-fd-muted-foreground">
                  {dict.home.contact.hotline}
                </div>
                <div className="mt-1 text-base font-semibold">400-800-1234</div>
              </div>
              <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
                <div className="text-sm text-fd-muted-foreground">
                  {dict.home.contact.email}
                </div>
                <div className="mt-1 text-base font-semibold">hello@ezalive.com</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
