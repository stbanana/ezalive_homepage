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
    const visualRef = useRef<HTMLDivElement | null>(null);
    const typeLoopRef = useRef<gsap.core.Timeline | null>(null);

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
        const d: string[] = [];

        const stepLevels = [0, 30, 50, 80, 130, 0];
        const N = stepLevels.length;
        const scale = 1.02;
        const phaseOffset = signal.phase * 0.12 * signal.acMix;

        // Insert u values just before and after each DC segment boundary so the
        // SVG path has two nearly-coincident x positions with different y values —
        // this produces a visually vertical edge even with a sparse point count.
        const eps = 0.0001;
        const boundaryUs: number[] = [];
        for (let k = 0; k < N; k++) {
            for (let wrap = 0; wrap <= 1; wrap++) {
                const u = (k / N - phaseOffset + wrap) / scale;
                if (u > eps && u < 1 - eps) {
                    boundaryUs.push(u - eps, u + eps);
                }
            }
        }

        const baseSteps = 92;
        const uniformUs = Array.from({ length: baseSteps + 1 }, (_, i) => i / baseSteps);
        const allUs = [...uniformUs, ...boundaryUs]
            .filter(u => u >= 0 && u <= 1)
            .sort((a, b) => a - b);

        allUs.forEach((u, idx) => {
            const x = left + (right - left) * u;

            const stairPos = (u * scale + phaseOffset) % 1;
            const segPos = stairPos * N;
            const segIndex = Math.min(Math.floor(segPos), N - 1);
            const local = segPos - segIndex;
            const currentLevel = stepLevels[segIndex] ?? 0;
            const prevLevel = stepLevels[(segIndex - 1 + N) % N];

            const entryDelta = currentLevel - prevLevel;
            const ringing = entryDelta !== 0
                ? Math.sin(local * Math.PI * 4.2) *
                  Math.exp(-local * 22) *
                  entryDelta * 0.13
                : 0;

            const stepScale = 0.44;
            const dcWave = -(currentLevel + ringing) * stepScale;
            const acWave = 31 * Math.sin((u * 4.7 + signal.phase) * Math.PI * 2);

            const beatCenter = 0.46;
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
            heartbeatWave *= -1;

            const baseWave = dcWave * (1 - signal.acMix) + acWave * signal.acMix;
            const mixedWave = baseWave * (1 - signal.hbMix) + heartbeatWave * signal.hbMix;
            const noiseMix = signal.acMix * (1 - signal.hbMix);
            const noise =
                signal.jitter * noiseMix *
                (Math.sin(u * 90 + signal.phase * 20) + Math.sin(u * 52 - signal.phase * 14)) *
                0.45;

            const y = mid + mixedWave * signal.amp + noise;
            d.push(`${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
        });

        return d.join(' ');
    };

    useEffect(() => {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        if (navEntry?.type === 'back_forward') {
            window.location.reload();
            return;
        }

        const onPageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                window.location.reload();
            }
        };

        window.addEventListener('pageshow', onPageShow);

        const root = rootRef.current;
        const line = scopeLineRef.current;
        const trail = scopeTrailRef.current;
        const visual = visualRef.current;
        if (!root || !line || !trail || !visual) {
            window.removeEventListener('pageshow', onPageShow);
            return;
        }

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const signal: SignalState = { acMix: 0, hbMix: 0, phase: 0.05, amp: 1, jitter: 0 };

        const updateSignal = () => {
            const d = buildSignalPath(signal);
            line.setAttribute('d', d);
            trail.setAttribute('d', d);
        };

        // prepare a waveform: update path, recalculate length, reset dash
        let currentLen = 0;
        const prepareSignal = (newState: Partial<SignalState>, withTrail = false) => {
            Object.assign(signal, newState);
            updateSignal();
            currentLen = line.getTotalLength();
            gsap.set(line, { strokeDasharray: currentLen, strokeDashoffset: currentLen });
            if (withTrail) {
                gsap.set(trail, {
                    strokeDasharray: currentLen,
                    strokeDashoffset: currentLen,
                    autoAlpha: 0.45,
                });
            } else {
                gsap.set(trail, { autoAlpha: 0 });
            }
        };

        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                gsap.set(
                    '[data-hero-title], [data-hero-desc], [data-hero-cta], [data-hero-scope-card]',
                    { clearProps: 'all' },
                );
                Object.assign(signal, { acMix: 0, hbMix: 0, phase: 0.05, amp: 1, jitter: 0 });
                updateSignal();
                gsap.set(line, { strokeDashoffset: 0, strokeDasharray: 'none' });
                gsap.set(trail, { autoAlpha: 0 });
                return;
            }

            gsap.set('[data-hero-logo], [data-hero-title], [data-hero-desc], [data-hero-cta]', { opacity: 0, y: 18 });
            gsap.set('[data-hero-scope-card]', { opacity: 0, y: 10 });
            gsap.set(trail, { autoAlpha: 0 });

            // Initialize with DC staircase
            prepareSignal({ acMix: 0, hbMix: 0, phase: 0.05, amp: 1, jitter: 0.7 });

            const tl = gsap.timeline();

            // — Scope card entrance —
            tl.to('[data-hero-scope-card]', { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });

            // — Boot: DC staircase sweep —
            tl.to(line, { strokeDashoffset: 0, duration: 0.75, ease: 'none' })
                .to('[data-scope-label-dc]', { autoAlpha: 1, duration: 0.15 }, '<')
                .to({}, { duration: 0.55 })
                .to('[data-scope-label-dc]', { autoAlpha: 0, duration: 0.15 });

            // — Boot: AC sine sweep —
            tl.call(() => prepareSignal({ acMix: 1, hbMix: 0, phase: 0.3, amp: 1, jitter: 0.08 }))
                .to(line, { strokeDashoffset: 0, duration: 0.65, ease: 'none' })
                .to('[data-scope-label-ac]', { autoAlpha: 1, duration: 0.15 }, '<')
                .to({}, { duration: 0.55 })
                .to('[data-scope-label-ac]', { autoAlpha: 0, duration: 0.15 });

            // — Boot: V-signature sweep with phosphor trail —
            tl.call(() => prepareSignal({ acMix: 0, hbMix: 1, phase: 0.58, amp: 0.98, jitter: 0.1 }, true))
                .to(line, { strokeDashoffset: 0, duration: 0.65, ease: 'none' })
                .to(trail, { strokeDashoffset: 0, duration: 0.65, ease: 'none' }, '<')
                .to('[data-scope-label-v]', { autoAlpha: 1, duration: 0.15 }, '<')
                .to(trail, { autoAlpha: 0, duration: 0.3 }, '>')
                .to({}, { duration: 0.6 });

            // — Text entrance, parallel with boot (absolute positions) —
            tl.add(
                gsap.fromTo('[data-hero-logo]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: 'power3.out' }),
                1.0,
            );
            tl.add(
                gsap.fromTo('[data-hero-title]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, ease: 'power3.out' }),
                1.4,
            );
            tl.add(
                gsap.fromTo('[data-hero-desc]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, ease: 'power3.out' }),
                1.8,
            );
            tl.add(
                gsap.fromTo('[data-hero-cta]', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, stagger: 0.1, ease: 'power3.out' }),
                2.1,
            );

            // — After boot: start continuous live loop —
            tl.call(() => {
                gsap.set('[data-scope-label-v]', { autoAlpha: 0 });

                typeLoopRef.current = gsap.timeline({ repeat: -1 });
                const loop = typeLoopRef.current;

                // DC
                loop.call(() => prepareSignal({ acMix: 0, hbMix: 0, phase: 0.05, amp: 1, jitter: 0.7 }))
                    .to(line, { strokeDashoffset: 0, duration: 0.65, ease: 'none' })
                    .to('[data-scope-label-dc]', { autoAlpha: 1, duration: 0.15 }, '<')
                    .to({}, { duration: 2.2 })
                    .to('[data-scope-label-dc]', { autoAlpha: 0, duration: 0.15 });

                // AC
                loop.call(() => prepareSignal({ acMix: 1, hbMix: 0, phase: 0.3, amp: 1, jitter: 0.08 }))
                    .to(line, { strokeDashoffset: 0, duration: 0.65, ease: 'none' })
                    .to('[data-scope-label-ac]', { autoAlpha: 1, duration: 0.15 }, '<')
                    .to({}, { duration: 2.2 })
                    .to('[data-scope-label-ac]', { autoAlpha: 0, duration: 0.15 });

                // V-signature
                loop.call(() => prepareSignal({ acMix: 0, hbMix: 1, phase: 0.58, amp: 0.98, jitter: 0.1 }, true))
                    .to(line, { strokeDashoffset: 0, duration: 0.65, ease: 'none' })
                    .to(trail, { strokeDashoffset: 0, duration: 0.65, ease: 'none' }, '<')
                    .to('[data-scope-label-v]', { autoAlpha: 1, duration: 0.15 }, '<')
                    .to(trail, { autoAlpha: 0, duration: 0.3 }, '>')
                    .to({}, { duration: 1.8 })
                    .to('[data-scope-label-v]', { autoAlpha: 0, duration: 0.15 });
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
                overwrite: 'auto',
            });
        };

        const onMouseLeave = () => {
            if (prefersReducedMotion) return;
            gsap.to(visual, {
                x: 0, y: 0, rotateY: 0, rotateX: 0,
                duration: 0.5, ease: 'power2.out',
                overwrite: 'auto',
            });
        };

        visual.addEventListener('mousemove', onMouseMove);
        visual.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('pageshow', onPageShow);
            visual.removeEventListener('mousemove', onMouseMove);
            visual.removeEventListener('mouseleave', onMouseLeave);
            typeLoopRef.current?.kill();
            gsap.killTweensOf(visual);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative overflow-hidden rounded-xl border border-fd-border bg-fd-card/95 px-8 py-10 shadow-md md:px-10 md:py-12"
        >
            <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                {/* Left: text content */}
                <div className="space-y-6">
                    <img
                        data-hero-logo
                        src="/品牌logo.png"
                        alt={brandLogoAlt}
                        className="h-10 w-auto object-contain"
                    />
                    <h1 data-hero-title>{title}</h1>
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

                {/* Right: persistent oscilloscope */}
                <div ref={visualRef} className="relative flex items-center justify-center">
                    <div
                        ref={scopeRef}
                        data-hero-scope-card
                        className="relative w-full rounded-sm border border-fd-primary/35 bg-fd-background/90 px-4 py-4 shadow-xl"
                    >
                        {/* Graticule — oscilloscope measurement grid */}
                        <div
                            className="pointer-events-none absolute bottom-10 inset-x-4 top-9 opacity-[0.07]"
                            style={{
                                backgroundImage: `linear-gradient(to right, var(--color-fd-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-fd-primary) 1px, transparent 1px)`,
                                backgroundSize: '25% 20%',
                            }}
                        />

                        {/* Scope header */}
                        <div className="relative mb-1 flex items-center justify-between">
                            <div className="text-[10px] font-medium tracking-wider text-fd-muted-foreground/70">
                                SIGNAL BOOT SEQUENCE
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fd-primary" />
                                <span className="text-[10px] font-medium tracking-wider text-fd-primary/70">LIVE</span>
                            </div>
                        </div>

                        {/* Signal waveform — solid primary color, no gradient */}
                        <svg viewBox="0 0 760 180" className="h-36 w-full md:h-48">
                            {/* Center reference line */}
                            <path
                                d="M 18 90 L 742 90"
                                stroke="var(--color-fd-primary)"
                                strokeOpacity="0.15"
                                strokeWidth="1"
                                fill="none"
                            />
                            {/* Main trace */}
                            <path
                                ref={scopeLineRef}
                                d="M 18 90 L 742 90"
                                stroke="var(--color-fd-primary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                            {/* Phosphor trail (V-signature only) */}
                            <path
                                ref={scopeTrailRef}
                                d="M 18 90 L 742 90"
                                stroke="var(--color-fd-primary)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                style={{ filter: 'blur(4px)' }}
                            />
                        </svg>

                        {/* Signal type labels */}
                        <div className="relative h-5">
                            <div data-scope-label-dc className="absolute right-0 text-xs font-medium text-fd-primary/85 opacity-0">DC LEVEL</div>
                            <div data-scope-label-ac className="absolute right-0 text-xs font-medium text-fd-primary/85 opacity-0">AC SWEEP</div>
                            <div data-scope-label-v className="absolute right-0 text-xs font-medium text-fd-primary/85 opacity-0">V SIGNATURE</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
