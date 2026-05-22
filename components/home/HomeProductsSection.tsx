'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type Locale = 'zh' | 'en';

type ProductCard = {
    slug: string;
    model: string;
    series: string;
    summary: string;
    coreSpecs: string[];
    communicationInterfaces: string[];
    communicationProtocols: string[];
};

type ProductLabels = {
    coreSpecs: string;
    communicationInterfaces: string;
    communicationProtocols: string;
};

type HomeProductsSectionProps = {
    locale: Locale;
    title: string;
    viewAll: string;
    details: string;
    comingSoon: string;
    products: ProductCard[];
    placeholderCount: number;
    labels: ProductLabels;
};

export default function HomeProductsSection({
    locale,
    title,
    viewAll,
    details,
    comingSoon,
    products,
    placeholderCount,
    labels,
}: HomeProductsSectionProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const hasPathInitRef = useRef(false);
    const [isVisible, setIsVisible] = useState(false);
    const [observerKey, setObserverKey] = useState(0);
    const pathname = usePathname();
    const viewAllLabel = viewAll.replace(/\s*[→›»]+$/, '').trim();

    useEffect(() => {
        const onPageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                setIsVisible(true);
            }
        };

        const onPopState = () => {
            setIsVisible(true);
        };

        window.addEventListener('pageshow', onPageShow);
        window.addEventListener('popstate', onPopState);
        return () => {
            window.removeEventListener('pageshow', onPageShow);
            window.removeEventListener('popstate', onPopState);
        };
    }, []);

    useEffect(() => {
        if (!hasPathInitRef.current) {
            hasPathInitRef.current = true;
            return;
        }

        const homePath = `/${locale}`;
        if (pathname === homePath || pathname === `${homePath}/`) {
            setIsVisible(true);
        }
    }, [locale, pathname]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        if (isVisible) return;

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        let observer: IntersectionObserver | null = null;

        const checkInView = () => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const visible = rect.top < viewportHeight * 0.92 && rect.bottom > 0;

            if (visible) {
                setIsVisible(true);
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
                window.removeEventListener('scroll', checkInView);
                window.removeEventListener('resize', checkInView);
            }
        };

        checkInView();
        if (isVisible) return;

        observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry) return;
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer?.disconnect();
                    observer = null;
                    window.removeEventListener('scroll', checkInView);
                    window.removeEventListener('resize', checkInView);
                }
            },
            {
                threshold: 0.24,
                rootMargin: '0px 0px -8% 0px',
            },
        );

        observer.observe(section);
        window.addEventListener('scroll', checkInView, { passive: true });
        window.addEventListener('resize', checkInView);

        return () => {
            observer?.disconnect();
            window.removeEventListener('scroll', checkInView);
            window.removeEventListener('resize', checkInView);
        };
    }, [isVisible, observerKey]);

    return (
        <section ref={sectionRef} className="relative md:-mx-4 lg:-mx-8">
            <div className="relative mb-6 flex flex-wrap items-end justify-between gap-3 px-1 pt-1 md:px-4 lg:px-8">
                <h2>{title}</h2>
                <a
                    aria-label={viewAllLabel || viewAll}
                    className="inline-flex items-center gap-1 text-sm font-medium text-fd-primary transition-colors hover:text-fd-primary/85 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary/50"
                    href={`/${locale}/products`}
                >
                    <span>{viewAllLabel || viewAll}</span>
                    <span
                        aria-hidden="true"
                        className="inline-block"
                    >
                        →
                    </span>
                </a>
            </div>

            <div className="relative grid gap-5 md:grid-cols-12 md:px-4 lg:gap-6 lg:px-8">
                {products.map((product, index) => {
                    const isFeatured = index === 0;
                    const delay = `${100 + index * 95}ms`;

                    return (
                        <a
                            key={`${product.slug}-${product.model}`}
                            href={`/${locale}/products/${product.slug}`}
                            style={{ transitionDelay: delay }}
                            className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-fd-card/92 p-6 shadow-lg will-change-transform motion-reduce:transition-none ${isFeatured
                                ? 'md:col-span-12 lg:col-span-6 lg:p-7'
                                : 'md:col-span-6 lg:col-span-3'
                                } ${isVisible
                                    ? 'translate-y-0 opacity-100 transition-all duration-500 ease-out'
                                    : 'translate-y-8 opacity-0 transition-all duration-500 ease-out'
                                } ${isFeatured
                                    ? 'border-fd-border/75 hover:-translate-y-1 hover:border-fd-primary/70 hover:shadow-2xl'
                                    : 'border-fd-border/90 hover:-translate-y-1 hover:border-fd-primary/70 hover:shadow-xl'
                                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary`}
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background:
                                        'linear-gradient(118deg, transparent 0%, color-mix(in oklab, var(--color-fd-primary) 15%, transparent) 46%, transparent 90%)',
                                }}
                            />

                            <div className="relative mb-3 flex items-end justify-between gap-3">
                                <div className={`font-bold text-fd-primary ${isFeatured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                                    {product.model}
                                </div>
                                <span
                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${isFeatured
                                        ? 'border-fd-primary/55 text-fd-primary'
                                        : 'border-fd-border/80 text-fd-muted-foreground'
                                        }`}
                                >
                                    {isFeatured ? (locale === 'zh' ? '推荐' : 'Featured') : (locale === 'zh' ? '核心' : 'Core')}
                                </span>
                            </div>

                            <div className="relative mb-2 text-sm text-fd-muted-foreground">{product.series}</div>

                            <p className={`relative mb-4 flex-1 text-fd-muted-foreground ${isFeatured ? 'text-base leading-7' : 'text-sm leading-6'}`}>
                                {product.summary}
                            </p>

                            <div className="relative mb-5 space-y-1 text-[11px] text-fd-muted-foreground">
                                <div>{labels.coreSpecs}: {product.coreSpecs.join(' · ')}</div>
                                {isFeatured ? <div>{labels.communicationInterfaces}: {product.communicationInterfaces.join(' / ')}</div> : null}
                                {isFeatured ? <div>{labels.communicationProtocols}: {product.communicationProtocols.join(' / ')}</div> : null}
                            </div>

                            <div className="relative mt-auto inline-flex items-center gap-1 text-sm font-semibold text-fd-foreground transition group-hover:text-fd-primary">
                                {details}
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </a>
                    );
                })}

                {Array.from({ length: placeholderCount }).map((_, index) => {
                    const delay = `${100 + (products.length + index) * 95}ms`;

                    return (
                        <div
                            key={`coming-soon-${index}`}
                            style={{ transitionDelay: delay }}
                            className={`relative flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-fd-border/90 bg-fd-card/75 p-6 text-fd-muted-foreground will-change-transform motion-reduce:transition-none md:col-span-6 lg:col-span-3 ${isVisible
                                ? 'translate-y-0 opacity-100 transition-all duration-500 ease-out'
                                : 'translate-y-8 opacity-0 transition-all duration-500 ease-out'
                                }`}
                        >
                            <span className="mb-2 text-2xl font-bold text-fd-primary/65">+</span>
                            <span className="text-sm">{comingSoon}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
