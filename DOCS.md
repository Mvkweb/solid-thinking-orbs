# Documentation

Comprehensive API and integration reference for `solid-thinking-orbs`.

---

## Table of Contents

1. [Installation](#installation)
2. [ThinkingOrb](#1-thinkingorb)
3. [Liquid Gooey Physics (`<Liquid>` & `<Liquid.Item>`)](#2-liquid-gooey-physics)
4. [Metal FX (`<MetalFx>`)](#3-metal-fx)
5. [Border Beam (`<BorderBeam>`)](#4-border-beam)
6. [Activity Heatmap (`<ActivityHeatmap>` & `<ActivityHeatmapV2>`)](#5-activity-heatmap)
7. [Agent Thinking (`<AgentThinking>`)](#6-agent-thinking)
8. [Web Search (`<WebSearch>`)](#7-web-search)
9. [To-do List (`<TodoList>`)](#8-to-do-list)
10. [Theme Resolution](#9-theme-resolution)
11. [TypeScript Exports Reference](#10-typescript-exports-reference)

---

## Installation

```bash
npm install solid-thinking-orbs
# or
pnpm add solid-thinking-orbs
# or
bun add solid-thinking-orbs
```

---

## 1. ThinkingOrb

Dotted thought-orb loading indicators for AI & agent UIs rendered on high-performance 2D canvas with automatic dark/light theme adaptation.

```tsx
import { ThinkingOrb } from 'solid-thinking-orbs';

// Avatar / Hero scale
<ThinkingOrb state="searching" size={64} />

// Inline text scale
<ThinkingOrb state="listening" size={20} />
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `state` | `OrbState` | `'working'` | Animation verb state (18 available states). |
| `size` | `OrbSize` (`64` \| `20`) | `64` | Tuned size preset in CSS pixels (`64` for avatar, `20` for inline). |
| `speed` | `number` | `1.0` | Speed multiplier relative to the preset's baked rate. |
| `paused` | `boolean` | `false` | When `true`, freezes the canvas on the current frame. |
| `theme` | `'auto'` \| `'dark'` \| `'light'` | `'auto'` | Color mode (light ink on dark backgrounds, dark ink on light). |
| `style` | `JSX.CSSProperties \| string` | `undefined` | Custom inline styling. |
| `ref` | `(el: HTMLCanvasElement) => void` | `undefined` | Ref callback for direct access to `<canvas>`. |

All standard HTML `<canvas>` attributes (`class`, `style`, `onClick`, `onMouseEnter`, `data-*`) pass through natively.

### Available States

#### Original V1 States
- `working`: Particles moving along tilted spherical orbits.
- `searching`: A scan meridian sweeping across a dotted globe.
- `solving`: Bands scramble in quarter turns, then snap back into alignment.
- `listening`: A continuous audio waveform rolling through latitude rings.
- `composing`: An undulating multi-band ribbon sash.
- `shaping`: A dotted outline morphing between circle, triangle, and square.

#### Extended V2 States
- `syncing`: Fast-spinning 3D wireframe cylinder.
- `evolving`: Twisting double-helix ribbon.
- `building`: 3D dotted wireframe cube tumbling in space.
- `hypercube`: Filled 3D cubic matrix with undulating surface waves.
- `conjuring`: Logarithmic 3D spiral triangle tumbling in space.
- `conjuring_static`: Upright 3D spiral triangle with flowing energy pulses.
- `assembling`: 3D quantum cube whose particles explode outward and snap back.
- `blooming`: Concentric geometric petals expanding and pulsing.
- `glacio`: Crystalline icy geometry refractive particles.
- `flower`: 3D organic flower petals undulating in harmonic motion.
- `sandglass`: Hourglass particle flow cascading between dual chambers.
- `sand_orbs`: Dual orbiting sand vortex clusters.

### Styling & CSS Filters

```tsx
/* Tint with CSS filters */
<ThinkingOrb
  state="hypercube"
  style={{ filter: 'hue-rotate(190deg) saturate(6) brightness(1.2)' }}
/>

/* Ambient Drop Shadow Glow */
<ThinkingOrb
  state="conjuring"
  style={{ filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))' }}
/>
```

---

## 2. Liquid Gooey Physics

Hardware-accelerated fluid UI physics and SVG silhouette generation. Enables fluid droplet splitting, trailing velocity stretch, and contact melting.

```tsx
import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={6} contrast={18} fill="#ffffff" shadow="0 2px 8px rgba(0,0,0,0.1)">
  <Liquid.Item x={open() ? -54 : 0} y={open() ? -34 : 0} transition={{ duration: 550, ease: 'bouncy' }}>
    <button class="pm-btn pm-sat">File</button>
  </Liquid.Item>
  <Liquid.Item x={0} y={open() ? -64 : 0} transition={{ duration: 550, ease: 'bouncy' }} delay={40}>
    <button class="pm-btn pm-sat">Image</button>
  </Liquid.Item>
  <Liquid.Item x={open() ? 54 : 0} y={open() ? -34 : 0} transition={{ duration: 550, ease: 'bouncy' }} delay={80}>
    <button class="pm-btn pm-sat">Folder</button>
  </Liquid.Item>
  <Liquid.Item>
    <button class="pm-btn pm-main" onClick={toggle}>+</button>
  </Liquid.Item>
</Liquid>
```

### `<Liquid>` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `blur` | `number` | `6` | Goo blur sigma in px — controls how far apart pieces start bridging. |
| `contrast` | `number` | `18` | Alpha-contrast slope — controls edge sharpness of the liquid surface. |
| `fill` | `string` | `'#fff'` | Fill color of the liquid surface (CSS color or `var(...)`). |
| `shadow` | `string` | `undefined` | Merged silhouette shadow (`box-shadow` or `drop-shadow` syntax). |
| `filterPadding` | `number` | `24` | Extra filter slack in px for traveling blobs. |

### `<Liquid.Item>` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `effect` | `'morph' \| 'move'` | `'morph'` | Dynamic physics mode. |
| `x` | `number` | `0` | Coordinate translation X in px. |
| `y` | `number` | `0` | Coordinate translation Y in px. |
| `scale` | `number` | `1` | Transform scale multiplier. |
| `transition` | `Transition` | `undefined` | Spring/easing config (`{ duration, ease, stiffness, damping }`). |
| `delay` | `number` | `0` | Transition start delay in ms. |
| `morph` | `MorphTuning` | `undefined` | Configuration for shape bridging, speed, and bounce. |
| `move` | `MoveTuning` | `undefined` | Configuration for rubber trailing (`springiness`, `wobble`, `stretch`, `trail`). |
| `dissolve` | `boolean \| number \| DissolveOptions` | `undefined` | Contact melt erosion with turbulence displacement. |

---

## 3. Metal FX

Liquid metal WebGL shader ring for buttons, badges, and icon controls with realtime luminance-driven catch-glow and proximity reflections.

```tsx
import { MetalFx } from 'solid-thinking-orbs';

<MetalFx preset="blueberry" variant="button">
  <button class="h-10 px-6 rounded-full bg-zinc-900 text-white">
    Upgrade to Pro
  </button>
</MetalFx>

<MetalFx preset="chromatic" variant="circle">
  <button class="h-10 w-10 rounded-full bg-zinc-900 text-white">
    ↑
  </button>
</MetalFx>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `preset` | `MetalFxPreset` | `'chromatic'` | Color scheme (`chromatic`, `silver`, `gold`, `blueberry`, `rose`, `copper`). |
| `variant` | `'button' \| 'circle'` | `'button'` | Geometry variant (`button` for pills/rectangles, `circle` for circular buttons). |
| `theme` | `'auto' \| 'dark' \| 'light'` | `'auto'` | Theme mode for metallic reflection contrast. |
| `strength` | `number` | `1.0` | Opacity and glow multiplier (0.0 to 1.0). |
| `paused` | `boolean` | `false` | Pauses shader rendering loop. |
| `disableGlow` | `boolean` | `false` | Disables outer edge specular glow highlights. |
| `reflectionTargets` | `HTMLElement[] \| (() => HTMLElement[])` | `undefined` | Elements that receive ambient metallic light reflections. |
| `borderRadius` | `number` | *Auto-detected* | Custom corner radius in px. |

---

## 4. Border Beam

Animated glowing border effect tracing element edges with radial/conic gradients, breathing pulse modes, and traveling spotlights.

```tsx
import { BorderBeam } from 'solid-thinking-orbs';

// Contained Breathing Glow
<BorderBeam size="pulse-inner" colorVariant="ocean" borderRadius={16}>
  <div class="p-6 bg-zinc-900 rounded-2xl">Content</div>
</BorderBeam>

// Outward Bloom Halo
<BorderBeam size="pulse-outside" colorVariant="colorful" borderRadius={16}>
  <div class="p-6 bg-zinc-900 rounded-2xl">Content</div>
</BorderBeam>

// Bottom Traveling Spotlight
<BorderBeam size="line" colorVariant="sunset" borderRadius={16}>
  <div class="p-6 bg-zinc-900 rounded-2xl">Content</div>
</BorderBeam>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `BorderBeamSize` | `'md'` | Beam geometry: `'pulse-inner'`, `'pulse-outside'`, `'md'`, `'sm'`, `'line'`. |
| `colorVariant` | `BorderBeamColorVariant` | `'colorful'` | Palette: `'colorful'`, `'rainbow'`, `'ocean'`, `'sunset'`, `'mono'`. |
| `theme` | `'auto' \| 'dark' \| 'light'` | `'dark'` | Color contrast mode. |
| `duration` | `number` | *Per-size* | Animation loop cycle duration in seconds. |
| `active` | `boolean` | `true` | Toggles animation with smooth fade-in/fade-out. |
| `borderRadius` | `number` | *Auto-detected* | Corner radius in px. |
| `strength` | `number` | `1.0` | Beam opacity/intensity factor (0.0 to 1.0). |

---

## 5. Activity Heatmap

GitHub activity visualization cards with staggered animations, tooltips, and expandable repository breakdown drawers.

### V2: Rare UI GitHub Activity Card

```tsx
import { ActivityHeatmapV2, type RepoContribution } from 'solid-thinking-orbs';

const repos: RepoContribution[] = [
  { name: 'Option 1', count: 842 },
  { name: 'Option 2', count: 624 },
  { name: 'Option 3', count: 397 },
];

<ActivityHeatmapV2
  totalContributions={1863}
  year={2025}
  weeks={26}
  repos={repos}
  accentColor="green"
/>
```

### V1: Matrix Grid Heatmap

```tsx
import { ActivityHeatmap } from 'solid-thinking-orbs';

<ActivityHeatmap accentColor="green" weeks={20} />
<ActivityHeatmap accentColor="blue" weeks={20} />
<ActivityHeatmap accentColor="sunset" weeks={20} />
```

### Props (`ActivityHeatmapV2Props`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `username` | `string` | `undefined` | GitHub login to fetch real contribution calendar and top repos. |
| `contributions` | `Contribution[]` | *Demo mock* | Custom daily contribution records. |
| `repos` | `RepoContribution[]` | *Demo mock* | Custom repository contribution breakdown. |
| `totalContributions` | `number` | *Auto-summed* | Total contributions override. |
| `year` | `number \| string` | *Current* | Display year in heading. |
| `weeks` | `number` | `26` (or from months) | Number of weeks to render. |
| `cellSize` | `number` | `11` | Size of each grid cell in px. |
| `accent` / `accentColor` | `string` | `'#39d353'` | Accent color or palette key. |
| `customDarkShades` | `[string, string, string, string, string]` | `undefined` | 5-step dark mode color scale. |
| `customLightShades` | `[string, string, string, string, string]` | `undefined` | 5-step light mode color scale. |
| `showMonths` | `boolean` | `true` | Displays month labels header. |
| `defaultOpen` | `boolean` | `false` | Initial expanded state of repo breakdown drawer. |
| `theme` | `'auto' \| 'dark' \| 'light'` | `'auto'` | Dark/light color theme. |

---

## 6. Agent Thinking

Collapsible multi-line reasoning stream displaying step-by-step thoughts from LLMs and agentic workflows with live elapsed timer.

```tsx
import { AgentThinking } from 'solid-thinking-orbs';

<AgentThinking
  sentences={[
    "Reading the request and locating the middleware...",
    "Validating jwt verification parameters...",
    "Confirming signing secret isolation...",
    "Drafting the patch with regression tests..."
  ]}
  showTimer={true}
  autoCollapse={true}
  onComplete={() => console.log('Thinking finished!')}
/>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `sentences` | `string[]` | *Default demo thoughts* | List of reasoning steps to reveal sequentially. |
| `delays` | `number[]` | `[700, 900, 800, ...]` | Delay in ms before revealing each subsequent thought. |
| `defaultOpen` | `boolean` | `true` | Initial expanded state of the thought viewport. |
| `showTimer` | `boolean` | `true` | Shows live elapsed seconds in header ("Thinking for 4s..."). |
| `autoCollapse` | `boolean` | `true` | Automatically collapses the thought box upon completion. |
| `onComplete` | `() => void` | `undefined` | Callback fired when all thoughts are revealed. |

---

## 7. Web Search

Live search radar component displaying real-time URL discovery and web queries for search-augmented agents.

```tsx
import { WebSearch } from 'solid-thinking-orbs';

<WebSearch
  query="JWT security best practices and authorization flaws"
  sites={[
    { title: "JWT verification best practices", url: "auth0.com/blog/jwt-security", discover: 600, finish: 2400 },
    { title: "OWASP Node.js authentication guide", url: "owasp.org/www-project-nodejs", discover: 1600, finish: 4000 }
  ]}
  loop={true}
/>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `query` | `string` | *Default query* | Search query text displayed in header. |
| `sites` | `WebSearchSite[]` | *Default mock sites* | Discovered websites with `{ title, url, discover, finish }`. |
| `defaultOpen` | `boolean` | `true` | Initial expanded state of results list. |
| `loop` | `boolean` | `true` | Continuously re-runs the discovery simulation. |

---

## 8. To-do List

Cursor-style agent task list: a collapsible card showing completed, active in-progress, and pending item states, with a progress pie ring and rolling counter numbers.

```tsx
import { TodoList } from 'solid-thinking-orbs';

<TodoList
  labels={[
    "Scaffold project structure",
    "Build component registry",
    "Implement entitlement gating",
    "Wire up Stripe checkout",
    "Polish landing page"
  ]}
  stepMs={2250}
  startDelay={700}
  loop={true}
  onComplete={() => console.log('All tasks finished!')}
/>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `labels` | `string[]` | *5 default tasks* | Task item descriptions. |
| `stepMs` | `number` | `2250` | Milliseconds spent on each task before marking it complete. |
| `startDelay` | `number` | `700` | Delay in ms before starting the first task. |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state. |
| `loop` | `boolean` | `true` | Automatically restarts the task flow after all tasks finish. |
| `onComplete` | `() => void` | `undefined` | Callback fired when the final task is completed. |

---

## 9. Theme Resolution

All components support universal dark/light theme resolution:

1. **Explicit**: Pass `theme="dark"` or `theme="light"` to force a theme.
2. **Auto**: When `theme="auto"` is set, the component:
   - Watches ancestor DOM elements for `data-theme="dark|light"` or `class="dark|light"`.
   - Falls back to `(prefers-color-scheme: dark)`.
   - Is SSR-safe (resolves on the client before initial paint).

---

## 10. TypeScript Exports Reference

```ts
import type {
  // ThinkingOrb
  OrbState,
  OrbSize,
  OrbTheme,
  ThinkingOrbProps,

  // BorderBeam
  BorderBeamProps,
  BorderBeamColorVariant,
  BorderBeamSize,
  BorderBeamTheme,

  // MetalFx
  MetalFxProps,
  MetalFxPreset,
  MetalFxTheme,
  MetalFxVariant,

  // Liquid Gooey
  LiquidProps,
  LiquidEffect,
  LiquidItemProps,
  MorphTuning,
  MoveTuning,
  DissolveOptions,
  EvolveOptions,
  MoveOptions,
  Transition,

  // ActivityHeatmap
  ActivityHeatmapProps,
  ActivityHeatmapV2Props,
  RepoContribution,
  Contribution,
  ContributionLevel,
  HeatmapAccent,

  // AgentThinking
  AgentThinkingProps,

  // WebSearch
  WebSearchProps,
  WebSearchSite,

  // TodoList
  TodoListProps,
} from 'solid-thinking-orbs';
```

