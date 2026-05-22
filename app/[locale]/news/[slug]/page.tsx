import type { ComponentType } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SubtleTechBackgroundLayout from '@/components/SubtleTechBackgroundLayout';
import { getMdxComponents } from '@/mdx-components';
import { i18n } from '@/lib/i18n';
import {
    getNewsStaticParams,
    loadNewsPage,
    type Locale,
} from '@/lib/news';

type PageProps = {
    params: Promise<{ locale: Locale; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
    return getNewsStaticParams(i18n.languages as Locale[]);
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const newsPage = await loadNewsPage(locale, slug);

    if (!newsPage) {
        notFound();
    }

    const Content = newsPage.Content as ComponentType<any>;
    const backText = locale === 'zh' ? '返回新闻列表' : 'Back to Newsroom';

    return (
        <SubtleTechBackgroundLayout>
            <main className="relative mx-auto w-full max-w-4xl px-6 py-12">
                <div className="mb-6">
                    <Link
                        href={`/${locale}/news`}
                        className="text-sm font-medium text-fd-primary hover:underline"
                    >
                        ← {backText}
                    </Link>
                </div>

                <article className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
                    <header className="mb-6 space-y-3 border-b border-fd-border pb-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-fd-border/80 bg-fd-background px-2.5 py-1 text-[11px] font-medium text-fd-muted-foreground">
                                {newsPage.meta.tag}
                            </span>
                            <span className="text-xs text-fd-muted-foreground">{newsPage.meta.date}</span>
                        </div>
                        <h1 className="text-3xl leading-tight md:text-4xl">{newsPage.meta.title}</h1>
                        <p className="text-sm leading-7 text-fd-muted-foreground">{newsPage.meta.summary}</p>
                    </header>

                    <div className="prose max-w-none text-fd-foreground">
                        <Content components={getMdxComponents()} />
                    </div>
                </article>
            </main>
        </SubtleTechBackgroundLayout>
    );
}
