import {
  createSignal,
  createMemo,
  createEffect,
  onCleanup,
  For,
  Show,
  type JSX,
} from 'solid-js';
import { Liquid } from '../liquid-gooey';
import { CopyButton } from './CopyButton';
import { createResolvedDark } from '../theme';
import { cn } from '../lib/utils';

import avatar1 from '../assets/gooey/avatars/avatar-1.png';
import avatar2 from '../assets/gooey/avatars/avatar-2.png';
import avatar3 from '../assets/gooey/avatars/avatar-3.png';
import avatar4 from '../assets/gooey/avatars/avatar-4.png';
import avatar5 from '../assets/gooey/avatars/avatar-5.png';
import avatar6 from '../assets/gooey/avatars/avatar-6.png';

const PORTRAITS = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const EASES: Record<string, string> = {
  Bouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  Smooth: 'cubic-bezier(0.3, 1.05, 0.4, 1)',
  Snappy: 'cubic-bezier(0.22, 1, 0.36, 1)',
  'Ease in-out': 'ease-in-out',
  Linear: 'linear',
};

const P3 =
  typeof CSS !== 'undefined' &&
  CSS.supports?.('color', 'color(display-p3 0 0 0 / 0.2)');
const p3 = (tpl: string) =>
  tpl
    .replace(
      /\{w4\}/g,
      P3 ? 'color(display-p3 1 1 1 / 0.04)' : 'rgba(255, 255, 255, 0.04)'
    )
    .replace(
      /\{w3\}/g,
      P3 ? 'color(display-p3 1 1 1 / 0.03)' : 'rgba(255, 255, 255, 0.03)'
    )
    .replace(
      /\{k6\}/g,
      P3 ? 'color(display-p3 0 0 0 / 0.06)' : 'rgba(0, 0, 0, 0.06)'
    )
    .replace(
      /\{k5\}/g,
      P3 ? 'color(display-p3 0 0 0 / 0.05)' : 'rgba(0, 0, 0, 0.05)'
    )
    .replace(
      /\{k24\}/g,
      P3 ? 'color(display-p3 0 0 0 / 0.24)' : 'rgba(0, 0, 0, 0.24)'
    );

const SHADOWS = {
  light: {
    'Figma soft':
      '0 0 0 1px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.05), 0 4px 42px rgba(0, 0, 0, 0.06)',
    Floating: '0 2px 6px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.18)',
    None: '',
  },
  dark: {
    'Figma soft': p3(
      '0 0 0 1px {w4} inset, 0 1px 0 0 {w3} inset, ' +
        '0 0 0 1px {k6}, 0 2px 6px 0 {k5}, 0 4px 42px 0 {k24}'
    ),
    Floating: '0 2px 6px rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.55)',
    None: '',
  },
};

const THUMB_SHADOW = {
  light: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 5px rgba(0, 0, 0, 0.08)',
  dark:
    `0 0 0 1px rgba(255, 255, 255, 0.04) inset, ` +
    `0 1px 0 0 rgba(255, 255, 255, 0.03) inset, ` +
    `0 0 0 1px rgba(0, 0, 0, 0.06), ` +
    `0 2px 6px 0 rgba(0, 0, 0, 0.05), ` +
    `0 4px 42px 0 rgba(0, 0, 0, 0.24)`,
};

const PILL_SHADOW = {
  light: '0 1px 3px rgba(0, 0, 0, 0.11), 0 1px 1px rgba(0, 0, 0, 0.07)',
  dark: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(0, 0, 0, 0.35)',
};

const SATELLITES = [
  {
    label: 'New file',
    x: -54,
    y: -34,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 1.5H4A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V6z" />
        <path d="M9 1.5V6h4.5" />
      </svg>
    ),
  },
  {
    label: 'Add image',
    x: 0,
    y: -64,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
        <circle cx="5.5" cy="5.5" r="1.25" />
        <path d="M14.5 10.5L11 7l-7.5 7.5" />
      </svg>
    ),
  },
  {
    label: 'New folder',
    x: 54,
    y: -34,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14.5 12.5A1.5 1.5 0 0 1 13 14H3a1.5 1.5 0 0 1-1.5-1.5V3A1.5 1.5 0 0 1 3 1.5h3L7.5 4H13a1.5 1.5 0 0 1 1.5 1.5z" />
      </svg>
    ),
  },
];

const TAB_ITEMS = ['Plan', 'Debug', 'Ask'];

const tabBtnBase =
  'flex items-center justify-center h-9 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] font-normal leading-[14px] cursor-pointer transition-all duration-200 whitespace-nowrap [-webkit-tap-highlight-color:transparent] hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2';

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

