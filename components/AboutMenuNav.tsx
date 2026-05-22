"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AboutMenuNav({ locale }: { locale: string }) {
    const [open, setOpen] = useState(false);
    const [enableHoverMenu, setEnableHoverMenu] = useState(true);
    const [isDesktopTabsVisible, setIsDesktopTabsVisible] = useState(true);
    const [panelLeft, setPanelLeft] = useState(0);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const useInlineMenu = !isDesktopTabsVisible || !enableHoverMenu;

    const isActive =
        pathname === `/${locale}/about` ||
        pathname.startsWith(`/${locale}/about/`) ||
        pathname === `/${locale}/news` ||
        pathname.startsWith(`/${locale}/news/`);

    const handleEnter = () => {
        if (useInlineMenu) return;
        if (timer.current) clearTimeout(timer.current);
        setOpen(true);
    };

    const handleLeave = () => {
        if (useInlineMenu) return;
        timer.current = setTimeout(() => setOpen(false), 120);
    };

    useEffect(() => {
        const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

        const update = () => {
            setEnableHoverMenu(hoverQuery.matches);
            const trigger = triggerRef.current;
            const navRoot = trigger?.closest('nav');
            const desktopTabs = navRoot?.querySelector('ul.max-sm\\:hidden') as HTMLElement | null;
            const desktopVisible = desktopTabs
                ? window.getComputedStyle(desktopTabs).display !== 'none'
                : window.innerWidth > 640;

            setIsDesktopTabsVisible(desktopVisible);

            if (!hoverQuery.matches || !desktopVisible) {
                setOpen(false);
            }
        };

        update();
        if (typeof hoverQuery.addEventListener === 'function') {
            hoverQuery.addEventListener('change', update);
            window.addEventListener('resize', update);

            return () => {
                hoverQuery.removeEventListener('change', update);
                window.removeEventListener('resize', update);
            };
        }

        hoverQuery.addListener(update);
        window.addEventListener('resize', update);

        return () => {
            hoverQuery.removeListener(update);
            window.removeEventListener('resize', update);
        };
    }, []);

    useEffect(() => {
        if (!open || useInlineMenu) return;

        const updatePanelOffset = () => {
            const trigger = triggerRef.current;
            if (!trigger) return;

            const triggerRect = trigger.getBoundingClientRect();
            const panelWidth = Math.min(360, Math.max(260, window.innerWidth - 24));
            const safePadding = 12;
            const minLeft = safePadding;
            const maxLeft = Math.max(minLeft, window.innerWidth - panelWidth - safePadding);
            const desiredLeft = triggerRect.left;
            const clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);
            setPanelLeft(Math.round(clampedLeft - triggerRect.left));
        };

        updatePanelOffset();
        window.addEventListener('resize', updatePanelOffset);

        return () => window.removeEventListener('resize', updatePanelOffset);
    }, [open, useInlineMenu]);

    return (
        <div
            ref={triggerRef}
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <Link
                href={`/${locale}/about`}
                data-active={isActive}
                className="inline-flex items-center gap-1 p-2 text-sm leading-5 cursor-pointer hover:text-fd-primary font-medium"
                tabIndex={0}
                onClick={(event) => {
                    if (useInlineMenu) {
                        event.preventDefault();
                        setOpen((prev) => !prev);
                        return;
                    }

                    setOpen(false);
                }}
            >
                {locale === 'zh' ? '关于我们' : 'About'}
                {useInlineMenu ? <span className="text-[11px] leading-none">{open ? '▴' : '▾'}</span> : null}
            </Link>

            {open && !useInlineMenu && (
                <div
                    className="absolute top-full z-50 mt-2 w-86 rounded-xl border border-fd-border bg-fd-background p-3 shadow-2xl animate-in fade-in"
                    style={{ left: panelLeft }}
                >
                    <div className="grid gap-2">
                        <Link
                            href={`/${locale}/about`}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl border border-fd-border bg-fd-card/90 px-4 py-3 shadow-sm transition-all hover:border-fd-primary"
                        >
                            <div className="text-sm font-semibold leading-6 text-fd-foreground">
                                {locale === 'zh' ? '关于我们' : 'About'}
                            </div>
                            <div className="mt-1 text-xs text-fd-muted-foreground">
                                {locale === 'zh' ? '了解品牌与团队能力定位' : 'Learn about our team and positioning'}
                            </div>
                        </Link>

                        <Link
                            href={`/${locale}/news`}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl border border-fd-border bg-fd-card/90 px-4 py-3 shadow-sm transition-all hover:border-fd-primary"
                        >
                            <div className="text-sm font-semibold leading-6 text-fd-foreground">
                                {locale === 'zh' ? '新闻动态' : 'News'}
                            </div>
                            <div className="mt-1 text-xs text-fd-muted-foreground">
                                {locale === 'zh' ? '查看近期产品与应用更新' : 'Recent product and application updates'}
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {open && useInlineMenu && (
                <div className="mt-2 w-full min-w-0 rounded-xl border border-fd-border bg-fd-background p-3 shadow-lg">
                    <div className="grid gap-2">
                        <Link
                            href={`/${locale}/about`}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl border border-fd-border bg-fd-card/90 px-4 py-3 shadow-sm transition-all hover:border-fd-primary"
                        >
                            <div className="text-sm font-semibold leading-6 text-fd-foreground">
                                {locale === 'zh' ? '关于我们' : 'About'}
                            </div>
                            <div className="mt-1 text-xs text-fd-muted-foreground">
                                {locale === 'zh' ? '了解品牌与团队能力定位' : 'Learn about our team and positioning'}
                            </div>
                        </Link>

                        <Link
                            href={`/${locale}/news`}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl border border-fd-border bg-fd-card/90 px-4 py-3 shadow-sm transition-all hover:border-fd-primary"
                        >
                            <div className="text-sm font-semibold leading-6 text-fd-foreground">
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
