import Link from 'next/link';
import SubtleTechBackgroundLayout from '@/components/SubtleTechBackgroundLayout';
import { getNewsList, type Locale } from '@/lib/news';

type PageProps = {
    params: Promise<{ locale: Locale }>;
};

export default async function NewsPage({ params }: PageProps) {
    const { locale } = await params;
    const news = await getNewsList(locale);

    const title = locale === 'zh' ? '新闻动态' : 'Newsroom';
    const description = locale === 'zh'
        ? '聚焦产品迭代、测试实践与交付进展，持续更新团队近期动态。'
        : 'Updates on product iterations, validation practices, and delivery progress.';

    return (
        <SubtleTechBackgroundLayout>
            <main className="relative mx-auto w-full max-w-5xl px-6 py-12">
                <div className="mb-8 space-y-3">
                    <h1>{title}</h1>
                    <p className="max-w-3xl text-sm leading-7 text-fd-muted-foreground">{description}</p>
                </div>

                <div className="grid gap-4">
                    {news.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/${locale}/news/${item.slug}`}
                            className="group block rounded-xl border border-fd-border bg-fd-card/90 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-fd-primary/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <span className="rounded-full border border-fd-border/80 bg-fd-background px-2.5 py-1 text-[11px] font-medium text-fd-muted-foreground">
                                    {item.tag}
                                </span>
                                <span className="text-xs text-fd-muted-foreground">{item.date}</span>
                            </div>
                            <h2 className="text-xl font-semibold leading-7 text-fd-foreground group-hover:text-fd-primary">
                                {item.title}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{item.summary}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </SubtleTechBackgroundLayout>
    );
}
