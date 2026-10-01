import {
  createSignal,
  createEffect,
  createMemo,
  onMount,
  onCleanup,
  createUniqueId,
  splitProps,
  type JSX,
} from 'solid-js';
import type { BotAvatarProps, BotAvatarShading, BotAvatarState } from './types';
import { botAvatarPresets, stateLabels } from './presets';
import { SHAPE_PATHS, SHAPE_PARTS } from './shapes';
import { autoInk, shade } from './color';
import { Sim, restPose } from './engine';
import { draw, OVERSCAN, RISE, type DrawConfig } from './draw';
import { warmPlastic } from './plastic';
import { subscribe, pointer } from './ticker';

/* A 0–1 seed from an id, so two avatars side by side never blink in step unless asked to. */
function hashSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : 1));

const pathCache = new Map<string, Path2D>();
function bodyPath(d: string): Path2D {
  let p = pathCache.get(d);
  if (!p) {
    p = new Path2D(d);
    pathCache.set(d, p);
  }
  return p;
}

const reducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function BotAvatar(props: BotAvatarProps) {
  const [local, rest] = splitProps(props, [
    'type',
    'face',
    'state',
    'size',
    'color',
    'color2',
    'ink',
    'brightness',
    'saturation',
    'speed',
    'paused',
    'seed',
    'shading',
    'shadow',
    'highlight',
    'depth',
    'light',
    'rim',
    'spread',
    'interactive',
    'turn',
    'theme',
    'whirl',
    'whirlSize',
    'whirlWidth',
    'whirlLength',
    'whirlTilt',
    'jumpHeight',
    'jumpTime',
    'jumpStretch',
    'jumpSpin',
    'jumpLean',
    'jumpEvery',
    'jumpLand',
    'jumpSquash',
    'jumpSquashTime',
    'jumpSquashEase',
    'jumpGroundTime',
    'jumpGroundEase',
    'jumpRiseTime',
    'jumpRiseEase',
    'jumpClickSquashTime',
    'class',
    'className',
    'style',
    'aria-label',
    'ref',
    'onClick',
  ]);

  let canvasRef!: HTMLCanvasElement;
  const autoId = createUniqueId();

  const type = () => local.type ?? 'clover';
  const preset = () => botAvatarPresets[type()] ?? botAvatarPresets.clover;
  const faceKind = () => local.face ?? preset().face;
  const size = () => local.size ?? 64;
  const speed = () => local.speed ?? 1;
  const paused = () => local.paused ?? false;
  const interactive = () => local.interactive ?? true;
  const theme = () => local.theme ?? 'auto';

  const picked = () => local.color ?? preset().color;
  const picked2 = () => local.color2 ?? preset().color2;
  const brightness = () => local.brightness ?? 1;
  const saturation = () => local.saturation ?? 1.5;

  const body = createMemo(() => {
    const p = picked();
    const b = brightness();
    const s = saturation();
    if (b === 1 && s === 1) return p;
    return shade(
      p,
      (Math.min(2, Math.max(0, b)) - 1) * 0.35,
      (Math.min(2, Math.max(0, s)) - 1) * 0.5
    );
  });

  const body2 = createMemo(() => {
    const p = picked2();
    if (!p) return undefined;
    const b = brightness();
    const s = saturation();
    if (b === 1 && s === 1) return p;
    return shade(
      p,
      (Math.min(2, Math.max(0, b)) - 1) * 0.35,
      (Math.min(2, Math.max(0, s)) - 1) * 0.5
    );
  });

  const inkColor = createMemo(() => local.ink ?? preset().ink ?? autoInk(body()));
  const seedValue = createMemo(() =>
    Math.min(1, Math.max(0, local.seed ?? hashSeed(autoId)))
  );
  const stateKey = createMemo<BotAvatarState>(() => {
    const s = local.state ?? 'default';
    return s in stateLabels ? s : 'default';
  });

  const frozen = createMemo(() => paused() || !(speed() > 0));
  const shadingMode = createMemo<BotAvatarShading>(() => {
    const sh = local.shading ?? 'plastic';
    return sh === true ? 'crisp' : sh === false ? 'flat' : sh;
  });

  const path = createMemo(() =>
    typeof Path2D === 'undefined'
      ? (null as unknown as Path2D)
      : bodyPath(SHAPE_PATHS[type()] ?? SHAPE_PATHS.clover)
  );

  const parts = createMemo(() =>
    typeof Path2D !== 'undefined' && SHAPE_PARTS[type()]
      ? bodyPath(SHAPE_PARTS[type()] as string)
      : undefined
  );

  let sim: Sim | null = null;
  let cssSize = 0;

  const resolveTheme = (el: HTMLElement | null): 'dark' | 'light' => {
    const th = theme();
    if (th !== 'auto') return th;
    const host = el?.closest('[data-theme], .dark, .light') as HTMLElement | null;
    if (host) {
      const v = host.getAttribute('data-theme');
      if (v === 'dark' || v === 'light') return v;
      if (host.classList.contains('dark')) return 'dark';
      if (host.classList.contains('light')) return 'light';
    }
    return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  };

  const getDrawConfig = (): DrawConfig => {
    const p = preset();
    return {
      path: path(),
      face: faceKind(),
      faceX: p.faceX,
      faceY: p.faceY,
      faceScale: p.faceScale,
      color: body(),
      color2: body2(),
      ink: inkColor(),
      shading: shadingMode(),
      shadow: clamp(local.shadow ?? 0.35, 0, 2),
      highlight: clamp(local.highlight ?? 1.3, 0, 2),
      depth: clamp(local.depth ?? 0.65, 0.2, 2),
      light: local.light ?? 265,
      rim: clamp(local.rim ?? 0.5, 0, 2),
      spread: clamp(local.spread ?? 1.55, 0.4, 2.5),
      typeKey: type(),
      still: frozen() || reducedMotion(),
      whirl: {
        strength: clamp(local.whirl ?? 0, 0, 2),
        size: clamp(local.whirlSize ?? 1, 0.6, 1.6),
        width: clamp(local.whirlWidth ?? 1, 0.4, 2),
        length: clamp(local.whirlLength ?? 1, 0.4, 1.6),
        tilt: clamp(local.whirlTilt ?? 1, 0.5, 1.8),
      },
      parts: parts(),
      theme: resolveTheme(canvasRef),
    };
  };

  const paint = () => {
    const canvas = canvasRef;
    if (!canvas || !path()) return;
    const s = size();
    const px = canvas.clientWidth / OVERSCAN || cssSize || (typeof s === 'number' ? s : 64);
    if (!px) return;
    const dpr = Math.min(2, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1);
    const want = Math.round(px * OVERSCAN * dpr);
    if (canvas.width !== want || canvas.height !== want) {
      canvas.width = want;
      canvas.height = want;
    }
    cssSize = px;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cfg = getDrawConfig();
    cfg.dpr = dpr;
    const pose = sim ? sim.pose : restPose(stateKey());
    draw(ctx, px, pose, cfg);
  };

  onMount(() => {
    if (typeof local.ref === 'function') local.ref(canvasRef);

    sim = new Sim(seedValue(), stateKey());
    sim.setTurn(clamp(local.turn ?? 1, 0, 2));
    sim.setJump({
      height: local.jumpHeight ?? 26,
      time: Math.max(0.2, local.jumpTime ?? 0.68),
      stretch: local.jumpStretch ?? 1,
      spin: Math.max(0, Math.round(local.jumpSpin ?? 1)),
      lean: local.jumpLean ?? 6,
      every: local.jumpEvery ?? 8,
      land: local.jumpLand ?? 0,
      squash: local.jumpSquash ?? 1.15,
      squashTime: Math.max(0.05, local.jumpSquashTime ?? 0.37),
      squashEase: local.jumpSquashEase ?? 'pulse',
      groundTime: Math.max(0, local.jumpGroundTime ?? 0.11),
      groundEase: local.jumpGroundEase ?? 'pulse',
      riseTime: Math.max(0.05, local.jumpRiseTime ?? 0.33),
      riseEase: local.jumpRiseEase ?? 'pulse',
      clickSquashTime: Math.max(0.05, local.jumpClickSquashTime ?? 0.24),
    });

    paint();

    // Idle plastic material warming
    if (shadingMode() === 'plastic' && path()) {
      const s = size();
      const dev = (typeof s === 'number' ? s : 64) * Math.min(2, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1);
      const ric = (typeof requestIdleCallback === 'function'
        ? requestIdleCallback
        : (fn: () => void) => setTimeout(fn, 1)) as (fn: () => void) => number;
      const id = ric(() => warmPlastic(type(), path(), dev, local.depth ?? 0.65));
      onCleanup(() => {
        if (typeof cancelIdleCallback === 'function') cancelIdleCallback(id);
        else clearTimeout(id);
      });
    }

    // Animation frame subscription loop
    let onScreen = true;
    let unsub: (() => void) | null = null;
    const REACH = 3;

    const tick = (dt: number) => {
      if (!sim) return;
      if (interactive() && !Number.isNaN(pointer.x) && canvasRef) {
        const r = canvasRef.getBoundingClientRect();
        const box = r.width / OVERSCAN || 1;
        const dx = (pointer.x - (r.left + r.width / 2)) / box;
        const dy = (pointer.y - (r.top + r.height / 2 + RISE * box)) / box;
        const d = Math.hypot(dx, dy);
        const strength = d < 1 ? 1 : d > REACH ? 0 : 1 - (d - 1) / (REACH - 1);
        sim.setPointer(dx / Math.max(1, d), dy / Math.max(1, d), strength);
      } else {
        sim.setPointer(0, 0, 0);
      }

      sim.update(dt * speed());
      paint();
    };

    const run = () => {
      if (!unsub && !frozen() && !reducedMotion()) {
        unsub = subscribe(tick);
      }
    };

    const stop = () => {
      if (unsub) {
        unsub();
        unsub = null;
      }
    };

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === 'function' && canvasRef) {
      io = new IntersectionObserver((entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen) run();
        else stop();
      });
      io.observe(canvasRef);
    } else {
      run();
    }

    createEffect(() => {
      if (frozen() || reducedMotion()) {
        stop();
        paint();
      } else if (onScreen) {
        run();
      }
    });

    onCleanup(() => {
      stop();
      if (io) io.disconnect();
    });
  });

  // Track state changes dynamically
  createEffect(() => {
    if (sim) {
      sim.setState(stateKey());
    }
  });

  // Track turn changes
  createEffect(() => {
    if (sim) {
      sim.setTurn(clamp(local.turn ?? 1, 0, 2));
    }
  });

  // Track jump settings
  createEffect(() => {
    if (sim) {
      sim.setJump({
        height: local.jumpHeight ?? 26,
        time: Math.max(0.2, local.jumpTime ?? 0.68),
        stretch: local.jumpStretch ?? 1,
        spin: Math.max(0, Math.round(local.jumpSpin ?? 1)),
        lean: local.jumpLean ?? 6,
        every: local.jumpEvery ?? 8,
        land: local.jumpLand ?? 0,
        squash: local.jumpSquash ?? 1.15,
        squashTime: Math.max(0.05, local.jumpSquashTime ?? 0.37),
        squashEase: local.jumpSquashEase ?? 'pulse',
        groundTime: Math.max(0, local.jumpGroundTime ?? 0.11),
        groundEase: local.jumpGroundEase ?? 'pulse',
        riseTime: Math.max(0.05, local.jumpRiseTime ?? 0.33),
        riseEase: local.jumpRiseEase ?? 'pulse',
        clickSquashTime: Math.max(0.05, local.jumpClickSquashTime ?? 0.24),
      });
    }
  });

  const dim = () =>
    typeof size() === 'number' ? `${(size() as number) * OVERSCAN}px` : `calc(${size()} * ${OVERSCAN})`;
  const pull = (k: number) =>
    typeof size() === 'number' ? `${-(size() as number) * k}px` : `calc(${size()} * ${-k})`;
  const side = (OVERSCAN - 1) / 2;

  const mergedStyle = createMemo<JSX.CSSProperties | string>(() => {
    const base: Record<string, string | number> = {
      display: 'inline-block',
      'vertical-align': 'middle',
      width: dim(),
      height: dim(),
      'margin-left': pull(side),
      'margin-right': pull(side),
      'margin-top': pull(side + RISE),
      'margin-bottom': pull(side - RISE),
      flex: 'none',
    };

    if (typeof local.style === 'string') {
      return `${Object.entries(base)
        .map(([k, v]) => `${k}:${v}`)
        .join(';')};${local.style}`;
    }
    return { ...base, ...(local.style as object) } as JSX.CSSProperties;
  });

  const handleClick = (e: MouseEvent) => {
    if (interactive() && !frozen()) {
      sim?.poke();
    }
    if (typeof local.onClick === 'function') {
      (local.onClick as any)(e);
    }
  };

  return (
    <canvas
      ref={(el) => {
        canvasRef = el;
        if (typeof local.ref === 'function') local.ref(el);
      }}
      class={local.class || local.className ? `ba ${local.class || local.className}` : 'ba'}
      data-bot-avatar={type()}
      data-face={faceKind()}
      data-state={stateKey()}
      role="img"
      aria-label={local['aria-label'] ?? `${preset().label} bot, ${stateLabels[stateKey()]}`}
      style={mergedStyle()}
      onClick={handleClick}
      {...rest}
    />
  );
}

export default BotAvatar;
