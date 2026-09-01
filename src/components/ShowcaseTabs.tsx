import { For } from 'solid-js';

export type ShowcaseTab = 'orbs' | 'metal' | 'border-beam' | 'agent-thinking' | 'web-search' | 'todo' | 'heatmaps' | 'gooey';

export interface TabItem {
  id: ShowcaseTab;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'orbs', label: 'Thinking Orbs' },
  { id: 'metal', label: 'Metal FX' },
  { id: 'border-beam', label: 'Border Beam' },
  { id: 'agent-thinking', label: 'Agent Thinking' },
  { id: 'web-search', label: 'Web Search' },
  { id: 'todo', label: 'To-do List' },
  { id: 'heatmaps', label: 'Activity Heatmaps' },
  { id: 'gooey', label: 'Liquid Gooey' },
];

export function ShowcaseTabs(props: {
  activeTab: ShowcaseTab;
  onTabChange: (tab: ShowcaseTab) => void;
}) {
  return (
    <nav class="w-full flex items-center justify-center my-8 max-sm:my-5" aria-label="Component selector">
      <div class="relative inline-flex items-center p-1.5 rounded-full bg-(--hero-surface) border border-[rgba(255,255,255,0.06)] shadow-[0_8px_32px_rgba(0,0,0,0.25)] max-sm:w-full max-sm:overflow-x-auto max-sm:justify-start">
        <For each={TABS}>
          {(tab) => {
            const isActive = () => props.activeTab === tab.id;
            return (
              <button
                type="button"
                onClick={() => props.onTabChange(tab.id)}
                class={`relative flex items-center justify-center px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                  isActive()
                    ? 'bg-(--icon-btn-hover) text-(--title-color) shadow-sm'
                    : 'text-(--subtitle-color) hover:text-(--title-color) hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                {tab.label}
              </button>
            );
          }}
        </For>
      </div>
    </nav>
  );
}
