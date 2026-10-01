import type { LightRaysPreset } from './types';

export const lightRaysPresets: Record<string, LightRaysPreset> = {
  'Cyber Blue': {
    name: 'Cyber Blue',
    description: 'Electric azure and cobalt blue light rays with high reach and crisp luminance.',
    intensity: 13,
    rays: 32,
    reach: 16,
    position: 50,
    speed: 10,
    raysColor: {
      mode: 'single',
      color: '#639AFF',
    },
  },
  'Azure & White': {
    name: 'Azure & White',
    description: 'Deep royal blue light beams paired with brilliant white celestial specular highlights.',
    intensity: 16,
    rays: 36,
    reach: 22,
    position: 50,
    speed: 12,
    raysColor: {
      mode: 'multi',
      color1: '#2060DF',
      color2: '#FFFFFF',
    },
  },
  'Sunset Rose': {
    name: 'Sunset Rose',
    description: 'Warm sunset crimson and vivid magenta rays radiating across dusk skies.',
    intensity: 15,
    rays: 30,
    reach: 20,
    position: 45,
    speed: 11,
    raysColor: {
      mode: 'multi',
      color1: '#FF5E3A',
      color2: '#FF2A68',
    },
  },
  'Emerald Aurora': {
    name: 'Emerald Aurora',
    description: 'Northern lights neon emerald green blending into deep Arctic cyan ocean hues.',
    intensity: 14,
    rays: 35,
    reach: 18,
    position: 55,
    speed: 9,
    raysColor: {
      mode: 'multi',
      color1: '#00F260',
      color2: '#0575E6',
    },
  },
  'Neon Violet': {
    name: 'Neon Violet',
    description: 'Synthwave violet and electric hot pink rays cutting through deep void darkness.',
    intensity: 18,
    rays: 28,
    reach: 24,
    position: 50,
    speed: 14,
    raysColor: {
      mode: 'multi',
      color1: '#A855F7',
      color2: '#EC4899',
    },
  },
  'Solar Flare': {
    name: 'Solar Flare',
    description: 'High-energy coronal solar flares with incandescent amber and fiery vermilion.',
    intensity: 20,
    rays: 40,
    reach: 25,
    position: 50,
    speed: 16,
    raysColor: {
      mode: 'multi',
      color1: '#FFA000',
      color2: '#FF3D00',
    },
  },
  'Monochrome': {
    name: 'Monochrome',
    description: 'Pure silver spotlight beams creating clean modern studio lighting.',
    intensity: 12,
    rays: 26,
    reach: 15,
    position: 50,
    speed: 8,
    raysColor: {
      mode: 'single',
      color: '#FFFFFF',
    },
  },
};

export const presetNames = Object.keys(lightRaysPresets);
