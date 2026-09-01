import { createSignal, createMemo, createEffect, onCleanup, For, Show } from 'solid-js';
import type { ActivityHeatmapProps, Contribution, ContributionLevel, HeatmapAccent } from './activity-heatmap-types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

const COMMIT_MESSAGES = [
  'feat: add liquid metal shader preset',
  'fix: prevent slider overshoot on switch',
  'perf: reduce rAF matrix allocation',
  'refactor: extract reactive theme hooks',
  'style: polish dark mode cell borders',
  'feat: support custom week range',
  'chore: bump package version to v0.1.1',
  'docs: add contribution heatmap guide',
  'test: verify rolling digit animation',
  'fix: handle touch events on mobile grid',
  'feat: add high-contrast noir palette',
  'perf: optimize webgl uniform updates',
  'fix: resolve hydration mismatch in ssr',
  'feat: implement tooltip commit popover',
  'refactor: isolate shader compilation',
  'feat: add multi-line reasoning stream',
  'fix: prevent pulse clipping on outer ring',
];

function getCommitsForDay(dateStr: string, count: number, seed: number): string[] {
  if (count === 0) return [];
  const displayCount = Math.min(count, 3);
  const dateHash = dateStr.split('-').reduce((acc, part) => (acc * 37 + Number(part)) & 0xffffff, seed * 997);
  const commits: string[] = [];
  for (let i = 0; i < displayCount; i++) {
    const idx = Math.abs((dateHash + i * 59) % COMMIT_MESSAGES.length);
    commits.push(COMMIT_MESSAGES[idx]);
  }
  return commits;
}

function formatDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return dateStr;
  }
}

function generateContributions(weeksCount: number, seedOffset = 0): Contribution[] {
  const today = new Date();
  return Array.from({ length: weeksCount * 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (weeksCount * 7 - 1 - i));

    const pseudoRandom = Math.sin((i + seedOffset * 137) * 9999 + 42) * 10000;
    const rand = pseudoRandom - Math.floor(pseudoRandom);
    
    let level: ContributionLevel = 0;
    let count = 0;

    if (rand > 0.38) {
      level = (Math.floor(rand * 4) + 1) as ContributionLevel;
      count = level * 3 + Math.floor(rand * 4);
    }

    return {
      date: date.toISOString().slice(0, 10),
      count,
      level,
    };
  });
}

interface PaletteConfig {
  darkShades: [string, string, string, string, string];
  lightShades: [string, string, string, string, string];
  badgeBg: string;
  badgeText: string;
  label: string;
  totalDefault: number;
  seed: number;
}

export const PALETTES: Record<HeatmapAccent, PaletteConfig> = {
  green: {
    darkShades: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    lightShades: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    label: 'Emerald Matrix',
    totalDefault: 956,
    seed: 1,
  },
  blue: {
    darkShades: ['#141b24', '#0c4a6e', '#0369a1', '#0284c7', '#38bdf8'],
    lightShades: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985'],
    badgeBg: 'bg-sky-500/10 dark:bg-sky-500/15',
    badgeText: 'text-sky-600 dark:text-sky-400',
    label: 'Sky Blue Grid',
    totalDefault: 822,
    seed: 2,
  },
  purple: {
    darkShades: ['#181524', '#3b0764', '#581c87', '#7e22ce', '#c084fc'],
    lightShades: ['#faf5ff', '#e9d5ff', '#c084fc', '#9333ea', '#581c87'],
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    badgeText: 'text-purple-600 dark:text-purple-400',
    label: 'Violet Pulse',
    totalDefault: 788,
    seed: 3,
  },
  sunset: {
    darkShades: ['#1f1614', '#431407', '#7c2d12', '#c2410c', '#fb923c'],
    lightShades: ['#fff7ed', '#fed7aa', '#fb923c', '#ea580c', '#9a3412'],
    badgeBg: 'bg-orange-500/10 dark:bg-orange-500/15',
    badgeText: 'text-orange-600 dark:text-orange-400',
    label: 'Sunset Matrix',
    totalDefault: 890,
    seed: 4,
  },
  rose: {
    darkShades: ['#201419', '#4c0519', '#881337', '#be123c', '#fb7185'],
    lightShades: ['#fff1f2', '#fecdd3', '#fb7185', '#e11d48', '#9f1239'],
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    badgeText: 'text-rose-600 dark:text-rose-400',
    label: 'Rose Pulse',
    totalDefault: 845,
    seed: 5,
  },
  amber: {
    darkShades: ['#1f1a12', '#451a03', '#78350f', '#b45309', '#fbbf24'],
    lightShades: ['#fffbeb', '#fde68a', '#fbbf24', '#d97706', '#78350f'],
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
    label: 'Amber Grid',
    totalDefault: 912,
    seed: 6,
  },
  mono: {
    darkShades: ['#141416', '#2e2e33', '#5c5c66', '#9e9eb0', '#ffffff'],
    lightShades: ['#f4f4f5', '#cbd5e1', '#94a3b8', '#475569', '#0f172a'],
    badgeBg: 'bg-zinc-500/10 dark:bg-zinc-500/15',
    badgeText: 'text-zinc-600 dark:text-zinc-300',
    label: 'Monochrome',
    totalDefault: 760,
    seed: 7,
  },
};

