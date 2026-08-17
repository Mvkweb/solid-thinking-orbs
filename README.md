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
- **Extended V2**: `syncing`, `evolving`, `building`, `hypercube`, `conjuring`, `conjuring_static`, `assembling`

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

// Web Search Component
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

## Development

```bash
bun run dev          # Start showcase dev server
bun run build:lib    # Build library for npm distribution
bun run build:demo   # Build showcase site
bun run typecheck    # Validate TypeScript types
```

---

## Credits & License

- SolidJS port, extended states, and integrated components by **Mvkweb**.
- Original Thinking Orbs concept and design by **Jakub Antalík**.
- Licensed under the [MIT License](LICENSE).
