import type { JSX } from 'solid-js';

export interface AnimationConfig {
  animate?: boolean;
  speed?: number;
}

export interface SingleColorConfig {
  mode?: 'single';
  color?: string;
}

export interface MultiColorConfig {
  mode: 'multi';
  color1: string;
  color2: string;
}

export interface RandomColorConfig {
  mode: 'random';
}

export type RaysColorConfig =
  | SingleColorConfig
  | MultiColorConfig
  | RandomColorConfig;

export interface LightRaysProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Brightness intensity of the rays (0-100). Default 13. */
  intensity?: number;
  /** Number and frequency density of light rays (0-100). Default 32. */
  rays?: number;
  /** How far the rays extend across the viewport (0-100). Default 16. */
  reach?: number;
  /** Horizontal position percentage of the light source (0-100). Default 50. */
  position?: number;
  /** Border radius of the container. Default '0px'. */
  radius?: string;
  /** Background color of the canvas container. Default '#000' or transparent. */
  backgroundColor?: string;
  /** Animation configuration: toggle animation and adjust time speed (0-100). */
  animation?: AnimationConfig;
  /** Color configuration: single color, multi dual-gradient, or random HSL spectrum. */
  raysColor?: RaysColorConfig;
  /** Color mode override ('auto' | 'dark' | 'light'). */
  theme?: 'auto' | 'dark' | 'light';
  class?: string;
  className?: string;
  style?: JSX.CSSProperties | string;
  children?: JSX.Element;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
}

export interface LightRaysPreset {
  name: string;
  description: string;
  intensity?: number;
  rays?: number;
  reach?: number;
  position?: number;
  speed?: number;
  raysColor: RaysColorConfig;
}
