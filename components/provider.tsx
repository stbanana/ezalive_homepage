'use client';
import { RootProvider } from 'fumadocs-ui/provider/next';
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

const SearchDialog = dynamic(() => import('@/components/search'), { ssr: false });

export function Provider({ children, ...props }: ComponentProps<typeof RootProvider>) {
  return (
    <RootProvider search={{ SearchDialog }} {...props}>
      {children}
    </RootProvider>
  );
}
