import {
  createSignal,
  createEffect,
  createMemo,
  onMount,
  onCleanup,
  splitProps,
} from 'solid-js';
import type { JSX } from 'solid-js';
import { generateBeamCSS, getPulseDriverConfig, sizePresets, sizeThemePresets } from './border-beam-styles';
import { registerPulseInstance } from './border-beam-pulseDriver';
import type { BorderBeamProps, BorderBeamTheme } from './border-beam-types';

let idCounter = 0;

function useSystemTheme(): () => 'dark' | 'light' {
  const [theme, setTheme] = createSignal<'dark' | 'light'>(
    (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  );

  createEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    onCleanup(() => mediaQuery.removeEventListener('change', handler));
  });

  return theme;
}

function resolveTheme(theme: BorderBeamTheme, systemTheme: 'dark' | 'light'): 'dark' | 'light' {
  return theme === 'auto' ? systemTheme : theme;
}

export function BorderBeam(props: BorderBeamProps) {
  const [local, rest] = splitProps(props, [
    'children', 'size', 'colorVariant', 'theme', 'staticColors',
    'duration', 'active', 'borderRadius', 'brightness', 'saturation',
    'hueRange', 'strength', 'className', 'style', 'onActivate', 'onDeactivate',
    'onAnimationEnd', 'ref'
  ]);

  const baseId = `bb-${++idCounter}`;
  const systemTheme = useSystemTheme();
  let internalRef!: HTMLDivElement;

  const [isActive, setIsActive] = createSignal(local.active ?? true);
  const [isFading, setIsFading] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(true);
  const [detectedRadius, setDetectedRadius] = createSignal<number | null>(null);
  const [pulseGlowScale, setPulseGlowScale] = createSignal({ x: 1, y: 1 });

  createEffect(() => {
    const act = local.active ?? true;
    if (act && !isActive() && !isFading()) {
      setIsActive(true);
    } else if (!act && isActive() && !isFading()) {
      setIsFading(true);
    }
  });

  onMount(() => {
    if (!internalRef || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      entries => { for (const entry of entries) setIsVisible(entry.isIntersecting); },
      { rootMargin: '256px' }
    );
    observer.observe(internalRef);
    onCleanup(() => observer.disconnect());
  });

  createEffect(() => {
    if (local.borderRadius != null) return;
    if (!internalRef) return;
    
    const detect = () => {
      const child = internalRef.firstElementChild as HTMLElement | null;
      if (!child) return;
      const computed = getComputedStyle(child);
      const raw = parseFloat(computed.borderTopLeftRadius);
      if (!isNaN(raw) && raw > 0) setDetectedRadius(raw);
    };

    detect();
    const observer = new MutationObserver(detect);
    observer.observe(internalRef, { childList: true, subtree: false });
    onCleanup(() => observer.disconnect());
  });

  createEffect(() => {
    if (local.size !== 'pulse-outside') {
      setPulseGlowScale({ x: 1, y: 1 });
      return;
    }
    if (!internalRef) return;

    const REF_WIDTH = 350;
    const REF_HEIGHT = 140;
    const MIN_SCALE = 0.35;
    const MAX_SCALE = 4;
    const clamp = (value: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));

    const measure = () => {
      const child = internalRef.firstElementChild as HTMLElement | null;
      if (!child) return;
      const rect = child.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = +clamp(rect.width / REF_WIDTH).toFixed(3);
      const y = +clamp(rect.height / REF_HEIGHT).toFixed(3);
      setPulseGlowScale(prev => (prev.x === x && prev.y === y ? prev : { x, y }));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const child = internalRef.firstElementChild as HTMLElement | null;
    if (!child) return;

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(child);
    onCleanup(() => resizeObserver.disconnect());
  });

  const handleAnimationEnd = (e: AnimationEvent) => {
    const animationName = e.animationName;
    if (animationName.includes('fade-out')) {
      setIsActive(false);
      setIsFading(false);
      local.onDeactivate?.();
    } else if (animationName.includes('fade-in')) {
      local.onActivate?.();
    }
    (local.onAnimationEnd as any)?.(e);
  };

  const resolvedThemeStr = () => resolveTheme(local.theme ?? 'dark', systemTheme());
  const sizeConfig = () => sizePresets[local.size ?? 'md'];
  const isPulse = () => local.size === 'pulse-inner' || local.size === 'pulse-outside';

  const cssStyles = createMemo(() => {
    const size = local.size ?? 'md';
    const theme = resolvedThemeStr();
    const themeConfig = sizeThemePresets[size][theme];
    const sConfig = sizeConfig();
    const isP = isPulse();
    const colorVar = local.colorVariant ?? 'colorful';

    const finalBorderRadius = local.borderRadius ?? detectedRadius() ?? sConfig.borderRadius;
    const finalDuration = local.duration ?? (size === 'line' ? 3.1 : isP ? 2.3 : 1.96);
    const finalSaturation = local.saturation ?? themeConfig.saturation;
    const finalBrightness = local.brightness ?? themeConfig.brightness ?? 1.3;
    const finalHueRange = size === 'line' ? Math.min(local.hueRange ?? 30, 13) : (local.hueRange ?? 30);
    const finalStaticColors = colorVar === 'mono' ? true : (local.staticColors ?? false);

    return generateBeamCSS({
      id: baseId,
      borderRadius: finalBorderRadius,
      borderWidth: sConfig.borderWidth,
      duration: finalDuration,
      strokeOpacity: themeConfig.strokeOpacity,
      innerOpacity: themeConfig.innerOpacity,
      bloomOpacity: themeConfig.bloomOpacity,
      innerShadow: themeConfig.innerShadow,
      size,
      colorVariant: colorVar,
      staticColors: finalStaticColors,
      brightness: finalBrightness,
      saturation: finalSaturation,
      hueRange: finalHueRange,
      theme,
      hairlineOpacity: themeConfig.hairlineOpacity,
    });
  });

  const driverConfig = createMemo(() => {
    const size = local.size ?? 'md';
    if (!isPulse()) return null;
    const theme = resolvedThemeStr();
    const finalDuration = local.duration ?? 2.3;
    const finalHueRange = local.hueRange ?? 30;
    const colorVar = local.colorVariant ?? 'colorful';
    const finalStaticColors = colorVar === 'mono' ? true : (local.staticColors ?? false);

    return getPulseDriverConfig(size, theme, finalDuration, finalHueRange, finalStaticColors, baseId);
  });

  createEffect(() => {
    const cfg = driverConfig();
    if (!cfg) return;
    if (!(isActive() || isFading()) || !isVisible()) return;
    if (!internalRef) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const cleanup = registerPulseInstance(internalRef, cfg);
    onCleanup(() => {
      if (cleanup) cleanup();
    });
  });

  const mergedStyle = createMemo<JSX.CSSProperties | string>(() => {
    const strength = local.strength ?? 1;
    let base: Record<string, string | number> = {
      '--beam-strength': Math.max(0, Math.min(1, strength)),
    };
    if (local.size === 'pulse-outside') {
      const scale = pulseGlowScale();
      base['--pulse-glow-sx'] = scale.x;
      base['--pulse-glow-sy'] = scale.y;
    }
    
    if (typeof local.style === 'string') {
      return `${Object.entries(base).map(([k, v]) => `${k}:${v}`).join(';')};${local.style}`;
    }
    return { ...base, ...(local.style as object) } as JSX.CSSProperties;
  });

  return (
    <>
      <style>{cssStyles()}</style>
      <div
        {...rest}
        ref={(el) => {
          internalRef = el;
          if (typeof local.ref === 'function') local.ref(el);
        }}
        data-beam={baseId}
        data-active={isActive() && !isFading() ? '' : undefined}
        data-fading={isFading() ? '' : undefined}
        data-paused={isActive() && !isFading() && !isVisible() ? '' : undefined}
        class={local.className}
        style={mergedStyle()}
        onAnimationEnd={handleAnimationEnd}
      >
        {local.children}
        <div data-beam-bloom />
      </div>
    </>
  );
}