import { createResolvedDark } from '../theme';

export function ActivityHeatmap(props: ActivityHeatmapProps) {
  let containerRef: HTMLDivElement | undefined;
  const isDark = createResolvedDark(() => props.theme ?? 'auto', () => containerRef ?? null);

  const accent = () => props.accentColor ?? 'green';
  const weeksCount = () => props.weeks ?? 20;

  const palette = createMemo(() => PALETTES[accent()] ?? PALETTES.green);

  const seedValue = () => props.seed ?? palette().seed;
  const contributions = createMemo(() => props.data ?? generateContributions(weeksCount(), seedValue()));
  const totalContributions = createMemo(() => {
    if (props.totalContributions !== undefined) return props.totalContributions;
    if (props.data) return props.data.reduce((sum, d) => sum + d.count, 0);
    return palette().totalDefault;
  });

  const [tooltip, setTooltip] = createSignal<{
    day: Contribution;
    commits: string[];
    x: number;
    y: number;
  } | null>(null);
  const [isGliding, setIsGliding] = createSignal(false);

  const cellColor = (level: ContributionLevel) => {
    if (isDark() && props.customDarkShades) {
      return props.customDarkShades[level] ?? props.customDarkShades[0];
    }
    if (!isDark() && props.customLightShades) {
      return props.customLightShades[level] ?? props.customLightShades[0];
    }
    const shades = isDark() ? palette().darkShades : palette().lightShades;
    return shades[level] ?? shades[0];
  };

  const badgeBg = () => props.badgeBgClass ?? palette().badgeBg;
  const badgeText = () => props.badgeTextClass ?? palette().badgeText;
  const showTooltip = () => props.showTooltip ?? true;

  const onMouseEnterCell = (e: MouseEvent, day: Contribution) => {
    if (!showTooltip()) return;
    if (!containerRef) return;
    const containerRect = containerRef.getBoundingClientRect();
    const cellRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const x = cellRect.left - containerRect.left + cellRect.width / 2;
    const y = cellRect.top - containerRect.top;

    const commits = getCommitsForDay(day.date, day.count, seedValue());

    if (!tooltip()) {
      setIsGliding(false);
      setTooltip({ day, commits, x, y });
      requestAnimationFrame(() => {
        setIsGliding(true);
      });
    } else {
      setIsGliding(true);
      setTooltip({ day, commits, x, y });
    }
  };

  return (
    <div
      ref={containerRef}
      class={`relative w-full rounded-[16px] transition-all duration-200 flex flex-col justify-between overflow-visible p-4 sm:p-5 font-sans ${
        isDark()
          ? 'bg-[#121213] text-[#ededed] border border-[rgba(255,255,255,0.05)] shadow-sm hover:border-[rgba(255,255,255,0.08)]'
          : 'bg-[#fafafa] text-[#18181b] border border-[rgba(0,0,0,0.06)] shadow-sm hover:border-[rgba(0,0,0,0.1)]'
      } ${props.class || props.className || ''}`}
    >
      {/* Floating Dark Fitting Popup / Tooltip with Commits (Smooth Gliding without Off-Side Spawn) */}
      <div
        class={`absolute z-50 pointer-events-none flex flex-col gap-1.5 p-2.5 rounded-[10px] bg-[#141416]/95 backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_12px_28px_rgba(0,0,0,0.65)] text-left min-w-[210px] max-w-[280px] ${
          isGliding()
            ? 'transition-[left,top,opacity,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]'
            : 'transition-[opacity,transform] duration-150 ease-out'
        } ${
          showTooltip() && tooltip()
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95'
        }`}
        style={{
          left: `${tooltip()?.x ?? 0}px`,
          top: `${(tooltip()?.y ?? 0) - 8}px`,
          transform: tooltip()?.x && tooltip()!.x < 110
            ? 'translate(-15%, -100%)'
            : tooltip()?.x && containerRef && (containerRef.clientWidth - tooltip()!.x < 110)
            ? 'translate(-85%, -100%)'
            : 'translate(-50%, -100%)',
          "transform-origin": tooltip()?.x && tooltip()!.x < 110
            ? '0% 100%'
            : tooltip()?.x && containerRef && (containerRef.clientWidth - tooltip()!.x < 110)
            ? '100% 100%'
            : '50% 100%',
        }}
      >
        {/* Header */}
        <div class="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-1.5">
          <span class="text-[11px] font-semibold text-white font-mono">
            {tooltip() ? formatDate(tooltip()!.day.date) : ''}
          </span>
          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-white/[0.08] text-white/90 shrink-0">
            {tooltip() ? tooltip()!.day.count : 0} {tooltip()?.day.count === 1 ? 'commit' : 'commits'}
          </span>
        </div>

        {/* Commit entries */}
        <Show
          when={tooltip() && tooltip()!.commits.length > 0}
          fallback={
            <span class="text-[10.5px] text-white/40 font-mono py-0.5">
              No contributions recorded
            </span>
          }
        >
          <div class="flex flex-col gap-1 mt-0.5">
            <For each={tooltip()?.commits ?? []}>
              {(c) => (
                <div class="flex items-center gap-1.5 text-[10.5px] text-white/80 font-mono truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      "background-color": tooltip()
                        ? cellColor(tooltip()!.day.level)
                        : '#555',
                    }}
                  />
                  <span class="truncate">{c}</span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Header */}
      <div class="flex items-center justify-between mb-3">
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-2">
            <span class={`text-[11px] font-medium tracking-wide uppercase ${isDark() ? 'text-[#8a8a8e]' : 'text-[#71717a]'}`}>
              {props.title ?? 'Activity Heatmap'}
            </span>
            <span class={`inline-flex items-center px-1.5 py-0.5 rounded-[5px] text-[10px] font-medium select-none ${badgeBg()} ${badgeText()}`}>
              {props.badgeText ?? palette().label}
            </span>
          </div>
          <div class="flex items-baseline mt-0.5">
            <span class="text-xl sm:text-2xl font-semibold tracking-tight tabular-nums">
              {totalContributions()}
            </span>
            <span class={`text-xs ml-1.5 ${isDark() ? 'text-[#8a8a8e]' : 'text-[#71717a]'}`}>
              contributions
            </span>
          </div>
        </div>
      </div>

      {/* Main Heatmap Stage Grid */}
      <div class={`relative w-full rounded-[10px] p-3 transition-colors duration-200 flex flex-col justify-between items-center ${
        isDark() ? 'bg-[#0a0a0b]' : 'bg-[#f4f4f5]'
      }`}>
        {/* Month Headers */}
        <div class="flex justify-between mb-2 w-full px-1">
          <For each={MONTH_NAMES}>
            {(m) => (
              <span class={`text-[10px] font-mono flex-1 text-center ${isDark() ? 'text-[#52525b]' : 'text-[#a1a1aa]'}`}>
                {m}
              </span>
            )}
          </For>
        </div>

        {/* 20-Week x 7-Day Heatmap Grid */}
        <div
          class="grid grid-flow-col grid-rows-7 gap-[3px] sm:gap-[3.5px] w-full items-center my-0.5"
          onMouseLeave={() => setTooltip(null)}
        >
          <For each={contributions()}>
            {(day) => (
              <div
                onMouseEnter={(e) => onMouseEnterCell(e, day)}
                class="w-full aspect-square rounded-[2px] transition-transform cursor-pointer hover:scale-125 duration-100"
                style={{
                  "background-color": cellColor(day.level),
                }}
              />
            )}
          </For>
        </div>

        {/* Active Cell Callout / Hint */}
        <div class="h-4 mt-2 flex items-center justify-center">
          <Show
            when={tooltip()}
            keyed
            fallback={
              <span class={`text-[10px] font-mono ${isDark() ? 'text-[#52525b]' : 'text-[#a1a1aa]'}`}>
                {showTooltip() ? 'Hover tiles for metrics & commits' : 'Hover tiles for metrics'}
              </span>
            }
          >
            {(item) => (
              <span class={`text-[10px] font-mono ${isDark() ? 'text-[#d4d4d8]' : 'text-[#27272a]'}`}>
                {item.day.count} {item.day.count === 1 ? 'item' : 'items'} on {item.day.date}
              </span>
            )}
          </Show>
        </div>
      </div>

      {/* Footer Details */}
      <div class="flex items-center justify-between mt-3 pt-2 border-t border-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.04)] text-[10px] font-mono">
        <span class={isDark() ? 'text-[#52525b]' : 'text-[#a1a1aa]'}>
          {props.footerLabel ?? `${weeksCount()} Weeks × 7 Days Grid`}
        </span>
        <span class={isDark() ? 'text-[#71717a]' : 'text-[#52525b]'}>
          {props.footerAuthor ?? 'GitHub Activity'}
        </span>
      </div>
    </div>
  );
}
