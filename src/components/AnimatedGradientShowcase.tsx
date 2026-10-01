import {
  createMemo,
  createSignal,
  For,
  Show,
} from 'solid-js';
import {
  AnimatedGradient,
  animatedGradientPresets,
  presetNames,
  type GradientConfig,
  type NoiseConfig,
  type PatternShape,
  type PresetName,
} from '../animated-gradient';
import { cn } from '../lib/utils';
import { CopyButton } from './CopyButton';

const PATTERN_SHAPES: PatternShape[] = ['Checks', 'Stripes', 'Edge'];

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

export function AnimatedGradientShowcase() {
  const [activePreset, setActivePreset] = createSignal<PresetName | 'custom'>('Prism');

  // Custom configuration state
  const [color1, setColor1] = createSignal('#050505');
  const [color2, setColor2] = createSignal('#66B3FF');
  const [color3, setColor3] = createSignal('#FFFFFF');
  const [rotation, setRotation] = createSignal(-50);
  const [proportion, setProportion] = createSignal(1);
  const [scale, setScale] = createSignal(0.01);
  const [speed, setSpeed] = createSignal(30);
  const [distortion, setDistortion] = createSignal(0);
  const [swirl, setSwirl] = createSignal(50);
  const [swirlIterations, setSwirlIterations] = createSignal(16);
  const [softness, setSoftness] = createSignal(47);
  const [offset, setOffset] = createSignal(-299);
  const [shape, setShape] = createSignal<PatternShape>('Checks');
  const [shapeSize, setShapeSize] = createSignal(45);

  // Noise config
  const [enableNoise, setEnableNoise] = createSignal(false);
  const [noiseOpacity, setNoiseOpacity] = createSignal(0.2);
  const [noiseScale, setNoiseScale] = createSignal(1);

  const applyPreset = (name: PresetName) => {
    setActivePreset(name);
    const p = animatedGradientPresets[name];
    if (!p) return;
    setColor1(p.color1);
    setColor2(p.color2);
    setColor3(p.color3);
    setRotation(p.rotation);
    setProportion(p.proportion);
    setScale(p.scale);
    setSpeed(p.speed);
    setDistortion(p.distortion);
    setSwirl(p.swirl);
    setSwirlIterations(p.swirlIterations);
    setSoftness(p.softness);
    setOffset(p.offset);
    setShape(p.shape);
    setShapeSize(p.shapeSize);
  };

  const gradientConfig = createMemo<GradientConfig>(() => {
    const current = activePreset();
    if (current !== 'custom') {
      return {
        preset: current,
        speed: speed(),
      };
    }
    return {
      preset: 'custom',
      color1: color1(),
      color2: color2(),
      color3: color3(),
      rotation: rotation(),
      proportion: proportion(),
      scale: scale(),
      speed: speed(),
      distortion: distortion(),
      swirl: swirl(),
      swirlIterations: swirlIterations(),
      softness: softness(),
      offset: offset(),
      shape: shape(),
      shapeSize: shapeSize(),
    };
  });

  const noiseConfig = createMemo<NoiseConfig | undefined>(() => {
    if (!enableNoise()) return undefined;
    return {
      opacity: noiseOpacity(),
      scale: noiseScale(),
    };
  });

  const codeSnippet = createMemo(() => {
    const isCustom = activePreset() === 'custom';
    if (!isCustom) {
      const speedProp =
        speed() !== animatedGradientPresets[activePreset() as PresetName].speed
          ? `, speed: ${speed()}`
          : '';
      const noiseProp = enableNoise()
        ? `\n  noise={{ opacity: ${noiseOpacity()}, scale: ${noiseScale()} }}`
        : '';
      return `import { AnimatedGradient } from 'solid-thinking-orbs';

<div class="relative h-[380px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
  <div class="z-10 flex flex-col items-center text-white gap-1 select-none">
    <p class="text-4xl font-semibold tracking-tight">Animated</p>
    <p class="text-4xl font-medium italic font-serif">Gradient</p>
  </div>
  <AnimatedGradient
    config={{ preset: "${activePreset()}"${speedProp} }}${noiseProp}
  />
</div>`;
    }

    const noiseProp = enableNoise()
      ? `\n  noise={{ opacity: ${noiseOpacity()}, scale: ${noiseScale()} }}`
      : '';

    return `import { AnimatedGradient } from 'solid-thinking-orbs';

<div class="relative h-[380px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
  <div class="z-10 flex flex-col items-center text-white gap-1 select-none">
    <p class="text-4xl font-semibold tracking-tight">Animated</p>
    <p class="text-4xl font-medium italic font-serif">Gradient</p>
  </div>
  <AnimatedGradient
    config={{
      preset: "custom",
      color1: "${color1()}",
      color2: "${color2()}",
      color3: "${color3()}",
      rotation: ${rotation()},
      proportion: ${proportion()},
      scale: ${scale()},
      speed: ${speed()},
      distortion: ${distortion()},
      swirl: ${swirl()},
      swirlIterations: ${swirlIterations()},
      softness: ${softness()},
      offset: ${offset()},
      shape: "${shape()}",
      shapeSize: ${shapeSize()},
    }}${noiseProp}
  />
</div>`;
  });

  return (
    <div class="w-full flex flex-col gap-8">
      {/* Playground Section */}
      <section class="w-full flex flex-col gap-1.5" aria-label="Animated Gradient interactive playground">
        <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Playground</h2>

        {/* Controls Panel */}
        <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {/* Row 1: Presets & Pattern Shape */}
          <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
            <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Preset">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Preset</span>
              <div class="flex gap-2 items-center flex-wrap">
                <For each={presetNames}>
                  {(p) => (
                    <TabBtn active={activePreset() === p} onClick={() => applyPreset(p)}>
                      {p}
                    </TabBtn>
                  )}
                </For>
                <TabBtn active={activePreset() === 'custom'} onClick={() => setActivePreset('custom')}>
                  Custom
                </TabBtn>
              </div>
            </div>

            <div class="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Pattern Shape">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Shape</span>
              <div class="flex gap-2 items-center">
                <For each={PATTERN_SHAPES}>
                  {(s) => (
                    <TabBtn
                      active={shape() === s}
                      onClick={() => {
                        setShape(s);
                        setActivePreset('custom');
                      }}
                    >
                      {s}
                    </TabBtn>
                  )}
                </For>
              </div>
            </div>

            <div class="flex flex-col gap-[9px] min-w-0 ml-auto max-sm:ml-0">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Noise Grain</span>
              <div class="flex gap-2 items-center">
                <TabBtn active={enableNoise()} onClick={() => setEnableNoise((v) => !v)}>
                  {enableNoise() ? 'Noise Enabled' : 'Noise Off'}
                </TabBtn>
              </div>
            </div>
          </div>

          {/* Row 2: Custom Colors (Visible when Custom is selected or available) */}
          <div class="flex flex-wrap items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)]">
            <div class="flex flex-col gap-[9px] min-w-[120px] flex-1">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color 1 (Base)</span>
              <div class="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-(--tab-bg) border border-[rgba(255,255,255,0.06)]">
                <input
                  type="color"
                  value={color1()}
                  onInput={(e) => {
                    setColor1(e.currentTarget.value);
                    setActivePreset('custom');
                  }}
                  class="w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={color1()}
                  onInput={(e) => {
                    setColor1(e.currentTarget.value);
                    setActivePreset('custom');
                  }}
                  class="w-full bg-transparent border-none text-xs text-(--title-color) font-mono focus:outline-none"
                />
              </div>
            </div>

            <div class="flex flex-col gap-[9px] min-w-[120px] flex-1">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color 2 (Accent)</span>
              <div class="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-(--tab-bg) border border-[rgba(255,255,255,0.06)]">
                <input
                  type="color"
                  value={color2()}
                  onInput={(e) => {
                    setColor2(e.currentTarget.value);
                    setActivePreset('custom');
                  }}
                  class="w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={color2()}
                  onInput={(e) => {
                    setColor2(e.currentTarget.value);
                    setActivePreset('custom');
                  }}
                  class="w-full bg-transparent border-none text-xs text-(--title-color) font-mono focus:outline-none"
                />
              </div>
            </div>

            <div class="flex flex-col gap-[9px] min-w-[120px] flex-1">
              <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Color 3 (Highlight)</span>
              <div class="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-(--tab-bg) border border-[rgba(255,255,255,0.06)]">
                <input
                  type="color"
                  value={color3()}
                  onInput={(e) => {
                    setColor3(e.currentTarget.value);
                    setActivePreset('custom');
                  }}
                  class="w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={color3()}
                  onInput={(e) => {
                    setColor3(e.currentTarget.value);
                    setActivePreset('custom');
                  }}
                  class="w-full bg-transparent border-none text-xs text-(--title-color) font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Sliders using StrengthSlider */}
          <div class="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)] flex-wrap">
            <StrengthSlider
              label="Speed"
              min={0}
              max={100}
              step={1}
              value={speed()}
              displayValue={`${speed()}%`}
              onChange={(v) => {
                setSpeed(v);
                setActivePreset('custom');
              }}
            />
            <StrengthSlider
              label="Swirl Intensity"
              min={0}
              max={100}
              step={1}
              value={swirl()}
              displayValue={`${swirl()}%`}
              onChange={(v) => {
                setSwirl(v);
                setActivePreset('custom');
              }}
            />
            <StrengthSlider
              label="Swirl Layers"
              min={0}
              max={25}
              step={1}
              value={swirlIterations()}
              displayValue={`${swirlIterations()}`}
              onChange={(v) => {
                setSwirlIterations(v);
                setActivePreset('custom');
              }}
            />
            <StrengthSlider
              label="Distortion"
              min={0}
              max={100}
              step={1}
              value={distortion()}
              displayValue={`${distortion()}%`}
              onChange={(v) => {
                setDistortion(v);
                setActivePreset('custom');
              }}
            />
            <StrengthSlider
              label="Softness"
              min={0}
              max={100}
              step={1}
              value={softness()}
              displayValue={`${softness()}%`}
              onChange={(v) => {
                setSoftness(v);
                setActivePreset('custom');
              }}
            />
            <StrengthSlider
              label="Rotation"
              min={-180}
              max={180}
              step={1}
              value={rotation()}
              displayValue={`${rotation()}°`}
              onChange={(v) => {
                setRotation(v);
                setActivePreset('custom');
              }}
            />
            <StrengthSlider
              label="Proportion"
              min={0}
              max={100}
              step={1}
              value={proportion()}
              displayValue={`${proportion()}%`}
              onChange={(v) => {
                setProportion(v);
                setActivePreset('custom');
              }}
            />
            <StrengthSlider
              label="Shape Size"
              min={0}
              max={100}
              step={1}
              value={shapeSize()}
              displayValue={`${shapeSize()}%`}
              onChange={(v) => {
                setShapeSize(v);
                setActivePreset('custom');
              }}
            />
            <Show when={enableNoise()}>
              <StrengthSlider
                label="Noise Opacity"
                min={5}
                max={80}
                step={5}
                value={Math.round(noiseOpacity() * 100)}
                displayValue={`${Math.round(noiseOpacity() * 100)}%`}
                onChange={(v) => setNoiseOpacity(v / 100)}
              />
            </Show>
          </div>
        </div>

        {/* Hero Stage Area (Unified rounded card) */}
        <div class="relative w-full min-h-[380px] md:min-h-[440px] rounded-[16px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-5 max-sm:p-6 overflow-hidden border border-white/[0.04]">
          {/* Centered Typography Hero */}
          <div class="relative z-10 flex flex-col items-center select-none pointer-events-none drop-shadow-md">
            <p class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
              Animated
            </p>
            <p class="text-4xl sm:text-5xl md:text-6xl font-medium italic font-serif text-white/90 leading-tight">
              Gradient
            </p>
          </div>

          {/* Live WebGL2 Background */}
          <AnimatedGradient
            config={gradientConfig()}
            noise={noiseConfig()}
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

export default AnimatedGradientShowcase;
