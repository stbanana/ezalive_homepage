import type { ReactNode } from 'react';

type SubtleTechBackgroundLayoutProps = {
    children: ReactNode;
    className?: string;
};

export default function SubtleTechBackgroundLayout({
    children,
    className,
}: SubtleTechBackgroundLayoutProps) {
    const subtleGridColor =
        'color-mix(in oklab, var(--color-fd-primary) 5%, transparent)';

    return (
        <div className={className ? `relative min-h-screen ${className}` : 'relative min-h-screen'}>
            <div
                className="pointer-events-none absolute inset-0 -z-20 opacity-30"
                style={{
                    backgroundImage: `radial-gradient(circle at top, color-mix(in oklab, var(--color-fd-primary) 7%, transparent) 10%, transparent 42%)`
                }}
            />
            {children}
        </div>
    );
}
