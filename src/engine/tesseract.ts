import type { Dot, ModeDraw } from './types';
import { makeProj, paint, radiusScale } from './core';

/**
 * Filled 3D Cube with undulating face grids.
 * Creates a solid, dense 3D cubic matrix that tumbles cleanly while face dots ripple.
 */
export const drawTesseract: ModeDraw = (ctx, size, t, dark, o) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.52; // Fits neatly inside canvas

  const spin = o.spin ?? 1;
  const tilt = t * 0.14 * spin;
  const yaw = t * 0.18 * spin;

  const pt = makeProj(yaw, tilt, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  const dots: Dot[] = [];
  const gridN = Math.max(4, Math.floor(o.ghostN ?? 7));

  // Define 6 faces of a unit cube (-1 to 1) with normal vectors
  const FACES: Array<{
    axis: 'x' | 'y' | 'z';
    val: number;
    normal: [number, number, number];
  }> = [
    { axis: 'z', val: 1, normal: [0, 0, 1] },   // Front
    { axis: 'z', val: -1, normal: [0, 0, -1] }, // Back
    { axis: 'x', val: 1, normal: [1, 0, 0] },   // Right
    { axis: 'x', val: -1, normal: [-1, 0, 0] }, // Left
    { axis: 'y', val: 1, normal: [0, 1, 0] },   // Top
    { axis: 'y', val: -1, normal: [0, -1, 0] }, // Bottom
  ];

  for (const { axis, val, normal } of FACES) {
    for (let i = 0; i < gridN; i++) {
      const u = -1 + (2 * i) / (gridN - 1);
      for (let j = 0; j < gridN; j++) {
        const v = -1 + (2 * j) / (gridN - 1);

        let lx = 0;
        let ly = 0;
        let lz = 0;

        if (axis === 'z') {
          lx = u;
          ly = v;
          lz = val;
        } else if (axis === 'x') {
          lx = val;
          ly = u;
          lz = v;
        } else {
          lx = u;
          ly = val;
          lz = v;
        }

        // Gentle organic wave passing through the face grid
        const phase = lx * 1.5 + ly * 1.5 + lz * 1.5;
        const wave = 0.06 * Math.sin(t * 2.2 + phase);

        const fx = lx + normal[0] * wave;
        const fy = ly + normal[1] * wave;
        const fz = lz + normal[2] * wave;

        const [px, py, pz] = pt(fx * R, fy * R, fz * R);

        // Depth based shading (max radius in 3D for unit cube ~ sqrt(3) ~ 1.732)
        const maxZ = R * 1.732;
        const depth = (pz / maxZ + 1) / 2; // 0 to 1

        dots.push({
          x: px,
          y: py,
          z: pz,
          r: ((o.rBase ?? 0.8) + (o.rDepth ?? 1.5) * depth) * rs,
          white: 0.55 - 0.45 * depth,
          a: 0.35 + 0.65 * depth,
        });
      }
    }
  }

  paint(ctx, dots, dark, o.rMin);
};
