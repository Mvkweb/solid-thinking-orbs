import { createSignal, For, type JSX } from 'solid-js';
import type { OrbSize, OrbState } from '../types';
import { ThinkingOrb } from '../ThinkingOrb';
import { cn } from '../lib/utils';
import { CopyButton } from './CopyButton';
import { PlayPauseToggle } from './PlayPauseToggle';

const V1_STATES: OrbState[] = ['working', 'searching', 'solving', 'listening', 'composing', 'shaping'];
const V2_STATES: OrbState[] = ['syncing', 'evolving', 'building', 'hypercube', 'conjuring', 'conjuring_static', 'assembling'];
const ALL_STATES: OrbState[] = [...V1_STATES, ...V2_STATES];

const STATE_LABELS: Record<OrbState, string> = {
  working: 'Working',
  searching: 'Searching',
  solving: 'Solving',
  listening: 'Listening',
  composing: 'Composing',
  shaping: 'Shaping',
  syncing: 'Syncing',
  evolving: 'Evolving',
  building: 'Building',
  hypercube: 'Structuring',
  conjuring: 'Conjuring',
  conjuring_static: 'Conjuring Static',
  assembling: 'Assembling',
};

const SIZES: OrbSize[] = [64, 20];

const SPEED_MIN = 25;
const SPEED_MAX = 300;

function buildSnippet(state: OrbState, size: OrbSize, speed: number) {
  const props = [`state="${state}"`, `size={${size}}`];
  if (speed !== 100) props.push(`speed={${(speed / 100).toFixed(2)}}`);
  return `import { ThinkingOrb } from 'solid-thinking-orbs';\n\n<ThinkingOrb ${props.join(' ')} />`;
}

const tabBtnBase = 'flex items-center justify-center h-9 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] font-normal leading-[14px] cursor-pointer transition-all duration-200 whitespace-nowrap [-webkit-tap-highlight-color:transparent] hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2';

function TabBtn(props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      {...props}
      class={cn(
        tabBtnBase,
        props.active
          ? 'bg-(--tab-active-bg) text-(--tab-active-color) shadow-(--tab-active-shadow) scale-[1.02]'
          : 'bg-(--tab-bg) text-(--tab-color)',
        props.class
      )}
      type="button"
    />
  );
}

export function Playground(props: {
  speed: number;
  onSpeedChange: (value: number) => void;
}) {
  const [state, setState] = createSignal<OrbState>('listening');
  const [category, setCategory] = createSignal<'all' | 'v1' | 'v2'>('all');
  const [size, setSize] = createSignal<OrbSize>(64);
  const [paused, setPaused] = createSignal(true);

  const visibleStates = () => {
    const cat = category();
    if (cat === 'v1') return V1_STATES;
    if (cat === 'v2') return V2_STATES;
    return ALL_STATES;
  };

  const handleCategoryChange = (newCat: 'all' | 'v1' | 'v2') => {
    setCategory(newCat);
    const available = newCat === 'v1' ? V1_STATES : newCat === 'v2' ? V2_STATES : ALL_STATES;
    if (!available.includes(state())) {
      setState(available[0]);
    }
  };

  const snippet = () => buildSnippet(state(), size(), props.speed);
  const fillPct = () => ((props.speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;

  return (
    <section class="w-full flex flex-col gap-1.5 mb-12" aria-label="Interactive playground">
      <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Playground</h2>

      {/* Main Control Panel with smooth animated transition */}
      <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div class="flex flex-col gap-2 min-w-0" role="radiogroup" aria-label="Orb state">
          <div class="flex items-center justify-between gap-2 max-sm:flex-col max-sm:items-start">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">State</span>
            
            {/* V1 / V2 / All Categorization Pill Tabs */}
            <div class="flex items-center bg-(--hero-surface) border border-[rgba(255,255,255,0.05)] p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                class={`px-2.5 py-1 rounded-md transition-all duration-200 text-[11px] font-medium cursor-pointer ${category() === 'all' ? 'bg-(--icon-btn-hover) text-(--title-color) shadow-sm' : 'text-(--subtitle-color) hover:text-(--title-color)'}`}
              >
                All ({ALL_STATES.length})
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('v1')}
                class={`px-2.5 py-1 rounded-md transition-all duration-200 text-[11px] font-medium cursor-pointer ${category() === 'v1' ? 'bg-(--icon-btn-hover) text-(--title-color) shadow-sm' : 'text-(--subtitle-color) hover:text-(--title-color)'}`}
              >
                V1 Original ({V1_STATES.length})
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('v2')}
                class={`px-2.5 py-1 rounded-md transition-all duration-200 text-[11px] font-medium cursor-pointer ${category() === 'v2' ? 'bg-(--icon-btn-hover) text-(--title-color) shadow-sm' : 'text-(--subtitle-color) hover:text-(--title-color)'}`}
              >
                V2 Custom ({V2_STATES.length})
              </button>
            </div>
          </div>

          {/* Smooth animated button grid area */}
          <div class="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div class="flex gap-2 items-center flex-wrap pt-1">
              <For each={visibleStates()}>
                {(s) => (
                  <TabBtn active={state() === s} onClick={() => setState(s)}>
                    {STATE_LABELS[s]}
                  </TabBtn>
                )}
              </For>
            </div>
          </div>
        </div>

        <div class="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)]">
          <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Orb size">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Size</span>
            <div class="flex gap-2 items-center">
              <For each={SIZES}>
                {(s) => (
                  <TabBtn active={size() === s} onClick={() => setSize(s)}>
                    {s}px
                  </TabBtn>
                )}
              </For>
            </div>
          </div>

          <div class="flex flex-col gap-[9px] min-w-[100px] w-[140px] max-sm:w-full">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Speed</span>
            <div class="strength-track relative w-full h-9 rounded-lg bg-(--strength-bg) shadow-(--strength-shadow) overflow-hidden cursor-grab active:cursor-grabbing hover:bg-(--strength-hover)">
              <div class="absolute top-0 left-0 bottom-0 rounded-lg bg-(--strength-fill-bg) shadow-(--strength-shadow) transition-[width] duration-[80ms] ease-out pointer-events-none" style={{ width: `${fillPct()}%` }} />
              <span class="absolute top-0 left-[11px] h-full flex items-center text-[11px] font-normal leading-[14px] text-(--text-muted) whitespace-nowrap pointer-events-none z-[1]">{(props.speed / 100).toFixed(2)}×</span>
              <input
                class="strength-input appearance-none absolute inset-0 w-full h-full m-0 p-0 bg-transparent cursor-grab opacity-0 z-[2] active:cursor-grabbing"
                type="range"
                min={SPEED_MIN}
                max={SPEED_MAX}
                step={5}
                value={props.speed}
                onInput={(e) => props.onSpeedChange(Number(e.currentTarget.value))}
                aria-label="Animation speed"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="relative w-full min-h-[304px] rounded-[10px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-6 max-sm:p-6">
        <ThinkingOrb state={state()} size={size()} speed={props.speed / 100} paused={paused()} />
        <PlayPauseToggle playing={!paused()} onToggle={() => setPaused((p) => !p)} class="max-sm:absolute max-sm:bottom-6 max-sm:left-1/2 max-sm:-translate-x-1/2" />
      </div>

      <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">{snippet()}</code>
        <CopyButton getText={() => snippet()} />
      </div>
    </section>
  );
}

