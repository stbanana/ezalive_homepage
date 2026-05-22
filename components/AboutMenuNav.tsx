"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AboutMenuNav({ locale }: { locale: string }) {
    const [open, setOpen] = useState(false);
    const [enableHoverMenu, setEnableHoverMenu] = useState(true);
    const [panelOffset, setPanelOffset] = useState(0);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const isActive =
        pathname === `/${locale}/about` ||
        pathname.startsWith(`/${locale}/about/`) ||
        pathname === `/${locale}/news` ||
        pathname.startsWith(`/${locale}/news/`);

    const handleEnter = () => {
        if (!enableHoverMenu) return;
        if (timer.current) clearTimeout(timer.current);
        setOpen(true);
    };

    const handleLeave = () => {
        if (!enableHoverMenu) return;
        timer.current = setTimeout(() => setOpen(false), 120);
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        const update = () => {
            setEnableHoverMenu(mediaQuery.matches);
            if (!mediaQuery.matches) {
                setOpen(false);
            }
        };

        update();
        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', update);
            return () => mediaQuery.removeEventListener('change', update);
        }

        mediaQuery.addListener(update);
        return () => mediaQuery.removeListener(update);
    }, []);

    useEffect(() => {
        if (!open) return;

        const updateOffset = () => {
            const trigger = triggerRef.current;
            if (!trigger) return;

            const navRoot = trigger.closest('nav') ?? trigger.closest('header') ?? document;
            const anchors = Array.from(navRoot.querySelectorAll('a'));
            const homeLabel = locale === 'zh' ? '首页' : 'Home';
            const homeLink = anchors.find((anchor) => anchor.textContent?.trim() === homeLabel);

            if (!homeLink) {
                setPanelOffset(0);
                return;
            }

            const triggerRect = trigger.getBoundingClientRect();
            const homeRect = homeLink.getBoundingClientRect();
            setPanelOffset(Math.round(homeRect.left - triggerRect.left));
        };

        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, [open, locale]);

    return (
        <div
            ref={triggerRef}
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={() => {
                if (!enableHoverMenu) {
                    router.push(`/${locale}/about`);
                }
            }}
        >
            <Link
                href={`/${locale}/about`}
                data-active={isActive}
                className="inline-flex items-center p-2 text-sm leading-5 cursor-pointer hover:text-fd-primary font-medium"
                tabIndex={0}
                onClick={() => setOpen(false)}
            >
                {locale === 'zh' ? '关于我们' : 'About'}
            </Link>

            {open && enableHoverMenu && (
                <div
                    className="absolute left-0 top-full z-50 mt-2 w-86 rounded-xl border border-fd-border bg-fd-background p-3 shadow-2xl animate-in fade-in"
                    style={{ transform: `translateX(${panelOffset}px)` }}
                >
                    <div className="grid gap-2">
                        <Link
                            href={`/${locale}/about`}
                            className="block rounded-xl border border-fd-border bg-fd-card/90 px-4 py-3 shadow-sm transition-all hover:border-fd-primary"
                        >
                            <div className="text-base font-semibold text-fd-foreground">
                                {locale === 'zh' ? '关于我们' : 'About'}
                            </div>
                            <div className="mt-1 text-xs text-fd-muted-foreground">
                                {locale === 'zh' ? '了解品牌与团队能力定位' : 'Learn about our team and positioning'}
                            </div>
                        </Link>

                        <Link
                            href={`/${locale}/news`}
                            className="block rounded-xl border border-fd-border bg-fd-card/90 px-4 py-3 shadow-sm transition-all hover:border-fd-primary"
                        >
                            <div className="text-base font-semibold text-fd-foreground">
                                {locale === 'zh' ? '新闻动态' : 'News'}
                            </div>
                            <div className="mt-1 text-xs text-fd-muted-foreground">
                                {locale === 'zh' ? '查看近期产品与应用更新' : 'Recent product and application updates'}
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
