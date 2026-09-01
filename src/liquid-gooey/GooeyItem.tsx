import {
  createSignal,
  createMemo,
  createEffect,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from 'solid-js';
import { useGooeyContext, type GooeyContextValue } from './context';
import {
  measureRadius,
  normalizeRadius,
  offsetTo,
  roundedRectPath,
  type BlobBox,
  type CornerRadii,
} from './geometry';
import {
  EVOLVE_DEFAULTS,
  MOVE_DEFAULTS,
  type EvolveOptions,
  type MoveOptions,
} from './observer';
import { easingFunction, resolveTransition, type Transition } from './spring';
import { createReducedMotion } from '../theme';

export type GooeyEffect = 'morph' | 'evolve' | 'move';

export interface DissolveOptions {
  blur?: number;
  warp?: number;
  pull?: number;
  range?: number;
  zone?: number;
  mix?: number;
  gravity?: number;
  taper?: number;
  warpFreq?: number;
  flowSpeed?: number;
  warpStyle?: 'fractalNoise' | 'turbulence';
  detail?: number;
  active?: boolean;
  releaseMs?: number;
  fadeMs?: number;
  strength?: number;
  sink?: number;
}

export interface GooeyItemProps {
  effect?: GooeyEffect | GooeyEffect[];
  evolve?: EvolveOptions;
  move?: MoveOptions;
  x?: number;
  y?: number;
  scale?: number;
  transition?: Transition;
  delay?: number;
  observe?: boolean;
  contactBlur?: boolean | DissolveOptions;
  radius?: number | CornerRadii;
  blobInset?: number;
  bridgeGrow?: number;
  class?: string;
  className?: string;
  style?: JSX.CSSProperties | string;
  children?: JSX.Element;
}

function toEffects(effect: GooeyEffect | GooeyEffect[] | undefined): GooeyEffect[] {
  return Array.isArray(effect) ? effect : effect ? [effect] : [];
}

export function GooeyItem(props: GooeyItemProps) {
  const ctx = useGooeyContext();
  const needsEngine = () =>
    props.observe || toEffects(props.effect).some((e) => e !== 'morph');

  return (
    <Show
      when={needsEngine()}
      fallback={<MirroredItem {...props} ctx={ctx} />}
    >
      <ObservedItem {...props} ctx={ctx} />
    </Show>
  );
}

type Internal = GooeyItemProps & { ctx: GooeyContextValue };

function sameBox(a: BlobBox | null, b: BlobBox): boolean {
  return (
    !!a &&
    a.x === b.x &&
    a.y === b.y &&
    a.w === b.w &&
    a.h === b.h &&
    a.r.every((v, i) => v === b.r[i])
  );
}

function MirroredItem(props: Internal) {
  let wrapRef!: HTMLDivElement;
  let blobEl: SVGGraphicsElement | null = null;
  const [box, setBox] = createSignal<BlobBox | null>(null);
  const reduced = createReducedMotion();

  const x = () => props.x ?? 0;
  const y = () => props.y ?? 0;
  const scale = () => props.scale ?? 1;
  const delay = () => props.delay ?? 0;

  const resolvedTrans = createMemo(() =>
    resolveTransition(props.transition, reduced())
  );

  onMount(() => {
    const el = wrapRef;
    const group = props.ctx.getGroup();
    if (!el || !group) return;

    const measure = () => {
      const base = offsetTo(el, group);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const target = (el.firstElementChild as HTMLElement | null) ?? el;
      const r: CornerRadii =
        props.radius != null
          ? normalizeRadius(props.radius)
          : measureRadius(target, w, h);
      const next: BlobBox = { x: base.x, y: base.y, w, h, r };
      setBox((prev) => (sameBox(prev, next) ? prev : next));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(group);
    onCleanup(() => ro.disconnect());
  });

  // Mount the SVG blob to portal directly in the SVG namespace
  createEffect(() => {
    const b = box();
    const portal = props.ctx.portal();
    if (!b || !portal) return;

    if (blobEl) {
      blobEl.remove();
      blobEl = null;
    }

    const [tl, tr, br, bl] = b.r;
    const uniform = tl === tr && tr === br && br === bl;
    if (uniform) {
      const rx = Math.max(0, Math.min(tl, Math.min(b.w, b.h) / 2));
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(b.x));
      rect.setAttribute('y', String(b.y));
      rect.setAttribute('width', String(b.w));
      rect.setAttribute('height', String(b.h));
      rect.setAttribute('rx', String(rx));
      rect.style.transformBox = 'fill-box';
      rect.style.transformOrigin = 'center';
      rect.style.willChange = 'transform';
      portal.appendChild(rect);
      blobEl = rect;
    } else {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', roundedRectPath(b.x, b.y, b.w, b.h, b.r));
      path.style.transformBox = 'fill-box';
      path.style.transformOrigin = 'center';
      path.style.willChange = 'transform';
      portal.appendChild(path);
      blobEl = path;
    }

    const c = cur ?? { x: x(), y: y(), s: scale() };
    blobEl.style.transform =
      `translate(${c.x}px, ${c.y}px)` + (c.s !== 1 ? ` scale(${c.s})` : '');

    onCleanup(() => {
      if (blobEl) {
        blobEl.remove();
        blobEl = null;
      }
    });
  });

  let cur: { x: number; y: number; s: number } | null = null;
  const writeTransform = (px: number, py: number, ps: number) => {
    const t = `translate(${px}px, ${py}px)` + (ps !== 1 ? ` scale(${ps})` : '');
    if (wrapRef) wrapRef.style.transform = t;
    if (blobEl) blobEl.style.transform = t;
  };

  createEffect(() => {
    const targetX = x();
    const targetY = y();
    const targetScale = scale();
    const { duration, easing } = resolvedTrans();
    const d = delay();

    const from = cur;
    if (
      !from ||
      duration <= 0 ||
      (from.x === targetX && from.y === targetY && from.s === targetScale)
    ) {
      cur = { x: targetX, y: targetY, s: targetScale };
      writeTransform(targetX, targetY, targetScale);
      return;
    }

    const f = { ...from };
    const ease = easingFunction(easing);
    const start = performance.now() + d;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      const e = ease(p);
      const cx = f.x + (targetX - f.x) * e;
      const cy = f.y + (targetY - f.y) * e;
      const cs = f.s + (targetScale - f.s) * e;
      cur = { x: cx, y: cy, s: cs };
      writeTransform(cx, cy, cs);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    onCleanup(() => cancelAnimationFrame(raf));
  });

  return (
    <div
      ref={wrapRef}
      class={props.class || props.className}
      style={{
        display: 'inline-block',
        ...(typeof props.style === 'object' ? props.style : {}),
        'will-change': 'transform',
      }}
    >
      {props.children}
    </div>
  );
}

function ObservedItem(props: Internal) {
  let hostRef!: HTMLSpanElement;

  onMount(() => {
    const host = hostRef;
    const group = props.ctx.getGroup();
    const portal = props.ctx.portal();
    const meltPortal = props.ctx.meltPortal();
    if (!host || !group || !portal) return;

    const target = (host.firstElementChild as HTMLElement | null) ?? host;

    // Create SVG rect in portal directly
    const blob = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    blob.setAttribute('x', '0');
    blob.setAttribute('y', '0');
    blob.setAttribute('width', '0');
    blob.setAttribute('height', '0');
    blob.style.willChange = 'transform';
    blob.style.transformBox = 'fill-box';
    blob.style.transformOrigin = 'center';
    portal.appendChild(blob);

    let meltEl: SVGGElement | null = null;
    if (props.contactBlur !== undefined && props.contactBlur !== false && meltPortal) {
      meltEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      meltEl.setAttribute('opacity', '0');
      meltPortal.appendChild(meltEl);
    }

    const opts = typeof props.contactBlur === 'object' ? props.contactBlur : {};
    const blend =
      props.contactBlur && meltEl
        ? {
            host: meltEl,
            blur: opts.blur ?? 8,
            warp: opts.warp ?? 26,
            pull: opts.pull ?? 4,
            range: opts.range,
            zone: opts.zone,
            mix: opts.mix ?? 0,
            gravity: opts.gravity ?? 60,
            taper: opts.taper ?? 1,
            warpFreq: opts.warpFreq ?? 1.7,
            flowSpeed: opts.flowSpeed ?? 22,
            warpStyle: opts.warpStyle ?? 'fractalNoise',
            detail: opts.detail ?? 2,
            active: opts.active !== false,
            releaseMs: opts.releaseMs ?? 240,
            fadeMs: opts.fadeMs,
            strength: opts.strength ?? 1,
            sink: opts.sink,
          }
        : undefined;

    const effects = toEffects(props.effect);
    const dynamics = {
      evolve: effects.includes('evolve'),
      move: effects.includes('move'),
      evolveOpts: { ...EVOLVE_DEFAULTS, ...props.evolve },
      moveOpts: { ...MOVE_DEFAULTS, ...props.move },
    };
    const hasDynamics = dynamics.evolve || dynamics.move;

    const cleanup = props.ctx.engine.add({
      target,
      blob,
      radius:
        props.radius != null
          ? normalizeRadius(props.radius)[0]
          : undefined,
      blobInset: props.blobInset,
      bridgeGrow: props.bridgeGrow,
      blend,
      dynamics: hasDynamics ? dynamics : undefined,
    });

    onCleanup(() => {
      cleanup();
      blob.remove();
      if (meltEl) meltEl.remove();
    });
  });

  return (
    <span
      ref={hostRef}
      class={props.class || props.className}
      style={{
        display: 'contents',
        ...(typeof props.style === 'object' ? props.style : {}),
      }}
    >
      {props.children}
    </span>
  );
}
