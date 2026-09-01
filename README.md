# solid-thinking-orbs

A suite of premium SolidJS UI animations and micro-interactions for AI & agent interfaces. Includes **Thinking Orbs** dotted loading indicators, **Metal FX** liquid metal WebGL shader rings, **Border Beam** dynamic traveling & breathing glowing borders, **Agent Thinking** multi-line reasoning streams, and **Web Search** live radar discovery indicators.

[Live Demo](https://solid-thinking-orbs.vercel.app) · [GitHub Repository](https://github.com/Mvkweb/solid-thinking-orbs)

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

## 1. Thinking Orb

Dotted thought-orb loading indicators for AI & agent UIs with 13 hand-crafted animated states. Rendered on high-performance 2D canvas with automatic dark/light theme adaptation.

```tsx
import { ThinkingOrb } from 'solid-thinking-orbs';

// Avatar / Hero scale
<ThinkingOrb state="searching" size={64} />

// Inline text scale
<ThinkingOrb state="listening" size={20} />
```

### States
- **Original V1**: `working`, `searching`, `solving`, `listening`, `composing`, `shaping`
- **Extended V2**: `syncing`, `evolving`, `building`, `hypercube`, `conjuring`, `conjuring_static`, `assembling`, `blooming`

---

## 2. Metal FX (`WebGL`)

Liquid metal WebGL shader ring for buttons, badges, and icon controls with realtime luminance-driven catch-glow and proximity reflections on neighboring elements.

```tsx
import { MetalFx } from 'solid-thinking-orbs';

// Pill Button with Blueberry preset
<MetalFx preset="blueberry" variant="button">
  <button class="h-10 px-6 rounded-full bg-zinc-900 text-white">
    Upgrade to Pro
  </button>
</MetalFx>

// Icon Button with Chromatic preset
<MetalFx preset="chromatic" variant="circle">
  <button class="h-10 w-10 rounded-full bg-zinc-900 text-white">
    ↑
  </button>
</MetalFx>
```

### Presets
- `chromatic`: Rainbow spectrum
- `silver`: Polished chrome
- `gold`: Warm metallic gold
- `blueberry`: Deep indigo & electric blue
- `rose`: Vivid crimson & pink
- `copper`: Warm amber & fiery orange

---

## 3. Border Beam

Animated glowing border effect that traces element edges with smooth radial and conic gradients, breathing pulse modes, and traveling spotlights.

```tsx
import { BorderBeam } from 'solid-thinking-orbs';

// Contained Breathing Glow
<div class="relative w-96 h-48 rounded-2xl bg-zinc-900">
  <BorderBeam size="pulse-inner" colorVariant="ocean" borderRadius={16}>
    <div class="p-6">Content</div>
  </BorderBeam>
</div>

// Outward Bloom Halo
<BorderBeam size="pulse-outside" colorVariant="colorful" borderRadius={16}>
  <div class="p-6">Content with outward halo</div>
</BorderBeam>

// Traveling Spotlight Line
<BorderBeam size="line" colorVariant="sunset" borderRadius={16}>
  <div class="p-6">Bottom traveling glow</div>
</BorderBeam>
```

### Size Presets
- `pulse-inner`: Contained breathing glow
- `pulse-outside`: Radiating outward bloom halo
- `md`: Full rotating perimeter beam
- `sm`: Compact button-sized glow
- `line`: Bottom traveling spotlight with breathing spike

---

## 4. Agent Thinking

Collapsible multi-line reasoning stream displaying step-by-step thoughts from LLMs and agentic workflows with live elapsed timer.

```tsx
import { AgentThinking } from 'solid-thinking-orbs';

<AgentThinking
  showTimer={true}
  autoCollapse={true}
  onComplete={() => console.log('Thinking finished!')}
/>
```

---

## 5. Web Search

Live search radar component displaying real-time URL discovery and web queries for search-augmented agents.

```tsx
import { WebSearch } from 'solid-thinking-orbs';

<WebSearch
  query="JWT security best practices and authorization flaws"
  loop={true}
/>
```

---

## 6. To-do List

A Cursor-style to-do list for agent reasoning: a collapsible card showing completed, active in-progress, and pending item states, with a progress pie ring and rolling counter numbers.

```tsx
import { TodoList } from 'solid-thinking-orbs';

<TodoList
  labels={[
    "Scaffold the project structure",
    "Build the component registry",
    "Implement entitlement gating",
    "Wire up Stripe checkout",
    "Polish the landing page",
  ]}
  stepMs={2250}
/>
```

---

## 7. Activity Heatmap (`V1 & V2`)

Interactive GitHub activity cards with staggered animations, tooltips, and expandable repository breakdown drawers.

### V2: Rare UI GitHub Activity Card
1:1 port of Rare UI's expandable activity heatmap with month labels, staggered column entrance, and spring-animated breakdown list.

```tsx
import { ActivityHeatmapV2, type RepoContribution } from 'solid-thinking-orbs';

const repos: RepoContribution[] = [
  { name: 'solid-thinking-orbs', count: 320, color: '#38bdf8' },
  { name: 'antigravity-core', count: 184, color: '#a855f7' },
  { name: 'flow-engine', count: 76, color: '#34d399' },
];

<ActivityHeatmapV2
  username="Mvkweb"
  totalContributions={580}
  topRepos={repos}
  weeks={20}
/>
```

### V1: Matrix Grid Heatmap
Classic activity heatmaps with rounded cell grids and palette presets.

```tsx
import { ActivityHeatmap } from 'solid-thinking-orbs';

<ActivityHeatmap accentColor="green" weeks={20} />
<ActivityHeatmap accentColor="blue" weeks={20} />
<ActivityHeatmap accentColor="purple" weeks={20} />
```

---

## 8. Liquid Gooey Physics

A SolidJS port of Jakub Antalík's `liquid-gooey` library. Renders a hardware-accelerated SVG silhouette layer with real `box-shadow` filter pipelines behind crisp interactive UI content.

```tsx
import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={6} contrast={18} fill="#ffffff" shadow="0 2px 8px rgba(0,0,0,0.1)">
  {/* Satellite buttons that split like fluid droplets */}
  <Liquid.Item x={open() ? -54 : 0} y={open() ? -34 : 0} transition={{ duration: 550, ease: 'bouncy' }}>
    <button class="pm-btn pm-sat">File</button>
  </Liquid.Item>
  <Liquid.Item x={0} y={open() ? -64 : 0} transition={{ duration: 550, ease: 'bouncy' }} delay={40}>
    <button class="pm-btn pm-sat">Image</button>
  </Liquid.Item>
  <Liquid.Item x={open() ? 54 : 0} y={open() ? -34 : 0} transition={{ duration: 550, ease: 'bouncy' }} delay={80}>
    <button class="pm-btn pm-sat">Folder</button>
  </Liquid.Item>

  {/* Main Trigger Button */}
  <Liquid.Item>
    <button class="pm-btn pm-main" onClick={toggle}>+</button>
  </Liquid.Item>
</Liquid>
```

### Effects
- **`morph`**: Touching pieces merge with organic fluid bridges and cross-blur content transitions (`shape`, `bounce`, `speed`).
- **`move`**: Liquid rubber trailing moving elements with velocity stretch and trailing droplet tails (`springiness`, `wobble`, `stretch`, `trail`).
- **`dissolve`**: Contact melt with turbulence displacement, two-liquid mixing erosion, and directional flow gravity.

---

## Development

```bash
bun run dev          # Start showcase dev server
bun run build:lib    # Build library for npm distribution
bun run build:demo   # Build showcase site
bun run typecheck    # Validate TypeScript types
```

---

## Credits & License

- SolidJS port, extended V2 states, and additional UI modules by **Mvkweb**.
- Original Thinking Orbs concept & Liquid Gooey physics by **Jakub Antalík**.
- GitHub Activity V2 design inspired by **Rare UI**.
- Licensed under the [MIT License](LICENSE).

