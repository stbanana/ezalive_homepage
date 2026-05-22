'use client';

import { useMemo, useState } from 'react';
import type { ProductCategory } from '@/data/products';

type Locale = 'zh' | 'en';

type ProductLabels = {
    coreSpecs: string;
    communicationInterfaces: string;
    communicationProtocols: string;
};

type ProductItem = {
    slug: string;
    model: string;
    category: ProductCategory;
    series: string;
    summary: string;
    coreSpecs: string[];
    communicationInterfaces: string[];
    communicationProtocols: string[];
};

type ProductsCatalogSectionProps = {
    locale: Locale;
    products: ProductItem[];
    detailsText: string;
    labels: ProductLabels;
};

const categoryOrder: ProductCategory[] = ['acdc', 'ac', 'dc'];

export default function ProductsCatalogSection({
    locale,
    products,
    detailsText,
    labels,
}: ProductsCatalogSectionProps) {
    const [selectedCategories, setSelectedCategories] = useState<Set<ProductCategory>>(
        new Set(categoryOrder),
    );

    const categoryText: Record<ProductCategory, string> = {
        acdc: locale === 'zh' ? '交直流' : 'AC/DC',
        ac: locale === 'zh' ? '交流' : 'AC',
        dc: locale === 'zh' ? '直流' : 'DC',
    };

    const allChecked = selectedCategories.size === categoryOrder.length;

    const toggleCategory = (category: ProductCategory, checked: boolean) => {
        const next = new Set(selectedCategories);
        if (checked) {
            next.add(category);
        } else {
            next.delete(category);
        }

        setSelectedCategories(next);
    };

    const filteredProducts = useMemo(() => {
        if (allChecked || selectedCategories.size === 0) return products;
        return products.filter((product) => selectedCategories.has(product.category));
    }, [allChecked, products, selectedCategories]);

    const groupedByCategoryAndSeries = useMemo(() => {
        return categoryOrder
            .map((category) => {
                const categoryProducts = filteredProducts.filter((item) => item.category === category);
                if (categoryProducts.length === 0) return null;

                const seriesMap = new Map<string, ProductItem[]>();
                for (const item of categoryProducts) {
                    const current = seriesMap.get(item.series) ?? [];
                    current.push(item);
                    seriesMap.set(item.series, current);
                }

                return {
                    category,
                    categoryLabel: categoryText[category],
                    seriesGroups: Array.from(seriesMap.entries()).map(([series, items]) => ({
                        series,
                        items,
                    })),
                };
            })
            .filter(Boolean) as Array<{
                category: ProductCategory;
                categoryLabel: string;
                seriesGroups: Array<{ series: string; items: ProductItem[] }>;
            }>;
    }, [categoryText, filteredProducts]);

    return (
        <div className="mt-8 space-y-6">
            <section className="border-b border-fd-border/70 pb-4">
                <div className="mb-3 text-xs font-semibold tracking-[0.08em] text-fd-muted-foreground">
                    {locale === 'zh' ? '分类筛选' : 'CATEGORY FILTER'}
                </div>
                <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center gap-2 rounded-md border border-fd-border/70 px-3 py-1.5 text-sm">
                        <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setSelectedCategories(new Set(categoryOrder));
                                }
                            }}
                        />
                        <span>{locale === 'zh' ? '全部' : 'All'}</span>
                    </label>

                    {categoryOrder.map((category) => (
                        <label
                            key={category}
                            className="inline-flex items-center gap-2 rounded-md border border-fd-border/70 px-3 py-1.5 text-sm"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.has(category)}
                                onChange={(event) => toggleCategory(category, event.target.checked)}
                            />
                            <span>{categoryText[category]}</span>
                        </label>
                    ))}
                </div>
            </section>

            <div className="space-y-6">
                {groupedByCategoryAndSeries.map((categoryGroup) => (
                    <section key={categoryGroup.category} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-semibold text-fd-foreground">{categoryGroup.categoryLabel}</h2>
                            <div className="h-px flex-1 bg-fd-border/70" />
                        </div>

                        <div className="space-y-4">
                            {categoryGroup.seriesGroups.map((seriesGroup) => (
                                <article key={`${categoryGroup.category}-${seriesGroup.series}`} className="space-y-2">
                                    <div className="text-sm font-semibold text-fd-muted-foreground">
                                        <span className="inline-block border-l-2 border-fd-primary pl-2">{seriesGroup.series}</span>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {seriesGroup.items.map((product) => (
                                            <a
                                                key={`${product.slug}-${product.model}`}
                                                className="group flex h-full flex-col rounded-2xl border border-fd-primary/40 bg-fd-card/90 p-6 shadow-lg transition-all hover:scale-[1.03] hover:border-fd-primary hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
                                                href={`/${locale}/products/${product.slug}`}
                                            >
                                                <h2 className="text-xl font-semibold text-fd-foreground">{product.model}</h2>
                                                <p className="mt-2 text-sm text-fd-muted-foreground">{product.summary}</p>
                                                <div className="mt-2 text-xs text-fd-muted-foreground">
                                                    {labels.coreSpecs}: {product.coreSpecs.join(' · ')}
                                                </div>
                                                <div className="mt-1 text-xs text-fd-muted-foreground">
                                                    {labels.communicationInterfaces}: {product.communicationInterfaces.join(' / ')}
                                                </div>
                                                <div className="mt-1 text-xs text-fd-muted-foreground">
                                                    {labels.communicationProtocols}: {product.communicationProtocols.join(' / ')}
                                                </div>
                                                <div className="mt-4 inline-flex items-center text-sm font-medium text-fd-foreground transition-colors group-hover:text-fd-primary">
                                                    {detailsText} →
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
