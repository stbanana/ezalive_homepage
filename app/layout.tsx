import type { ReactNode } from 'react';
import './globals.css';

type LayoutProps = {
  children: ReactNode;
};

export const metadata = {
  icons: {
    icon: [
      { url: "/icon.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
