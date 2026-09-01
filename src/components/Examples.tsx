import { For, createSignal } from 'solid-js';
import type { OrbState } from '../types';
import { ThinkingOrb } from '../ThinkingOrb';

const listeningPillClass =
  'inline-flex items-center gap-3 w-[270px] h-[74px] pl-[9px] pr-8 rounded-full bg-(--pill-fill) shadow-(--pill-stroke) text-(--pill-fg) text-lg leading-6 font-inherit cursor-default';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const chipClass =
  'inline-flex items-center gap-2 h-9 pl-2 pr-3.5 rounded-full bg-(--pill-fill) shadow-(--pill-stroke) text-(--pill-fg) text-xs leading-[14px] font-inherit cursor-default';

const V1_CHIP_STATES: OrbState[] = ['listening', 'working', 'searching', 'shaping'];
const LARGE_CHIPS = new Set<OrbState>(['working', 'searching']);

const V1_HERO_PILLS: Array<{ state: OrbState; label: string }> = [
  { state: 'solving', label: 'Solving….' },
  { state: 'composing', label: 'Thinking….' },
];

const V2_HERO_PILLS: Array<{ state: OrbState; label: string }> = [
  { state: 'syncing', label: 'Syncing….' },
  { state: 'evolving', label: 'Evolving….' },
  { state: 'building', label: 'Building….' },
  { state: 'hypercube', label: 'Structuring….' },
  { state: 'conjuring', label: 'Conjuring….' },
  { state: 'conjuring_static', label: 'Conjuring static….' },
  { state: 'assembling', label: 'Assembling….' },
  { state: 'blooming', label: 'Blooming….' }
];
const V2_CHIP_STATES: OrbState[] = [];

export function Examples(props: {
  speed?: number;
  debug?: boolean;
  bigChips?: boolean;
  smallAll?: boolean;
}) {
  const [version, setVersion] = createSignal<'v1' | 'v2'>('v1');
  const surface = () => props.debug ? 'bg-transparent' : 'bg-(--hero-surface)';

  const currentHeroPills = () => version() === 'v1' ? V1_HERO_PILLS : V2_HERO_PILLS;
  const currentChipStates = () => version() === 'v1' ? V1_CHIP_STATES : V2_CHIP_STATES;

  return (
    <section class="w-full flex flex-col gap-3 mb-12" aria-label="Component demonstrations">
      
      {/* V1 / V2 Version Toggle */}
      <div class="flex flex-col items-center mb-8 mt-2">
        <div class="relative flex items-center bg-(--hero-surface) border border-[rgba(255,255,255,0.05)] p-1 rounded-full w-[260px] h-[44px]">
          {/* Animated slider highlight */}
          <div 
            class={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-(--icon-btn-hover) rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${version() === 'v1' ? 'translate-x-0' : 'translate-x-full'}`}
          />
          <button 
            onClick={() => setVersion('v1')}
            class={`relative flex-1 h-full flex items-center justify-center text-[13px] font-medium z-10 transition-colors duration-200 cursor-pointer ${version() === 'v1' ? 'text-(--title-color)' : 'text-(--subtitle-color)'}`}
          >
            V1 Original
          </button>
          <button 
            onClick={() => setVersion('v2')}
            class={`relative flex-1 h-full flex items-center justify-center text-[13px] font-medium z-10 transition-colors duration-200 cursor-pointer ${version() === 'v2' ? 'text-(--title-color)' : 'text-(--subtitle-color)'}`}
          >
            V2 Custom
          </button>
        </div>
        <div class="relative w-full h-6 mt-3">
          <p class={`absolute inset-0 flex items-center justify-center text-[13px] text-(--subtitle-color) font-normal transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${version() === 'v1' ? 'translate-y-0 opacity-60' : 'translate-y-1.5 opacity-0 pointer-events-none'}`}>
            Original hand-tuned engine states
          </p>
          <p class={`absolute inset-0 flex items-center justify-center text-[13px] text-(--subtitle-color) font-normal transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${version() === 'v2' ? 'translate-y-0 opacity-60' : '-translate-y-1.5 opacity-0 pointer-events-none'}`}>
            Custom expanded engine states
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <For each={currentHeroPills()}>
          {({ state, label }, index) => {
            const isLastOdd = () => currentHeroPills().length % 2 !== 0 && index() === currentHeroPills().length - 1;
            return (
              <div
                class={`relative w-full h-[314px] rounded-[30px] ${surface()} flex items-center justify-center px-10 py-12 overflow-hidden max-sm:h-auto max-sm:min-h-[200px] max-sm:px-5 max-sm:py-8 max-sm:rounded-[20px] ${isLastOdd() ? 'col-span-2 max-sm:col-span-1' : ''}`}
              >
                <div class={props.smallAll ? chipClass : listeningPillClass}>
                  {props.smallAll ? (
                    <ThinkingOrb state={state} size={20} speed={props.speed} />
                  ) : (
                    <ThinkingOrb state={state} size={64} speed={props.speed} style={{ width: '56px', height: '56px' }} />
                  )}
                  <span class="t-shimmer" data-text={label}>{label}</span>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <div class={`grid grid-cols-2 gap-3 [grid-auto-rows:151px] max-sm:grid-cols-1 max-sm:auto-rows-auto ${currentChipStates().length === 0 ? 'hidden' : ''}`}>
        <For each={currentChipStates()}>
          {(state) => {
            const large = () => !props.smallAll && (props.bigChips || LARGE_CHIPS.has(state));
            const label = () => large() ? `${cap(state)}….` : `Agent ${state}…`;
            return (
              <div
                class={`relative w-full ${large() ? 'row-span-2' : 'row-span-1'} rounded-[30px] ${surface()} flex items-center justify-center px-8 py-8 overflow-hidden max-sm:row-auto max-sm:h-auto max-sm:min-h-[200px] max-sm:rounded-[20px]`}
              >
                <div class={large() ? listeningPillClass : chipClass}>
                  {large() ? (
                    <ThinkingOrb state={state} size={64} speed={props.speed} style={{ width: '56px', height: '56px' }} />
                  ) : (
                    <ThinkingOrb state={state} size={20} speed={props.speed} />
                  )}
                  <span class="t-shimmer" data-text={label()}>{label()}</span>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </section>
  );
}
