import {
  createEffect,
  createMemo,
  createSignal,
  onMount,
  onCleanup,
  splitProps,
} from 'solid-js';
import type { JSX } from 'solid-js';
import type { MetalFxInstance } from './engine/renderer/core';
import {
  createInstance,
  destroyInstance,
  registerGlowInstance,
  setGlowCallback,
  setInstanceVisible,
  setSharedPreset,
  unregisterGlowInstance,
  updateInstance,
} from './engine/renderer/loop';
import { injectGlow, updateGlow } from './engine/glow/glow';
import { addReflectionTarget, removeReflectionTarget } from './engine/reflection/paint';
import { scheduleReflectionPaint } from './engine/reflection/reflectionScheduler';
import { ensureStylesInjected } from './metal-fx-styles';
import type { MetalFxProps, MetalFxTheme } from './metal-fx-types';

ensureStylesInjected();

const CANVAS_STYLE: JSX.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
const INNER_STYLE: JSX.CSSProperties = { position: 'absolute', inset: '3px' };
const GLOW_HOST_STYLE: JSX.CSSProperties = { position: 'absolute', inset: 0, "pointer-events": 'none', "z-index": 3, "border-radius": 'inherit' };

const glowHandlesMap = new Map<MetalFxInstance, { handles: ReturnType<typeof injectGlow>; themeRef: { current: 'dark' | 'light' } }>();

setGlowCallback((inst, nowMs) => {
  const entry = glowHandlesMap.get(inst);
  if (!entry) return;
  updateGlow(entry.handles, inst, nowMs, inst.opacityMul, entry.themeRef.current);
});

function useResolvedTheme(theme: () => MetalFxTheme): () => 'dark' | 'light' {
  const [resolved, setResolved] = createSignal<'dark' | 'light'>(
    theme() !== 'auto' ? (theme() as 'dark' | 'light') :
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  );

  createEffect(() => {
    const currentTheme = theme();
    if (currentTheme !== 'auto') { setResolved(currentTheme); return; }
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setResolved(mql.matches ? 'dark' : 'light');
    update();
    mql.addEventListener('change', update);
    onCleanup(() => mql.removeEventListener('change', update));
  });

  return resolved;
}

