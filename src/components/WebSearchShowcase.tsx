import { createSignal, createMemo } from 'solid-js';
import { WebSearch } from '../web-search';
import { CopyButton } from './CopyButton';
import { cn } from '../lib/utils';

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

export function WebSearchShowcase() {
  const [key, setKey] = createSignal(0);

  const snippet = createMemo(() => {
    return `import { WebSearch } from 'solid-thinking-orbs';\n\n<WebSearch />`;
  });

  return (
    <section class="w-full flex flex-col gap-1.5 mb-12" aria-label="WebSearch interactive showcase">
      <h2 class="text-base font-normal leading-[34px] text-(--section-title-color)">Playground</h2>

      <div class="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div class="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
          <div class="flex items-center gap-2 flex-wrap">
            <TabBtn active={false} onClick={() => setKey((k) => k + 1)}>
              ↻ Restart Search
            </TabBtn>
          </div>
        </div>
      </div>

      <div class="relative w-full min-h-[304px] rounded-[10px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-6 max-sm:p-6">
        <div class="relative w-full max-w-[460px] flex items-center justify-center">
          <WebSearch key={key()} />
        </div>
      </div>

      <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden">
        <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">{snippet()}</code>
        <CopyButton getText={() => snippet()} />
      </div>
    </section>
  );
}
