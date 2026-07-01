'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Locale = 'zh' | 'en';

type NewsItem = {
    title: string;
    summary: string;
    date: string;
    tag: string;
    href: string;
};

type HomeNewsSectionProps = {
    locale: Locale;
    title: string;
    description: string;
    viewAll: string;
    viewAllHref: string;
    items: NewsItem[];
};

export default function HomeNewsSection({
    locale,
    title,
    description,
    viewAll,
    viewAllHref,
    items,
}: HomeNewsSectionProps) {
    const [isActive, setIsActive] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;

        const homePath = `/${locale}`;
        const isHome = pathname === homePath || pathname === `${homePath}/`;
        if (!isHome) {
            return;
        }

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            setIsActive(true);
            return;
        }

        setIsActive(false);
        const rafId = window.requestAnimationFrame(() => {
            setIsActive(true);
        });

        return () => {
            window.cancelAnimationFrame(rafId);
        };
    }, [locale, pathname]);

    return (
        <section className="overflow-hidden rounded-sm border border-fd-border bg-fd-card/90 p-6 shadow-md lg:p-8">
            <div className="grid gap-4 lg:gap-8 md:items-start lg:grid-cols-16">
                <div className="min-w-0 space-y-3 lg:col-span-7">
                    <p className={`text-xs font-semibold uppercase tracking-[0.12em] text-fd-primary/70 transition-all duration-500 ease-out ${!isActive ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}>
                        {locale === 'zh' ? '最新动态' : 'Latest Updates'}
                    </p>
                    <h2 data-news-headline className={`transition-all duration-500 ease-out ${!isActive ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}>{title}</h2>
                    <p data-news-desc className={`wrap-break-word text-sm leading-7 text-fd-muted-foreground transition-all duration-500 ease-out ${!isActive ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}>
                        {description}
                    </p>
                    <a
                        data-news-link
                        href={viewAllHref}
                        className={`inline-flex items-center gap-1 text-sm font-medium text-fd-primary underline-offset-4 transition-all duration-500 ease-out hover:underline ${!isActive ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}
                    >
                        {viewAll}
                    </a>
                </div>

                <div className="min-w-0 grid gap-3 lg:col-span-9">
                    {items.map((item) => (
                        <a
                            key={`${item.title}-${item.date}`}
                            data-news-card
                            href={item.href}
                            className={`group relative min-w-0 rounded-sm border border-fd-primary/30 bg-fd-background/80 px-4 py-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-fd-primary/70 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary md:px-5 ${!isActive ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
                        >
                            <div className="pointer-events-none absolute left-0 top-0 h-full w-1 rounded-l-sm bg-fd-primary/40" />
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pl-2">
                                <span className="rounded-sm border border-fd-border/80 bg-fd-card px-2.5 py-1 text-[11px] font-medium text-fd-muted-foreground">
                                    {item.tag}
                                </span>
                                <span className="text-xs text-fd-muted-foreground">{item.date}</span>
                            </div>
                            <h3 className="wrap-break-word pl-2 text-base font-semibold leading-6 text-fd-foreground group-hover:text-fd-primary">
                                {item.title}
                            </h3>
                            <p className="mt-1 truncate pl-2 pr-1 text-sm text-fd-muted-foreground">{item.summary}</p>
                            <div className="mt-3 inline-flex items-center gap-1 pl-2 text-xs font-medium text-fd-primary/90">
                                {locale === 'zh' ? '查看详情' : 'Read update'}
                                <span aria-hidden="true">→</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
