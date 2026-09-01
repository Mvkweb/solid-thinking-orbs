import {
  createSignal,
  createMemo,
  createEffect,
  onCleanup,
  onMount,
  For,
  Show,
  type JSX,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { createResolvedDark, createReducedMotion } from '../theme';

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type RepoContribution = {
  name: string;
  count: number;
  logo?: JSX.Element;
  href?: string;
};

const DEFAULT_ACCENT = '#39d353';
const DEFAULT_CELL_SIZE = 11;
const DEFAULT_LABEL = 'Top contributions in:';
const DEFAULT_MONTHS = 12;
const WEEKS_PER_MONTH = 365.25 / 12 / 7;
const STACK_LIMIT = 3;
const MIN_CARD_WIDTH = 320;
const MIN_LABEL_WEEKS = 3;
const CARD_PADDING = 32;

const gapFor = (cellSize: number) => Math.max(2, Math.round(cellSize / 4));
const weeksFor = (months: number) =>
  Math.max(1, Math.ceil(months * WEEKS_PER_MONTH));

const LEVELS: ContributionLevel[] = [0, 1, 2, 3, 4];

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function toMonthLabels(weeks: Contribution[][]) {
  const labels: (string | null)[] = weeks.map(() => null);
  const monthAt = (index: number) => weeks[index]?.[0]?.date.slice(5, 7);

  let start = 0;
  for (let i = 1; i <= weeks.length; i++) {
    if (i < weeks.length && monthAt(i) === monthAt(start)) continue;
    if (i - start >= MIN_LABEL_WEEKS) {
      const mIdx = Number(monthAt(start)) - 1;
      labels[start] = MONTH_NAMES[mIdx] ?? null;
    }
    start = i;
  }

  return labels;
}

const LEVEL_OPACITY: Record<ContributionLevel, number> = {
  0: 0,
  1: 0.3,
  2: 0.52,
  3: 0.76,
  4: 1,
};

type LevelStyle = { backgroundColor: string; opacity: number };
type HoveredDay = { day: Contribution; x: number; y: number };

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function describeDay({ count, date }: Contribution) {
  const noun = count === 1 ? 'contribution' : 'contributions';
  return `${count} ${noun} on ${DATE_FORMAT.format(new Date(`${date}T00:00:00`))}`;
}

const CALENDAR_API = 'https://github-contributions-api.jogruber.de/v4';
const EVENTS_API = 'https://api.github.com/users';

type ApiDay = { date: string; count: number; level: number };
type PushEvent = {
  type: string;
  repo?: { name: string };
  payload?: { commits?: unknown[] };
};

async function fetchCalendar(login: string) {
  try {
    const res = await fetch(`${CALENDAR_API}/${login}?y=last`);
    if (!res.ok) return null;

    const days: ApiDay[] = (await res.json())?.contributions ?? [];
    if (!days.length) return null;

    const start = days.findIndex(
      (day) => new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0
    );

    return days.slice(start < 0 ? 0 : start).map<Contribution>((day) => ({
      date: day.date,
      count: day.count,
      level: Math.min(4, Math.max(0, day.level)) as ContributionLevel,
    }));
  } catch {
    return null;
  }
}

async function fetchRepos(login: string): Promise<RepoContribution[]> {
  try {
    const res = await fetch(`${EVENTS_API}/${login}/events/public?per_page=100`);
    if (!res.ok) return [];

    const events: PushEvent[] = await res.json();
    const counts = new Map<string, number>();

    for (const event of events) {
      if (event.type !== 'PushEvent' || !event.repo) continue;
      const commits = event.payload?.commits?.length ?? 1;
      counts.set(event.repo.name, (counts.get(event.repo.name) ?? 0) + commits);
    }

    return [...counts.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, STACK_LIMIT)
      .map(([fullName, count]) => {
        const [owner, name] = fullName.split('/');
        return {
          name,
          count,
          href: `https://github.com/${fullName}`,
          logo:
            owner.toLowerCase() === login.toLowerCase() ? undefined : (
              <img
                src={`https://github.com/${owner}.png?size=64`}
                alt=""
                class="size-full object-cover"
              />
            ),
        };
      });
  } catch {
    return [];
  }
}

function emptyDays(weeks: number): Contribution[] {
  const today = new Date();
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (weeks * 7 - 1 - i));
    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0 as ContributionLevel,
    };
  });
}

