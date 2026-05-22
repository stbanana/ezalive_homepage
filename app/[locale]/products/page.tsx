import { getLocalizedProduct, products } from '@/data/products';
import { getDictionary } from '@/lib/dictionaries';
import SubtleTechBackgroundLayout from '@/components/SubtleTechBackgroundLayout';
import ProductsCatalogSection from '@/components/products/ProductsCatalogSection';

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

        <ProductsCatalogSection
          locale={locale}
          products={localizedProducts}
          detailsText={dict.home.products.details}
          labels={dict.common.labels}
        />
      </main>
    </SubtleTechBackgroundLayout>
  );
}
