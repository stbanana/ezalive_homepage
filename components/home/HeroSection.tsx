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
    const scopeTrailRef = useRef<SVGPathElement | null>(null);
    const logoImageRef = useRef<HTMLImageElement | null>(null);
    const visualRef = useRef<HTMLDivElement | null>(null);

    type SignalState = {
        acMix: number;
        hbMix: number;
        phase: number;
        amp: number;
        jitter: number;
    };

    const buildSignalPath = (
        signal: SignalState,
        width = 760,
        height = 180,
    ) => {
        const mid = height / 2;
        const left = 18;
        const right = width - 18;
        const steps = 92;
        const d: string[] = [];

        for (let i = 0; i <= steps; i += 1) {
            const u = i / steps;
            const x = left + (right - left) * u;

            // 6-point step DC: 0V -> 30V -> 50V -> 80V -> 130V -> 0V
            const stepLevels = [0, 30, 50, 80, 130, 0];
            // Keep step DC stable; only let phase affect it when blending into AC.
            const stairPos = (u * 1.02 + signal.phase * 0.12 * signal.acMix) % 1;
            const segPos = stairPos * stepLevels.length;
            const segIndex = Math.floor(segPos);
            const local = segPos - segIndex;
            const currentLevel = stepLevels[segIndex];
            const nextLevel = stepLevels[(segIndex + 1) % stepLevels.length];

            // Keep long plateaus and make edges very steep.
            const edgeStart = 0.94;
            const edgeMix = local < edgeStart
                ? 0
                : 0.5 + 0.5 * Math.tanh((local - edgeStart) * 80);
            const stepped = currentLevel + (nextLevel - currentLevel) * edgeMix;

            // Slight overshoot/ringing on each step transition.
            const ringProgress = Math.max(0, (local - edgeStart) / (1 - edgeStart));
            const delta = nextLevel - currentLevel;
            const ringing = delta > 0
                ? Math.sin(ringProgress * Math.PI * 2.6) *
                Math.exp(-ringProgress * 7.5) *
                delta * 0.1
                : 0;

            const stepScale = 0.44;
            const dcWave = -(stepped + ringing) * stepScale;
            const acWave = 31 * Math.sin((u * 4.7 + signal.phase) * Math.PI * 2);

            const beatCenter = 0.46;
            // V-signature: 0 -> +85V -> -85V -> 0 with straight triangle edges.
            const triWindow = 0.16;
            const triStart = beatCenter - triWindow * 0.5;
            const triT = (u - triStart) / triWindow;
            let heartbeatWave = 0;
            if (triT >= 0 && triT <= 1) {
                if (triT < 1 / 3) {
                    heartbeatWave = (triT / (1 / 3)) * 85;
                } else if (triT < 2 / 3) {
                    heartbeatWave = 85 - ((triT - 1 / 3) / (1 / 3)) * 170;
                } else {
                    heartbeatWave = -85 + ((triT - 2 / 3) / (1 / 3)) * 85;
                }
            }
            // Screen coordinates grow downward on Y, so invert to make it display as high -> low.
            heartbeatWave *= -1;

            const baseWave = dcWave * (1 - signal.acMix) + acWave * signal.acMix;
            const mixedWave = baseWave * (1 - signal.hbMix) + heartbeatWave * signal.hbMix;
            const noiseMix = signal.acMix * (1 - signal.hbMix);
            const noise =
                signal.jitter * noiseMix *
                (Math.sin(u * 90 + signal.phase * 20) + Math.sin(u * 52 - signal.phase * 14)) *
                0.45;

            const y = mid + mixedWave * signal.amp + noise;
            d.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
        }

        return d.join(' ');
    };

    useEffect(() => {
        const root = rootRef.current;
        const scope = scopeRef.current;
        const line = scopeLineRef.current;
        const trail = scopeTrailRef.current;
        const visual = visualRef.current;
        if (!root || !scope || !line || !trail || !visual) return;

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                gsap.set('[data-scope-layer]', { autoAlpha: 0 });
                gsap.set('[data-hero-glow], [data-hero-title], [data-hero-desc], [data-hero-cta], [data-hero-badge], [data-hero-visual-card]', {
                    clearProps: 'all',
                });
                return;
            }

            gsap.set('[data-hero-glow]', { opacity: 0, scale: 0.92 });
            gsap.set('[data-hero-title], [data-hero-desc], [data-hero-cta]', { opacity: 0, y: 18 });
            gsap.set('[data-hero-badge]', { opacity: 0, y: 12 });
            gsap.set('[data-scope-layer]', { autoAlpha: 1 });

            gsap.to('[data-hero-badge]', {
                y: 0,
                opacity: 1,
                duration: 0.42,
                stagger: 0.08,
                ease: 'power2.out',
                delay: 0.24,
            });

            const signal: SignalState = {
                acMix: 0,
                hbMix: 0,
                phase: 0,
                amp: 1,
                jitter: 0.7,
            };
            const updateSignal = () => {
                const d = buildSignalPath(signal);
                line.setAttribute('d', d);
                trail.setAttribute('d', d);
            };

            updateSignal();
            gsap.set(trail, { autoAlpha: 0 });

            const baseLength = line.getTotalLength();
            gsap.set(line, {
                strokeDasharray: baseLength,
                strokeDashoffset: baseLength,
            });
            gsap.set(trail, {
                strokeDasharray: baseLength,
                strokeDashoffset: baseLength,
            });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.to(line, {
                strokeDashoffset: 0,
                duration: 0.75,
                ease: 'power2.out',
            })
                .to('[data-scope-label-dc]', { autoAlpha: 1, duration: 0.2 }, '<')
                .to(signal, {
                    phase: 0.08,
                    duration: 0.26,
                    ease: 'none',
                    onUpdate: updateSignal,
                }, '<')
                .to('[data-scope-label-dc]', { autoAlpha: 0, duration: 0.2 })
                .to(signal, {
                    acMix: 1,
                    phase: 0.3,
                    jitter: 0.24,
                    duration: 0.76,
                    ease: 'sine.inOut',
                    onUpdate: updateSignal,
                })
                .to('[data-scope-label-ac]', { autoAlpha: 1, duration: 0.18 }, '<0.05')
                .to(signal, {
                    jitter: 0.1,
                    duration: 0.2,
                    ease: 'sine.out',
                    onUpdate: updateSignal,
                }, '>')
                .to(signal, {
                    phase: 0.56,
                    duration: 0.52,
                    ease: 'none',
                    onUpdate: updateSignal,
                }, '>')
                .to('[data-scope-label-ac]', { autoAlpha: 0, duration: 0.2 })
                .to(signal, {
                    hbMix: 1,
                    acMix: 0,
                    phase: 0.58,
                    jitter: 0.22,
                    amp: 0.98,
                    duration: 0.82,
                    ease: 'power2.inOut',
                    onUpdate: updateSignal,
                })
                .set(trail, { autoAlpha: 0.55, strokeDashoffset: baseLength }, '>-0.06')
                .to(trail, {
                    strokeDashoffset: 0,
                    duration: 0.34,
                    ease: 'power2.out',
                }, '>-0.01')
                .to(trail, {
                    autoAlpha: 0,
                    duration: 0.22,
                }, '>-0.05')
                .to('[data-scope-label-v]', { autoAlpha: 1, duration: 0.2 }, '<')
                .to({}, { duration: 0.4 })
                .to(scope, {
                    scale: 0.72,
                    opacity: 0,
                    duration: 0.45,
                    ease: 'power3.inOut',
                    transformOrigin: 'center',
                })
                .to('[data-scope-layer]', { autoAlpha: 0, duration: 0.2 }, '<0.02')
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
                className="pointer-events-none absolute left-4 right-4 top-6 z-20 md:inset-0 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-stretch md:px-10 md:py-12"
            >
                <div
                    ref={scopeRef}
                    className="relative min-h-44 w-full rounded-xl border border-fd-primary/40 bg-fd-background/90 px-4 py-4 shadow-2xl md:mr-8 md:min-h-72 md:max-w-none"
                >
                    <div className="absolute left-4 top-3 text-[11px] font-medium tracking-wider text-fd-muted-foreground/80">
                        SIGNAL BOOT SEQUENCE
                    </div>
                    <svg viewBox="0 0 760 180" className="h-28 w-full md:h-52">
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
                        <path
                            ref={scopeTrailRef}
                            d="M 18 90 L 742 90"
                            stroke="color-mix(in oklab, var(--color-fd-primary) 42%, white)"
                            strokeWidth="5.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            style={{ filter: 'blur(2px)' }}
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
                    <div className="relative min-h-72 w-full max-w-md overflow-hidden rounded-2xl border border-fd-border/80 bg-fd-background/85 p-6 shadow-xl">
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
