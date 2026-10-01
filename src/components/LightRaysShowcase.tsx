import {
  createMemo,
  createSignal,
  For,
  Show,
} from 'solid-js';
import {
  LightRays,
  lightRaysPresets,
  presetNames,
  type RaysColorConfig,
} from '../light-rays';
import { cn } from '../lib/utils';
import { CopyButton } from './CopyButton';

const tabBtnBase =
  'flex items-center justify-center h-9 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] font-normal leading-[14px] cursor-pointer transition-all duration-200 whitespace-nowrap [-webkit-tap-highlight-color:transparent] hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2';

function TabBtn(props: {
  active: boolean;
  children: any;
  onClick: () => void;
  class?: string;
}) {
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

export function LightRaysShowcase() {
  const [activePreset, setActivePreset] = createSignal<string>('Cyber Blue');

  // Physics & Tuning State
  const [intensity, setIntensity] = createSignal(13);
  const [rays, setRays] = createSignal(32);
  const [reach, setReach] = createSignal(16);
  const [position, setPosition] = createSignal(50);
  const [speed, setSpeed] = createSignal(10);
  const [animate, setAnimate] = createSignal(true);

  // Color State
  const [colorMode, setColorMode] = createSignal<'single' | 'multi' | 'random'>('single');
  const [color1, setColor1] = createSignal('#639AFF');
  const [color2, setColor2] = createSignal('#2060DF');
  const [backgroundColor, setBackgroundColor] = createSignal('#000000');

  const applyPreset = (name: string) => {
    setActivePreset(name);
    const p = lightRaysPresets[name];
    if (!p) return;
    setIntensity(p.intensity ?? 13);
    setRays(p.rays ?? 32);
    setReach(p.reach ?? 16);
    setPosition(p.position ?? 50);
    setSpeed(p.speed ?? 10);

    const rc = p.raysColor;
    if (rc.mode === 'multi') {
      setColorMode('multi');
      setColor1(rc.color1);
      setColor2(rc.color2);
    } else if (rc.mode === 'random') {
      setColorMode('random');
    } else {
      setColorMode('single');
      setColor1(rc.color ?? '#639AFF');
    }
  };

  const raysColorConfig = createMemo<RaysColorConfig>(() => {
    const mode = colorMode();
    if (mode === 'random') {
      return { mode: 'random' };
    }
    if (mode === 'multi') {
      return { mode: 'multi', color1: color1(), color2: color2() };
    }
    return { mode: 'single', color: color1() };
  });

  const codeSnippet = createMemo(() => {
    const mode = colorMode();
    let colorProp = '';
    if (mode === 'multi') {
      colorProp = `\n    raysColor={{ mode: "multi", color1: "${color1()}", color2: "${color2()}" }}`;
    } else if (mode === 'random') {
      colorProp = `\n    raysColor={{ mode: "random" }}`;
    } else if (color1() !== '#639AFF') {
      colorProp = `\n    raysColor={{ mode: "single", color: "${color1()}" }}`;
    }

    return `import { LightRays } from 'solid-thinking-orbs';

<div class="relative min-h-[380px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
  <div class="z-10 flex flex-wrap items-center justify-center gap-3 text-white">
    <p class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">${colorMode() === 'multi' ? 'Multi Colored' : 'Beautiful'}</p>
    <p class="text-4xl sm:text-5xl md:text-6xl font-medium italic font-serif text-white/90 leading-tight">Light Rays</p>
  </div>
  <LightRays
    intensity={${intensity()}}
    rays={${rays()}}
    reach={${reach()}}
    position={${position()}}
    animation={{ animate: ${animate()}, speed: ${speed()} }}${colorProp}
    backgroundColor="${backgroundColor()}"
    radius="16px"
  />
</div>`;
  });

  return (
    <div class="w-full flex flex-col gap-8">
      {/* Playground Section */}
      <section class="w-full flex flex-col gap-1.5" aria-label="Light Rays interactive playground">
        <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Playground</h2>

        {/* Controls Panel */}
        <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {/* Row 1: Presets, Color Mode, Animation */}
          <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
            <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Presets">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Preset</span>
              <div class="flex gap-2 items-center flex-wrap">
                <For each={presetNames}>
                  {(name) => (
                    <TabBtn
                      active={activePreset() === name}
                      onClick={() => applyPreset(name)}
                    >
                      {name}
                    </TabBtn>
                  )}
                </For>
                <TabBtn
                  active={activePreset() === 'Custom'}
                  onClick={() => setActivePreset('Custom')}
                >
                  Custom
                </TabBtn>
              </div>
            </div>

            <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Color Mode">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color Mode</span>
              <div class="flex gap-2 items-center">
                <TabBtn
                  active={colorMode() === 'single'}
                  onClick={() => {
                    setColorMode('single');
                    setActivePreset('Custom');
                  }}
                >
                  Single
                </TabBtn>
                <TabBtn
                  active={colorMode() === 'multi'}
                  onClick={() => {
                    setColorMode('multi');
                    setActivePreset('Custom');
                  }}
                >
                  Multi (Dual)
                </TabBtn>
                <TabBtn
                  active={colorMode() === 'random'}
                  onClick={() => {
                    setColorMode('random');
                    setActivePreset('Custom');
                  }}
                >
                  Random HSL
                </TabBtn>
              </div>
            </div>

            <div class="flex flex-col gap-[9px] min-w-0 ml-auto max-sm:ml-0">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Animation</span>
              <div class="flex gap-2 items-center">
                <TabBtn active={animate()} onClick={() => setAnimate((a) => !a)}>
                  {animate() ? 'Animated' : 'Paused'}
                </TabBtn>
              </div>
            </div>
          </div>

          {/* Row 2: Custom Colors */}
          <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)]">
            <Show when={colorMode() !== 'random'}>
              <div class="flex flex-col gap-[9px] min-w-[120px] flex-1">
                <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color 1 (Primary)</span>
                <div class="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-(--tab-bg) border border-[rgba(255,255,255,0.06)]">
                  <input
                    type="color"
                    value={color1()}
                    onInput={(e) => {
                      setColor1(e.currentTarget.value);
                      setActivePreset('Custom');
                    }}
                    class="w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={color1()}
                    onInput={(e) => {
                      setColor1(e.currentTarget.value);
                      setActivePreset('Custom');
                    }}
                    class="w-full bg-transparent border-none text-xs text-(--title-color) font-mono focus:outline-none"
                  />
                </div>
              </div>

              <Show when={colorMode() === 'multi'}>
                <div class="flex flex-col gap-[9px] min-w-[120px] flex-1">
                  <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color 2 (Accent)</span>
                  <div class="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-(--tab-bg) border border-[rgba(255,255,255,0.06)]">
                    <input
                      type="color"
                      value={color2()}
                      onInput={(e) => {
                        setColor2(e.currentTarget.value);
                        setActivePreset('Custom');
                      }}
                      class="w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={color2()}
                      onInput={(e) => {
                        setColor2(e.currentTarget.value);
                        setActivePreset('Custom');
                      }}
                      class="w-full bg-transparent border-none text-xs text-(--title-color) font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </Show>
            </Show>

            <div class="flex flex-col gap-[9px] min-w-[120px] flex-1">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Background</span>
              <div class="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-(--tab-bg) border border-[rgba(255,255,255,0.06)]">
                <input
                  type="color"
                  value={backgroundColor()}
                  onInput={(e) => setBackgroundColor(e.currentTarget.value)}
                  class="w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={backgroundColor()}
                  onInput={(e) => setBackgroundColor(e.currentTarget.value)}
                  class="w-full bg-transparent border-none text-xs text-(--title-color) font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Sliders using StrengthSlider */}
          <div class="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)] flex-wrap">
            <StrengthSlider
              label="Intensity"
              min={1}
              max={100}
              step={1}
              value={intensity()}
              displayValue={`${intensity()}`}
              onChange={(v) => {
                setIntensity(v);
                setActivePreset('Custom');
              }}
            />
            <StrengthSlider
              label="Rays Density"
              min={4}
              max={100}
              step={1}
              value={rays()}
              displayValue={`${rays()}`}
              onChange={(v) => {
                setRays(v);
                setActivePreset('Custom');
              }}
            />
            <StrengthSlider
              label="Reach"
              min={1}
              max={100}
              step={1}
              value={reach()}
              displayValue={`${reach()}`}
              onChange={(v) => {
                setReach(v);
                setActivePreset('Custom');
              }}
            />
            <StrengthSlider
              label="Origin X"
              min={0}
              max={100}
              step={1}
              value={position()}
              displayValue={`${position()}%`}
              onChange={(v) => {
                setPosition(v);
                setActivePreset('Custom');
              }}
            />
            <StrengthSlider
              label="Speed"
              min={0}
              max={50}
              step={1}
              value={speed()}
              displayValue={`${speed()}`}
              onChange={(v) => {
                setSpeed(v);
                setActivePreset('Custom');
              }}
            />
          </div>
        </div>

        {/* Hero Stage Area */}
        <div class="relative w-full min-h-[380px] md:min-h-[440px] rounded-[16px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-5 max-sm:p-6 overflow-hidden border border-white/[0.04]">
          {/* Centered Typography Hero */}
          <div class="relative z-10 flex flex-wrap items-center justify-center gap-3 select-none pointer-events-none drop-shadow-md text-center">
            <p class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
              {colorMode() === 'multi' ? 'Multi Colored' : 'Beautiful'}
            </p>
            <p class="text-4xl sm:text-5xl md:text-6xl font-medium italic font-serif text-white/90 leading-tight">
              Light Rays
            </p>
          </div>

          <LightRays
            intensity={intensity()}
            rays={rays()}
            reach={reach()}
            position={position()}
            animation={{ animate: animate(), speed: speed() }}
            raysColor={raysColorConfig()}
            backgroundColor={backgroundColor()}
            radius="16px"
            class="absolute inset-0"
          />
        </div>
      </section>

      {/* Usage / Code Section */}
      <section class="w-full mb-6" aria-label="Usage">
        <h2 class="text-base font-normal leading-[34px] text-(--section-title-muted) mb-1">Usage</h2>
        <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative">
          <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">
            {codeSnippet()}
          </code>
          <CopyButton getText={() => codeSnippet()} />
        </div>
      </section>
    </div>
  );
}

export default LightRaysShowcase;
