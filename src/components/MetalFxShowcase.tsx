import { createSignal, createMemo, Show, For } from 'solid-js';
import { MetalFx } from '../metal-fx';
import type { MetalFxPreset, MetalFxVariant } from '../metal-fx';
import { CopyButton } from './CopyButton';
import { ArrowUpIcon, SearchIcon18 } from './icons';
import { PlayPauseToggle } from './PlayPauseToggle';
import { cn } from '../lib/utils';

const PRESETS: MetalFxPreset[] = ['chromatic', 'silver', 'gold', 'blueberry', 'rose', 'copper'];
const VARIANTS: MetalFxVariant[] = ['button', 'circle'];

const tabBtnBase = 'flex items-center justify-center h-9 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] font-normal leading-[14px] cursor-pointer transition-all duration-200 whitespace-nowrap [-webkit-tap-highlight-color:transparent] hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2';

function TabBtn(props: { active: boolean; children: any; onClick: () => void; class?: string }) {
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

const pillBaseClass = 'h-10 rounded-full border border-[rgba(44,47,54,0.52)] bg-[#1d1d1d] text-[#f8f8f8] shadow-[inset_0_0_50px_0_rgba(255,255,255,0.02)] cursor-pointer flex items-center justify-center p-0';
const demoPillClass = `${pillBaseClass} w-[140px] text-sm font-medium font-inherit leading-[17.938px] tracking-normal whitespace-nowrap`;
const demoCircleClass = `${pillBaseClass} w-10`;

export function MetalFxShowcase() {
  const [variant, setVariant] = createSignal<MetalFxVariant>('button');
  const [preset, setPreset] = createSignal<MetalFxPreset>('blueberry');
  const [strength, setStrength] = createSignal(95);
  const [paused, setPaused] = createSignal(false);
  const [disableGlow, setDisableGlow] = createSignal(false);
  const [disableReflection, setDisableReflection] = createSignal(false);

  let playPauseRef!: HTMLButtonElement;
  let neighborRef!: HTMLLabelElement;

  const snippet = createMemo(() => {
    const props = [`preset="${preset()}"`];
    if (variant() !== 'button') props.push(`variant="${variant()}"`);
    if (strength() !== 100) props.push(`strength={${(strength() / 100).toFixed(2)}}`);
    if (disableGlow()) props.push('disableGlow');
    if (!disableReflection()) props.push('reflectionTargets={[neighborRef]}');
    const child = variant() === 'circle'
      ? '  <button aria-label="Send"><ArrowUpIcon /></button>'
      : '  <button>Upgrade to Pro</button>';
    return `import { MetalFx } from 'solid-thinking-orbs';\n\n<MetalFx ${props.join(' ')}>\n${child}\n</MetalFx>`;
  });

  return (
    <section class="w-full flex flex-col gap-1.5 mb-12" aria-label="Interactive playground">
      <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Playground</h2>

      <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
          <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Component type">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Type</span>
            <div class="flex gap-2 items-center">
              <For each={VARIANTS}>
                {(v) => (
                  <TabBtn active={variant() === v} onClick={() => setVariant(v)}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </TabBtn>
                )}
              </For>
            </div>
          </div>

          <div class="flex flex-col gap-[9px] min-w-0">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Options</span>
            <div class="flex gap-2 items-center">
              <TabBtn active={disableGlow()} onClick={() => setDisableGlow((g) => !g)}>
                No Glow
              </TabBtn>
              <TabBtn active={disableReflection()} onClick={() => setDisableReflection((r) => !r)}>
                No Reflection
              </TabBtn>
            </div>
          </div>

          <div class="flex flex-col gap-[9px] min-w-[100px] w-[140px] max-sm:w-full ml-auto max-sm:ml-0">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Strength</span>
            <div class="strength-track relative w-full h-9 rounded-lg bg-(--strength-bg) shadow-(--strength-shadow) overflow-hidden cursor-grab active:cursor-grabbing hover:bg-(--strength-hover)">
              <div class="absolute top-0 left-0 bottom-0 rounded-lg bg-(--strength-fill-bg) shadow-(--strength-shadow) transition-[width] duration-[80ms] ease-out pointer-events-none" style={{ width: `${strength()}%` }} />
              <span class="absolute top-0 left-[11px] h-full flex items-center text-[11px] font-normal leading-[14px] text-(--text-muted) whitespace-nowrap pointer-events-none z-[1]">{strength()}%</span>
              <input
                class="strength-input appearance-none absolute inset-0 w-full h-full m-0 p-0 bg-transparent cursor-grab opacity-0 z-[2] active:cursor-grabbing"
                type="range"
                min={0}
                max={100}
                step={1}
                value={strength()}
                onInput={(e) => setStrength(Number(e.currentTarget.value))}
                aria-label="Effect strength"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-[9px] min-w-0 pt-2 border-t border-[rgba(255,255,255,0.05)]" role="radiogroup" aria-label="Color preset">
          <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color</span>
          <div class="flex flex-wrap gap-2 items-center">
            <For each={PRESETS}>
              {(p) => (
                <TabBtn active={preset() === p} onClick={() => setPreset(p)}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </TabBtn>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class="relative w-full min-h-[380px] rounded-[16px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-6 max-sm:p-6 border border-white/[0.04]">
        <div class="flex items-center gap-3">
          <label ref={neighborRef} class="relative flex items-center gap-1.5 w-[180px] h-10 rounded-full py-2.5 pr-2 pl-3 bg-[#1d1d1d] border border-[rgba(44,47,54,0.52)] shadow-[inset_0_0_50px_0_rgba(255,255,255,0.02)] text-[#f8f8f8] text-sm font-medium cursor-text [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:stroke-[#8B8B8B] [&_svg]:fill-none">
            <SearchIcon18 />
            <input class="flex-1 min-w-0 border-none bg-transparent text-sm font-medium font-inherit outline-none text-inherit placeholder:text-current placeholder:opacity-30" type="search" placeholder="Search" spellcheck={false} tabIndex={-1} aria-label="Search" />
          </label>

          <MetalFx
            preset={preset()}
            variant={variant()}
            theme="dark"
            strength={strength() / 100}
            paused={paused()}
            disableGlow={disableGlow()}
            reflectionTargets={disableReflection() ? undefined : [() => playPauseRef, () => neighborRef] as any}
          >
            <Show when={variant() === 'circle'}>
              <button type="button" class={demoCircleClass}>
                <ArrowUpIcon />
              </button>
            </Show>
            <Show when={variant() !== 'circle'}>
              <button type="button" class={demoPillClass}>
                Upgrade to Pro
              </button>
            </Show>
          </MetalFx>
        </div>

        <PlayPauseToggle ref={el => playPauseRef = el} playing={!paused()} onToggle={() => setPaused((p) => !p)} class="max-sm:absolute max-sm:bottom-6 max-sm:left-1/2 max-sm:-translate-x-1/2" />
      </div>

      <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">{snippet()}</code>
        <CopyButton getText={() => snippet()} />
      </div>
    </section>
  );
}
