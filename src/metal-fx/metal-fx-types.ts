import type { JSX } from 'solid-js';

/**
 * Variant for the metal effect.
 * - 'button' (default): pill-shaped 134×40 baseline with shaderScale 1.6
 * - 'circle': compact 32×32 circle baseline with shaderScale 1.3
 */
export type MetalFxVariant = 'button' | 'circle';

/**
 * Theme mode for the metal effect.
 * - `auto` (default): follows the user's `prefers-color-scheme`
 * - `dark`: pin to dark-mode tunings
 * - `light`: pin to light-mode tunings
 */
export type MetalFxTheme = 'dark' | 'light' | 'auto';

/**
 * Bundled preset names. Each preset ships both a dark and light mode block.
 */
export type MetalFxPreset = 'chromatic' | 'silver' | 'gold' | 'blueberry' | 'rose' | 'copper';

/**
 * Props for the MetalFx component.
 */
export interface MetalFxProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The single host element to wrap with the metal effect.
   */
  children: JSX.Element;

  /**
   * Variant — controls the shader sampling scale + ring width.
   * - `button` (default): pill-style ring at 1 px wide, scale 1.6
   * - `circle`: compact circle with a 2 px ring, scale 1.3
   */
  variant?: MetalFxVariant;

  /**
   * Color preset.
   * @default 'chromatic'
   */
  preset?: MetalFxPreset;

  /**
   * Theme mode.
   * @default 'auto'
   */
  theme?: MetalFxTheme;

  /**
   * Effect strength (0..1).
   * @default 1
   */
  strength?: number;

  /**
   * Pause the shader animation.
   * @default false
   */
  paused?: boolean;

  /**
   * Optional explicit border radius (CSS px).
   */
  borderRadius?: number;

  /**
   * When true, MetalFx normalizes the host element's outer chrome.
   * @default true
   */
  normalizeHostStyles?: boolean;

  /**
   * Neighbour elements that should receive a soft proximity reflection.
   */
  reflectionTargets?: ReadonlyArray<HTMLElement | null | (() => HTMLElement | null)>;

  /**
   * Disable the wandering halo overlay.
   * @default false
   */
  disableGlow?: boolean;

  /**
   * Override the shader sampling scale.
   */
  shaderScale?: number;

  /**
   * Override the ring thickness in CSS pixels.
   */
  ringCssPx?: number;

  /**
   * Master scale multiplier.
   * @default 1
   */
  scale?: number;

  /**
   * Forwarded class name for the wrapper element.
   */
  className?: string;

  /**
   * Forwarded inline styles for the wrapper element.
   */
  style?: JSX.CSSProperties | string;
}
