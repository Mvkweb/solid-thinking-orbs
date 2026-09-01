import { createSignal, Switch, Match } from 'solid-js';
import { CopyButton } from './components/CopyButton';
import { Examples } from './components/Examples';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Playground } from './components/Playground';
import { useTheme } from './hooks/useTheme';
import { Installation } from './components/Installation';
import { ShowcaseTabs, type ShowcaseTab } from './components/ShowcaseTabs';
import { MetalFxShowcase } from './components/MetalFxShowcase';
import { BorderBeamShowcase } from './components/BorderBeamShowcase';
import { AgentThinkingShowcase } from './components/AgentThinkingShowcase';
import { WebSearchShowcase } from './components/WebSearchShowcase';
import { TodoListShowcase } from './components/TodoListShowcase';
import { ActivityHeatmapShowcase } from './components/ActivityHeatmapShowcase';
import { GooeyShowcase } from './components/GooeyShowcase';

const USAGE_SNIPPET = `import { ThinkingOrb } from 'solid-thinking-orbs';\n\n<ThinkingOrb state="listening" size={64} />`;

export function App() {
  const [theme, toggleTheme] = useTheme();
  const [activeTab, setActiveTab] = createSignal<ShowcaseTab>('orbs');
  const [speed, setSpeed] = createSignal(100);
  const [debug, setDebug] = createSignal(false);
  const [bigChips, setBigChips] = createSignal(false);
  const [smallAll, setSmallAll] = createSignal(false);

  return (
    <div class="relative w-full min-h-screen">
      {/* Subtle Ambient Radial Glow */}
      <div class="pointer-events-none fixed inset-0 flex justify-center z-0 overflow-hidden" aria-hidden="true">
        <div class="w-[900px] h-[360px] bg-gradient-to-b from-blue-500/[0.04] via-indigo-500/[0.02] to-transparent blur-[140px] rounded-full -mt-20" />
      </div>

      <main class="relative z-10 flex flex-col items-center max-w-[1040px] mx-auto w-full px-6 pb-20 max-sm:px-4 max-sm:pb-12">
        <Header
          theme={theme()}
          onToggleTheme={toggleTheme}
        />

        {/* Component Showcase Switcher Tabs */}
        <ShowcaseTabs activeTab={activeTab()} onTabChange={setActiveTab} />

      <Switch>
        <Match when={activeTab() === 'orbs'}>
          <Examples speed={speed() / 100} debug={debug()} bigChips={bigChips()} smallAll={smallAll()} />

          <Installation />

          <section class="w-full mb-6" aria-label="Usage">
            <h2 class="text-base font-normal leading-[34px] text-(--section-title-muted) mb-1">Usage</h2>
            <div class="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative">
              <code class="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">{USAGE_SNIPPET}</code>
              <CopyButton getText={() => USAGE_SNIPPET} />
            </div>
          </section>

          <Playground speed={speed()} onSpeedChange={setSpeed} />
        </Match>

        <Match when={activeTab() === 'metal'}>
          <Installation />
          <MetalFxShowcase />
        </Match>

        <Match when={activeTab() === 'border-beam'}>
          <Installation />
          <BorderBeamShowcase />
        </Match>

        <Match when={activeTab() === 'agent-thinking'}>
          <Installation />
          <AgentThinkingShowcase />
        </Match>

        <Match when={activeTab() === 'web-search'}>
          <Installation />
          <WebSearchShowcase />
        </Match>

        <Match when={activeTab() === 'todo'}>
          <Installation />
          <TodoListShowcase />
        </Match>

        <Match when={activeTab() === 'heatmaps'}>
          <Installation />
          <ActivityHeatmapShowcase />
        </Match>

        <Match when={activeTab() === 'gooey'}>
          <Installation />
          <GooeyShowcase />
        </Match>
      </Switch>

      <Footer />
    </main>
  </div>
);
}
