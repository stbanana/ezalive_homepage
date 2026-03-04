import { getLocalizedProduct, products } from '@/data/products';
import { getDictionary } from '@/lib/dictionaries';
import SubtleTechBackgroundLayout from '@/components/SubtleTechBackgroundLayout';

type Locale = 'zh' | 'en';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const localizedProducts = products.map((product) => getLocalizedProduct(product, locale));

  return (
    <SubtleTechBackgroundLayout>
      <main className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold">
            {locale === 'zh' ? '产品中心' : 'Products'}
          </h1>
          <p className="text-sm text-neutral-600">
            {locale === 'zh'
              ? '聚焦电力电子测试场景的源载双向交直流源。'
              : 'Bidirectional AC/DC source-load solutions for power electronics testing.'}
          </p>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {localizedProducts.map((product) => (
            <a
              key={product.slug}
              className="group flex h-full flex-col rounded-2xl border-1 border-fd-primary/80 bg-fd-card/90 p-6 shadow-lg transition-all hover:scale-[1.03] hover:border-fd-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
              href={`/${locale}/products/${product.slug}`}
            >
              <div className="text-xs text-neutral-500">{locale === 'zh' ? '型号' : 'Model'}: {product.model}</div>
              <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
              <p className="mt-2 text-sm text-neutral-600">{product.summary}</p>
              <div className="mt-2 text-xs text-neutral-500">
                {locale === 'zh' ? '核心参数' : 'Core Specs'}: {product.coreSpecs.join(' · ')}
              </div>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-neutral-900 group-hover:text-fd-primary">
                {dict.home.products.details} →
              </div>
            </a>
          ))}
        </div>
      </main>
    </SubtleTechBackgroundLayout>
  );
}
