import { createSignal, createMemo, For, Show } from 'solid-js';
import { ActivityHeatmap, ActivityHeatmapV2 } from '../activity-heatmap';
import type { HeatmapAccent } from '../activity-heatmap';
import { CopyButton } from './CopyButton';
import { cn } from '../lib/utils';

export interface ColorFamilyVariant {
  id: string;
  badge: string;
  darkShades: [string, string, string, string, string];
  lightShades: [string, string, string, string, string];
  badgeBg: string;
  badgeText: string;
  total: number;
  seed: number;
}

export interface ColorFamily {
  id: HeatmapAccent;
  label: string;
  buttonSwatch: [string, string, string, string];
  variants: ColorFamilyVariant[];
}

export const COLOR_FAMILIES: ColorFamily[] = [
  {
    id: 'purple',
    label: 'Violet Pulse',
    buttonSwatch: ['#3b0764', '#581c87', '#9333ea', '#c084fc'],
    variants: [
      {
        id: 'violet-pulse',
        badge: 'Violet Pulse',
        darkShades: ['#181524', '#3b0764', '#581c87', '#7e22ce', '#c084fc'],
        lightShades: ['#faf5ff', '#e9d5ff', '#c084fc', '#9333ea', '#581c87'],
        badgeBg: 'bg-purple-500/10 dark:bg-purple-500/15',
        badgeText: 'text-purple-600 dark:text-purple-400',
        total: 788,
        seed: 3,
      },
      {
        id: 'deep-amethyst',
        badge: 'Deep Amethyst',
        darkShades: ['#130f1c', '#2e0854', '#4c1d95', '#6b21a8', '#a855f7'],
        lightShades: ['#f3e8ff', '#d8b4fe', '#a855f7', '#7e22ce', '#3b0764'],
        badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
        badgeText: 'text-indigo-600 dark:text-indigo-400',
        total: 1042,
        seed: 31,
      },
      {
        id: 'electric-orchid',
        badge: 'Electric Orchid',
        darkShades: ['#1a1026', '#4a044e', '#701a75', '#a21caf', '#e879f9'],
        lightShades: ['#fdf4ff', '#f5d0fe', '#e879f9', '#c026d3', '#701a75'],
        badgeBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/15',
        badgeText: 'text-fuchsia-600 dark:text-fuchsia-400',
        total: 924,
        seed: 32,
      },
      {
        id: 'soft-lavender',
        badge: 'Soft Lavender',
        darkShades: ['#15131a', '#2a2238', '#473b5e', '#786899', '#b8a9d9'],
        lightShades: ['#fbfaff', '#ede9fe', '#c4b5fd', '#8b5cf6', '#4c1d95'],
        badgeBg: 'bg-violet-500/10 dark:bg-violet-500/15',
        badgeText: 'text-violet-600 dark:text-violet-400',
        total: 615,
        seed: 33,
      },
    ],
  },
  {
    id: 'green',
    label: 'Emerald Matrix',
    buttonSwatch: ['#064e3b', '#047857', '#10b981', '#34d399'],
    variants: [
      {
        id: 'emerald-matrix',
        badge: 'Emerald Matrix',
        darkShades: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
        lightShades: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        badgeText: 'text-emerald-600 dark:text-emerald-400',
        total: 956,
        seed: 1,
      },
      {
        id: 'deep-forest',
        badge: 'Deep Forest',
        darkShades: ['#0d1712', '#052e16', '#14532d', '#166534', '#22c55e'],
        lightShades: ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#14532d'],
        badgeBg: 'bg-green-500/10 dark:bg-green-500/15',
        badgeText: 'text-green-600 dark:text-green-400',
        total: 1120,
        seed: 11,
      },
      {
        id: 'neon-mint',
        badge: 'Neon Mint',
        darkShades: ['#0c1b18', '#042f2e', '#115e59', '#0d9488', '#2dd4bf'],
        lightShades: ['#f0fdfa', '#99f6e4', '#2dd4bf', '#0f766e', '#115e59'],
        badgeBg: 'bg-teal-500/10 dark:bg-teal-500/15',
        badgeText: 'text-teal-600 dark:text-teal-400',
        total: 874,
        seed: 12,
      },
      {
        id: 'sage-glow',
        badge: 'Sage Glow',
        darkShades: ['#121814', '#1f2b23', '#34473b', '#577562', '#86a893'],
        lightShades: ['#f4f7f5', '#dce7df', '#86a893', '#476352', '#1f2b23'],
        badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        badgeText: 'text-emerald-600 dark:text-emerald-400',
        total: 642,
        seed: 13,
      },
    ],
  },
  {
    id: 'blue',
    label: 'Sky Blue Grid',
    buttonSwatch: ['#0c4a6e', '#0369a1', '#0284c7', '#38bdf8'],
    variants: [
      {
        id: 'sky-blue',
        badge: 'Sky Blue Grid',
        darkShades: ['#141b24', '#0c4a6e', '#0369a1', '#0284c7', '#38bdf8'],
        lightShades: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985'],
        badgeBg: 'bg-sky-500/10 dark:bg-sky-500/15',
        badgeText: 'text-sky-600 dark:text-sky-400',
        total: 822,
        seed: 2,
      },
      {
        id: 'deep-ocean',
        badge: 'Deep Ocean',
        darkShades: ['#0f172a', '#172554', '#1e3a8a', '#1d4ed8', '#60a5fa'],
        lightShades: ['#eff6ff', '#bfdbfe', '#60a5fa', '#1d4ed8', '#1e3a8a'],
        badgeBg: 'bg-blue-500/10 dark:bg-blue-500/15',
        badgeText: 'text-blue-600 dark:text-blue-400',
        total: 1085,
        seed: 21,
      },
      {
        id: 'electric-cyan',
        badge: 'Electric Cyan',
        darkShades: ['#082026', '#0e3b43', '#155e75', '#0891b2', '#22d3ee'],
        lightShades: ['#ecfeff', '#a5f3fc', '#22d3ee', '#0891b2', '#155e75'],
        badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
        badgeText: 'text-cyan-600 dark:text-cyan-400',
        total: 940,
        seed: 22,
      },
      {
        id: 'steel-mist',
        badge: 'Steel Mist',
        darkShades: ['#12171d', '#1e2833', '#334152', '#526882', '#8da2bd'],
        lightShades: ['#f3f6f9', '#dbe3eb', '#8da2bd', '#44576d', '#1e2833'],
        badgeBg: 'bg-slate-500/10 dark:bg-slate-500/15',
        badgeText: 'text-slate-600 dark:text-slate-400',
        total: 670,
        seed: 23,
      },
    ],
  },
  {
    id: 'sunset',
    label: 'Sunset Matrix',
    buttonSwatch: ['#7c2d12', '#c2410c', '#f97316', '#fdba74'],
    variants: [
      {
        id: 'sunset-matrix',
        badge: 'Sunset Matrix',
        darkShades: ['#1f1614', '#431407', '#7c2d12', '#c2410c', '#fb923c'],
        lightShades: ['#fff7ed', '#fed7aa', '#fb923c', '#ea580c', '#9a3412'],
        badgeBg: 'bg-orange-500/10 dark:bg-orange-500/15',
        badgeText: 'text-orange-600 dark:text-orange-400',
        total: 890,
        seed: 4,
      },
      {
        id: 'solar-flare',
        badge: 'Solar Flare',
        darkShades: ['#1c130c', '#451a03', '#78350f', '#b45309', '#f97316'],
        lightShades: ['#fffbeb', '#fde68a', '#f97316', '#c2410c', '#78350f'],
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
        badgeText: 'text-amber-600 dark:text-amber-400',
        total: 1030,
        seed: 41,
      },
      {
        id: 'burnt-sienna',
        badge: 'Burnt Sienna',
        darkShades: ['#221111', '#500724', '#831843', '#be123c', '#fb7185'],
        lightShades: ['#fff1f2', '#fecdd3', '#fb7185', '#be123c', '#831843'],
        badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
        badgeText: 'text-rose-600 dark:text-rose-400',
        total: 965,
        seed: 42,
      },
      {
        id: 'golden-peach',
        badge: 'Golden Peach',
        darkShades: ['#1a1512', '#2d221b', '#4d3a2d', '#7d614b', '#bfa18a'],
        lightShades: ['#faf6f2', '#ede2d7', '#bfa18a', '#694f3b', '#2d221b'],
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
        badgeText: 'text-amber-600 dark:text-amber-400',
        total: 620,
        seed: 43,
      },
    ],
  },
  {
    id: 'rose',
    label: 'Rose Pulse',
    buttonSwatch: ['#881337', '#be123c', '#f43f5e', '#fbcfe8'],
    variants: [
      {
        id: 'rose-pulse',
        badge: 'Rose Pulse',
        darkShades: ['#201419', '#4c0519', '#881337', '#be123c', '#fb7185'],
        lightShades: ['#fff1f2', '#fecdd3', '#fb7185', '#e11d48', '#9f1239'],
        badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
        badgeText: 'text-rose-600 dark:text-rose-400',
        total: 845,
        seed: 5,
      },
      {
        id: 'ruby-ember',
        badge: 'Ruby Ember',
        darkShades: ['#1c0c11', '#3f0414', '#700926', '#9f1239', '#f43f5e'],
        lightShades: ['#fff1f2', '#fda4af', '#f43f5e', '#9f1239', '#4c0519'],
        badgeBg: 'bg-red-500/10 dark:bg-red-500/15',
        badgeText: 'text-red-600 dark:text-red-400',
        total: 1060,
        seed: 51,
      },
      {
        id: 'hot-fuchsia',
        badge: 'Hot Fuchsia',
        darkShades: ['#200e1f', '#4a044e', '#701a75', '#c026d3', '#f472b6'],
        lightShades: ['#fdf2f8', '#fbcfe8', '#f472b6', '#db2777', '#831843'],
        badgeBg: 'bg-pink-500/10 dark:bg-pink-500/15',
        badgeText: 'text-pink-600 dark:text-pink-400',
        total: 910,
        seed: 52,
      },
      {
        id: 'blush-velvet',
        badge: 'Blush Velvet',
        darkShades: ['#1a1316', '#2b1c23', '#49313c', '#755262', '#b38ca0'],
        lightShades: ['#fbf6f8', '#eddfe6', '#b38ca0', '#634252', '#2b1c23'],
        badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
        badgeText: 'text-rose-600 dark:text-rose-400',
        total: 590,
        seed: 53,
      },
    ],
  },
  {
    id: 'amber',
    label: 'Amber Grid',
    buttonSwatch: ['#78350f', '#b45309', '#f59e0b', '#fde68a'],
    variants: [
      {
        id: 'amber-grid',
        badge: 'Amber Grid',
        darkShades: ['#1f1a12', '#451a03', '#78350f', '#b45309', '#fbbf24'],
        lightShades: ['#fffbeb', '#fde68a', '#fbbf24', '#d97706', '#78350f'],
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
        badgeText: 'text-amber-600 dark:text-amber-400',
        total: 912,
        seed: 6,
      },
      {
        id: 'pure-gold',
        badge: 'Pure Gold',
        darkShades: ['#1b160a', '#3d2e05', '#6b4f08', '#a1780d', '#eab308'],
        lightShades: ['#fefce8', '#fef08a', '#eab308', '#a1780d', '#593f05'],
        badgeBg: 'bg-yellow-500/10 dark:bg-yellow-500/15',
        badgeText: 'text-yellow-600 dark:text-yellow-400',
        total: 1090,
        seed: 61,
      },
      {
        id: 'copper-bronze',
        badge: 'Copper Bronze',
        darkShades: ['#20150d', '#4d2008', '#7c3a0d', '#b45309', '#f97316'],
        lightShades: ['#fff7ed', '#fed7aa', '#f97316', '#b45309', '#7c3a0d'],
        badgeBg: 'bg-orange-500/10 dark:bg-orange-500/15',
        badgeText: 'text-orange-600 dark:text-orange-400',
        total: 935,
        seed: 62,
      },
      {
        id: 'desert-sand',
        badge: 'Desert Sand',
        darkShades: ['#1a1712', '#2a241b', '#473d2e', '#73644b', '#b39f82'],
        lightShades: ['#f9f7f4', '#eae3d8', '#b39f82', '#61533c', '#2a241b'],
        badgeBg: 'bg-stone-500/10 dark:bg-stone-500/15',
        badgeText: 'text-stone-600 dark:text-stone-400',
        total: 625,
        seed: 63,
      },
    ],
  },
  {
    id: 'mono',
    label: 'Monochrome',
    buttonSwatch: ['#2e2e33', '#5c5c66', '#9e9eb0', '#ffffff'],
    variants: [
      {
        id: 'mono-carbon',
        badge: 'Carbon Pure',
        darkShades: ['#141416', '#2e2e33', '#5c5c66', '#9e9eb0', '#ffffff'],
        lightShades: ['#f4f4f5', '#cbd5e1', '#94a3b8', '#475569', '#0f172a'],
        badgeBg: 'bg-zinc-500/10 dark:bg-zinc-500/15',
        badgeText: 'text-zinc-600 dark:text-zinc-300',
        total: 760,
        seed: 7,
      },
      {
        id: 'mono-cool-slate',
        badge: 'Cool Slate',
        darkShades: ['#12151a', '#222b38', '#475569', '#94a3b8', '#e2e8f0'],
        lightShades: ['#f8fafc', '#cbd5e1', '#64748b', '#334155', '#0f172a'],
        badgeBg: 'bg-slate-500/10 dark:bg-slate-500/15',
        badgeText: 'text-slate-600 dark:text-slate-300',
        total: 1050,
        seed: 71,
      },
      {
        id: 'mono-warm-titanium',
        badge: 'Warm Titanium',
        darkShades: ['#171614', '#302c27', '#665e55', '#aba194', '#faf8f5'],
        lightShades: ['#faf8f5', '#e7e2da', '#a89f92', '#574f45', '#1c1917'],
        badgeBg: 'bg-stone-500/10 dark:bg-stone-500/15',
        badgeText: 'text-stone-600 dark:text-stone-300',
        total: 885,
        seed: 72,
      },
      {
        id: 'mono-noir',
        badge: 'High-Contrast Noir',
        darkShades: ['#101012', '#33333a', '#6b6b78', '#b5b5c4', '#ffffff'],
        lightShades: ['#ffffff', '#d4d4d8', '#71717a', '#27272a', '#000000'],
        badgeBg: 'bg-neutral-500/10 dark:bg-neutral-500/15',
        badgeText: 'text-neutral-600 dark:text-neutral-300',
        total: 580,
        seed: 73,
      },
    ],
  },
];

