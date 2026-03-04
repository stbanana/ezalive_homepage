"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import { getLocalizedProduct, products, type ProductLocale } from '@/data/products';

export default function ProductMenuNav({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const currentLocale: ProductLocale = locale === 'en' ? 'en' : 'zh';
  const localizedProducts = products.map((product) => getLocalizedProduct(product, currentLocale));
  const acdcProducts = localizedProducts.filter((product) => product.slug === 'ez40004');

  // 菜单分组与产品数据
  const groups = [
    {
      label: locale === 'zh' ? '交直流' : 'AC/DC',
      products: acdcProducts.map((product) => ({
        key: product.slug,
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

  // 悬停控制
  const handleEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={`/${locale}/products`}
        className="inline-block px-3 py-2 cursor-pointer hover:text-fd-primary font-medium"
        tabIndex={0}
        onClick={() => setOpen(false)}
      >
        {locale === 'zh' ? '产品中心' : 'Products'}
      </Link>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[340px] -translate-x-1/2 rounded-xl border border-fd-border bg-white shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in">
          {groups.map(group => (
            <div key={group.label}>
              <div className="text-xs font-bold text-fd-muted-foreground mb-2 select-none">
                {group.label}
              </div>
              {group.products.length === 0 ? (
                <div className="text-xs text-fd-muted-foreground italic pl-2 pb-2">{locale === 'zh' ? '暂无产品' : 'No products yet'}</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {group.products.map(p => (
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
          ))}
        </div>
      )}
    </div>
  );
}
