import { createSignal, For, type JSX } from 'solid-js';
import { CopyButton } from './CopyButton';

type PkgManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno';

interface PkgOption {
  id: PkgManager;
  name: string;
  command: string;
  icon: JSX.Element;
}

const OPTIONS: PkgOption[] = [
  {
    id: 'npm',
    name: 'npm',
    command: 'npm install solid-thinking-orbs',
    icon: (
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3.87H4v16h8v-13h5v13h3v-16z" />
      </svg>
    ),
  },
  {
    id: 'pnpm',
    name: 'pnpm',
    command: 'pnpm add solid-thinking-orbs',
    icon: (
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z" />
      </svg>
    ),
  },
  {
    id: 'yarn',
    name: 'yarn',
    command: 'yarn add solid-thinking-orbs',
    icon: (
      <svg class="w-3.5 h-3.5" viewBox="0 0 477 512" fill="currentColor">
        <path d="M201.875 54.078S223.312-11.056 243.1 1.641c6.101 3.958 28.032 52.767 28.032 52.767s23.416-13.686 26.054-8.575c30.535 93.073 2.41 158.697-37.926 211.067c53.649 50.098 62.982 101.431 52.602 166.38c50.47.108 76.45-49.081 140.82-52.107c28.857-.495 30.341 33.309 8.575 38.585c-44.75 6.317-88.88 56.237-179.077 81.624c-11.635 17.708-81.148 15.728-135.874 20.612c-57.902.615-42.944-44.48-22.096-52.107c-13.596-7.408-14.15-14.796-16.819-14.016c-14.48 77.126-53.98 53.626-78.16 46.995c-18.634-9.894 1.319-33.144 1.319-33.144c-18.14 7.776-32.457-26.504-30.341-60.187c1.979-26.878 31.99-52.932 31.99-52.932c-1.789-67.104 17.813-110.758 69.915-147.417C83.91 177.75 62.91 143.25 90.606 103.06C126.66 93 133.66 50.25 201.876 54.078" />
      </svg>
    ),
  },
  {
    id: 'bun',
    name: 'bun',
    command: 'bun add solid-thinking-orbs',
    icon: (
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22.596c6.628 0 12-4.338 12-9.688c0-3.318-2.057-6.248-5.219-7.986c-1.286-.715-2.297-1.357-3.139-1.89C14.058 2.025 13.08 1.404 12 1.404c-1.097 0-2.334.785-3.966 1.821a50 50 0 0 1-2.816 1.697C2.057 6.66 0 9.59 0 12.908c0 5.35 5.372 9.687 12 9.687zM10.599 4.715c.334-.759.503-1.58.498-2.409c0-.145.202-.187.23-.029c.658 2.783-.902 4.162-2.057 4.624c-.124.048-.199-.121-.103-.209a5.8 5.8 0 0 0 1.432-1.977m2.058-.102a5.8 5.8 0 0 0-.782-2.306v-.016c-.069-.123.086-.263.185-.172c1.962 2.111 1.307 4.067.556 5.051c-.082.103-.23-.003-.189-.126a5.85 5.85 0 0 0 .23-2.431m1.776-.561a5.7 5.7 0 0 0-1.612-1.806v-.014c-.112-.085-.024-.274.114-.218c2.595 1.087 2.774 3.18 2.459 4.407a.12.12 0 0 1-.049.071a.11.11 0 0 1-.153-.026a.12.12 0 0 1-.022-.083a5.9 5.9 0 0 0-.737-2.331m-5.087.561c-.617.546-1.282.76-2.063 1c-.117 0-.195-.078-.156-.181c1.752-.909 2.376-1.649 2.999-2.778c0 0 .155-.118.188.085c0 .304-.349 1.329-.968 1.874m4.945 11.237a2.96 2.96 0 0 1-.937 1.553c-.346.346-.8.565-1.286.62a2.18 2.18 0 0 1-1.327-.62a2.96 2.96 0 0 1-.925-1.553a.24.24 0 0 1 .064-.198a.23.23 0 0 1 .193-.069h3.965a.23.23 0 0 1 .19.07c.05.053.073.125.063.197m-5.458-2.176a1.86 1.86 0 0 1-2.384-.245a1.98 1.98 0 0 1-.233-2.447c.207-.319.503-.566.848-.713a1.84 1.84 0 0 1 1.092-.11c.366.075.703.261.967.531a1.98 1.98 0 0 1 .408 2.114a1.93 1.93 0 0 1-.698.869zm8.495.005a1.86 1.86 0 0 1-2.381-.253a1.96 1.96 0 0 1-.547-1.366c0-.384.11-.76.32-1.079c.207-.319.503-.567.849-.713a1.84 1.84 0 0 1 1.093-.108c.367.076.704.262.968.534a1.98 1.98 0 0 1 .4 2.117a1.93 1.93 0 0 1-.702.868" />
      </svg>
    ),
  },
  {
    id: 'deno',
    name: 'deno',
    command: 'deno add npm:solid-thinking-orbs',
    icon: (
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0" />
        <path d="M13.47 20.882L12 15c-2.649-.088-5-1.624-5-3.5C7 9.567 9.239 8 12 8s4 1 5 3q.036.072 2 6.5M12 11h.01" />
      </svg>
    ),
  },
];

export function Installation() {
  const [selected, setSelected] = createSignal<PkgManager>('npm');

  const activeOption = () => OPTIONS.find((o) => o.id === selected())!;
  const selectedIndex = () => OPTIONS.findIndex((o) => o.id === selected());

  return (
    <section class="w-full mb-6" aria-label="Installation">
      <div class="flex items-center justify-between gap-4 mb-2 max-sm:flex-col max-sm:items-start">
        <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Installation</h2>

        {/* Sleek Outlined Package Manager Selector with Animated Sliding Highlight */}
        <div class="relative flex items-center bg-(--hero-surface) border border-[rgba(255,255,255,0.06)] p-1 rounded-lg">
          {/* Animated Sliding Pill Highlight */}
          <div
            class="absolute top-1 bottom-1 bg-(--icon-btn-hover) rounded-md transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.2)] shadow-sm pointer-events-none"
            style={{
              width: `calc(${100 / OPTIONS.length}% - 2px)`,
              transform: `translateX(${selectedIndex() * 100}%)`,
            }}
          />
          <For each={OPTIONS}>
            {(opt) => (
              <button
                type="button"
                onClick={() => setSelected(opt.id)}
                class={`relative flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-medium z-10 transition-colors duration-200 cursor-pointer ${
                  selected() === opt.id ? 'text-(--title-color)' : 'text-(--subtitle-color) hover:text-(--title-color)'
                }`}
              >
                {opt.icon}
                <span>{opt.name}</span>
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Codeblock showing dynamic install command */}
      <div class="flex items-center h-10 bg-(--code-bg) rounded-[10px] py-0.5 pr-10 pl-3 overflow-hidden relative border border-[rgba(255,255,255,0.03)]">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">
          {activeOption().command}
        </code>
        <CopyButton getText={() => activeOption().command} />
      </div>
    </section>
  );
}
