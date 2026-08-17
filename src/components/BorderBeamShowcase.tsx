import { createSignal, createMemo, For } from 'solid-js';
import { BorderBeam } from '../border-beam';
import type { BorderBeamColorVariant, BorderBeamSize } from '../border-beam';
import { CopyButton } from './CopyButton';
import { cn } from '../lib/utils';

const SIZES: { id: BorderBeamSize; label: string }[] = [
  { id: 'pulse-inner', label: 'Pulse Inner' },
  { id: 'pulse-outside', label: 'Pulse Outside' },
  { id: 'md', label: 'Rotate' },
  { id: 'line', label: 'Line' },
  { id: 'sm', label: 'Small' },
];

const COLORS: { id: BorderBeamColorVariant; label: string }[] = [
  { id: 'colorful', label: 'Colorful' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'mono', label: 'Mono' },
];

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

export function BorderBeamShowcase() {
  const [size, setSize] = createSignal<BorderBeamSize>('pulse-inner');
  const [colorVariant, setColorVariant] = createSignal<BorderBeamColorVariant>('colorful');
  const [duration, setDuration] = createSignal(2.4);
  const [active, setActive] = createSignal(true);

  const snippet = createMemo(() => {
    const props = [`size="${size()}"`, `colorVariant="${colorVariant()}"`];
    if (duration() !== 2.4) props.push(`duration={${duration()}}`);
    if (!active()) props.push(`active={false}`);
    return `import { BorderBeam } from 'solid-thinking-orbs';\n\n<div class="relative w-[380px] h-[180px] rounded-2xl bg-zinc-900">\n  <BorderBeam ${props.join(' ')} borderRadius={16}>\n    <div class="p-6 flex flex-col items-center justify-center h-full">\n      <h3 class="text-white font-medium">Border Beam Card</h3>\n    </div>\n  </BorderBeam>\n</div>`;
  });

  const durationMin = 1.0;
  const durationMax = 6.0;
  const fillPct = () => ((duration() - durationMin) / (durationMax - durationMin)) * 100;

  return (
    <section class="w-full flex flex-col gap-1.5 mb-12" aria-label="BorderBeam interactive showcase">
      <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Playground</h2>

      <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
          <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="BorderBeam size">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Preset</span>
            <div class="flex gap-2 items-center flex-wrap">
              <For each={SIZES}>
                {(s) => (
                  <TabBtn active={size() === s.id} onClick={() => setSize(s.id)}>
                    {s.label}
                  </TabBtn>
                )}
              </For>
            </div>
          </div>

          <div class="flex flex-col gap-[9px] min-w-0">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">State</span>
            <div class="flex gap-2 items-center">
              <TabBtn active={active()} onClick={() => setActive((a) => !a)}>
                {active() ? 'Active' : 'Paused'}
              </TabBtn>
            </div>
          </div>

          <div class="flex flex-col gap-[9px] min-w-[100px] w-[140px] max-sm:w-full ml-auto max-sm:ml-0">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Duration</span>
            <div class="strength-track relative w-full h-9 rounded-lg bg-(--strength-bg) shadow-(--strength-shadow) overflow-hidden cursor-grab active:cursor-grabbing hover:bg-(--strength-hover)">
              <div class="absolute top-0 left-0 bottom-0 rounded-lg bg-(--strength-fill-bg) shadow-(--strength-shadow) transition-[width] duration-[80ms] ease-out pointer-events-none" style={{ width: `${fillPct()}%` }} />
              <span class="absolute top-0 left-[11px] h-full flex items-center text-[11px] font-normal leading-[14px] text-(--text-muted) whitespace-nowrap pointer-events-none z-[1]">{duration()}s</span>
              <input
                class="strength-input appearance-none absolute inset-0 w-full h-full m-0 p-0 bg-transparent cursor-grab opacity-0 z-[2] active:cursor-grabbing"
                type="range"
                min={durationMin}
                max={durationMax}
                step={0.2}
                value={duration()}
                onInput={(e) => setDuration(Number(e.currentTarget.value))}
                aria-label="Animation duration"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-[9px] min-w-0 pt-2 border-t border-[rgba(255,255,255,0.05)]" role="radiogroup" aria-label="Color variant">
          <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color</span>
          <div class="flex flex-wrap gap-2 items-center">
            <For each={COLORS}>
              {(c) => (
                <TabBtn active={colorVariant() === c.id} onClick={() => setColorVariant(c.id)}>
                  {c.label}
                </TabBtn>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class="relative w-full min-h-[304px] rounded-[10px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-6 max-sm:p-6">
        <div class="relative w-full max-w-[400px] h-[190px] rounded-[16px] bg-[#121212] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
          <BorderBeam
            size={size()}
            colorVariant={colorVariant()}
            duration={duration()}
            active={active()}
            borderRadius={16}
            theme="dark"
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <div class="relative z-10 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
              <h3 class="text-white font-medium text-base mb-1">Border Beam</h3>
              <p class="text-white/40 text-xs">Smooth animated glows and pulses</p>
            </div>
          </BorderBeam>
        </div>
      </div>

      <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">{snippet()}</code>
        <CopyButton getText={() => snippet()} />
      </div>
    </section>
  );
}