const tabBtnBase = 'flex items-center justify-center h-9 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] font-normal leading-[14px] cursor-pointer transition-all duration-200 whitespace-nowrap [-webkit-tap-highlight-color:transparent] hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2';

export function TabBtn(props: { active: boolean; children: any; onClick: () => void; class?: string }) {
  return (
    <button
      class={cn(
        tabBtnBase,
        props.active
          ? 'bg-(--tab-active-bg) text-(--tab-active-color) shadow-(--tab-active-shadow) scale-[1.02]'
          : 'bg-(--tab-bg) text-(--tab-color)',
        props.class
      )}
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function ActivityHeatmapShowcase() {
  const [version, setVersion] = createSignal<'v1' | 'v2'>('v2');
  const [viewMode, setViewMode] = createSignal<'grid' | 'single' | 'wide'>('single');
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<HeatmapAccent>('green');
  const [showPopup, setShowPopup] = createSignal(true);

  const currentFamily = createMemo(() => {
    return COLOR_FAMILIES.find((f) => f.id === selectedFamilyId()) ?? COLOR_FAMILIES[0];
  });

  const snippet = createMemo(() => {
    if (version() === 'v2') {
      const props = [`totalContributions={1863}`, `year={2025}`];
      if (selectedFamilyId() !== 'green') props.push(`accentColor="${selectedFamilyId()}"`);
      if (viewMode() === 'wide') props.push('weeks={32}');
      else if (viewMode() === 'grid') props.push('weeks={20}');
      else props.push('weeks={26}');
      if (!showPopup()) props.push('showTooltip={false}');

      return `import { ActivityHeatmapV2 } from 'solid-thinking-orbs';\n\n<ActivityHeatmapV2 ${props.join(' ')} />`;
    }

    const props = [`accentColor="${selectedFamilyId()}"`];
    if (viewMode() === 'wide') props.push('weeks={32}');
    else props.push('weeks={20}');
    if (!showPopup()) props.push('showTooltip={false}');

    return `import { ActivityHeatmap } from 'solid-thinking-orbs';\n\n<ActivityHeatmap ${props.join(' ')} />`;
  });

  return (
    <section class="w-full flex flex-col gap-1.5 mb-12" aria-label="Activity Heatmap interactive showcase">
      <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Playground</h2>

      {/* Controls */}
      <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
          
          {/* Version Switcher (V1 / V2) */}
          <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Heatmap version">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Version</span>
            <div class="flex gap-2 items-center">
              <TabBtn active={version() === 'v2'} onClick={() => setVersion('v2')}>
                V2 (Rare Gitmap)
              </TabBtn>
              <TabBtn active={version() === 'v1'} onClick={() => setVersion('v1')}>
                V1 (Matrix Grid)
              </TabBtn>
            </div>
          </div>

          <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="View mode">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Display</span>
            <div class="flex gap-2 items-center flex-wrap">
              <TabBtn active={viewMode() === 'single'} onClick={() => setViewMode('single')}>
                Single Card
              </TabBtn>
              <TabBtn active={viewMode() === 'grid'} onClick={() => setViewMode('grid')}>
                2 Per Row Grid
              </TabBtn>
              <TabBtn active={viewMode() === 'wide'} onClick={() => setViewMode('wide')}>
                Full Timeline
              </TabBtn>
            </div>
          </div>

          <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Commit popup toggle">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Pop-up</span>
            <TabBtn active={showPopup()} onClick={() => setShowPopup((p) => !p)}>
              Pop-up: {showPopup() ? 'On' : 'Off'}
            </TabBtn>
          </div>

          <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Heatmap accent">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color Palette</span>
            <div class="flex gap-2 items-center flex-wrap">
              <For each={COLOR_FAMILIES}>
                {(fam) => {
                  const isActive = () => selectedFamilyId() === fam.id;
                  return (
                    <TabBtn active={isActive()} onClick={() => setSelectedFamilyId(fam.id)}>
                      {/* 4-Shade Stepped Progression Preview */}
                      <span class="inline-flex items-center gap-[2.5px] mr-2 opacity-90">
                        <span class="w-[5.5px] h-[5.5px] rounded-[1px]" style={{ "background-color": fam.buttonSwatch[0] }} />
                        <span class="w-[5.5px] h-[5.5px] rounded-[1px]" style={{ "background-color": fam.buttonSwatch[1] }} />
                        <span class="w-[5.5px] h-[5.5px] rounded-[1px]" style={{ "background-color": fam.buttonSwatch[2] }} />
                        <span class="w-[5.5px] h-[5.5px] rounded-[1px]" style={{ "background-color": fam.buttonSwatch[3] }} />
                      </span>
                      <span>{fam.label}</span>
                    </TabBtn>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div class="relative w-full rounded-[16px] bg-(--surface) flex flex-col items-center justify-center p-8 max-sm:p-4 gap-6 border border-white/[0.04]">
        <Show
          when={version() === 'v2'}
          fallback={
            viewMode() === 'grid' ? (
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
                <For each={currentFamily().variants}>
                  {(variant) => (
                    <div class="w-full">
                      <ActivityHeatmap
                        accentColor={selectedFamilyId()}
                        badgeText={variant.badge}
                        badgeBgClass={variant.badgeBg}
                        badgeTextClass={variant.badgeText}
                        customDarkShades={variant.darkShades}
                        customLightShades={variant.lightShades}
                        totalContributions={variant.total}
                        seed={variant.seed}
                        showTooltip={showPopup()}
                        weeks={20}
                      />
                    </div>
                  )}
                </For>
              </div>
            ) : viewMode() === 'wide' ? (
              <div class="w-full max-w-[800px]">
                <ActivityHeatmap accentColor={selectedFamilyId()} weeks={32} showTooltip={showPopup()} />
              </div>
            ) : (
              <div class="w-full max-w-[460px]">
                <ActivityHeatmap accentColor={selectedFamilyId()} weeks={20} showTooltip={showPopup()} />
              </div>
            )
          }
        >
          {viewMode() === 'grid' ? (
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
              <For each={currentFamily().variants}>
                {(variant) => (
                  <div class="w-full flex justify-center">
                    <ActivityHeatmapV2
                      accentColor={selectedFamilyId()}
                      customDarkShades={variant.darkShades}
                      customLightShades={variant.lightShades}
                      totalContributions={variant.total}
                      year={2025}
                      seed={variant.seed}
                      showTooltip={showPopup()}
                      weeks={26}
                    />
                  </div>
                )}
              </For>
            </div>

          ) : viewMode() === 'wide' ? (
            <div class="w-full max-w-[720px] flex justify-center">
              <ActivityHeatmapV2
                accentColor={selectedFamilyId()}
                customDarkShades={currentFamily().variants[0].darkShades}
                customLightShades={currentFamily().variants[0].lightShades}
                totalContributions={1863}
                year={2025}
                weeks={32}
                showTooltip={showPopup()}
              />
            </div>
          ) : (
            <div class="w-full max-w-[560px] flex justify-center">
              <ActivityHeatmapV2
                accentColor={selectedFamilyId()}
                customDarkShades={currentFamily().variants[0].darkShades}
                customLightShades={currentFamily().variants[0].lightShades}
                totalContributions={1863}
                year={2025}
                weeks={26}
                showTooltip={showPopup()}
              />
            </div>
          )}
        </Show>

      </div>

      {/* Code Snippet */}
      <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">
          {snippet()}
        </code>
        <CopyButton getText={() => snippet()} />
      </div>
    </section>
  );
}
