import { createSignal, createMemo, For, Show } from 'solid-js';
import {
  BotAvatar,
  botAvatarTypes,
  botAvatarStates,
  botAvatarFaces,
  botAvatarPresets,
  type BotAvatarType,
  type BotAvatarState,
  type BotAvatarFace,
  type BotAvatarShading,
} from '../bot-avatars';
import { CopyButton } from './CopyButton';
import { cn } from '../lib/utils';

const tabBtnBase =
  'flex items-center justify-center h-9 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] font-normal leading-[14px] cursor-pointer transition-all duration-200 whitespace-nowrap [-webkit-tap-highlight-color:transparent] hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2';

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

function StrengthSlider(props: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  displayValue: string;
  onChange: (val: number) => void;
}) {
  const fillPct = () =>
    ((props.value - props.min) / (props.max - props.min)) * 100;

  return (
    <div class="flex flex-col gap-[9px] min-w-[100px] w-[130px] max-sm:w-full">
      <span class="text-xs font-normal leading-[14px] text-(--text-muted)">
        {props.label}
      </span>
      <div class="strength-track relative w-full h-9 rounded-lg bg-(--strength-bg) shadow-(--strength-shadow) overflow-hidden cursor-grab active:cursor-grabbing hover:bg-(--strength-hover)">
        <div
          class="absolute top-0 left-0 bottom-0 rounded-lg bg-(--strength-fill-bg) shadow-(--strength-shadow) transition-[width] duration-[80ms] ease-out pointer-events-none"
          style={{ width: `${fillPct()}%` }}
        />
        <span class="absolute top-0 left-[11px] h-full flex items-center text-[11px] font-normal leading-[14px] text-(--text-muted) whitespace-nowrap pointer-events-none z-[1]">
          {props.displayValue}
        </span>
        <input
          class="strength-input appearance-none absolute inset-0 w-full h-full m-0 p-0 bg-transparent cursor-grab opacity-0 z-[2] active:cursor-grabbing"
          type="range"
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          onInput={(e) => props.onChange(Number(e.currentTarget.value))}
          aria-label={props.label}
        />
      </div>
    </div>
  );
}

const SHADING_OPTIONS: { id: BotAvatarShading; label: string }[] = [
  { id: 'plastic', label: 'Plastic (Matcap 3D)' },
  { id: 'crisp', label: 'Crisp (Vector Edge)' },
  { id: 'smooth', label: 'Smooth (Soft Ambient)' },
  { id: 'flat', label: 'Flat (Silhouette)' },
];

