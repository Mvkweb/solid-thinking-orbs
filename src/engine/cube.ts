import type { Dot, ModeDraw } from './types';
import { makeProj, paint, radiusScale } from './core';

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
  [1, -1, 1, 1, -1, -1]
];

export const drawCube: ModeDraw = (ctx, size, t, dark, o) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.55; // Scale down so corners don't clip
  
  // Apply a continuous tumbling rotation on multiple axes
  // spin sets the tumbling speed
  const spin = o.spin ?? 1;
  const tilt = t * 0.15 * spin;
  const yaw = t * 0.2 * spin;
  
  const pt = makeProj(yaw, tilt, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  
  const dots: Dot[] = [];
  const dotsPerEdge = Math.max(2, Math.floor(o.ghostN ?? 12));
  
  for (const [x1, y1, z1, x2, y2, z2] of EDGES) {
    for (let i = 0; i < dotsPerEdge; i++) {
      // Interpolate along the edge
      const f = i / (dotsPerEdge - 1);
      
      const x = x1 + (x2 - x1) * f;
      const y = y1 + (y2 - y1) * f;
      const z = z1 + (z2 - z1) * f;
      
      const [px, py, pz] = pt(x * R, y * R, z * R);
      
      // Depth based shading
      // R * sqrt(3) is the max possible z distance for a cube corner
      const maxZ = R * 1.732;
      const depth = (pz / maxZ + 1) / 2; // Normalize to 0..1
      
      dots.push({
        x: px,
        y: py,
        z: pz,
        r: ((o.rBase ?? 1.1) + (o.rDepth ?? 1.7) * depth) * rs,
        white: 0.52 - 0.44 * depth,
        a: 0.4 + 0.6 * depth
      });
    }
  }
  
  paint(ctx, dots, dark, o.rMin);
};
