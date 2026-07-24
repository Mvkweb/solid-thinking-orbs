# Documentation

Detailed reference for integrating, styling, and extending `solid-thinking-orbs`.

## Props

The `<ThinkingOrb />` component accepts the following props:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `state` | `OrbState` | `'working'` | Animation verb state (13 available states). |
| `size` | `OrbSize` (`64` \| `20`) | `64` | Tuned size preset in CSS pixels (`64` for avatar, `20` for inline). |
| `speed` | `number` | `1.0` | Speed multiplier relative to the preset's baked rate. |
| `paused` | `boolean` | `false` | When `true`, freezes the canvas on the current frame. |
| `theme` | `'auto'` \| `'dark'` \| `'light'` | `'auto'` | Color mode (light ink on dark backgrounds, dark ink on light). |
| `aria-label` | `string` | *Per-state fallback* | Accessible label for screen readers (`role="img"`). |
| `ref` | `(el: HTMLCanvasElement) => void` | `undefined` | Ref callback for direct access to the `<canvas>` DOM element. |

All standard HTML `<canvas>` attributes (`class`, `style`, `onClick`, `onMouseEnter`, `data-*`) pass through natively.

## States

### V1 Original States
```tsx
<ThinkingOrb state="working" />    /* particles on tilted orbits */
<ThinkingOrb state="searching" />  /* a scan meridian sweeps a dotted globe */
<ThinkingOrb state="solving" />    /* bands scramble, then click back solved */
<ThinkingOrb state="listening" />  /* a waveform rolls through latitude rings */
<ThinkingOrb state="composing" />  /* an undulating multi-band sash */
<ThinkingOrb state="shaping" />    /* dotted outline morphing circle → triangle → square */
```

### V2 Custom States
```tsx
<ThinkingOrb state="syncing" />          /* fast-spinning 3D wireframe cylinder */
<ThinkingOrb state="evolving" />         /* twisting double-helix ribbon */
<ThinkingOrb state="building" />         /* 3D dotted wireframe cube tumbling */
<ThinkingOrb state="hypercube" />        /* filled 3D cubic matrix with undulating surface waves */
<ThinkingOrb state="conjuring" />        /* 3D logarithmic spiral triangle tumbling in space */
<ThinkingOrb state="conjuring_static" /> /* static upright 3D spiral triangle with flowing energy */
<ThinkingOrb state="assembling" />       /* 3D quantum cube whose particles explode outward & snap back */
```

## Styling & Coloring

`ThinkingOrb` renders monochrome dots by default. Custom colors, glows, and gradients can be applied using CSS.

### CSS Filters
Use CSS `hue-rotate`, `saturate`, and `brightness` to tint dots:

```tsx
/* Blue Tint */
<ThinkingOrb
  state="hypercube"
  style={{ filter: 'hue-rotate(190deg) saturate(6) brightness(1.2)' }}
/>

/* Pink Glow */
<ThinkingOrb
  state="conjuring"
  style={{ filter: 'hue-rotate(290deg) saturate(8) drop-shadow(0 0 10px #ec4899)' }}
/>
```

### Drop Shadow Glow
Add an ambient shadow aura behind the particles:

```tsx
<ThinkingOrb
  state="assembling"
  style={{ filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))' }}
/>
```

### Vertical Gradients
To create vertical color transitions, wrap the orb in a gradient container:

```tsx
<div class="relative w-[64px] h-[64px] bg-gradient-to-t from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
  <ThinkingOrb
    state="conjuring_static"
    size={64}
    style={{ 'mix-blend-mode': 'screen' }}
  />
</div>
```

## Theme Resolution

When `theme="auto"` is set, the theme mode resolves automatically in three steps:

1. Checks ancestor elements for `data-theme="dark|light"` attribute or `dark`/`light` class (watched via `MutationObserver`).
2. Subscribes to system OS preferences (`prefers-color-scheme: dark`).
3. SSR-safe — paints only on the client after theme resolution.

## SolidJS Integration

### State Machine Example

```tsx
import { createSignal } from 'solid-js';
import { ThinkingOrb, type OrbState } from 'solid-thinking-orbs';

function AgentStatus() {
  const [status, setStatus] = createSignal<OrbState>('searching');

  return (
    <div class="flex items-center gap-3">
      <ThinkingOrb state={status()} size={64} />
      <span>Status: {status()}</span>
    </div>
  );
}
```

### Pause / Play & Speed Controls

```tsx
import { createSignal } from 'solid-js';
import { ThinkingOrb } from 'solid-thinking-orbs';

function ControlledOrb() {
  const [paused, setPaused] = createSignal(false);
  const [speed, setSpeed] = createSignal(1.5);

  return (
    <div>
      <ThinkingOrb state="building" size={64} speed={speed()} paused={paused()} />
      <button onClick={() => setPaused((p) => !p)}>
        {paused() ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
}
```

## Custom Engine Architecture

All 3D drawing logic is modularized inside `src/engine/`.

### Creating a New Engine Mode

1. Create drawing function (`src/engine/custom_mode.ts`):
```ts
import type { Dot, ModeDraw } from './types';
import { makeProj, paint, radiusScale } from './core';

export const drawCustomMode: ModeDraw = (ctx, size, t, dark, o) => {
  const cx = size / 2;
  const cy = size / 2;
  const pt = makeProj(t * 0.2, 0.4, cx, cy, 1);
  const rs = radiusScale(size, 0.6);

  const dots: Dot[] = [];
  paint(ctx, dots, dark, o.rMin);
};
```

2. Register in `src/engine/registry.ts`:
```ts
import { drawCustomMode } from './custom_mode';

export const MODE_DRAWS = {
  // ...
  custom: drawCustomMode
};
```

3. Map state & preset in `src/presets.ts`:
```ts
export const STATE_TO_MODE = {
  // ...
  custom_state: 'custom'
};
```

## Types

Import TypeScript types directly:

```ts
import type {
  OrbState,
  OrbSize,
  ThinkingOrbProps,
  ModeDraw,
  Dot
} from 'solid-thinking-orbs';
```
