"use client";
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getLocalizedProduct, products, type ProductLocale } from '@/data/products';

export default function ProductMenuNav({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [enableHoverMenu, setEnableHoverMenu] = useState(true);
  const [isDesktopTabsVisible, setIsDesktopTabsVisible] = useState(true);
  const [activeGroup, setActiveGroup] = useState(0);
  const [panelStyle, setPanelStyle] = useState({ left: 0, width: 720 });
  const timer = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const currentLocale: ProductLocale = locale === 'en' ? 'en' : 'zh';
  const isActive = pathname === `/${locale}/products` || pathname.startsWith(`/${locale}/products/`);
  const localizedProducts = products.map((product) => getLocalizedProduct(product, currentLocale));
  const categoryLabels = {
    acdc: locale === 'zh' ? '交直流' : 'AC/DC',
    ac: locale === 'zh' ? '交流' : 'AC',
    dc: locale === 'zh' ? '直流' : 'DC',
  } as const;
  const categoryOrder = ['acdc', 'ac', 'dc'] as const;

  // 菜单分组与产品数据
  const groups = categoryOrder
    .map((category) => {
      const categoryProducts = localizedProducts.filter((product) => product.category === category);

      return {
        key: category,
        label: categoryLabels[category],
        products: categoryProducts.map((product) => ({
          key: `${product.slug}-${product.model}`,
          model: product.model,
          series: product.series,
          coreSpecsText: product.coreSpecs.join(' · '),
          communicationInterfacesText: product.communicationInterfaces.join(' / '),
          communicationProtocolsText: product.communicationProtocols.join(' / '),
          url: `/${locale}/products/${product.slug}`,
        })),
      };
    })
    .filter((group) => group.products.length > 0);

  const safeActiveGroup = Math.min(activeGroup, Math.max(0, groups.length - 1));
  const activeProducts = groups[safeActiveGroup]?.products ?? [];
  const activeSeriesGroups = activeProducts.reduce<Array<{ series: string; items: typeof activeProducts }>>((result, product) => {
    const last = result[result.length - 1];
    if (!last || last.series !== product.series) {
      result.push({ series: product.series, items: [product] });
      return result;
    }

    last.items.push(product);
    return result;
  }, []);
  const useInlineMenu = !isDesktopTabsVisible || !enableHoverMenu;

  // 悬停控制
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

    const updatePanelStyle = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const panelWidth = Math.min(720, Math.max(320, viewportWidth - 24));
      const safePadding = 12;
      const minLeft = safePadding;
      const maxLeft = Math.max(minLeft, viewportWidth - panelWidth - safePadding);
      const desiredLeft = triggerRect.left;
      const clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

      setPanelStyle({
        left: Math.round(clampedLeft - triggerRect.left),
        width: Math.round(panelWidth),
      });
    };

    updatePanelStyle();
    window.addEventListener('resize', updatePanelStyle);

    return () => window.removeEventListener('resize', updatePanelStyle);
  }, [open, useInlineMenu]);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={`/${locale}/products`}
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
        {locale === 'zh' ? '产品中心' : 'Products'}
        {useInlineMenu ? <span className="text-[11px] leading-none">{open ? '▴' : '▾'}</span> : null}
      </Link>

      {open && !useInlineMenu && (
        <div
          className="absolute top-full z-50 mt-2 rounded-xl border border-fd-border bg-fd-background p-4 shadow-2xl animate-in fade-in"
          style={{ left: panelStyle.left, width: panelStyle.width }}
        >
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <div className="flex flex-col gap-1 border-r border-fd-border pr-3">
              {groups.map((group, index) => (
                <button
                  key={group.key}
                  type="button"
                  onMouseEnter={() => setActiveGroup(index)}
                  onFocus={() => setActiveGroup(index)}
                  className={`text-left text-xs font-semibold px-2 py-2 rounded-md transition ${index === safeActiveGroup ? 'bg-fd-accent/70 text-fd-foreground' : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/40'}`}
                >
                  {group.label}
                </button>
              ))}
            </div>
            <div>
              {activeProducts.length === 0 ? (
                <div className="text-xs text-fd-muted-foreground italic pl-1 pt-1">{locale === 'zh' ? '暂无产品' : 'No products yet'}</div>
              ) : (
                <div className="space-y-4">
                  {activeSeriesGroups.map((seriesGroup) => (
                    <section key={seriesGroup.series} className="space-y-2 rounded-lg border border-fd-border/60 bg-fd-background/45 p-2">
                      <div className="px-1 py-1 text-xs font-semibold tracking-[0.06em] text-fd-foreground">
                        <span className="inline-block border-l-2 border-fd-primary pl-2">{seriesGroup.series}</span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {seriesGroup.items.map((p) => (
                          <Link
                            key={p.key}
                            href={p.url}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl border border-fd-primary/40 bg-fd-card/90 px-4 py-3 shadow-sm hover:border-fd-primary transition-all"
                          >
                            <div className="text-sm font-bold text-fd-primary mb-1">{p.model}</div>
                            <div className="mt-1 text-[11px] text-fd-muted-foreground">
                              {locale === 'zh' ? '核心参数' : 'Core Specs'}: {p.coreSpecsText}
                            </div>
                            <div className="mt-1 text-[11px] text-fd-muted-foreground">
                              {locale === 'zh' ? '通信接口' : 'Communication Interfaces'}: {p.communicationInterfacesText}
                            </div>
                            <div className="mt-1 text-[11px] text-fd-muted-foreground">
                              {locale === 'zh' ? '通信协议' : 'Communication Protocols'}: {p.communicationProtocolsText}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {open && useInlineMenu && (
        <div className="mt-2 w-full min-w-0 rounded-xl border border-fd-border bg-fd-background p-3 shadow-lg">
          <Link
            href={`/${locale}/products`}
            onClick={() => setOpen(false)}
            className="mb-3 inline-flex text-xs font-semibold text-fd-primary hover:underline"
          >
            {locale === 'zh' ? '查看产品中心总览' : 'View Product Overview'}
          </Link>

          <div className="mb-3 flex flex-wrap gap-2">
            {groups.map((group, index) => (
              <button
                key={group.key}
                type="button"
                onClick={() => setActiveGroup(index)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${index === safeActiveGroup ? 'bg-fd-accent/70 text-fd-foreground' : 'border border-fd-border/80 text-fd-muted-foreground hover:border-fd-primary/40 hover:text-fd-foreground'}`}
              >
                {group.label}
              </button>
            ))}
          </div>

          {activeProducts.length === 0 ? (
            <div className="text-xs italic text-fd-muted-foreground">{locale === 'zh' ? '暂无产品' : 'No products yet'}</div>
          ) : (
            <div className="space-y-3">
              {activeSeriesGroups.map((seriesGroup) => (
                <section key={seriesGroup.series} className="space-y-2 rounded-lg border border-fd-border/60 bg-fd-background/45 p-2">
                  <div className="px-1 py-1 text-xs font-semibold tracking-[0.06em] text-fd-foreground">
                    <span className="inline-block border-l-2 border-fd-primary pl-2">{seriesGroup.series}</span>
                  </div>
                  <div className="grid gap-3">
                    {seriesGroup.items.map((p) => (
                      <Link
                        key={p.key}
                        href={p.url}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl border border-fd-primary/40 bg-fd-card/90 px-4 py-3 shadow-sm hover:border-fd-primary transition-all"
                      >
                        <div className="text-sm font-bold text-fd-primary mb-1">{p.model}</div>
                        <div className="mt-1 text-[11px] text-fd-muted-foreground">
                          {locale === 'zh' ? '核心参数' : 'Core Specs'}: {p.coreSpecsText}
                        </div>
                        <div className="mt-1 text-[11px] text-fd-muted-foreground">
                          {locale === 'zh' ? '通信接口' : 'Communication Interfaces'}: {p.communicationInterfacesText}
                        </div>
                        <div className="mt-1 text-[11px] text-fd-muted-foreground">
                          {locale === 'zh' ? '通信协议' : 'Communication Protocols'}: {p.communicationProtocolsText}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
