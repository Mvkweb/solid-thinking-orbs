# solid-thinking-orbs

SolidJS port and fork of Jakub Antalík's original [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs), adding new custom states and engine improvements. Dotted thought-orb loading indicators for AI & agent UIs. 13 hand-tuned animated states, each shipped at two purpose-tuned sizes, rendered on a plain 2D canvas — no WebGL.

[Live Demo](https://solid-thinking-orbs.vercel.app) · [Original Repository](https://github.com/Jakubantalik/thinking-orbs) · [Documentation](https://github.com/Mvkweb/solid-thinking-orbs/blob/master/DOCS.md)

## Install

```bash
npm install solid-thinking-orbs
```

## Quick start

```tsx
import { ThinkingOrb } from 'solid-thinking-orbs';

function Status() {
  return <ThinkingOrb state="searching" size={64} />;
}
```

## States

Thirteen verbs an agent can be doing, each a distinct animation:

```tsx
/* V1 Original States */
<ThinkingOrb state="working" />    {/* particles on tilted orbits */}
<ThinkingOrb state="searching" />  {/* a scan meridian sweeps a dotted globe */}
<ThinkingOrb state="solving" />    {/* bands scramble, then click back solved */}
<ThinkingOrb state="listening" />  {/* a waveform rolls through the rings */}
<ThinkingOrb state="composing" />  {/* an undulating multi-band sash */}
<ThinkingOrb state="shaping" />    {/* dotted outline: circle → triangle → square */}

/* V2 Custom States */
<ThinkingOrb state="syncing" />    {/* a fast-spinning 3D wireframe cylinder */}
<ThinkingOrb state="evolving" />   {/* a twisting double-helix ribbon */}
<ThinkingOrb state="building" />   {/* a 3D dotted wireframe cube tumbling */}
<ThinkingOrb state="hypercube" />  {/* a filled 3D cubic matrix with undulating surface waves */}
<ThinkingOrb state="conjuring" />  {/* a 3D logarithmic spiral triangle tumbling in space */}
<ThinkingOrb state="conjuring_static" /> {/* a static upright 3D spiral triangle with flowing energy */}
<ThinkingOrb state="assembling" /> {/* a 3D quantum cube whose particles explode outward & snap back */}
```

## Sizes

Two tuned presets — separate designs, not a scale factor. `64` for chat-avatar scale, `20` for inline-text scale. Each carries its own dot count, dot size and speed tuning:

```tsx
<ThinkingOrb state="working" size={64} />
<ThinkingOrb state="working" size={20} />
```

## Theme

Strictly monochrome — light ink for dark backgrounds, dark ink for light backgrounds — with the mode picked automatically from the host project:

```tsx
<ThinkingOrb theme="auto" />   {/* default — detects from the project */}
<ThinkingOrb theme="dark" />   {/* pin: light dots for dark backgrounds */}
<ThinkingOrb theme="light" />  {/* pin: dark dots for light backgrounds */}
```

`auto` resolves in three layers and updates live when any of them change:

1. an ancestor `data-theme="dark|light"` attribute or `dark`/`light` class (the Tailwind / shadcn convention), watched via `MutationObserver`;
2. otherwise `prefers-color-scheme`, subscribed for live OS theme switches;
3. SSR-safe — the canvas paints only on the client, after the theme has resolved.

## Other props

```tsx
<ThinkingOrb
  state="solving"
  size={20}
  speed={1.5}          // multiplier on the preset's baked speed
  paused={false}       // freeze on the current frame
  aria-label="Analysing repository…"  // overrides the per-state default
/>
```

All other `<canvas>` props (`class`, `style`, `data-*`, …) pass through natively.

## Accessibility & performance

- `role="img"` with a sensible per-state `aria-label` out of the box.
- `prefers-reduced-motion: reduce` renders a static representative frame — no animation — and still follows the live theme.
- Every instance pauses automatically when scrolled offscreen (`IntersectionObserver`) or when the tab is hidden, and resumes in phase — all instances share one clock.
- Plain 2D canvas arcs only: no `ctx.filter`, no SVG filters, no WebGL — the same pixels everywhere, cheap on low-end devices. Device-pixel-ratio capped at 2.

## Development

```bash
bun run dev          # Start showcase dev server
bun run build:lib    # Build library for publishing
bun run build:demo   # Build showcase site
```

## License

MIT © 2026 Mvkweb (SolidJS Port & Custom V2 States)  
Original Implementation MIT © 2026 Jakub Antalík
