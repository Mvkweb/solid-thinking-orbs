import { createSignal } from 'solid-js';
import { CopyButton } from './components/CopyButton';
import { Examples } from './components/Examples';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Playground } from './components/Playground';
import { useTheme } from './hooks/useTheme';

import { Installation } from './components/Installation';

const USAGE_SNIPPET = `import { ThinkingOrb } from 'solid-thinking-orbs';\n\n<ThinkingOrb state="listening" size={64} />`;

export function App() {
  const [theme, toggleTheme] = useTheme();
  // Speed lives on App so the Playground slider drives both the playground
  // preview AND the hero examples above. Stored as 25..300 percent to match
  // the slider range; consumers convert to a multiplier via `speed / 100`.
  const [speed, setSpeed] = createSignal(100);
  // Dev-only: strip the gray hero surfaces to inspect the orbs in isolation.
  const [debug, setDebug] = createSignal(false);
  // Dev-only: render the small chips as large pills.
  const [bigChips, setBigChips] = createSignal(false);
  // Dev-only: force every pill (hero + chips) to the small chip style.
  const [smallAll, setSmallAll] = createSignal(false);

  return (
    <main class="flex flex-col items-center max-w-[883px] mx-auto w-full px-6 pb-16 max-sm:px-4 max-sm:pb-12">
      <Header
        theme={theme()}
        onToggleTheme={toggleTheme}
      />

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

      <Footer />
    </main>
  );
}

