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
            {dict.products.title}
          </h1>
          <p className="text-sm text-neutral-600">
            {dict.products.description}
          </p>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {localizedProducts.map((product) => (
            <a
              key={`${product.slug}-${product.model}`}
              className="group flex h-full flex-col rounded-2xl border border-fd-primary/40 bg-fd-card/90 p-6 shadow-lg transition-all hover:scale-[1.03] hover:border-fd-primary hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
              href={`/${locale}/products/${product.slug}`}
            >
              <div className="text-xs text-fd-primary">{dict.common.labels.model}: {product.model}</div>
              <h2 className="mt-2 text-xl font-semibold text-fd-foreground">{product.name}</h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">{product.summary}</p>
              <div className="mt-2 text-xs text-fd-muted-foreground">
                {dict.common.labels.coreSpecs}: {product.coreSpecs.join(' · ')}
              </div>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-fd-foreground transition-colors group-hover:text-fd-primary">
                {dict.home.products.details} →
              </div>
            </a>
          ))}
        </div>
      </main>
    </SubtleTechBackgroundLayout>
  );
}
