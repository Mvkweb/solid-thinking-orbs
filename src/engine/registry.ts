// Mode key → frame painter. Kept separate from the presets so tree
// shaking can in principle drop unused modes in custom builds.

import type { ModeKey } from '../presets';
import type { ModeDraw } from './types';
import { drawGlobe, drawRubik, drawWave } from './lattice';
import { drawMorph } from './morph';
import { drawOrbits } from './orbits';
import { drawRibbon } from './ribbon';
import { drawCube } from './cube';
import { drawTesseract } from './tesseract';
import { drawMerkaba } from './merkaba';
import { drawAssembling } from './assembling';

export const MODE_DRAWS: Record<ModeKey, ModeDraw> = {
  orbits: drawOrbits,
  globe: drawGlobe,
  rubik: drawRubik,
  wave: drawWave,
  ribbon: drawRibbon,
  morph: drawMorph,
  cube: drawCube,
  tesseract: drawTesseract,
  merkaba: drawMerkaba,
  assembling: drawAssembling
};
