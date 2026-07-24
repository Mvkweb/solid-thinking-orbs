import { PauseIcon, PlayIcon } from './icons';

export function PlayPauseToggle(props: { playing: boolean; onToggle: () => void; class?: string; ref?: any }) {
  const state = () => props.playing ? 'b' : 'a';
  return (
    <button
      ref={props.ref}
      class={`playground-play-toggle z-[2] inline-grid place-items-center size-8 border-0 rounded-full bg-(--toggle-bg) text-(--toggle-color) cursor-pointer transition-[background-color,color] duration-200 [-webkit-tap-highlight-color:transparent] hover:bg-(--toggle-hover) hover:text-(--toggle-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2 [&_.t-icon_svg]:size-3.5 [&_.t-icon_svg]:fill-current [&_.t-icon_svg]:stroke-none ${props.class || ''}`.trim()}
      type="button"
      data-state={state()}
      onClick={props.onToggle}
      aria-pressed={props.playing}
      aria-label={props.playing ? 'Pause shader animation' : 'Play shader animation'}
    >
      <span class="t-icon" data-icon="a"><PlayIcon /></span>
      <span class="t-icon" data-icon="b"><PauseIcon /></span>
    </button>
  );
}

