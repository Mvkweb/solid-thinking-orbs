import type { JSX } from 'solid-js';

export type PatternShape = 'Checks' | 'Stripes' | 'Edge';

export interface PresetColors {
  color1: string;
  color2: string;
  color3: string;
}

export interface PresetParams extends PresetColors {
  rotation: number;
  proportion: number;
  scale: number;
  speed: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  softness: number;
  offset: number;
  shape: PatternShape;
  shapeSize: number;
  lightColors?: PresetColors;
}

export type PresetName = 'Prism' | 'Lava' | 'Plasma' | 'Pulse' | 'Vortex' | 'Mist';

export interface CustomConfig {
  preset: 'custom';
  color1: string;
  color2: string;
  color3: string;
  rotation?: number;
  proportion?: number;
  scale?: number;
  speed?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  offset?: number;
  shape?: PatternShape;
  shapeSize?: number;
}

export interface PresetConfig {
  preset: PresetName;
  speed?: number;
}

export type GradientConfig = CustomConfig | PresetConfig;

export interface NoiseConfig {
  opacity: number;
  scale?: number;
}

export interface AnimatedGradientProps {
  /** Gradient configuration: choose a preset or provide custom settings. */
  config?: GradientConfig;
  /** Optional noise grain overlay configuration. */
  noise?: NoiseConfig;
  /** CSS border radius for the container clipping (defaults to '0px'). */
  radius?: string;
  /** Force theme mode ('dark' | 'light') or leave 'auto' to auto-detect theme. */
  theme?: 'auto' | 'dark' | 'light';
  /** Additional CSS class names. */
  class?: string;
  /** Additional inline CSS styles. */
  style?: JSX.CSSProperties | string;
}
