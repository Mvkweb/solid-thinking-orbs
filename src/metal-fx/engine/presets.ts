export type PresetName = 'chromatic' | 'silver' | 'gold' | 'blueberry' | 'rose' | 'copper';
export type PresetTheme = 'dark' | 'light';

export interface PresetMode {
  colors: [string, string, string, string, string, string, string];
  alphas: [number, number, number, number, number, number, number];
  direction: number;
  speed: number;
  intensity: number;
  scale: number;
  softness: number;
  distortion: number;
  complexity: number;
  shape: number;
  blur: number;
  vignette: number;
  vigOpacity: number;
  shaderOpacity: number;
}

export interface Preset {
  name: PresetName;
  modes: Record<PresetTheme, PresetMode>;
}

const CHROMATIC: Preset = {
  name: 'chromatic',
  modes: {
    dark: {
      colors: ['#000000', '#aae8ff', '#c5fe9e', '#f7888d', '#0d0d0d', '#fffdc3', '#007cff'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.2,
      intensity: 2,
      scale: 1.6,
      softness: 0.18,
      distortion: 0.3,
      complexity: 0.68,
      shape: 1,
      blur: 1,
      vignette: 0.26,
      vigOpacity: 0.6,
      shaderOpacity: 1,
    },
    light: {
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffb3b3', '#adadad', '#f5ff70', '#007cff'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.2,
      intensity: 2,
      scale: 2.5,
      softness: 0.18,
      distortion: 0.3,
      complexity: 0.68,
      shape: 1,
      blur: 1,
      vignette: 0.24,
      vigOpacity: 0.16,
      shaderOpacity: 1,
    },
  },
};

const SILVER: Preset = {
  name: 'silver',
  modes: {
    dark: {
      colors: ['#000000', '#dedede', '#747270', '#e5e5e5', '#0d0d0d', '#ffffff', '#e6e6e6'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.2,
      intensity: 2,
      scale: 2.5,
      softness: 0.18,
      distortion: 0.3,
      complexity: 0.68,
      shape: 1,
      blur: 1,
      vignette: 0.26,
      vigOpacity: 0.6,
      shaderOpacity: 0.88,
    },
    light: {
      colors: ['#f6f6f6', '#ffffff', '#ffffff', '#f7f7f7', '#c9c9c9', '#d0d0d0', '#d1d1d1'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.2,
      intensity: 2,
      scale: 2.5,
      softness: 0.18,
      distortion: 0.3,
      complexity: 0.68,
      shape: 1,
      blur: 1,
      vignette: 0.2,
      vigOpacity: 0.26,
      shaderOpacity: 1,
    },
  },
};

const GOLD: Preset = {
  name: 'gold',
  modes: {
    dark: {
      colors: ['#000000', '#ffffff', '#ffffff', '#f7d488', '#0d0d0d', '#fffdc3', '#ffffff'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.0,
      intensity: 2,
      scale: 2.5,
      softness: 0.18,
      distortion: 0.3,
      complexity: 0.68,
      shape: 1,
      blur: 1,
      vignette: 0.26,
      vigOpacity: 0.6,
      shaderOpacity: 0.92,
    },
    light: {
      colors: ['#fff8e1', '#fffbe0', '#ffffff', '#fff6d6', '#d2c7a7', '#dcd2bc', '#f9f7e5'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.2,
      intensity: 2,
      scale: 2.5,
      softness: 0.18,
      distortion: 0.3,
      complexity: 0.68,
      shape: 1,
      blur: 1,
      vignette: 0.22,
      vigOpacity: 0.24,
      shaderOpacity: 1,
    },
  },
};

const BLUEBERRY: Preset = {
  name: 'blueberry',
  modes: {
    dark: {
      colors: ['#090314', '#3c126d', '#1d6ce6', '#70a6ff', '#e6f0ff', '#5c3d75', '#38588c'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 75,
      speed: 1.4,
      intensity: 2.2,
      scale: 3.0,
      softness: 0.18,
      distortion: 0.45,
      complexity: 0.75,
      shape: 1,
      blur: 1,
      vignette: 0.25,
      vigOpacity: 0.6,
      shaderOpacity: 0.98,
    },
    light: {
      colors: ['#ffffff', '#c3cee8', '#4b7bec', '#1e3799', '#70a6ff', '#bfa5d9', '#5b6b9e'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 75,
      speed: 1.4,
      intensity: 2.2,
      scale: 3.0,
      softness: 0.18,
      distortion: 0.45,
      complexity: 0.75,
      shape: 1,
      blur: 1,
      vignette: 0.22,
      vigOpacity: 0.2,
      shaderOpacity: 1,
    },
  },
};

const ROSE: Preset = {
  name: 'rose',
  modes: {
    dark: {
      colors: ['#170206', '#850c26', '#e61c48', '#ff6b8b', '#fff0f3', '#a3263b', '#f0c4cc'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 85,
      speed: 1.3,
      intensity: 2.2,
      scale: 3.0,
      softness: 0.18,
      distortion: 0.45,
      complexity: 0.75,
      shape: 1,
      blur: 1,
      vignette: 0.25,
      vigOpacity: 0.6,
      shaderOpacity: 0.98,
    },
    light: {
      colors: ['#ffffff', '#fcdada', '#e84118', '#c23616', '#ff6b8b', '#e06c7e', '#8c1c2e'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 85,
      speed: 1.3,
      intensity: 2.2,
      scale: 3.0,
      softness: 0.18,
      distortion: 0.45,
      complexity: 0.75,
      shape: 1,
      blur: 1,
      vignette: 0.22,
      vigOpacity: 0.2,
      shaderOpacity: 1,
    },
  },
};

const COPPER: Preset = {
  name: 'copper',
  modes: {
    dark: {
      colors: ['#190a04', '#803512', '#d96b27', '#f7a468', '#fff3e8', '#a3481d', '#f28544'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.3,
      intensity: 2.2,
      scale: 3.0,
      softness: 0.18,
      distortion: 0.45,
      complexity: 0.75,
      shape: 1,
      blur: 1,
      vignette: 0.25,
      vigOpacity: 0.6,
      shaderOpacity: 0.98,
    },
    light: {
      colors: ['#ffffff', '#fce8dc', '#e67e3a', '#b84e14', '#f7a468', '#d66a2b', '#803512'],
      alphas: [1, 1, 1, 1, 1, 1, 1],
      direction: 80,
      speed: 1.3,
      intensity: 2.2,
      scale: 3.0,
      softness: 0.18,
      distortion: 0.45,
      complexity: 0.75,
      shape: 1,
      blur: 1,
      vignette: 0.22,
      vigOpacity: 0.2,
      shaderOpacity: 1,
    },
  },
};

export const PRESETS: Record<PresetName, Preset> = {
  chromatic: CHROMATIC,
  silver: SILVER,
  gold: GOLD,
  blueberry: BLUEBERRY,
  rose: ROSE,
  copper: COPPER,
};

export { hexToRgb } from './color';
