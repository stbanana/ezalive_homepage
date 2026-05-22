"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type StaticMenuNavProps = {
    locale: string;
    type: 'home' | 'contact';
};

export default function StaticMenuNav({ locale, type }: StaticMenuNavProps) {
    const pathname = usePathname();

    const config = type === 'home'
        ? {
            href: `/${locale}`,
            text: locale === 'zh' ? '首页' : 'Home',
            isActive: pathname === `/${locale}` || pathname === `/${locale}/`,
        }
        : {
            href: `/${locale}/contact`,
            text: locale === 'zh' ? '联系' : 'Contact',
            isActive:
                pathname === `/${locale}/contact` ||
                pathname.startsWith(`/${locale}/contact/`),
        };

    return (
        <Link
            href={config.href}
            data-active={config.isActive}
            className="inline-flex items-center p-2 text-sm leading-5 cursor-pointer hover:text-fd-primary font-medium"
            tabIndex={0}
        >
            {config.text}
        </Link>
    );
}