export function BotAvatarsShowcase() {
  const [selectedType, setSelectedType] = createSignal<BotAvatarType>('clover');
  const [state, setState] = createSignal<BotAvatarState>('default');
  const [face, setFace] = createSignal<BotAvatarFace>('eyes');
  const [shading, setShading] = createSignal<BotAvatarShading>('plastic');
  const [speed, setSpeed] = createSignal(1);
  const [size, setSize] = createSignal(140);
  const [turn, setTurn] = createSignal(1);
  const [whirl, setWhirl] = createSignal(1);
  const [brightness, setBrightness] = createSignal(1);
  const [saturation, setSaturation] = createSignal(1.5);
  const [showRoster, setShowRoster] = createSignal(true);

  const snippet = createMemo(() => {
    const props = [`type="${selectedType()}"`];
    if (state() !== 'default') props.push(`state="${state()}"`);
    if (face() !== 'eyes') props.push(`face="${face()}"`);
    if (shading() !== 'plastic') props.push(`shading="${shading()}"`);
    if (size() !== 64) props.push(`size={${size()}}`);
    if (speed() !== 1) props.push(`speed={${speed()}}`);
    if (turn() !== 1) props.push(`turn={${turn()}}`);
    if (whirl() !== 0) props.push(`whirl={${whirl()}}`);
    if (brightness() !== 1) props.push(`brightness={${brightness()}}`);
    if (saturation() !== 1.5) props.push(`saturation={${saturation()}}`);

    return `import { BotAvatar } from 'solid-thinking-orbs';\n\n<BotAvatar ${props.join(' ')} />`;
  });

  return (
    <section
      class="w-full flex flex-col gap-1.5 mb-12 select-none"
      aria-label="Bot Avatars interactive playground"
    >
      <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">
        Bot Avatars
      </h2>

      {/* Main Control Panel */}
      <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300">
        {/* Shape Picker (18 types) */}
        <div class="flex flex-col gap-2 min-w-0" role="radiogroup" aria-label="Bot Avatar Body Shape">
          <span class="text-xs font-normal leading-[14px] text-(--text-muted)">
            Body Shape ({botAvatarTypes.length} types)
          </span>
          <div class="flex gap-2 items-center flex-wrap">
            <For each={botAvatarTypes}>
              {(t) => {
                const isActive = () => selectedType() === t;
                const p = botAvatarPresets[t];
                return (
                  <TabBtn active={isActive()} onClick={() => setSelectedType(t)}>
                    <span
                      class="w-2.5 h-2.5 rounded-full mr-1.5 shrink-0 border border-white/20"
                      style={{ 'background-color': p.color }}
                    />
                    <span>{p.label}</span>
                  </TabBtn>
                );
              }}
            </For>
          </div>
        </div>

        {/* State, Face, and Shading Switchers */}
        <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)]">
          {/* State */}
          <div class="flex flex-col gap-2 min-w-0" role="radiogroup" aria-label="Bot State">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">State</span>
            <div class="flex gap-2 items-center">
              <For each={botAvatarStates}>
                {(s) => (
                  <TabBtn active={state() === s} onClick={() => setState(s)}>
                    {s === 'default' ? 'Idle' : s === 'working' ? 'Working' : 'Sleeping'}
                  </TabBtn>
                )}
              </For>
            </div>
          </div>

          {/* Face */}
          <div class="flex flex-col gap-2 min-w-0" role="radiogroup" aria-label="Bot Face">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Face</span>
            <div class="flex gap-2 items-center">
              <For each={botAvatarFaces}>
                {(f) => (
                  <TabBtn active={face() === f} onClick={() => setFace(f)}>
                    {f === 'eyes' ? 'Eyes only' : 'Mouth & Eyes'}
                  </TabBtn>
                )}
              </For>
            </div>
          </div>

          {/* Shading */}
          <div class="flex flex-col gap-2 min-w-0" role="radiogroup" aria-label="Shading Material">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Material Shading</span>
            <div class="flex gap-2 items-center flex-wrap">
              <For each={SHADING_OPTIONS}>
                {(sh) => (
                  <TabBtn active={shading() === sh.id} onClick={() => setShading(sh.id)}>
                    {sh.label}
                  </TabBtn>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Dynamic Knobs & Sliders */}
        <div class="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)] flex-wrap">
          <StrengthSlider
            label="Size"
            min={48}
            max={200}
            step={4}
            value={size()}
            displayValue={`${size()}px`}
            onChange={setSize}
          />
          <StrengthSlider
            label="Speed"
            min={0.25}
            max={3}
            step={0.25}
            value={speed()}
            displayValue={`${speed()}x`}
            onChange={setSpeed}
          />
          <StrengthSlider
            label="Head Turn"
            min={0}
            max={2}
            step={0.1}
            value={turn()}
            displayValue={`${turn()}`}
            onChange={setTurn}
          />
          <StrengthSlider
            label="Whirl Trail"
            min={0}
            max={2}
            step={0.2}
            value={whirl()}
            displayValue={`${whirl()}`}
            onChange={setWhirl}
          />
          <StrengthSlider
            label="Brightness"
            min={0.5}
            max={1.8}
            step={0.05}
            value={brightness()}
            displayValue={`${brightness()}`}
            onChange={setBrightness}
          />
          <StrengthSlider
            label="Saturation"
            min={0.2}
            max={2.0}
            step={0.1}
            value={saturation()}
            displayValue={`${saturation()}`}
            onChange={setSaturation}
          />

          <div class="flex flex-col gap-2 min-w-0 ml-auto max-sm:ml-0">
            <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Roster View</span>
            <TabBtn active={showRoster()} onClick={() => setShowRoster((v) => !v)}>
              {showRoster() ? `Hide All ${botAvatarTypes.length} Bots` : `Show All ${botAvatarTypes.length} Bots`}
            </TabBtn>
          </div>
        </div>
      </div>

      {/* Hero Stage Area */}
      <div class="relative w-full min-h-[340px] rounded-[16px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-5 max-sm:p-6 overflow-hidden border border-white/[0.04]">
        {/* Subtle radial ambient background glow */}
        <div
          class="absolute pointer-events-none w-[380px] h-[380px] rounded-full blur-[100px] opacity-25 transition-colors duration-700 -z-0"
          style={{ 'background-color': botAvatarPresets[selectedType()].color }}
        />

        {/* Live Interactive Hero Bot Avatar */}
        <div class="relative z-10 flex flex-col items-center gap-4 cursor-pointer group">
          <BotAvatar
            type={selectedType()}
            state={state()}
            face={face()}
            shading={shading()}
            size={size()}
            speed={speed()}
            turn={turn()}
            whirl={whirl()}
            brightness={brightness()}
            saturation={saturation()}
            interactive={true}
          />
          <div class="flex flex-col items-center gap-1">
            <span class="text-sm font-semibold tracking-tight text-white/90">
              {botAvatarPresets[selectedType()].label} Bot
            </span>
            <span class="text-xs text-white/40 group-hover:text-white/70 transition-colors">
              Click to poke & turn · Move mouse to glance
            </span>
          </div>
        </div>
      </div>

      {/* All 18 Bots Live Roster Grid */}
      <Show when={showRoster()}>
        <div class="w-full flex flex-col gap-3 mt-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-white/80">
              Live Roster ({botAvatarTypes.length} shapes in {state()} state)
            </h3>
            <span class="text-xs text-white/40">Interactive: click any bot to hop</span>
          </div>

          <div class="grid grid-cols-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-3 w-full">
            <For each={botAvatarTypes}>
              {(t) => {
                const isCurrent = () => selectedType() === t;
                const p = botAvatarPresets[t];
                return (
                  <button
                    type="button"
                    onClick={() => setSelectedType(t)}
                    class={cn(
                      'flex flex-col items-center justify-center p-4 rounded-2xl bg-(--surface) border transition-all duration-200 cursor-pointer text-inherit',
                      isCurrent()
                        ? 'border-white/30 bg-white/[0.04] shadow-lg scale-[1.02]'
                        : 'border-white/[0.04] hover:border-white/15 hover:bg-white/[0.02]'
                    )}
                  >
                    <div class="h-[80px] flex items-center justify-center pointer-events-none">
                      <BotAvatar
                        type={t}
                        state={state()}
                        face={face()}
                        shading={shading()}
                        size={64}
                        speed={speed()}
                        turn={turn()}
                        whirl={whirl()}
                        interactive={false}
                      />
                    </div>
                    <div class="flex items-center gap-1.5 mt-2">
                      <span
                        class="w-2 h-2 rounded-full shrink-0"
                        style={{ 'background-color': p.color }}
                      />
                      <span class="text-xs font-medium text-white/80">{p.label}</span>
                    </div>
                  </button>
                );
              }}
            </For>
          </div>
        </div>
      </Show>

      {/* Code Snippet Box */}
      <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden mt-2">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">
          {snippet()}
        </code>
        <CopyButton getText={() => snippet()} />
      </div>
    </section>
  );
}

export default BotAvatarsShowcase;