export function MetalFx(props: MetalFxProps) {
  const [local, rest] = splitProps(props, [
    'children', 'variant', 'preset', 'theme', 'strength', 'paused', 
    'borderRadius', 'normalizeHostStyles', 'reflectionTargets', 
    'disableGlow', 'shaderScale', 'ringCssPx', 'scale', 'className', 'style', 'ref'
  ]);

  let rootRef!: HTMLDivElement;
  let canvasRef!: HTMLCanvasElement;
  let glowHostRef!: HTMLDivElement;
  let contentRef!: HTMLDivElement;
  let instance: MetalFxInstance | null = null;
  let glowHandles: ReturnType<typeof injectGlow> | null = null;
  const themeRef = { current: 'dark' as 'dark' | 'light' };
  let initialWrapperRadius = 0;

  const [ready, setReady] = createSignal(true);
  
  const themeProp = () => local.theme ?? 'auto';
  const resolvedTheme = useResolvedTheme(themeProp);
  
  createEffect(() => {
    themeRef.current = resolvedTheme();
  });

  const shape = () => local.variant === 'circle' ? 'circle' : 'pill';
  const glowEnabled = () => !local.disableGlow;

  const resolveRadius = (w: number, h: number) => {
    if (shape() === 'circle') return Math.min(w, h) / 2;
    const br = local.borderRadius;
    const raw = typeof br === 'number'
      ? br
      : (() => {
          const childEl = contentRef?.firstElementChild as HTMLElement | null;
          if (childEl) {
            const parsed = parseFloat(getComputedStyle(childEl).borderTopLeftRadius);
            if (Number.isFinite(parsed) && parsed > 0) return parsed;
          }
          return initialWrapperRadius;
        })();
    return Math.min(raw, Math.min(w, h) / 2);
  };

  createEffect(() => { setSharedPreset(local.preset ?? 'chromatic', resolvedTheme()); });

  createEffect(() => {
    const isPaused = local.paused ?? false;
    if (!instance) return;
    updateInstance(instance, { paused: isPaused });
  });

  createEffect(() => {
    const sScale = local.shaderScale;
    const rPx = local.ringCssPx;
    const sc = local.scale;
    if (!instance) return;
    const patch: Partial<Parameters<typeof updateInstance>[1]> = {};
    if (sScale !== undefined) patch.shaderScale = sScale;
    if (rPx !== undefined) patch.ringCssPx = rPx;
    if (sc !== undefined) patch.scale = sc;
    if (Object.keys(patch).length > 0) updateInstance(instance, patch);
  });

  createEffect(() => {
    const currentShape = shape();
    if (!instance || !rootRef) return;
    const rect = rootRef.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));
    const cornerRadius = resolveRadius(cssWidth, cssHeight);
    updateInstance(instance, {
      kind: currentShape,
      cssWidth,
      cssHeight,
      cornerRadius,
    });
  });

  onMount(() => {
    if (!canvasRef || !rootRef) return;

    {
      const computed = getComputedStyle(rootRef);
      const parsed = parseFloat(computed.borderTopLeftRadius);
      initialWrapperRadius = Number.isFinite(parsed) ? parsed : 0;
    }

    const currentShape = shape();
    const currentScale = local.scale ?? 1;

    const measure = () => {
      const rect = rootRef.getBoundingClientRect();
      const cssWidth = Math.max(1, Math.round(rect.width));
      const cssHeight = Math.max(1, Math.round(rect.height));
      return { cssWidth, cssHeight, cornerRadius: resolveRadius(cssWidth, cssHeight) };
    };

    const initial = measure();
    instance = createInstance({
      hostCanvas: canvasRef,
      cssWidth: initial.cssWidth,
      cssHeight: initial.cssHeight,
      cornerRadius: initial.cornerRadius,
      kind: currentShape,
      paused: local.paused ?? false,
      shaderScale: local.shaderScale,
      ringCssPx: local.ringCssPx,
      scale: currentScale,
      onFirstCopy: () => setReady(true),
    });
    rootRef.style.setProperty('--mfx-radius', `${initial.cornerRadius}px`);
    rootRef.style.borderRadius = `${initial.cornerRadius}px`;

    if (glowHostRef) {
      glowHandles = injectGlow(glowHostRef, {
        width: initial.cssWidth,
        height: initial.cssHeight,
        cornerRadius: initial.cornerRadius,
        kind: currentShape,
        scale: currentScale,
      });
    }

    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      if (resizeRaf !== 0) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        const next = measure();
        if (!instance) return;
        updateInstance(instance, { cssWidth: next.cssWidth, cssHeight: next.cssHeight, cornerRadius: next.cornerRadius });
        rootRef.style.setProperty('--mfx-radius', `${next.cornerRadius}px`);
        rootRef.style.borderRadius = `${next.cornerRadius}px`;
        if (glowHostRef) {
          glowHostRef.innerHTML = '';
          glowHandles = injectGlow(glowHostRef, {
            width: next.cssWidth, height: next.cssHeight, cornerRadius: next.cornerRadius, kind: currentShape, scale: currentScale,
          });
          if (instance && glowHandles) {
            glowHandlesMap.set(instance, { handles: glowHandles, themeRef });
          }
        }
      });
    });
    ro.observe(rootRef);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => { if (!instance) return; for (const e of entries) setInstanceVisible(instance, e.isIntersecting); },
        { rootMargin: '64px' }
      );
      io.observe(rootRef);
    }

    if (instance && glowHandles) {
      glowHandlesMap.set(instance, { handles: glowHandles, themeRef });
      registerGlowInstance(instance);
    }

    onCleanup(() => {
      ro.disconnect();
      io?.disconnect();
      if (resizeRaf !== 0) cancelAnimationFrame(resizeRaf);
      if (instance) {
        glowHandlesMap.delete(instance);
        unregisterGlowInstance(instance);
        destroyInstance(instance);
      }
      instance = null;
      glowHandles = null;
      if (glowHostRef) glowHostRef.innerHTML = '';
    });
  });

  createEffect(() => {
    const s = local.strength ?? 1;
    if (!instance) return;
    updateInstance(instance, { opacityMul: Math.max(0, Math.min(1, s)) });
  });

  createEffect(() => {
    const targets = local.reflectionTargets;
    const theme = resolvedTheme();
    if (!instance || !rootRef || !targets || theme !== 'dark') return;
    instance.onAfterFrame = scheduleReflectionPaint;
    const live = targets.flatMap((r) => {
      const el = typeof r === 'function' ? (r as any)() : r;
      return el ? [el] : [];
    });
    for (const el of live) addReflectionTarget(el, instance, rootRef);
    onCleanup(() => {
      if (instance) instance.onAfterFrame = undefined;
      for (const el of live) removeReflectionTarget(el);
    });
  });

  createEffect(() => {
    if (!rootRef || !instance) return;
    const cornerRadius = resolveRadius(instance.cssWidth, instance.cssHeight);
    updateInstance(instance, { cornerRadius });
    rootRef.style.setProperty('--mfx-radius', `${cornerRadius}px`);
    rootRef.style.borderRadius = `${cornerRadius}px`;
  });

  const wrapperStyle = createMemo<JSX.CSSProperties | string>(() => {
    const s = local.strength ?? 1;
    let baseStyle: Record<string, string> = {
      '--mfx-strength': String(Math.min(1, Math.max(0, s))),
      'opacity': ready() ? '1' : '0',
      'visibility': ready() ? 'visible' : 'hidden',
      'transition': ready() ? 'opacity 0.15s ease-out' : 'none',
    };
    
    if (typeof local.style === 'string') {
        return `${Object.entries(baseStyle).map(([k, v]) => `${k}:${v}`).join(';')};${local.style}`;
    }
    
    return { ...baseStyle, ...(local.style as object) } as JSX.CSSProperties;
  });

  return (
    <div
      {...rest}
      ref={(el) => {
        rootRef = el;
        if (typeof local.ref === 'function') local.ref(el);
      }}
      class={local.className ? `metal-fx-root ${local.className}` : 'metal-fx-root'}
      data-variant={local.variant ?? 'button'}
      data-shape={shape()}
      data-theme={resolvedTheme()}
      data-paused={local.paused ? 'true' : undefined}
      data-normalize={local.normalizeHostStyles ?? true ? 'true' : 'false'}
      style={wrapperStyle()}
    >
      <canvas ref={canvasRef!} class="metal-fx-canvas" style={CANVAS_STYLE} />
      <div class="metal-fx-inner" aria-hidden="true" style={INNER_STYLE} />
      <div ref={glowHostRef!} aria-hidden="true" style={{ ...GLOW_HOST_STYLE, "display": glowEnabled() ? undefined : 'none' }} />
      <div ref={contentRef!} class="metal-fx-content">{local.children}</div>
    </div>
  );
}
