// The shipped tunings: six states × two sizes, baked from the inkform
// mini-page tuning session. `count`/`size` are multipliers over the base
// fine profiles; `speed` multiplies the shared clock. Resolved once per
// (state, size) pair and cached — the render loop sees plain numbers.

import type { ModeOpts } from './engine/profiles';
import { BASE_PROFILES, scaleCounts, scaleRadii } from './engine/profiles';
import type { OrbSize, OrbState } from './types';

export type ModeKey = 'orbits' | 'globe' | 'rubik' | 'wave' | 'ribbon' | 'morph' | 'cube' | 'tesseract' | 'merkaba' | 'assembling';

export const STATE_TO_MODE: Record<OrbState, ModeKey> = {
  working: 'orbits',
  searching: 'globe',
  solving: 'rubik',
  listening: 'wave',
  composing: 'ribbon',
  shaping: 'morph',
  syncing: 'ribbon',
  evolving: 'ribbon',
  building: 'cube',
  hypercube: 'tesseract',
  conjuring: 'merkaba',
  conjuring_static: 'merkaba',
  assembling: 'assembling'
};

interface Preset {
  speed: number;
  count: number;
  size: number;
  /** Extra mode opts merged verbatim after scaling. */
  extra?: ModeOpts;
}

const PRESETS: Record<OrbState, Record<OrbSize, Preset>> = {
  working: {
    64: { speed: 1.885, count: 1, size: 1 },
    20: { speed: 3.9, count: 0.238, size: 2.4 }
  },
  searching: {
    64: { speed: 2.015, count: 0.42, size: 1.15, extra: { scanMul: 4.08, dimBase: 0.45 } },
    20: { speed: 2.665, count: 0.105, size: 1.75, extra: { scanMul: 4.335, dimBase: 0.45 } }
  },
  solving: {
    64: { speed: 1.82, count: 0.35, size: 1.05 },
    20: { speed: 1.95, count: 0.088, size: 1.9 }
  },
  listening: {
    64: { speed: 4.388, count: 0.341, size: 1 },
    20: { speed: 3.998, count: 0.105, size: 1.6 }
  },
  composing: {
    64: { speed: 2.34, count: 0.25, size: 0.85, extra: { spin: 0, bandMul: 3.9, wobMul: 1 } },
    20: { speed: 3.12, count: 0.051, size: 1.073, extra: { spin: 0, bandMul: 4.94, wobMul: 1 } }
  },
  shaping: {
    64: { speed: 2.405, count: 0.54, size: 0.395, extra: { spread: 1.45 } },
    20: { speed: 2.08, count: 0.53, size: 1.011, extra: { spread: 1.45 } }
  },
  syncing: {
    64: { speed: 4.5, count: 0.8, size: 0.8, extra: { lanes: 12, spin: 3.0, bandMul: 0, wobMul: 0 } },
    20: { speed: 5.5, count: 0.25, size: 1.2, extra: { lanes: 6, spin: 3.0, bandMul: 0, wobMul: 0 } }
  },
  evolving: {
    64: { speed: 2.5, count: 0.4, size: 0.9, extra: { spin: 2.5, bandMul: 8.5, wobMul: 1.5, lanes: 4 } },
    20: { speed: 3.2, count: 0.15, size: 1.2, extra: { spin: 2.5, bandMul: 8.5, wobMul: 1.5, lanes: 4 } }
  },
  building: {
    64: { speed: 1.5, count: 1.0, size: 0.9, extra: { spin: 2.0, ghostN: 18 } },
    20: { speed: 2.0, count: 0.4, size: 1.4, extra: { spin: 2.0, ghostN: 8 } }
  },
  hypercube: {
    64: { speed: 1.8, count: 1.0, size: 0.9, extra: { spin: 2.0, ghostN: 7 } },
    20: { speed: 2.2, count: 0.5, size: 1.3, extra: { spin: 2.0, ghostN: 4 } }
  },
  conjuring: {
    64: { speed: 1.6, count: 1.0, size: 0.9, extra: { spin: 1.4, ghostN: 16 } },
    20: { speed: 1.8, count: 0.5, size: 1.3, extra: { spin: 1.4, ghostN: 8 } }
  },
  conjuring_static: {
    64: { speed: 1.6, count: 1.0, size: 0.9, extra: { spin: 0, ghostN: 16 } },
    20: { speed: 1.8, count: 0.5, size: 1.3, extra: { spin: 0, ghostN: 8 } }
  },
  assembling: {
    64: { speed: 1.6, count: 1.0, size: 0.9, extra: { spin: 2.0, ghostN: 16 } },
    20: { speed: 2.0, count: 0.5, size: 1.3, extra: { spin: 2.0, ghostN: 8 } }
  }
};

export interface Resolved {
  mode: ModeKey;
  speed: number;
  opts: ModeOpts;
}

const cache = new Map<string, Resolved>();

/** Resolve a (state, size) pair to its mode + fully-scaled draw options. */
export function resolvePreset(state: OrbState, size: OrbSize): Resolved {
  const key = `${state}-${size}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const mode = STATE_TO_MODE[state];
  const preset = PRESETS[state][size];
  let opts: ModeOpts = { ...BASE_PROFILES[mode] };
  if (preset.count !== 1) opts = scaleCounts(opts, preset.count);
  if (preset.size !== 1) opts = scaleRadii(opts, preset.size);
  if (preset.extra) opts = { ...opts, ...preset.extra };

  const resolved: Resolved = { mode, speed: preset.speed, opts };
  cache.set(key, resolved);
  return resolved;
}
