import { products } from '@/data/products';

type Locale = 'zh' | 'en';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
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
        {products.map((product) => (
          <article key={product.slug} className="rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm text-neutral-600">{product.summary}</p>
            <div className="mt-4 text-xs text-neutral-500">Model: {product.model}</div>
            <a
              className="mt-4 inline-flex items-center text-sm font-medium text-neutral-900"
              href={`/${locale}/products/${product.slug}`}
            >
              {locale === 'zh' ? '查看产品 →' : 'View product →'}
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