function generateDemoContributions(weeksCount: number, seedOffset = 1): Contribution[] {
  const today = new Date();
  return Array.from({ length: weeksCount * 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (weeksCount * 7 - 1 - i));

    const pseudoRandom = Math.sin((i + seedOffset * 137) * 9999 + 42) * 10000;
    const rand = pseudoRandom - Math.floor(pseudoRandom);

    let level: ContributionLevel = 0;
    let count = 0;

    if (rand > 0.35) {
      level = (Math.floor(rand * 4) + 1) as ContributionLevel;
      count = level * 3 + Math.floor(rand * 5);
    }

    return {
      date: date.toISOString().slice(0, 10),
      count,
      level,
    };
  });
}

function toScale(accent: string | string[]): LevelStyle[] {
  if (typeof accent === 'string') {
    return LEVELS.map((level) => ({
      backgroundColor: accent,
      opacity: LEVEL_OPACITY[level],
    }));
  }

  const colors = accent.length > 4 ? accent : ['transparent', ...accent];
  return LEVELS.map((level) => {
    const color = colors[level] ?? colors[colors.length - 1] ?? 'transparent';
    return { backgroundColor: color, opacity: color === 'transparent' ? 0 : 1 };
  });
}

function toWeeks(contributions: Contribution[]) {
  const weeks: Contribution[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }
  return weeks;
}

// 1:1 Demo Repos matching Rare UI showcase
const DEFAULT_DEMO_REPOS: RepoContribution[] = [
  {
    name: 'rare-ui',
    count: 842,
    href: 'https://github.com/swamimalode07/rare-ui',
    logo: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 8.5a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 8.5Zm-3.5 3.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5Zm7 0a3.5 3.5 0 1 0 3.5-3.5 3.5 3.5 0 0 0-3.5 3.5Zm-3.5 3.5a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0-3.5-3.5Zm-3.5 0a3.5 3.5 0 1 0-3.5 3.5 3.5 3.5 0 0 0 3.5-3.5Z" />
      </svg>
    ),
  },
  {
    name: 'solid-thinking-orbs',
    count: 624,
    href: 'https://github.com/Mvkweb/solid-thinking-orbs',
    logo: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <circle cx="6" cy="6" r="2" />
        <circle cx="12" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="12" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    ),
  },
  {
    name: 'engine',
    count: 397,
    href: 'https://github.com',
    logo: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    ),
  },
];

export interface ActivityHeatmapV2Props extends JSX.HTMLAttributes<HTMLDivElement> {
  username?: string;
  contributions?: Contribution[];
  repos?: RepoContribution[];
  year?: number;
  accent?: string | string[];
  accentColor?: string;
  customDarkShades?: [string, string, string, string, string];
  customLightShades?: [string, string, string, string, string];
  weeks?: number;
  cellSize?: number;
  months?: number;
  showMonths?: boolean;
  label?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  theme?: 'dark' | 'light' | 'auto';
  totalContributions?: number;
  seed?: number;
}

