"use client";
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLocalizedProduct, products, type ProductLocale } from '@/data/products';

export default function ProductMenuNav({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [enableHoverMenu, setEnableHoverMenu] = useState(true);
  const [activeGroup, setActiveGroup] = useState(0);
  const [panelOffset, setPanelOffset] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale: ProductLocale = locale === 'en' ? 'en' : 'zh';
  const isActive = pathname === `/${locale}/products` || pathname.startsWith(`/${locale}/products/`);
  const localizedProducts = products.map((product) => getLocalizedProduct(product, currentLocale));
  const acdcProducts = localizedProducts.filter((product) => product.slug === 'ez4000x');

  // 菜单分组与产品数据
  const groups = [
    {
      label: locale === 'zh' ? '交直流' : 'AC/DC',
      products: acdcProducts.map((product) => ({
        key: `${product.slug}-${product.model}`,
        model: product.model,
        name: product.name,
        coreSpecsText: product.coreSpecs.join(' · '),
        url: `/${locale}/products/${product.slug}`,
      })),
    },
    {
      label: locale === 'zh' ? '交流' : 'AC',
      products: []
    },
    {
      label: locale === 'zh' ? '直流' : 'DC',
      products: []
    }
  ];

  const safeActiveGroup = Math.min(activeGroup, Math.max(0, groups.length - 1));
  const activeProducts = groups[safeActiveGroup]?.products ?? [];

  // 悬停控制
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
          router.push(`/${locale}/products`);
        }
      }}
    >
      <Link
        href={`/${locale}/products`}
        data-active={isActive}
        className="inline-block px-2 py-2 cursor-pointer hover:text-fd-primary font-medium"
        tabIndex={0}
        onClick={() => setOpen(false)}
      >
        {locale === 'zh' ? '产品中心' : 'Products'}
      </Link>
      {open && enableHoverMenu && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-[720px] rounded-xl border border-fd-border bg-fd-background shadow-2xl p-4 animate-in fade-in"
          style={{ transform: `translateX(${panelOffset}px)` }}
        >
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <div className="flex flex-col gap-1 border-r border-fd-border pr-3">
              {groups.map((group, index) => (
                <button
                  key={group.label}
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
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {activeProducts.map((p) => (
                    <Link
                      key={p.key}
                      href={p.url}
                      className="block rounded-xl border border-fd-primary/40 bg-fd-card/90 px-4 py-3 shadow-sm hover:border-fd-primary transition-all"
                    >
                      <div className="text-sm font-bold text-fd-primary mb-1">{p.model}</div>
                      <div className="text-xs text-fd-muted-foreground">{p.name}</div>
                      <div className="mt-1 text-[11px] text-fd-muted-foreground">
                        {locale === 'zh' ? '核心参数' : 'Core Specs'}: {p.coreSpecsText}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
