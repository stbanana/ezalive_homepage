import LanguageNotice from '@/components/LanguageNotice';
import HeroSection from '@/components/home/HeroSection';
import HomeProductsSection from '@/components/home/HomeProductsSection';
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

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.languages.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
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
  const trustTitle = locale === 'zh' ? '为何选择易启测' : 'Why Teams Choose Ezalive';
  const trustLead = locale === 'zh'
    ? '我们把测试系统做成可复现、可扩展、可长期维护的工程资产，而不只是一次性验证工具。'
    : 'We build test systems as repeatable, scalable engineering assets, not one-off validation tools.';
  const trustBody = locale === 'zh'
    ? '从研发验证到量产前测试，团队可以在同一能力框架下持续复用流程与数据，降低切换成本。'
    : 'From R&D validation to pre-production testing, teams can reuse workflows and data under one capability framework.';
  const trustPoints = locale === 'zh'
    ? [
      {
        title: '验证效率',
        text: '统一源载能力与参数管理，缩短测试准备周期，减少重复调试时间。',
      },
      {
        title: '结果一致性',
        text: '在多场景切换中保持稳定输出与测量精度，提升实验复现可信度。',
      },
      {
        title: '交付可持续',
        text: '模块化架构便于后续扩展功率等级、测试项与场景策略。',
      },
    ]
    : [
      {
        title: 'Validation Efficiency',
        text: 'Unified source-load capability and parameter flow reduce setup time and repetitive tuning.',
      },
      {
        title: 'Result Consistency',
        text: 'Stable output and measurement accuracy across scenarios improve reproducibility confidence.',
      },
      {
        title: 'Sustainable Delivery',
        text: 'A modular architecture makes it easy to scale power levels, test items, and scenarios over time.',
      },
    ];

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
            <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div className="space-y-4">
                <h2 className="text-3xl leading-tight md:text-4xl">{trustTitle}</h2>
                <p className="text-base leading-7 text-fd-foreground/90">{trustLead}</p>
                <p className="text-sm leading-7 text-fd-muted-foreground">{trustBody}</p>
              </div>
              <div className="grid gap-4">
                {trustPoints.map((item, index) => (
                  <article
                    key={item.title}
                    className="rounded-xl border border-fd-border/70 bg-fd-background/75 px-5 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-grid h-6 w-6 place-items-center rounded-full border border-fd-border/80 text-[11px] font-semibold text-fd-muted-foreground">
                        0{index + 1}
                      </span>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-semibold leading-6">{item.title}</h3>
                        <p className="text-sm leading-6 text-fd-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
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