export function ActivityHeatmapV2(props: ActivityHeatmapV2Props) {
  let cardRef!: HTMLDivElement;
  let gridRef!: HTMLDivElement;

  const resolvedDark = createResolvedDark(
    () => props.theme ?? 'auto',
    () => cardRef
  );
  const reduceMotion = createReducedMotion();

  const [openState, setOpenState] = createSignal(props.defaultOpen ?? false);
  const open = () => (props.open !== undefined ? props.open : openState());
  const toggle = () => {
    const next = !open();
    if (props.open === undefined) setOpenState(next);
    props.onOpenChange?.(next);
  };

  const [fetchedData, setFetchedData] = createSignal<{
    contributions: Contribution[];
    repos: RepoContribution[];
  } | null>(null);

  createEffect(() => {
    const user = props.username;
    if (!user) return;
    let active = true;

    Promise.all([fetchCalendar(user), fetchRepos(user)])
      .then(([contribs, repos]) => {
        if (active && contribs) {
          setFetchedData({ contributions: contribs, repos });
        }
      })
      .catch(() => {});

    onCleanup(() => {
      active = false;
    });
  });

  const cellSize = () => props.cellSize ?? DEFAULT_CELL_SIZE;
  const months = () =>
    props.months ?? (props.weeks ? Math.ceil(props.weeks / WEEKS_PER_MONTH) : DEFAULT_MONTHS);
  const showMonths = () => props.showMonths ?? true;
  const label = () => props.label ?? DEFAULT_LABEL;
  const accent = () => props.accent ?? props.accentColor ?? DEFAULT_ACCENT;
  const seed = () => props.seed ?? 1;

  const contributions = createMemo(() => {
    if (props.contributions && props.contributions.length > 0) {
      return props.contributions;
    }
    if (fetchedData()) {
      return fetchedData()!.contributions;
    }
    if (props.username) {
      return emptyDays(weeksFor(months()));
    }
    const nWeeks = props.weeks ?? weeksFor(months());
    return generateDemoContributions(nWeeks, seed());
  });

  const repos = createMemo(() => {
    if (props.repos && props.repos.length > 0) {
      return props.repos;
    }
    if (fetchedData()) {
      return fetchedData()!.repos;
    }
    return DEFAULT_DEMO_REPOS;
  });

  const scale = createMemo(() => {
    if (resolvedDark() && props.customDarkShades) {
      return toScale(props.customDarkShades);
    }
    if (!resolvedDark() && props.customLightShades) {
      return toScale(props.customLightShades);
    }
    return toScale(accent());
  });

  const total = createMemo(() => {
    if (props.totalContributions !== undefined) return props.totalContributions;
    return contributions().reduce((sum, day) => sum + day.count, 0);
  });

  const parsedYear = createMemo(() => {
    const last = contributions()[contributions().length - 1];
    return Number(last?.date?.slice(0, 4));
  });

  const displayYear = () => props.year ?? (Number.isFinite(parsedYear()) ? parsedYear() : null);
  const heading = () =>
    `${total().toLocaleString()} contributions${displayYear() ? ` in ${displayYear()}` : ''}`;

  const gap = () => gapFor(cellSize());
  const weeks = createMemo(() => toWeeks(contributions()));
  const cap = () => Math.min(weeks().length, weeksFor(months()));
  const visibleWeeks = createMemo(() => weeks().slice(-cap()));
  const monthLabelList = createMemo(() => toMonthLabels(visibleWeeks()));

  const columnsCount = () => visibleWeeks().length;
  const cardWidth = () =>
    Math.max(MIN_CARD_WIDTH, columnsCount() * (cellSize() + gap()) - gap() + CARD_PADDING);

  const [hovered, setHovered] = createSignal<HoveredDay | null>(null);

  const handlePointerEnter = (day: Contribution, e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setHovered({ day, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <div
      ref={cardRef}
      data-slot="github-activity"
      class={`relative max-w-full overflow-hidden rounded-[28px] p-4 transition-all duration-300 select-none ${
        repos().length > 0 ? 'pb-[76px]' : ''
      } ${
        resolvedDark()
          ? 'bg-black text-white border border-white/[0.08] shadow-2xl shadow-black/80'
          : 'bg-white text-zinc-900 border border-black/[0.08] shadow-xl shadow-zinc-200/50'
      } ${props.class || ''}`}
      style={{ width: `${cardWidth()}px` }}
    >
      {/* 1:1 Rare UI Heading */}
      <p class="mb-4 text-base font-medium text-inherit px-1.5 tracking-tight">
        {heading()}
      </p>

      {/* 1:1 Contribution Grid */}
      <div
        ref={gridRef}
        data-slot="github-activity-grid"
        role="img"
        aria-label={heading()}
        class="relative"
      >
        {/* Month Labels Bar */}
        <Show when={showMonths()}>
          <div
            class="flex justify-center transition-all duration-300"
            style={{
              gap: `${gap()}px`,
              'margin-bottom': `${gap()}px`,
              animation: reduceMotion() ? 'none' : 'rare-label-reveal 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          >
            <For each={visibleWeeks()}>
              {(_, index) => {
                const mLabel = () => monthLabelList()[index()];
                return (
                  <div class="relative h-3 shrink-0" style={{ width: `${cellSize()}px` }}>
                    <Show when={mLabel()}>
                      <span
                        class={`absolute left-0 top-0 text-[10px] leading-none font-normal ${
                          resolvedDark() ? 'text-white/40' : 'text-zinc-500'
                        }`}
                      >
                        {mLabel()}
                      </span>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>

        {/* 7-Row Contribution Days Grid with 12ms Stagger */}
        <div
          class="flex justify-center overflow-hidden"
          style={{ gap: `${gap()}px` }}
          onPointerLeave={() => setHovered(null)}
        >
          <For each={visibleWeeks()}>
            {(week, weekIndex) => (
              <div
                class="flex flex-col"
                style={{
                  gap: `${gap()}px`,
                  animation: reduceMotion()
                    ? 'none'
                    : `rare-cell-fade 0.2s cubic-bezier(0.22, 1, 0.36, 1) ${weekIndex() * 0.012}s backwards`,
                }}
              >
                <For each={week}>
                  {(day) => {
                    const styleObj = () => scale()[day.level] ?? scale()[0];
                    return (
                      <div
                        onPointerEnter={(e) => handlePointerEnter(day, e)}
                        class={`shrink-0 rounded-[3px] transition-transform duration-150 hover:scale-125 cursor-pointer ${
                          resolvedDark() ? 'bg-white/[0.08]' : 'bg-black/[0.08]'
                        }`}
                        style={{
                          width: `${cellSize()}px`,
                          height: `${cellSize()}px`,
                        }}
                      >
                        <div
                          class="size-full rounded-[3px] transition-colors duration-200"
                          style={{
                            'background-color': styleObj().backgroundColor,
                            opacity: styleObj().opacity,
                          }}
                        />
                      </div>
                    );
                  }}
                </For>
              </div>
            )}
          </For>
        </div>

        {/* 1:1 Rare UI Tooltip */}
        <Show when={hovered()}>
          {(h) => (
            <Portal>
              <div
                class="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2"
                style={{
                  left: `${h().x}px`,
                  top: `${h().y}px`,
                  transform: 'translate(-50%, calc(-100% - 8px))',
                }}
              >
                <div
                  class={`whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium shadow-md transition-all duration-150 ${
                    resolvedDark()
                      ? 'bg-white text-black shadow-black/50'
                      : 'bg-zinc-900 text-white shadow-zinc-400/50'
                  }`}
                  style={{
                    animation: reduceMotion() ? 'none' : 'rare-tooltip-fade 0.14s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  }}
                >
                  {describeDay(h().day)}
                </div>
              </div>
            </Portal>
          )}
        </Show>
      </div>

      {/* 1:1 Expandable Footer Panel (`github-activity-panel`) */}
      <Show when={repos().length > 0}>
        <div
          id="github-activity-panel"
          data-slot="github-activity-panel"
          data-state={open() ? 'open' : 'closed'}
          class={`absolute inset-x-3 overflow-hidden backdrop-blur-xl border transition-all ${
            open() ? 'top-3 bottom-3 shadow-2xl z-20' : 'bottom-3 h-[52px] shadow-md z-10'
          } ${
            resolvedDark()
              ? 'bg-[#181a1f]/95 border-white/[0.08] text-white'
              : 'bg-zinc-100/95 border-black/[0.08] text-zinc-900'
          }`}
          style={{
            'border-radius': '18px',
            'transition-duration': '620ms',
            'transition-timing-function': 'cubic-bezier(0.175, 0.885, 0.32, 1.15)',
          }}
        >
          {/* Header Row */}
          <div class="flex items-center justify-between gap-3 py-3 px-4 h-[52px]">
            <span class="truncate text-sm font-medium text-inherit">{label()}</span>

            <div class="flex items-center gap-3">
              {/* Collapsed Stacked Avatars */}
              <Show when={!open()}>
                <div class="flex items-center -space-x-2 transition-opacity duration-200">
                  <For each={repos().slice(0, STACK_LIMIT)}>
                    {(repo) => (
                      <span
                        class={`grid size-7 shrink-0 place-items-center overflow-hidden rounded-full text-[11px] font-medium uppercase ring-2 transition-transform hover:scale-110 ${
                          resolvedDark()
                            ? 'bg-neutral-800 text-white/90 ring-[#181a1f]'
                            : 'bg-neutral-200 text-zinc-800 ring-zinc-100'
                        } [&_img]:size-full [&_img]:object-cover [&_svg]:size-full`}
                      >
                        {repo.logo ?? repo.name.charAt(0)}
                      </span>
                    )}
                  </For>
                </div>
              </Show>

              {/* Circular Chevron Button */}
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open()}
                aria-controls="github-activity-panel"
                aria-label={open() ? 'Hide top repositories' : 'Show top repositories'}
                class="grid size-7 shrink-0 place-items-center rounded-full bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class={`size-7 text-[#C4C9CC] dark:text-[#3E4346] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open() ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16 10-4 4-4-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded Repository List with Staggered Entrance */}
          <Show when={open()}>
            <ul
              class="px-2 pb-3 flex flex-col gap-1 overflow-y-auto max-h-[calc(100%-56px)] list-none m-0 p-0"
              style={{
                animation: reduceMotion()
                  ? 'none'
                  : 'rare-row-slide 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.2) 0.08s backwards',
              }}
            >
              <For each={repos()}>
                {(repo) => {
                  const content = (
                    <>
                      <span
                        class={`grid size-7 shrink-0 place-items-center overflow-hidden rounded-full text-[11px] font-medium uppercase ring-2 ${
                          resolvedDark()
                            ? 'bg-neutral-800 text-white/90 ring-[#181a1f]'
                            : 'bg-neutral-200 text-zinc-800 ring-zinc-100'
                        } [&_img]:size-full [&_img]:object-cover [&_svg]:size-full`}
                      >
                        {repo.logo ?? repo.name.charAt(0)}
                      </span>
                      <span class="flex-1 truncate text-sm font-medium text-inherit">
                        {repo.name}
                      </span>
                      <span class="text-sm tabular-nums text-zinc-400">
                        {repo.count}
                      </span>
                    </>
                  );

                  return (
                    <li>
                      <Show
                        when={repo.href}
                        fallback={
                          <div class="flex items-center gap-3 rounded-xl mx-2 px-2 py-2 transition-colors hover:bg-foreground/5">
                            {content}
                          </div>
                        }
                      >
                        <a
                          href={repo.href}
                          target="_blank"
                          rel="noreferrer"
                          class={`flex items-center gap-3 rounded-xl mx-2 px-2 py-2 transition-colors no-underline ${
                            resolvedDark()
                              ? 'hover:bg-white/10 text-white'
                              : 'hover:bg-black/5 text-zinc-900'
                          }`}
                        >
                          {content}
                        </a>
                      </Show>
                    </li>
                  );
                }}
              </For>
            </ul>
          </Show>
        </div>
      </Show>

      {/* Embedded 1:1 Rare UI CSS Keyframe Animations */}
      <style>{`
        @keyframes rare-cell-fade {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes rare-tooltip-fade {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes rare-label-reveal {
          from { opacity: 0; filter: blur(6px); }
          to { opacity: 1; filter: blur(0px); }
        }
        @keyframes rare-row-slide {
          from { opacity: 0; transform: translate(16px, 16px); }
          to { opacity: 1; transform: translate(0px, 0px); }
        }
      `}</style>
    </div>
  );
}

export { ActivityHeatmapV2 as GitHubActivity };
export default ActivityHeatmapV2;
