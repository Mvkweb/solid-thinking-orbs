import { For } from 'solid-js';
import type { Theme } from '../hooks/useTheme';
import { ThinkingOrb } from '../ThinkingOrb';
import { GitHubIcon, XIcon } from './icons';

function SocialDropdown(props: {
  icon: () => any;
  links: { name: string; url: string; tooltip?: string }[];
  hoverClass: string;
}) {
  return (
    <div class={`group relative flex items-center h-9 w-9 transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.2)] bg-(--icon-btn-bg) hover:bg-(--icon-btn-hover) rounded-full overflow-hidden hover:overflow-visible [&_svg]:fill-(--icon-btn-fill) [&_svg]:opacity-60 hover:[&_svg]:opacity-100 ${props.hoverClass}`}>
      <div class="w-9 h-9 shrink-0 flex items-center justify-center absolute left-0 top-0 pointer-events-none z-10">
        {props.icon()}
      </div>
      <div class="absolute left-9 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-0 group-hover:delay-75 whitespace-nowrap pr-3.5">
        <For each={props.links}>{(link) => (
          <div class="relative group/link inline-flex items-center">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-[12px] font-medium text-(--subtitle-color) hover:text-(--title-color) transition-colors py-1"
            >
              {link.name}
            </a>
            {link.tooltip && (
              <div class="absolute left-1/2 -translate-x-1/2 top-[calc(100%+4px)] opacity-0 translate-y-[-4px] scale-95 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:scale-100 transition-all duration-250 ease-[cubic-bezier(0.175,0.885,0.32,1.2)] pointer-events-none z-30 whitespace-nowrap bg-(--icon-btn-hover) backdrop-blur-md border border-[rgba(255,255,255,0.12)] text-[10px] font-medium text-(--title-color) px-2.5 py-0.5 rounded-[6px] shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                <div class="absolute -top-[4.5px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-(--icon-btn-hover) border-t border-l border-[rgba(255,255,255,0.12)]" />
                <span class="relative z-10">{link.tooltip}</span>
              </div>
            )}
          </div>
        )}</For>
      </div>
    </div>
  );
}

export function Header(props: {
  theme: Theme;
  onToggleTheme: () => void;
}) {
  return (
    <header class="relative w-full flex flex-col items-center justify-end pt-12 pb-8 text-center max-sm:pt-14 max-sm:pb-6">
      <nav class="absolute top-4 right-0 flex items-center gap-4 max-sm:top-3" aria-label="External links">
        <SocialDropdown 
          icon={() => <GitHubIcon />} 
          hoverClass="hover:w-[172px]"
          links={[
            { name: 'SolidJS Port', url: 'https://github.com/Mvkweb/solid-thinking-orbs' },
            { name: 'Original', url: 'https://github.com/Jakubantalik/thinking-orbs' }
          ]} 
        />
        <SocialDropdown 
          icon={() => <XIcon />} 
          hoverClass="hover:w-[182px]"
          links={[
            { name: 'Mvkweb', url: 'https://x.com/mvkweb' },
            { name: 'Jakub', url: 'https://x.com/jakubantalik', tooltip: '(Original Creator)' },
            { name: 'Alex', url: 'https://x.com/a_brinza', tooltip: '(Creator)' }
          ]} 
        />
      </nav>

      {/* Sleek Live-Orb Hero Icon Card */}
      <div class="relative flex flex-col items-center group cursor-pointer mb-4" aria-hidden="true">
        <div class="w-[84px] h-[84px] rounded-[24px] bg-(--hero-surface) border border-[rgba(255,255,255,0.08)] shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center justify-center relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.2)] group-hover:scale-105 group-hover:border-[rgba(255,255,255,0.18)] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <div class="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-transparent pointer-events-none z-10" />
          <ThinkingOrb state="hypercube" size={64} style={{ width: '62px', height: '62px' }} />
        </div>
      </div>

      <h1 class="text-[26px] font-semibold leading-[34px] tracking-tight text-(--title-color) mb-1">
        solid-thinking-orbs
      </h1>
      <p class="text-sm font-normal leading-[22px] text-(--subtitle-color) opacity-65 max-w-[500px]">
        SolidJS port and fork of Jakub Antalík's thinking-orbs, adding new custom states and expanded engine modes
      </p>
    </header>
  );
}
