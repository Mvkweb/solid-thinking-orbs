import type { Dot, ModeDraw } from './types';
import { hashD, makeProj, paint, radiusScale } from './core';

const EDGES: [number, number, number, number, number, number][] = [
  // Front face
  [1, 1, 1, -1, 1, 1],
  [-1, 1, 1, -1, -1, 1],
  [-1, -1, 1, 1, -1, 1],
  [1, -1, 1, 1, 1, 1],
  // Back face
  [1, 1, -1, -1, 1, -1],
  [-1, 1, -1, -1, -1, -1],
  [-1, -1, -1, 1, -1, -1],
  [1, -1, -1, 1, 1, -1],
  // Connecting edges
  [1, 1, 1, 1, 1, -1],
  [-1, 1, 1, -1, 1, -1],
  [-1, -1, 1, -1, -1, -1],
  [1, -1, 1, 1, -1, -1],
];

/**
 * Assembling / Quantum Reconstructing Cube Engine.
 * A 3D wireframe cube whose particles dynamically eject outward into 3D space,
 * scatter, and snap back into the cubic lattice "out of the blue".
 */
export const drawAssembling: ModeDraw = (ctx, size, t, dark, o) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.52;

  const spin = o.spin ?? 1;
  const tilt = t * 0.15 * spin;
  const yaw = t * 0.2 * spin;

  const pt = makeProj(yaw, tilt, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);

  const dots: Dot[] = [];
  const dotsPerEdge = Math.max(2, Math.floor(o.ghostN ?? 14));

  let edgeIdx = 0;
  for (const [x1, y1, z1, x2, y2, z2] of EDGES) {
    edgeIdx++;

    for (let i = 0; i < dotsPerEdge; i++) {
      const f = i / (dotsPerEdge - 1);

      // Base point on the cube's wireframe edge (-1 to 1)
      const bx = x1 + (x2 - x1) * f;
      const by = y1 + (y2 - y1) * f;
      const bz = z1 + (z2 - z1) * f;

      // Unique pseudo-random phase for each individual dot
      const seed = hashD(edgeIdx * 100 + i, 3.14);
      const phase = seed * Math.PI * 2;

      // Ejection cycle: periodic explosion outward and snap back
      const cycleTime = (t * 1.8 + phase) % (Math.PI * 2);

      let displacement = 0;
      let alphaMult = 1.0;
      let radiusBoost = 0;

      // Dots eject outward during a portion of the cycle
      if (cycleTime > Math.PI * 0.8 && cycleTime < Math.PI * 1.7) {
        const ejectProgress = (cycleTime - Math.PI * 0.8) / (Math.PI * 0.9);
        const ejectEnvelope = Math.sin(ejectProgress * Math.PI); // 0 -> 1 -> 0

        // Eject direction is outward along normalized position vector + noise offset
        const norm = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
        const dirX = bx / norm + 0.3 * Math.sin(seed * 10);
        const dirY = by / norm + 0.3 * Math.cos(seed * 10);
        const dirZ = bz / norm + 0.3 * Math.sin(seed * 20);

        const mag = 0.5 * ejectEnvelope;
        displacement = mag;

        // Fade slightly when scattered
        alphaMult = 1.0 - 0.4 * ejectEnvelope;
        radiusBoost = 0.4 * ejectEnvelope;
      }

      // Compute final 3D position
      const norm = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
      const fx = bx + (bx / norm) * displacement;
      const fy = by + (by / norm) * displacement;
      const fz = bz + (bz / norm) * displacement;

      const [px, py, pz] = pt(fx * R, fy * R, fz * R);

      const maxZ = R * 1.732;
      const depth = (pz / maxZ + 1) / 2;

      dots.push({
        x: px,
        y: py,
        z: pz,
        r: ((o.rBase ?? 1.1) + (o.rDepth ?? 1.7) * depth + radiusBoost) * rs,
        white: 0.55 - 0.42 * depth,
        a: (0.4 + 0.6 * depth) * alphaMult,
      });
    }
  }

  // Floating Quantum Snap-particles (particles spawning out of the blue to snap into corners)
  const snapCount = 12;
  for (let s = 0; s < snapCount; s++) {
    const sSeed = hashD(s + 50, 7.12);
    const snapCycle = (t * 2.2 + sSeed * Math.PI * 2) % (Math.PI * 2);

    if (snapCycle > Math.PI) {
      const snapProgress = (snapCycle - Math.PI) / Math.PI; // 0 to 1
      const easeSnap = Math.pow(1 - snapProgress, 3); // snaps in rapidly

      // Random corner index 0..7
      const cornerIdx = Math.floor(sSeed * 8);
      const cx_ = (cornerIdx & 1 ? 1 : -1);
      const cy_ = (cornerIdx & 2 ? 1 : -1);
      const cz_ = (cornerIdx & 4 ? 1 : -1);

      // Start distant, collapse to corner
      const dist = 1.2 * easeSnap;
      const fx = cx_ + Math.sin(sSeed * 15) * dist;
      const fy = cy_ + Math.cos(sSeed * 25) * dist;
      const fz = cz_ + Math.sin(sSeed * 35) * dist;

      const [px, py, pz] = pt(fx * R, fy * R, fz * R);
      const depth = (pz / (R * 1.732) + 1) / 2;

      dots.push({
        x: px,
        y: py,
        z: pz,
        r: (1.3 + 1.2 * depth) * rs,
        white: 0.7 - 0.4 * depth,
        a: (0.2 + 0.8 * (1 - easeSnap)),
      });
    }
  }

  paint(ctx, dots, dark, o.rMin);
};
