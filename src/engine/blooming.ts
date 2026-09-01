import type { Dot, ModeDraw } from './types';
import { makeProj, paint, radiusScale } from './core';

function bezierPoint(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

function getPetalPoint(u: number, L: number, W: number): [number, number] {
  if (u <= 0.5) {
    const t = u / 0.5;
    const x = bezierPoint(0, -W * 0.65, -W * 1.05, 0, t);
    const y = bezierPoint(0, L * 0.25, L * 0.85, L * 1.05, t);
    return [x, y];
  } else {
    const t = (1 - u) / 0.5;
    const x = -bezierPoint(0, -W * 0.65, -W * 1.05, 0, t);
    const y = bezierPoint(0, L * 0.25, L * 0.85, L * 1.05, t);
    return [x, y];
  }
}

/**
 * Blooming (Glacio Flower) Engine.
 * Constructs an authentic 5-petal fluid flower emblem completely from
 * elegant, rhythmic dotted particle paths, glowing wave pulses, and
 * subtle 3D layered weave dynamics.
 */
export const drawBlooming: ModeDraw = (ctx, size, t, dark, o) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.82;

  const spin = o.spin ?? 0.6;
  const rotSpeed = t * spin * 0.45;

  // Gentle gyroscopic tilt for authentic 3D depth and parallax
  const yaw = 0.12 * Math.sin(t * 0.5);
  const tilt = 0.14 * Math.cos(t * 0.4);

  const pt = makeProj(yaw, tilt, cx, cy, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const dots: Dot[] = [];
  const maxZ = R * 1.5;

  const countMul = o.count ?? 1;
  const numPetals = 5;
  const outerDotsPerPetal = Math.max(8, Math.floor(16 * Math.sqrt(countMul)));
  const innerDotsPerPetal = Math.max(4, Math.floor(9 * Math.sqrt(countMul)));

  // Breathing pulse
  const breathe = 1.0 + 0.035 * Math.sin(t * 1.2);
  const L_outer = 0.88 * breathe;
  const W_outer = 0.48 * breathe;

  const L_inner = 0.58 * breathe;
  const W_inner = 0.28 * breathe;

  // 1. Draw 5 Petals with Outer & Inner Dotted Contours
  for (let k = 0; k < numPetals; k++) {
    const baseAngle = rotSpeed + (k * (Math.PI * 2)) / numPetals;

    // Slight organic undulation per petal
    const petalWobble = 0.025 * Math.sin(t * 1.8 + k * 1.25);
    const angle = baseAngle + petalWobble;

    // Petal Z-layering: each petal sits on a slightly different depth plane
    const petalZBase = 0.08 * Math.sin((k / numPetals) * Math.PI * 2);

    // --- Outer Petal Perimeter Dots ---
    for (let i = 0; i < outerDotsPerPetal; i++) {
      const u = i / outerDotsPerPetal;
      const [lx, ly] = getPetalPoint(u, L_outer, W_outer);

      // Rotate into 2D plane
      const rx = lx * Math.cos(angle) - ly * Math.sin(angle);
      const ry = lx * Math.sin(angle) + ly * Math.cos(angle);

      // Slight 3D curvature: tips curve forward, center curves back
      const rz = petalZBase + 0.06 * Math.sin(u * Math.PI);

      const [px, py, pz] = pt(rx * R, ry * R, rz * R);
      const depth = (pz / maxZ + 1) / 2;

      // Dynamic multi-stage color / light movement:
      // 1. Sweeping circular lighthouse beam
      const dotAngle = Math.atan2(ry, rx);
      const beamSweep = Math.pow(Math.max(0, Math.cos(dotAngle - t * 1.8)), 3.5);

      // 2. Radial outward blooming wave from center to tip
      const distFromCenter = Math.hypot(rx, ry);
      const radialWave = Math.pow(0.5 + 0.5 * Math.sin(t * 2.6 - distFromCenter * 3.5), 2.2);

      // 3. Flow along the petal perimeter loop
      const loopWave = 0.5 + 0.5 * Math.sin(t * 3.2 - u * Math.PI * 2 + k * 1.25);

      // Combined organic luminescence
      const pulse = Math.min(1.0, beamSweep * 0.7 + radialWave * 0.35 + loopWave * 0.2);

      dots.push({
        x: px,
        y: py,
        z: pz,
        r: ((o.rBase ?? 0.95) + (o.rDepth ?? 1.35) * depth + pulse * 1.1) * rs,
        white: 0.72 - 0.35 * depth - pulse * 0.45,
        a: 0.3 + 0.45 * depth + pulse * 0.35,
      });
    }

    // --- Inner Concentric Petal Accent Dots ---
    for (let i = 0; i < innerDotsPerPetal; i++) {
      const u = i / innerDotsPerPetal;
      const [lx, ly] = getPetalPoint(u, L_inner, W_inner);

      const rx = lx * Math.cos(angle) - ly * Math.sin(angle);
      const ry = lx * Math.sin(angle) + ly * Math.cos(angle);
      const rz = petalZBase - 0.03 + 0.04 * Math.sin(u * Math.PI);

      const [px, py, pz] = pt(rx * R, ry * R, rz * R);
      const depth = (pz / maxZ + 1) / 2;

      const dotAngle = Math.atan2(ry, rx);
      const beamSweep = Math.pow(Math.max(0, Math.cos(dotAngle - t * 1.8 + Math.PI * 0.3)), 3.0);
      const distFromCenter = Math.hypot(rx, ry);
      const radialWave = Math.pow(0.5 + 0.5 * Math.sin(t * 2.6 - distFromCenter * 3.5 + Math.PI * 0.5), 2.0);

      const pulse = Math.min(1.0, beamSweep * 0.65 + radialWave * 0.35);

      dots.push({
        x: px,
        y: py,
        z: pz,
        r: ((o.rBase ?? 0.8) + (o.rDepth ?? 1.1) * depth + pulse * 0.75) * rs * 0.85,
        white: 0.65 - 0.3 * depth - pulse * 0.35,
        a: 0.22 + 0.4 * depth + pulse * 0.35,
      });
    }
  }

  // 2. Center Orbital Ring (connecting petal roots)
  const centerRingN = Math.max(5, Math.floor(10 * Math.sqrt(countMul)));
  const centerRadius = 0.16 * breathe;
  for (let c = 0; c < centerRingN; c++) {
    const cang = -rotSpeed * 1.2 + (c * (Math.PI * 2)) / centerRingN;
    const cx_ = Math.cos(cang) * centerRadius;
    const cy_ = Math.sin(cang) * centerRadius;
    const cz_ = 0.04 * Math.sin(t * 3.0 + c);

    const [px, py, pz] = pt(cx_ * R, cy_ * R, cz_ * R);
    const depth = (pz / maxZ + 1) / 2;

    const ringPulse = Math.pow(0.5 + 0.5 * Math.sin(t * 2.6 + cang * 2), 2.0);

    dots.push({
      x: px,
      y: py,
      z: pz,
      r: ((o.rBase ?? 0.9) + (o.rDepth ?? 1.2) * depth + ringPulse * 0.6) * rs,
      white: 0.62 - 0.35 * depth - ringPulse * 0.3,
      a: 0.4 + 0.45 * depth + ringPulse * 0.25,
    });
  }

  // 3. Central Luminous Core / Pistil
  const coreN = 4;
  for (let c = 0; c < coreN; c++) {
    const cang = t * 1.5 + (c * (Math.PI * 2)) / coreN;
    const crad = 0.045 * (0.8 + 0.4 * Math.sin(t * 2.5 + c));
    const [px, py, pz] = pt(Math.cos(cang) * crad * R, Math.sin(cang) * crad * R, 0.05);
    const depth = (pz / maxZ + 1) / 2;

    const corePulse = 0.5 + 0.5 * Math.sin(t * 3.0 + c);

    dots.push({
      x: px,
      y: py,
      z: pz,
      r: (1.4 + 1.2 * depth + corePulse * 0.8) * rs,
      white: 0.25 - 0.2 * depth,
      a: 0.8 + 0.2 * depth,
    });
  }

  paint(ctx, dots, dark, o.rMin);
};

export { drawBlooming as drawSandglass };
