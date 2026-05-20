'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CdsButton from '@/components/ui/cds-button';

type HeroSectionProps = {
    locale: 'zh' | 'en';
    title: string;
    description: string;
    exploreBtn: string;
    contactBtn: string;
    brandLogoAlt: string;
};

export default function HeroSection({
    locale,
    title,
    description,
    exploreBtn,
    contactBtn,
    brandLogoAlt,
}: HeroSectionProps) {
    const rootRef = useRef<HTMLElement | null>(null);
    const scopeRef = useRef<HTMLDivElement | null>(null);
    const scopeLineRef = useRef<SVGPathElement | null>(null);
    const vTargetRef = useRef<HTMLDivElement | null>(null);
    const logoImageRef = useRef<HTMLImageElement | null>(null);
    const visualRef = useRef<HTMLDivElement | null>(null);

    const buildPath = (
        mode: 'dc' | 'ac' | 'heartbeat',
        width = 760,
        height = 180,
    ) => {
        const mid = height / 2;
        const left = 18;
        const right = width - 18;

        if (mode === 'dc') {
            const points = [
                `M ${left} ${mid + 20}`,
                `L ${left + 95} ${mid + 20}`,
                `L ${left + 95} ${mid - 40}`,
                `L ${left + 210} ${mid - 40}`,
                `L ${left + 210} ${mid + 28}`,
                `L ${left + 320} ${mid + 28}`,
                `L ${left + 320} ${mid - 30}`,
                `L ${left + 455} ${mid - 30}`,
                `L ${left + 455} ${mid + 24}`,
                `L ${right} ${mid + 24}`,
            ];
            return points.join(' ');
        }

        if (mode === 'ac') {
            const steps = 52;
            const amp = 34;
            const d: string[] = [];
            for (let i = 0; i <= steps; i += 1) {
                const t = i / steps;
                const x = left + (right - left) * t;
                const y = mid + Math.sin(t * Math.PI * 5.2) * amp;
                d.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
            }
            return d.join(' ');
        }

        const points = [
            `M ${left} ${mid + 5}`,
            `L ${left + 180} ${mid + 5}`,
            `L ${left + 250} ${mid + 5}`,
            `L ${left + 275} ${mid - 24}`,
            `L ${left + 303} ${mid + 52}`,
            `L ${left + 336} ${mid - 82}`,
            `L ${left + 372} ${mid + 4}`,
            `L ${left + 420} ${mid + 4}`,
            `L ${left + 470} ${mid - 18}`,
            `L ${left + 525} ${mid + 5}`,
            `L ${right} ${mid + 5}`,
        ];
        return points.join(' ');
    };

    useEffect(() => {
        const root = rootRef.current;
        const scope = scopeRef.current;
        const line = scopeLineRef.current;
        const vTarget = vTargetRef.current;
        const logoImage = logoImageRef.current;
        const visual = visualRef.current;
        if (!root || !scope || !line || !vTarget || !logoImage || !visual) return;

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                gsap.set('[data-scope-layer]', { autoAlpha: 0 });
                gsap.set('[data-hero-glow], [data-hero-title], [data-hero-desc], [data-hero-cta], [data-hero-badge], [data-hero-visual-card], [data-v-pulse]', {
                    clearProps: 'all',
                });
                return;
            }

            gsap.set('[data-hero-glow]', { opacity: 0, scale: 0.92 });
            gsap.set('[data-hero-title], [data-hero-desc], [data-hero-cta], [data-hero-badge]', { opacity: 0, y: 18 });
            gsap.set('[data-hero-visual-card]', { opacity: 0, y: 24, rotateX: 5 });
            gsap.set('[data-v-pulse]', { autoAlpha: 0, scale: 0.82 });
            gsap.set('[data-scope-layer]', { autoAlpha: 1 });
            gsap.set(line, { attr: { d: buildPath('dc') } });

            const baseLength = line.getTotalLength();
            gsap.set(line, {
                strokeDasharray: baseLength,
                strokeDashoffset: baseLength,
            });

            const scopeBounds = scope.getBoundingClientRect();
            const targetBounds = vTarget.getBoundingClientRect();
            const logoBounds = logoImage.getBoundingClientRect();
            const dx = targetBounds.left + targetBounds.width / 2 - (scopeBounds.left + scopeBounds.width / 2);
            const dy = targetBounds.top + targetBounds.height / 2 - (scopeBounds.top + scopeBounds.height / 2);
            const logoDx = targetBounds.left + targetBounds.width / 2 - (logoBounds.left + logoBounds.width / 2);
            const logoDy = targetBounds.top + targetBounds.height / 2 - (logoBounds.top + logoBounds.height / 2);

            gsap.set(logoImage, {
                x: logoDx,
                y: logoDy,
                scale: 0.16,
                opacity: 0,
                transformOrigin: 'center',
            });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.to(line, {
                strokeDashoffset: 0,
                duration: 0.75,
                ease: 'power2.out',
            })
                .to('[data-scope-label-dc]', { autoAlpha: 1, duration: 0.2 }, '<')
                .to({}, { duration: 0.28 })
                .to('[data-scope-label-dc]', { autoAlpha: 0, duration: 0.2 })
                .to(line, {
                    attr: { d: buildPath('ac') },
                    duration: 0.65,
                    ease: 'sine.inOut',
                })
                .to('[data-scope-label-ac]', { autoAlpha: 1, duration: 0.18 }, '<0.05')
                .to({}, { duration: 0.28 })
                .to('[data-scope-label-ac]', { autoAlpha: 0, duration: 0.2 })
                .to(line, {
                    attr: { d: buildPath('heartbeat') },
                    duration: 0.62,
                    ease: 'power2.inOut',
                })
                .to('[data-scope-label-v]', { autoAlpha: 1, duration: 0.2 }, '<')
                .to({}, { duration: 0.25 })
                .to(scope, {
                    x: dx,
                    y: dy,
                    scale: 0.21,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power3.inOut',
                    transformOrigin: 'center',
                })
                .to('[data-v-pulse]', {
                    autoAlpha: 1,
                    scale: 1.08,
                    duration: 0.25,
                    yoyo: true,
                    repeat: 1,
                }, '-=0.2')
                .to('[data-v-pulse]', { autoAlpha: 0, duration: 0.12 }, '>-0.04')
                .to('[data-scope-layer]', { autoAlpha: 0, duration: 0.2 }, '<0.02')
                .fromTo(
                    '[data-hero-visual-card]',
                    { y: 24, opacity: 0, rotateX: 5 },
                    { y: 0, opacity: 1, rotateX: 0, duration: 0.46, ease: 'power2.out' },
                    '-=0.08',
                )
                .to(logoImage, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.72,
                    ease: 'back.out(1.7)',
                }, '<0.02')
            tl.fromTo(
                '[data-hero-glow]',
                { opacity: 0, scale: 0.92 },
                { opacity: 1, scale: 1, duration: 1.05 },
                '-=0.16',
            )
                .fromTo(
                    '[data-hero-title]',
                    { y: 28, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.72 },
                    '-=0.65',
                )
                .fromTo(
                    '[data-hero-desc]',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.62 },
                    '-=0.5',
                )
                .fromTo(
                    '[data-hero-cta]',
                    { y: 16, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.52, stagger: 0.1 },
                    '-=0.4',
                )
                .fromTo(
                    '[data-hero-badge]',
                    { y: 12, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
                    '-=0.45',
                );

            gsap.to('[data-hero-glow]', {
                y: -10,
                x: 8,
                duration: 3.8,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });
        }, root);

        const onMouseMove = (event: MouseEvent) => {
            if (prefersReducedMotion) return;
            const rect = visual.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(visual, {
                x: px * 10,
                y: py * 8,
                rotateY: px * 4,
                rotateX: -py * 3,
                transformPerspective: 900,
                transformOrigin: 'center',
                duration: 0.45,
                ease: 'power2.out',
            });
        };

        const onMouseLeave = () => {
            if (prefersReducedMotion) return;
            gsap.to(visual, {
                x: 0,
                y: 0,
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
        };

        root.addEventListener('mousemove', onMouseMove);
        root.addEventListener('mouseleave', onMouseLeave);

        return () => {
            root.removeEventListener('mousemove', onMouseMove);
            root.removeEventListener('mouseleave', onMouseLeave);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative overflow-hidden rounded-3xl border border-fd-border bg-fd-card/95 px-8 py-10 shadow-md md:px-10 md:py-12"
        >
            <div
                data-scope-layer
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            >
                <div
                    ref={scopeRef}
                    className="relative w-[min(86%,760px)] rounded-xl border border-fd-primary/40 bg-fd-background/90 px-4 py-4 shadow-2xl"
                >
                    <div className="absolute left-4 top-3 text-[11px] font-medium tracking-wider text-fd-muted-foreground/80">
                        SIGNAL BOOT SEQUENCE
                    </div>
                    <svg viewBox="0 0 760 180" className="h-40 w-full">
                        <defs>
                            <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="color-mix(in oklab, var(--color-fd-primary) 35%, white)" />
                                <stop offset="55%" stopColor="var(--color-fd-primary)" />
                                <stop offset="100%" stopColor="color-mix(in oklab, var(--color-fd-primary) 55%, black)" />
                            </linearGradient>
                        </defs>
                        <path d="M 18 90 L 742 90" stroke="color-mix(in oklab, var(--color-fd-primary) 18%, transparent)" strokeWidth="1" fill="none" />
                        <path
                            ref={scopeLineRef}
                            d="M 18 90 L 742 90"
                            stroke="url(#waveStroke)"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                    <div data-scope-label-dc className="absolute bottom-3 right-4 text-xs font-medium text-fd-primary/85 opacity-0">DC LEVEL</div>
                    <div data-scope-label-ac className="absolute bottom-3 right-4 text-xs font-medium text-fd-primary/85 opacity-0">AC SWEEP</div>
                    <div data-scope-label-v className="absolute bottom-3 right-4 text-xs font-medium text-fd-primary/85 opacity-0">V SIGNATURE</div>
                </div>
            </div>

            <div
                data-hero-glow
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70"
                style={{
                    background:
                        'radial-gradient(circle, color-mix(in oklab, var(--color-fd-primary) 36%, white) 0%, transparent 70%)',
                    filter: 'blur(2px)',
                }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, color-mix(in oklab, var(--color-fd-primary) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-fd-primary) 8%, transparent) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
                }}
            />

            <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <div className="space-y-6">
                    <h1 data-hero-title>
                        {title}
                    </h1>
                    <p data-hero-desc className="max-w-xl text-lg leading-8 text-fd-muted-foreground">
                        {description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <CdsButton
                            as="a"
                            href={`/${locale}/products`}
                            variant="primary"
                            radius="0.6rem"
                            className="[&]:min-w-33"
                            data-hero-cta
                        >
                            {exploreBtn}
                        </CdsButton>
                        <CdsButton
                            as="a"
                            href={`/${locale}#contact`}
                            variant="tertiary"
                            radius="0.6rem"
                            className="[&]:min-w-33"
                            data-hero-cta
                        >
                            {contactBtn}
                        </CdsButton>
                    </div>
                </div>

                <div ref={visualRef} className="relative flex items-center justify-center" data-hero-visual-card>
                    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-fd-border/80 bg-fd-background/85 p-6 shadow-xl">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-60"
                            style={{
                                background:
                                    'linear-gradient(135deg, color-mix(in oklab, var(--color-fd-primary) 20%, transparent) 0%, transparent 42%, color-mix(in oklab, var(--color-fd-primary) 12%, transparent) 100%)',
                            }}
                        />
                        <img
                            ref={logoImageRef}
                            src="/品牌logo.png"
                            alt={brandLogoAlt}
                            className="relative mx-auto w-80 rounded-lg border border-dashed border-fd-border bg-fd-card/60 p-6"
                        />
                        <div
                            ref={vTargetRef}
                            data-v-pulse
                            className="absolute left-1/2 top-[42%] grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-fd-primary/45 bg-fd-background/85 text-lg font-bold tracking-tight text-fd-primary"
                        >
                            V
                        </div>
                        <div className="relative mt-5 grid grid-cols-3 gap-2">
                            <span data-hero-badge className="rounded-md border border-fd-border/70 bg-fd-card/80 px-2 py-1 text-center text-[11px] text-fd-muted-foreground">AC/DC</span>
                            <span data-hero-badge className="rounded-md border border-fd-border/70 bg-fd-card/80 px-2 py-1 text-center text-[11px] text-fd-muted-foreground">Bidirectional</span>
                            <span data-hero-badge className="rounded-md border border-fd-border/70 bg-fd-card/80 px-2 py-1 text-center text-[11px] text-fd-muted-foreground">High Precision</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
