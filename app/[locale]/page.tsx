import type { ComponentType } from 'react';
import CdsButton from '@/components/ui/cds-button';
import LanguageNotice from '@/components/LanguageNotice';
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
  const placeholderCount = Math.max(0, HOME_PRODUCT_LIMIT - homepageProducts.length);
  const gridColor =
    'color-mix(in oklab, var(--color-fd-primary) 10%, transparent)';

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `radial-gradient(circle at top, color-mix(in oklab, var(--color-fd-primary) 12%, transparent) 0%, transparent 55%), repeating-linear-gradient(to right, ${gridColor}, ${gridColor} 1px, transparent 1px, transparent 64px), repeating-linear-gradient(to bottom, ${gridColor}, ${gridColor} 1px, transparent 1px, transparent 64px), repeating-linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-fd-primary) 6%, transparent) 360px, transparent 900px)`
        }}
      />

      <main className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <LanguageNotice locale={locale} />

        <div className="space-y-10">
          <section className="rounded-2xl border border-fd-border bg-fd-card/95 p-8 shadow-md">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {dict.home.hero.title}
                </h1>
                <p className="text-lg text-fd-muted-foreground">
                  {dict.home.hero.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <CdsButton
                    as="a"
                    href={`/${locale}/products`}
                    variant="primary"
                    radius="0.5rem"
                  >
                    {dict.home.hero.exploreBtn}
                  </CdsButton>
                  <CdsButton
                    as="a"
                    href={`/${locale}#contact`}
                    variant="tertiary"
                    radius="0.5rem"
                  >
                    {dict.home.hero.contactBtn}
                  </CdsButton>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/品牌logo.png"
                  alt={dict.common.brandLogoAlt}
                  className="h-40 w-40 rounded-lg border border-dashed border-fd-border bg-fd-card/60 p-6"
                />
              </div>
            </div>
          </section>

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

          <section className="md:-mx-4 lg:-mx-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-2xl font-semibold">
                {dict.home.products.title}
              </h2>
              <a
                className="text-sm font-medium text-fd-primary hover:underline"
                href={`/${locale}/products`}
              >
                {dict.home.products.viewAll}
              </a>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {homepageProducts.map((product) => {
                const localizedProduct = getLocalizedProduct(product, locale);

                return (
                  <a
                    key={`${product.slug}-${product.model}`}
                    className="group flex h-full flex-col rounded-2xl border-1 border-fd-primary/80 bg-fd-card/90 p-6 shadow-lg transition-all hover:scale-[1.03] hover:border-fd-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
                    href={`/${locale}/products/${product.slug}`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-lg font-extrabold tracking-widest text-fd-primary">
                        {product.model}
                      </span>
                    </div>
                    <div className="mb-2 text-base font-bold text-fd-foreground">
                      {localizedProduct.name}
                    </div>
                    <p className="mb-4 flex-1 text-sm text-fd-muted-foreground">
                      {localizedProduct.summary}
                    </p>
                    <div className="mb-4 text-xs text-fd-muted-foreground">
                      {dict.common.labels.coreSpecs}: {localizedProduct.coreSpecs.join(' · ')}
                    </div>
                    <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-fd-foreground group-hover:text-fd-primary transition">
                      {dict.home.products.details}
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </a>
                );
              })}

              {Array.from({ length: placeholderCount }).map((_, index) => (
                <div
                  key={`coming-soon-${index}`}
                  className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-fd-border bg-fd-card/80 p-6 text-fd-muted-foreground"
                >
                  <span className="mb-2 text-2xl font-bold">+</span>
                  <span className="text-sm">{dict.home.products.comingSoon}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <div className="prose max-w-none text-fd-foreground">
              <Content components={getMdxComponents()} />
            </div>
          </section>

          <section id="contact" className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <h2 className="text-2xl font-semibold">
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
