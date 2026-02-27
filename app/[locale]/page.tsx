import type { ComponentType } from 'react';
import LanguageNotice from '@/components/LanguageNotice';
import { getMdxComponents } from '@/mdx-components';

type Locale = 'zh' | 'en';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const homeMdxMap: Record<Locale, () => Promise<{ default: ComponentType<any> }>> = {
  zh: () => import('@/content/zh/home.mdx'),
  en: () => import('@/content/en/home.mdx')
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const Content = (await homeMdxMap[locale]()).default;
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
                  {locale === 'zh' ? '易启测 ezalive' : '易启测 ezalive'}
                </h1>
                <p className="text-lg text-fd-muted-foreground">
                  {locale === 'zh'
                    ? '易启测专注于高精度电力电子测试平台，为研发与验证提供可靠支持。'
                    : 'Ezalive focuses on high-precision power electronics test platforms for reliable R&D and validation.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    className="inline-flex items-center justify-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground shadow-sm"
                    href={`/${locale}/products`}
                  >
                    {locale === 'zh' ? '了解产品' : 'Explore Products'}
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-md border border-fd-border bg-fd-background/70 px-4 py-2 text-sm font-medium text-fd-foreground"
                    href={`/${locale}#contact`}
                  >
                    {locale === 'zh' ? '联系咨询' : 'Contact Us'}
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/品牌logo.png"
                  alt="brand logo"
                  className="h-40 w-40 rounded-lg border border-dashed border-fd-border bg-fd-card/60 p-6"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  zh: '高精度输出与测量',
                  en: 'High-precision output and measurement'
                },
                {
                  zh: '源载双向一体化',
                  en: 'Bidirectional source/load integration'
                },
                {
                  zh: '适配多场景测试',
                  en: 'Flexible for multi-scenario testing'
                }
              ].map((item) => (
                <div key={item.en} className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-5">
                  <h3 className="text-base font-semibold">
                    {locale === 'zh' ? item.zh : item.en}
                  </h3>
                  <p className="mt-2 text-sm text-fd-muted-foreground">
                    {locale === 'zh'
                      ? '面向研发与验证流程，提供稳定可靠的测试能力。'
                      : 'Designed for R&D and validation with stable, reliable testing.'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="md:-mx-4 lg:-mx-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-2xl font-semibold">
                {locale === 'zh' ? '产品中心' : 'Product Center'}
              </h2>
              <a
                className="text-sm font-medium text-fd-primary hover:underline"
                href={`/${locale}/products`}
              >
                {locale === 'zh' ? '查看全部 →' : 'View all →'}
              </a>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* 产品卡片1 */}
              <a
                className="group flex flex-col h-full rounded-2xl border-1 border-fd-primary/80 bg-fd-card/90 p-6 shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl hover:border-fd-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
                href={`/${locale}/products/ez40004`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-extrabold text-fd-primary tracking-widest">EZ40004</span>
                </div>
                <div className="mb-2 text-base font-bold text-fd-foreground">
                  {locale === 'zh' ? '源载双向交直流源' : 'Bidirectional AC/DC Source'}
                </div>
                <p className="mb-4 text-sm text-fd-muted-foreground flex-1">
                  {locale === 'zh'
                    ? '面向电力电子测试的高精度源载一体平台。'
                    : 'High-precision source/load platform for power electronics testing.'}
                </p>
                <div className="mt-auto text-sm font-semibold text-fd-primary transition flex items-center gap-1">
                  {locale === 'zh' ? '查看详情' : 'View details'}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </a>
              {/* 占位卡片2 */}
              <div className="flex flex-col h-full rounded-2xl border-2 border-dashed border-fd-border bg-fd-card/80 p-6 items-center justify-center text-fd-muted-foreground">
                <span className="text-2xl font-bold mb-2">+</span>
                <span className="text-sm">{locale === 'zh' ? '敬请期待' : 'Coming soon'}</span>
              </div>
              {/* 占位卡片3 */}
              <div className="flex flex-col h-full rounded-2xl border-2 border-dashed border-fd-border bg-fd-card/80 p-6 items-center justify-center text-fd-muted-foreground">
                <span className="text-2xl font-bold mb-2">+</span>
                <span className="text-sm">{locale === 'zh' ? '敬请期待' : 'Coming soon'}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <div className="prose max-w-none text-fd-foreground">
              <Content components={getMdxComponents()} />
            </div>
          </section>

          <section id="contact" className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
            <h2 className="text-2xl font-semibold">
              {locale === 'zh' ? '联系咨询' : 'Contact'}
            </h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              {locale === 'zh'
                ? '欢迎通过热线或邮箱联系我们。'
                : 'Reach us via hotline or email.'}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
                <div className="text-sm text-fd-muted-foreground">
                  {locale === 'zh' ? '服务热线' : 'Hotline'}
                </div>
                <div className="mt-1 text-base font-semibold">400-800-1234</div>
              </div>
              <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
                <div className="text-sm text-fd-muted-foreground">Email</div>
                <div className="mt-1 text-base font-semibold">hello@ezalive.com</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
