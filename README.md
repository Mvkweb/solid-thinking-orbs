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

## 9. Bot Avatars

Animated bot avatars with living faces, blinking eyes, mouth expressions, and 3 distinct behavioral states (`default` [idle], `working`, `sleeping`). Drawn as 3D rounded extruded solids on high-performance 2D Canvas with four shading models (`plastic`, `crisp`, `smooth`, `flat`), cursor-following, jump physics, and whirl trails.

```tsx
import { BotAvatar } from 'solid-thinking-orbs';

// Idle clover bot with mouth & eyes
<BotAvatar type="clover" face="mouth" state="default" size={64} />

// Working state (hopping and spinning with wide smiles)
<BotAvatar type="star" state="working" size={64} />

// Sleeping state (closed eyes, rhythmic breathing pulses, nodding)
<BotAvatar type="cat" state="sleeping" size={64} />
```

### 33 Body Shapes
`clover`, `flower`, `triangle`, `square`, `blob`, `ghost`, `circle`, `drop`, `star`, `droid`, `mech`, `alien`, `hexagon`, `cat`, `cloud`, `pill`, `pebble`, `puddle`, `heart`, `jelly`, `shroom`, `grok`, `daemon`, `cubic`, `artix`, `arch`, `apple`, `kite`, `nixos`, `discord`, `flame`, `gem`, `grim`.

### Deep Configuration & Physics Tuning

Every bot avatar is deeply customizable with over 30 props for custom palettes, 3D lighting angles, jump physics, and spin trails:

```tsx
<BotAvatar
  type="grim"
  color="#E0E7FF"               // Custom body color
  color2="#7EBAE4"              // Secondary body color for dual-tone avatars (e.g. NixOS)
  ink="#1E1B4B"                 // Custom face ink (auto-contrasted by default)
  shading="plastic"             // "plastic" | "crisp" | "smooth" | "flat"
  light={315}                   // Light angle in degrees (0–360)
  highlight={1.8}               // Specular gloss intensity
  shadow={0.4}                  // Ambient occlusion depth
  depth={1.0}                   // Extrusion thickness
  whirl={1.5}                   // Kinetic energy whirl ribbon on spins
  jumpHeight={36}               // Jump altitude in body units
  jumpTime={0.5}                // In-air airtime duration
  jumpStretch={1.4}             // Velocity stretch factor
  jumpSquash={1.5}              // Take-off & landing compression
  jumpSquashEase="bouncy"       // "sharp" | "pulse" | "soft" | "bouncy"
  jumpSpin={2}                  // Number of aerial 360° flips
  jumpLean={12}                 // Aerodynamic lean angle
/>
```

See [DOCS.md](DOCS.md#9-bot-avatars) for the full 32-prop API reference table.

---

## 10. Animated Gradient (`WebGL2`)

High-performance GPU shader gradient backgrounds with trigonometric domain warping, multi-iteration swirl distortions, procedural pattern shapes, and optional noise grain texture overlays.

```tsx
import { AnimatedGradient } from 'solid-thinking-orbs';

// Preset background (Prism, Lava, Plasma, Pulse, Vortex, Mist)
<div class="relative h-[400px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
  <div class="z-10 text-white font-bold text-4xl">Your Hero Content</div>
  <AnimatedGradient config={{ preset: "Prism" }} />
</div>

// Deeply customized shader physics
<AnimatedGradient
  config={{
    preset: "custom",
    color1: "#1a1a2e",
    color2: "#16213e",
    color3: "#0f3460",
    rotation: 45,
    speed: 30,
    swirl: 60,
    swirlIterations: 10,
    distortion: 15,
    softness: 80,
    shape: "Checks",
    shapeSize: 35,
  }}
  noise={{ opacity: 0.2, scale: 1 }}
  radius="16px"
/>
```

See [DOCS.md](DOCS.md#10-animated-gradient-webgl2) for the full props and custom parameters table.

---

## 11. Light Rays (`WebGL2`)

High-performance GPU volumetric light ray shader backgrounds with dual-origin scatter directions, distance attenuation reach, and chromatic dual-color blending.

```tsx
import { LightRays } from 'solid-thinking-orbs';

// Single Color Hero Background
<div class="relative min-h-[400px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
  <LightRays
    intensity={13}
    rays={32}
    reach={16}
    position={50}
    raysColor={{ mode: "single", color: "#639AFF" }}
    backgroundColor="#000000"
    radius="16px"
  />
  <div class="z-10 text-white font-bold text-4xl">Your Hero Content</div>
</div>

// Multi Dual-Color Gradient Rays
<LightRays
  intensity={16}
  rays={36}
  reach={22}
  position={50}
  animation={{ animate: true, speed: 12 }}
  raysColor={{ mode: "multi", color1: "#2060DF", color2: "#FFFFFF" }}
  backgroundColor="#000000"
/>
```

See [DOCS.md](DOCS.md#11-light-rays-webgl2) for the full props and presets reference.

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
- Original Thinking Orbs concept, Liquid Gooey physics, and Bot Avatars by **Jakub Antalík**.
- GitHub Activity V2 design inspired by **Rare UI**.
- Licensed under the [MIT License](LICENSE).