export function GooeyShowcase() {
  let rootRef!: HTMLDivElement;
  const isDark = createResolvedDark(
    () => 'auto',
    () => rootRef
  );

  const [preset, setPreset] = createSignal<
    'plusMenu' | 'tabs' | 'slider' | 'chips' | 'cards' | 'email'
  >('plusMenu');
  const [blur, setBlur] = createSignal(6);
  const [contrast, setContrast] = createSignal(18);

  const shadow = createMemo(() =>
    isDark() ? SHADOWS.dark['Figma soft'] : SHADOWS.light['Figma soft']
  );

  // PlusMenu State
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [openDur, setOpenDur] = createSignal(550);
  const [openStagger, setOpenStagger] = createSignal(40);
  const toggleMenu = () => setMenuOpen((o) => !o);

  // Tabs State
  const [activeTab, setActiveTab] = createSignal(0);
  const [tabSlideDur, setTabSlideDur] = createSignal(250);
  const [tabSpringiness, setTabSpringiness] = createSignal(0.5);
  let tabButtons: HTMLButtonElement[] = [];

  // Slider State (1:1 with Jakub's Slider.tsx)
  const SLIDER_MAX = 188;
  const [sliderX, setSliderX] = createSignal(84);
  const [sliderSpringiness, setSliderSpringiness] = createSignal(0.5);
  const [sliderStretch, setSliderStretch] = createSignal(0.6);
  const [sliderTrail, setSliderTrail] = createSignal(0.35);
  let sliderDragStart: number | null = null;

  // Chips State (1:1 with Jakub's Chips.tsx)
  const [chipsGroup, setChipsGroup] = createSignal(PORTRAITS.slice(0, 3));
  const [chipsDissolve, setChipsDissolve] = createSignal(1);
  const [chipsDragging, setChipsDragging] = createSignal(false);
  const [chipsConsumed, setChipsConsumed] = createSignal(false);
  const [chipsPos, setChipsPos] = createSignal({ x: 0, y: 0 });

  // Cards State (1:1 with Jakub's Cards.tsx)
  const [cardStrength, setCardStrength] = createSignal(1);
  const [cardWarp, setCardWarp] = createSignal(26);
  const [cardPos, setCardPos] = createSignal([
    { x: -78, y: 0 },
    { x: 78, y: 0 },
  ]);
  let cardDrag: { id: number; idx: number; dx: number; dy: number } | null = null;

  // Email Input State (1:1 with Jakub's EmailInput.tsx)
  const [emailOpen, setEmailOpen] = createSignal(false);
  const [emailDur, setEmailDur] = createSignal(600);

  const surfaceFill = () => (isDark() ? '#202020' : '#ffffff');
  const plusShadow = () =>
    isDark()
      ? '0 2px 8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)'
      : '0 2px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)';

  const tabPillFill = () => (isDark() ? '#ffffff' : '#0f0f0f');
  const sliderThumbFill = () => (isDark() ? '#525252' : '#ffffff');

  const snippet = createMemo(() => {
    switch (preset()) {
      case 'plusMenu':
        return `import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={${blur()}} contrast={${contrast()}} fill="${surfaceFill()}" shadow="${shadow()}">
  <Liquid.Item x={open() ? -54 : 0} y={open() ? -34 : 0} transition={{ duration: ${openDur()}, ease: 'bouncy' }}>
    <button class="pm-btn pm-sat">...</button>
  </Liquid.Item>
  <Liquid.Item x={0} y={open() ? -64 : 0} transition={{ duration: ${openDur()}, ease: 'bouncy' }} delay={${openStagger()}}>
    <button class="pm-btn pm-sat">...</button>
  </Liquid.Item>
  <Liquid.Item x={open() ? 54 : 0} y={open() ? -34 : 0} transition={{ duration: ${openDur()}, ease: 'bouncy' }} delay={${openStagger() * 2}}>
    <button class="pm-btn pm-sat">...</button>
  </Liquid.Item>
  <Liquid.Item>
    <button class="pm-btn pm-main" onClick={toggle}>+</button>
  </Liquid.Item>
</Liquid>`;
      case 'tabs':
        return `import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={${blur()}} contrast={${contrast()}} fill="${tabPillFill()}" shadow="${isDark() ? PILL_SHADOW.dark : PILL_SHADOW.light}">
  <Liquid.Item effect="move" move={{ springiness: ${tabSpringiness()}, trail: 0.575 }}>
    <div style={{ transform: \`translateX(\${tabOffset}px)\` }} class="tb-ind" />
  </Liquid.Item>
</Liquid>`;
      case 'slider':
        return `import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={${blur()}} contrast={${contrast()}} fill="var(--sl-thumb)" shadow="${isDark() ? THUMB_SHADOW.dark : THUMB_SHADOW.light}">
  <div class="sl-track" />
  <Liquid.Item effect="move" move={{ springiness: ${sliderSpringiness()}, stretch: ${sliderStretch()}, trail: ${sliderTrail()} }}>
    <div style={{ transform: \`translateX(\${x}px)\` }} class="sl-thumb" />
  </Liquid.Item>
</Liquid>`;
      case 'chips':
        return `import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={${blur()}} contrast={${contrast()}} fill="${surfaceFill()}" shadow="${shadow()}">
  <Liquid.Item morph={{ shape: true }}>
    <div class="ap-pill">...</div>
  </Liquid.Item>
  <Liquid.Item dissolve={{ strength: ${chipsDissolve()} }} morph={{ advanced: { blobInset: 2, bridgeGrow: 8 } }}>
    <div class="ap-chip"><img src={avatar} /></div>
  </Liquid.Item>
</Liquid>`;
      case 'cards':
        return `import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={${blur()}} contrast={${contrast()}} fill="${surfaceFill()}" shadow="${shadow()}">
  <Liquid.Item dissolve={{ strength: ${cardStrength()}, warp: ${cardWarp()} }} morph={{ advanced: { blobInset: 2, bridgeGrow: 10 } }}>
    <div class="dc-card"><img src={cardA} /></div>
  </Liquid.Item>
  <Liquid.Item dissolve={{ strength: ${cardStrength()}, warp: ${cardWarp()} }} morph={{ advanced: { blobInset: 2, bridgeGrow: 10 } }}>
    <div class="dc-card"><img src={cardB} /></div>
  </Liquid.Item>
</Liquid>`;
      case 'email':
        return `import { Liquid } from 'solid-thinking-orbs';

<Liquid blur={${blur()}} contrast={${contrast()}} fill="${surfaceFill()}" shadow="${shadow()}">
  <Liquid.Item x={open() ? -32 : 0} transition={{ duration: ${emailDur()} }}>
    <input class="eb-input" placeholder="Enter your email" />
  </Liquid.Item>
  <Liquid.Item x={open() ? 32 : 0} transition={{ duration: ${emailDur()} }}>
    <button class="eb-btn">→</button>
  </Liquid.Item>
</Liquid>`;
    }
  });

  return (
    <section
      ref={rootRef}
      class="w-full flex flex-col gap-1.5 mb-12 select-none"
      aria-label="Liquid Gooey interactive playground"
    >
      <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">
        Liquid Gooey
      </h2>

      {/* Main Control Panel (Playground styling) */}
      <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300">
        
        {/* Preset Selector */}
        <div class="flex flex-col gap-2 min-w-0" role="radiogroup" aria-label="Liquid Preset">
          <span class="text-xs font-normal leading-[14px] text-(--text-muted)">Preset</span>
          <div class="flex gap-2 items-center flex-wrap">
            <TabBtn active={preset() === 'plusMenu'} onClick={() => setPreset('plusMenu')}>
              Plus Menu (Morph)
            </TabBtn>
            <TabBtn active={preset() === 'tabs'} onClick={() => setPreset('tabs')}>
              Gooey Tabs (Move)
            </TabBtn>
            <TabBtn active={preset() === 'slider'} onClick={() => setPreset('slider')}>
              Elastic Slider (Move)
            </TabBtn>
            <TabBtn active={preset() === 'chips'} onClick={() => setPreset('chips')}>
              Avatar Group (Chips)
            </TabBtn>
            <TabBtn active={preset() === 'cards'} onClick={() => setPreset('cards')}>
              Melting Cards (Dissolve)
            </TabBtn>
            <TabBtn active={preset() === 'email'} onClick={() => setPreset('email')}>
              Email Input (Morph)
            </TabBtn>
          </div>
        </div>

        {/* Dynamic Parameter Sliders using standard app sliders */}
        <div class="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)]">
          <StrengthSlider
            label="Goo Blur"
            min={2}
            max={14}
            step={0.5}
            value={blur()}
            displayValue={`${blur()}px`}
            onChange={setBlur}
          />
          <StrengthSlider
            label="Contrast"
            min={8}
            max={32}
            step={1}
            value={contrast()}
            displayValue={`${contrast()}`}
            onChange={setContrast}
          />

          <Show when={preset() === 'plusMenu'}>
            <StrengthSlider
              label="Duration"
              min={150}
              max={950}
              step={10}
              value={openDur()}
              displayValue={`${openDur()}ms`}
              onChange={setOpenDur}
            />
            <StrengthSlider
              label="Stagger"
              min={0}
              max={100}
              step={5}
              value={openStagger()}
              displayValue={`${openStagger()}ms`}
              onChange={setOpenStagger}
            />
          </Show>

          <Show when={preset() === 'tabs'}>
            <StrengthSlider
              label="Slide Duration"
              min={100}
              max={600}
              step={10}
              value={tabSlideDur()}
              displayValue={`${tabSlideDur()}ms`}
              onChange={setTabSlideDur}
            />
            <StrengthSlider
              label="Springiness"
              min={0}
              max={1}
              step={0.05}
              value={tabSpringiness()}
              displayValue={`${tabSpringiness()}`}
              onChange={setTabSpringiness}
            />
          </Show>

          <Show when={preset() === 'slider'}>
            <StrengthSlider
              label="Springiness"
              min={0}
              max={1}
              step={0.05}
              value={sliderSpringiness()}
              displayValue={`${sliderSpringiness()}`}
              onChange={setSliderSpringiness}
            />
            <StrengthSlider
              label="Stretch"
              min={0}
              max={1}
              step={0.05}
              value={sliderStretch()}
              displayValue={`${sliderStretch()}`}
              onChange={setSliderStretch}
            />
            <StrengthSlider
              label="Trail"
              min={0}
              max={0.8}
              step={0.025}
              value={sliderTrail()}
              displayValue={`${sliderTrail()}`}
              onChange={setSliderTrail}
            />
          </Show>

          <Show when={preset() === 'chips'}>
            <StrengthSlider
              label="Dissolve Strength"
              min={0}
              max={1}
              step={0.05}
              value={chipsDissolve()}
              displayValue={`${chipsDissolve()}`}
              onChange={setChipsDissolve}
            />
          </Show>

          <Show when={preset() === 'cards'}>
            <StrengthSlider
              label="Dissolve Strength"
              min={0}
              max={1}
              step={0.05}
              value={cardStrength()}
              displayValue={`${cardStrength()}`}
              onChange={setCardStrength}
            />
            <StrengthSlider
              label="Warp"
              min={0}
              max={90}
              step={1}
              value={cardWarp()}
              displayValue={`${cardWarp()}px`}
              onChange={setCardWarp}
            />
          </Show>

          <Show when={preset() === 'email'}>
            <StrengthSlider
              label="Duration"
              min={120}
              max={1000}
              step={10}
              value={emailDur()}
              displayValue={`${emailDur()}ms`}
              onChange={setEmailDur}
            />
          </Show>
        </div>

      </div>

      {/* Stage Area */}
      <div class="relative w-full min-h-[304px] rounded-[10px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-6 max-sm:p-6 overflow-hidden">
        
        {/* 1. Plus Menu */}
        <Show when={preset() === 'plusMenu'}>
          <div class="pm-wrap">
            <Liquid
              blur={blur()}
              contrast={contrast()}
              fill="var(--modal-bg)"
              shadow={plusShadow()}
              class={`pm ${menuOpen() ? 'pm-open' : ''}`}
            >
              <For each={SATELLITES}>
                {(s, i) => (
                  <Liquid.Item
                    class="pm-slot"
                    x={menuOpen() ? s.x : 0}
                    y={menuOpen() ? s.y : 0}
                    transition={{
                      duration: menuOpen() ? openDur() : 250,
                      ease: menuOpen()
                        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        : 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    delay={menuOpen() ? i() * openStagger() : 0}
                  >
                    <button
                      type="button"
                      class="pm-btn pm-sat"
                      aria-label={s.label}
                      tabIndex={menuOpen() ? 0 : -1}
                      onClick={toggleMenu}
                    >
                      <span
                        class="pm-sat-icon"
                        style={{
                          'transition-delay': menuOpen()
                            ? `${120 + i() * openStagger()}ms`
                            : '0ms',
                        }}
                      >
                        {s.icon}
                      </span>
                    </button>
                  </Liquid.Item>
                )}
              </For>

              <Liquid.Item class="pm-slot">
                <button
                  type="button"
                  class="pm-btn pm-main"
                  aria-expanded={menuOpen()}
                  aria-label={menuOpen() ? 'Close menu' : 'Open menu'}
                  onClick={toggleMenu}
                >
                  <span class="pm-plus">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                    >
                      <path d="M10 4V16M4 10H16" />
                    </svg>
                  </span>
                </button>
              </Liquid.Item>
            </Liquid>
          </div>
        </Show>

        {/* 2. Gooey Tabs */}
        <Show when={preset() === 'tabs'}>
          <div class="tb-wrap">
            <Liquid
              blur={blur()}
              contrast={contrast()}
              fill="var(--tab-ind)"
              shadow={isDark() ? PILL_SHADOW.dark : PILL_SHADOW.light}
              class="tb"
              style={{
                '--tb-dur': `${tabSlideDur()}ms`,
                '--tb-ease': 'cubic-bezier(0.3, 1.05, 0.4, 1)',
              }}
            >
              <div class="tb-bar" aria-hidden="true" />
              <Liquid.Item
                effect="move"
                move={{ springiness: tabSpringiness(), stretch: 0.18, tail: 0.46 }}
              >
                <div
                  class="tb-ind"
                  style={{
                    transform: `translateX(${tabButtons[activeTab()] ? tabButtons[activeTab()].offsetLeft : 3}px)`,
                    width: `${tabButtons[activeTab()] ? tabButtons[activeTab()].offsetWidth : 60}px`,
                  }}
                />
              </Liquid.Item>
              <div class="tb-tabs" role="tablist" aria-label="Mode">
                <For each={TAB_ITEMS}>
                  {(label, i) => (
                    <button
                      ref={(el) => (tabButtons[i()] = el)}
                      type="button"
                      role="tab"
                      class="tb-tab"
                      aria-selected={i() === activeTab()}
                      onClick={() => setActiveTab(i())}
                    >
                      {label}
                    </button>
                  )}
                </For>
              </div>
            </Liquid>
          </div>
        </Show>

        {/* 3. Elastic Slider (1:1 from Jakub's Slider.tsx) */}
        <Show when={preset() === 'slider'}>
          <div class="sl-wrap">
            <Liquid
              blur={blur()}
              contrast={contrast()}
              fill="var(--sl-thumb)"
              shadow={isDark() ? THUMB_SHADOW.dark : THUMB_SHADOW.light}
              class="sl"
            >
              <div class="sl-track" aria-hidden="true" />
              <Liquid.Item
                effect="move"
                move={{
                  springiness: sliderSpringiness(),
                  stretch: sliderStretch(),
                  trail: sliderTrail(),
                }}
              >
                <div
                  class="sl-thumb"
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round((sliderX() / SLIDER_MAX) * 100)}
                  tabIndex={0}
                  style={{ transform: `translateX(${sliderX()}px)` }}
                  onPointerDown={(e) => {
                    try {
                      e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {}
                    sliderDragStart = e.clientX - sliderX();
                  }}
                  onPointerMove={(e) => {
                    if (sliderDragStart === null) return;
                    setSliderX(
                      Math.min(
                        SLIDER_MAX,
                        Math.max(0, e.clientX - sliderDragStart)
                      )
                    );
                  }}
                  onPointerUp={() => {
                    sliderDragStart = null;
                  }}
                  onPointerCancel={() => {
                    sliderDragStart = null;
                  }}
                />
              </Liquid.Item>
            </Liquid>
          </div>
        </Show>

        {/* 4. Avatar Group (Chips) */}
        <Show when={preset() === 'chips'}>
          <div class="ap-wrap">
            <Liquid
              blur={blur()}
              contrast={contrast()}
              fill="var(--modal-bg)"
              shadow={shadow()}
              class="ap"
            >
              {!chipsConsumed() && (
                <p
                  class={`ap-dragme ${
                    chipsDragging() ? 'is-hidden' : ''
                  }`}
                  aria-hidden="true"
                >
                  <span class="ap-dragme-text">Drag me</span>
                  <span class="ap-dragme-arrow" />
                </p>
              )}

              <button
                type="button"
                class="ap-reset"
                onClick={() => {
                  setChipsGroup(PORTRAITS.slice(0, 3));
                  setChipsConsumed(false);
                  setChipsPos({ x: 0, y: 0 });
                }}
              >
                Reset
              </button>

              <Liquid.Item
                morph={{
                  shape: true,
                  advanced: {
                    evolve: {
                      contentBlur: 0,
                      sizeStiffness: 380,
                      sizeDamping: 40,
                      massStiffness: 380,
                      massDamping: 40,
                      anticipation: 0,
                      travel: 0,
                      roundness: 0,
                    },
                  },
                }}
              >
                <div class="ap-pill">
                  <span class="ap-label">Share</span>
                  <span class="ap-stack">
                    <For each={chipsGroup()}>
                      {(src, i) => (
                        <img
                          class="ap-avatar"
                          src={src}
                          alt=""
                          draggable={false}
                          style={{
                            'margin-left': i() === 0 ? '0px' : '-8px',
                          }}
                        />
                      )}
                    </For>
                  </span>
                </div>
              </Liquid.Item>

              {!chipsConsumed() && (
                <Liquid.Item
                  morph={{ advanced: { blobInset: 2, bridgeGrow: 8 } }}
                  dissolve={{
                    strength: chipsDissolve(),
                    pull: 0,
                    active: chipsDragging(),
                    releaseMs: 380,
                    fadeMs: 320,
                  }}
                >
                  <div
                    class={`ap-chip ${
                      chipsDragging() ? 'ap-dragging' : ''
                    }`}
                    style={{
                      transform: `translate(${chipsPos().x}px, ${chipsPos().y}px)`,
                    }}
                    onPointerDown={(e) => {
                      try {
                        e.currentTarget.setPointerCapture(e.pointerId);
                      } catch {}
                      setChipsDragging(true);
                    }}
                    onPointerMove={(e) => {
                      if (!chipsDragging()) return;
                      setChipsPos((p) => ({
                        x: p.x + e.movementX,
                        y: p.y + e.movementY,
                      }));
                    }}
                    onPointerUp={() => {
                      setChipsDragging(false);
                      if (chipsPos().x < -100 && chipsPos().y > 20) {
                        setChipsGroup((g) => [...g, PORTRAITS[3]]);
                        setChipsConsumed(true);
                      } else {
                        setChipsPos({ x: 0, y: 0 });
                      }
                    }}
                  >
                    <img src={PORTRAITS[3]} alt="Avatar" draggable={false} />
                  </div>
                </Liquid.Item>
              )}
            </Liquid>
          </div>
        </Show>

        {/* 5. Melting Cards */}
        <Show when={preset() === 'cards'}>
          <div class="dc-wrap">
            <Liquid
              blur={blur()}
              contrast={contrast()}
              fill="var(--modal-bg)"
              shadow={shadow()}
              class="dc"
            >
              <For each={[PORTRAITS[4], PORTRAITS[5]]}>
                {(src, i) => (
                  <Liquid.Item
                    dissolve={{
                      warp: cardWarp() * cardStrength(),
                      blur: 5 * cardStrength(),
                      mix: 0.7 * cardStrength(),
                      gravity: 60 * cardStrength(),
                      taper: 0.95,
                      warpFreq: 1,
                      flowSpeed: 26,
                      detail: 2,
                      zone: 26,
                      range: 44,
                      releaseMs: 110,
                      fadeMs: 320,
                    }}
                    morph={{ advanced: { blobInset: 2, bridgeGrow: 10 } }}
                  >
                    <div
                      class="dc-card"
                      role="img"
                      aria-label={`Draggable photo card ${i() + 1}`}
                      style={{
                        transform: `translate(${cardPos()[i()].x}px, ${cardPos()[i()].y}px)`,
                      }}
                      onPointerDown={(e) => {
                        try {
                          e.currentTarget.setPointerCapture(e.pointerId);
                        } catch {}
                        cardDrag = {
                          id: e.pointerId,
                          idx: i(),
                          dx: e.clientX - cardPos()[i()].x,
                          dy: e.clientY - cardPos()[i()].y,
                        };
                      }}
                      onPointerMove={(e) => {
                        if (!cardDrag || e.pointerId !== cardDrag.id) return;
                        const idx = cardDrag.idx;
                        const x = Math.max(
                          -106,
                          Math.min(106, e.clientX - cardDrag.dx)
                        );
                        const y = Math.max(
                          -52,
                          Math.min(52, e.clientY - cardDrag.dy)
                        );
                        setCardPos((prev) =>
                          prev.map((p, k) => (k === idx ? { x, y } : p))
                        );
                      }}
                      onPointerUp={() => {
                        cardDrag = null;
                      }}
                      onPointerCancel={() => {
                        cardDrag = null;
                      }}
                    >
                      <img src={src} alt="" draggable={false} />
                    </div>
                  </Liquid.Item>
                )}
              </For>
            </Liquid>
          </div>
        </Show>

        {/* 6. Email Input */}
        <Show when={preset() === 'email'}>
          <div class="eb-wrap">
            <Liquid
              blur={blur()}
              contrast={contrast()}
              fill="var(--modal-bg)"
              shadow={shadow()}
              class="eb"
              style={{
                '--eb-dur': `${emailDur()}ms`,
                '--eb-ease': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <Liquid.Item
                class="eb-slot eb-field-slot"
                x={emailOpen() ? -(44 + 20) / 2 : 0}
                transition={{
                  duration: emailDur(),
                  ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <div class="eb-field">
                  <input
                    class="eb-input"
                    type="email"
                    placeholder="Enter your email"
                    onFocus={() => setEmailOpen(true)}
                    onBlur={() => setEmailOpen(false)}
                  />
                </div>
              </Liquid.Item>

              <Liquid.Item
                class="eb-slot eb-btn-slot"
                x={emailOpen() ? 44 / 2 + 2 + 20 / 2 : 0}
                transition={{
                  duration: emailDur(),
                  ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <button
                  type="button"
                  class={`eb-btn ${emailOpen() ? 'eb-btn-open' : ''}`}
                  aria-label="Submit email"
                  tabIndex={emailOpen() ? 0 : -1}
                  onPointerDown={(e) => e.preventDefault()}
                >
                  <svg
                    class="eb-arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" />
                  </svg>
                </button>
              </Liquid.Item>
            </Liquid>
          </div>
        </Show>

      </div>

      {/* Code Snippet Box */}
      <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">
          {snippet()}
        </code>
        <CopyButton getText={() => snippet()} />
      </div>

      {/* Scoped CSS matching Jakub's styles.css */}
      <style>{`
        :root {
          --modal-bg: #ffffff;
          --btn-text: #17181c;
          --sl-thumb: #ffffff;
          --track: rgba(234, 234, 234, 0.7);
          --track-ring: rgba(0, 0, 0, 0.056);
          --tab-ind: #0f0f0f;
          --tab-ind-text: #ffffff;
          --tab-label: rgba(15, 15, 15, 0.8);
          --tab-label-hover: #0f0f0f;
          --hover-veil: rgba(0, 0, 0, 0.04);
          --photo-edge: rgba(0, 0, 0, 0.2);
          --photo-lift: rgba(0, 0, 0, 0.16);
        }
        .dark, [data-theme='dark'] {
          --modal-bg: #202020;
          --btn-text: #fbfbfb;
          --sl-thumb: #525252;
          --track: rgba(115, 115, 115, 0.2);
          --track-ring: rgba(255, 255, 255, 0.02);
          --tab-ind: #ffffff;
          --tab-ind-text: #0d0d0d;
          --tab-label: rgba(251, 251, 251, 0.72);
          --tab-label-hover: #ffffff;
          --hover-veil: rgba(255, 255, 255, 0.06);
          --photo-edge: rgba(255, 255, 255, 0.08);
          --photo-lift: rgba(0, 0, 0, 0.55);
        }

        /* Plus Menu */
        .pm { width: 200px; height: 140px; }
        .pm-slot { position: absolute; left: 80px; top: 80px; }
        .pm-btn {
          width: 40px; height: 40px; border: 0; padding: 0;
          border-radius: 50%; background: transparent;
          display: grid; place-items: center; cursor: pointer;
          color: var(--btn-text);
          -webkit-tap-highlight-color: transparent;
        }
        .pm-sat { pointer-events: none; }
        .pm-open .pm-sat { pointer-events: auto; }
        .pm-open .pm-sat:hover { background: var(--hover-veil); }
        .pm-sat-icon {
          display: grid; place-items: center; opacity: 0; filter: blur(2px);
          transition: opacity 120ms ease, filter 120ms ease;
        }
        .pm-open .pm-sat-icon {
          opacity: 1; filter: blur(0);
          transition-duration: 180ms;
        }
        .pm-plus {
          display: grid; place-items: center; transform: rotate(0deg);
          transition: transform 250ms ease-in-out;
        }
        .pm-open .pm-plus { transform: rotate(45deg); }

        /* Tabs */
        .tb {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 3px; border-radius: 48px;
        }
        .tb-bar { position: absolute; inset: 0; border-radius: 48px; z-index: -2; }
        .tb-tabs { display: contents; }
        .tb-tab {
          appearance: none; box-sizing: border-box; border: 1px solid transparent;
          background: transparent; height: 30px; padding: 4px 14px; font: inherit;
          font-size: 13px; font-weight: 500; line-height: 1.4;
          color: var(--tab-label); cursor: pointer; border-radius: 48px; z-index: 1;
          transition: color 250ms cubic-bezier(0.22, 1, 0.36, 1);
          white-space: nowrap;
        }
        .tb-tab:hover { color: var(--tab-label-hover); }
        .tb-tab[aria-selected='true'] { color: var(--tab-ind-text); font-weight: 600; }
        .tb-ind {
          position: absolute; top: 3px; left: 0; height: 30px; border-radius: 48px;
          pointer-events: none;
          transition: transform var(--tb-dur, 250ms) var(--tb-ease, cubic-bezier(0.3, 1.05, 0.4, 1)),
                      width var(--tb-dur, 250ms) var(--tb-ease, cubic-bezier(0.3, 1.05, 0.4, 1));
        }

        /* Slider 1:1 */
        .sl { width: 240px; height: 80px; }
        .sl-track {
          position: absolute; left: 14px; right: 14px; top: 38px; height: 8px;
          border-radius: 4px; background: var(--track);
          box-shadow: inset 0 0 0 1px var(--track-ring); z-index: -2;
        }
        .sl-thumb {
          position: absolute; left: 14px; top: 30px; width: 24px; height: 24px;
          border-radius: 50%; cursor: grab; touch-action: none; user-select: none;
        }
        .sl-thumb:active { cursor: grabbing; }

        /* Chips */
        .ap { width: 290px; height: 250px; }
        .ap-dragme {
          position: absolute; right: 66px; top: 2px; margin: 0; display: flex;
          align-items: flex-start; gap: 3px; font-size: 13px; line-height: 19px;
          color: #8a8b92; opacity: 0.55; pointer-events: none;
        }
        .ap-dragme.is-hidden { opacity: 0; }
        .ap-dragme-text { margin-top: 27px; }
        .ap-dragme-arrow {
          width: 50px; height: 49px; display: flex; align-items: center; justify-content: center;
        }
        .ap-dragme-arrow::before {
          content: '↖'; font-size: 24px; transform: rotate(180deg);
        }
        .ap-pill {
          position: absolute; left: 20px; top: 82px; height: 56px; border-radius: 28px;
          display: flex; align-items: center; gap: 10px; padding: 0 12px 0 17px;
        }
        .ap-label { font-size: 14px; font-weight: 500; color: var(--btn-text); }
        .ap-stack { display: flex; align-items: center; }
        .ap-avatar {
          position: relative; width: 32px; height: 32px; border-radius: 50%;
          object-fit: cover; box-shadow: 0 1px 1px 0 var(--photo-edge);
          outline: 1px solid var(--photo-edge); outline-offset: -1px;
        }
        .ap-chip {
          position: absolute; right: 20px; top: 22px; width: 40px; height: 40px;
          border-radius: 50%; cursor: grab; touch-action: none; user-select: none;
        }
        .ap-chip img {
          width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
          box-shadow: 0 2px 6px 0 var(--photo-lift), 0 1px 1px 0 var(--photo-edge);
          outline: 1px solid var(--photo-edge); outline-offset: -1px;
        }
        .ap-reset {
          position: absolute; left: 50%; transform: translateX(-50%); bottom: 10px;
          z-index: 3; height: 32px; padding: 0 14px; border: 0; border-radius: 40px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          background: rgba(255, 255, 255, 0.08); color: var(--btn-text);
        }

        /* Cards */
        .dc { width: 320px; height: 210px; }
        .dc-card {
          position: absolute; left: 50%; top: 50%; width: 96px; height: 96px;
          margin: -48px 0 0 -48px; border-radius: 16px; cursor: grab;
          touch-action: none; user-select: none;
        }
        .dc-card img {
          width: 100%; height: 100%; border-radius: 16px; object-fit: cover;
          pointer-events: none;
        }

        /* Email */
        .eb { width: 290px; height: 210px; }
        .eb-slot { position: absolute; }
        .eb-field-slot { left: 44px; top: 81px; }
        .eb-btn-slot { left: 200px; top: 83px; }
        .eb-field { width: 202px; height: 48px; border-radius: 999px; }
        .eb-input {
          width: 100%; height: 100%; border: 0; background: transparent;
          border-radius: 999px; padding: 0 44px 0 18px; font-size: 14px;
          color: var(--btn-text); outline: none;
        }
        .eb-btn {
          width: 44px; height: 44px; border: 0; padding: 0; border-radius: 50%;
          background: transparent; color: var(--btn-text); display: grid;
          place-items: center; cursor: pointer;
        }
        .eb-arrow { opacity: 0; transition: opacity 150ms ease; }
        .eb-btn-open .eb-arrow { opacity: 1; }
      `}</style>
    </section>
  );
}
