import { createEffect, onCleanup, splitProps, mergeProps } from 'solid-js';
import type { JSX } from 'solid-js';
import { MODE_DRAWS } from './engine/registry';
import { resolvePreset } from './presets';
import { createReducedMotion, createResolvedDark } from './theme';
import type { ThinkingOrbProps } from './types';

const LABELS: Record<string, string> = {
  working: 'Working…',
  searching: 'Searching…',
  solving: 'Solving…',
  listening: 'Listening…',
  composing: 'Composing…',
  shaping: 'Shaping…',
  syncing: 'Syncing…',
  evolving: 'Evolving…',
  building: 'Building…',
  hypercube: 'Structuring…',
  conjuring: 'Conjuring…',
  conjuring_static: 'Conjuring static…',
  assembling: 'Assembling…',
};

export function ThinkingOrb(props: ThinkingOrbProps) {
  const merged = mergeProps(
    { state: 'working', size: 64, theme: 'auto', speed: 1, paused: false } as const,
    props
  );
  
  // Note: SolidJS refs are special, we don't spread them like normal props. We extract them if we need to pass them down.
  const [local, rest] = splitProps(merged, ['state', 'size', 'theme', 'speed', 'paused', 'style', 'aria-label', 'ref']);

  let canvasRef!: HTMLCanvasElement;
  const dark = createResolvedDark(() => local.theme, () => canvasRef);
  const reduced = createReducedMotion();

  createEffect(() => {
    // Explicitly track dependencies so the effect re-runs when they change
    const currentState = local.state;
    const currentSize = local.size;
    const currentSpeed = local.speed;
    const currentPaused = local.paused;
    const currentDark = dark();
    const currentReduced = reduced();

    const canvas = canvasRef;
    if (!canvas) return;
    const dpr = Math.min(2, (typeof devicePixelRatio !== 'undefined' && devicePixelRatio) || 1);
    canvas.width = Math.round(currentSize * dpr);
    canvas.height = Math.round(currentSize * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { mode, speed: baseSpeed, opts } = resolvePreset(currentState, currentSize);
    const draw = MODE_DRAWS[mode];
    const effSpeed = baseSpeed * currentSpeed;

    const frame = (tSec: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, currentSize, currentSize);
      draw(ctx, currentSize, tSec, currentDark, opts);
    };

    // reduced motion → one static, deterministic frame
    if (currentReduced) {
      frame(0.6);
      return;
    }

    let raf = 0;
    let running = false;
    const loop = () => {
      frame((performance.now() / 1000) * effSpeed);
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || currentPaused) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // draw at least one frame even when paused/offscreen
    frame((performance.now() / 1000) * effSpeed);

    // pause offscreen + on hidden tabs — free when not visible
    let visible = true;
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && document.visibilityState !== 'hidden') start();
            else stop();
          })
        : null;
    io?.observe(canvas);
    const onVis = () => {
      if (document.visibilityState === 'hidden') stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVis);
    if (!io) start();

    onCleanup(() => {
      stop();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    });
  });

  return (
    <canvas
      ref={(el) => {
        canvasRef = el;
        if (typeof local.ref === 'function') local.ref(el);
      }}
      role="img"
      aria-label={local['aria-label'] ?? LABELS[local.state]}
      style={{ width: `${local.size}px`, height: `${local.size}px`, display: 'block', ...(typeof local.style === 'object' ? local.style : {}) }}
      {...rest}
    />
  );
}
