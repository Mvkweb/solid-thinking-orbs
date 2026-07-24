import type { Dot, ModeDraw } from './types';
import { makeProj, paint, radiusScale } from './core';

/**
 * Twisting Spiral Tetrahedron Engine.
 * Features an actively spinning base ring with static/tumbling camera option,
 * and seamless infinite harmonic wave pulses (zero loop resets).
 */
export const drawMerkaba: ModeDraw = (ctx, size, t, dark, o) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.55;

  const spin = o.spin ?? 1;
  const isStatic = spin === 0;

  // Fixed upright 3D camera angle if spin === 0, otherwise dynamic gyroscopic precession tumbling
  const yaw = isStatic ? 0.25 : t * 0.35 * spin;
  const tilt = isStatic ? 0.38 : 0.45 + 0.25 * Math.sin(t * 0.6 * spin);
  const roll = isStatic ? 0 : t * 0.2 * spin;

  // Base rotation: always active even when camera spin === 0
  const baseRotSpeed = isStatic ? 1.0 : 0.8;
  const baseAngleOffset = t * baseRotSpeed;

  // Combine yaw/tilt with roll
  const cr = Math.cos(roll), sr = Math.sin(roll);
  const basePt = makeProj(yaw, tilt, cx, cy, 1);

  const pt = (x: number, y: number, z: number): [number, number, number] => {
    const rx = x * cr - y * sr;
    const ry = x * sr + y * cr;
    return basePt(rx, ry, z);
  };

  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const dots: Dot[] = [];

  const dotsPerEdge = Math.max(4, Math.floor(o.ghostN ?? 16));

  // Apex Vertex (Fixed at top y = 0.9)
  const apexY = 0.9;
  const baseY = -0.6;

  // 1. Draw 3 Curved Spiral Edges from Spinning Base to Static Apex
  for (let b = 0; b < 3; b++) {
    const initialAngle = (b * 2 * Math.PI) / 3 + baseAngleOffset;

    for (let i = 0; i < dotsPerEdge; i++) {
      const f = i / (dotsPerEdge - 1); // 0 at base, 1 at apex

      // Vertical position from base to apex
      const y = baseY + (apexY - baseY) * f;

      // Radius tapers smoothly towards apex
      const currentRadius = 1.0 * (1 - f);

      // Spiral twist angle: base angle rotates continuously, plus additional twist towards top
      const twistAngle = initialAngle + f * Math.PI * 1.2;

      const x = Math.cos(twistAngle) * currentRadius;
      const z = Math.sin(twistAngle) * currentRadius;

      const [px, py, pz] = pt(x * R, y * R, z * R);

      const maxZ = R * 1.5;
      const depth = (pz / maxZ + 1) / 2;

      // Seamless, continuous harmonic wave moving UP the spiral (NO modulo/reset jump!)
      const wave = 0.5 + 0.5 * Math.cos(t * 2.8 - f * Math.PI * 4);
      const pulse = Math.pow(wave, 2.5); // Sharp, clean energy crest

      dots.push({
        x: px,
        y: py,
        z: pz,
        r: ((o.rBase ?? 1.0) + (o.rDepth ?? 1.6) * depth + pulse * 0.9) * rs,
        white: 0.65 - 0.45 * depth - pulse * 0.2,
        a: 0.4 + 0.6 * depth,
      });
    }
  }

  // 2. Draw Active Spinning Base Ring (Connecting the 3 rotating base vertices)
  const baseEdgeDots = Math.floor(dotsPerEdge * 0.8);
  for (let b = 0; b < 3; b++) {
    const a1 = (b * 2 * Math.PI) / 3 + baseAngleOffset;
    const a2 = ((b + 1) * 2 * Math.PI) / 3 + baseAngleOffset;

    for (let i = 0; i < baseEdgeDots; i++) {
      const f = i / (baseEdgeDots - 1);
      const ang = a1 + (a2 - a1) * f;

      // Arc outward slightly
      const arcRadius = 1.0 + 0.12 * Math.sin(f * Math.PI);
      const x = Math.cos(ang) * arcRadius;
      const y = baseY + 0.06 * Math.sin(f * Math.PI); // subtle vertical arc
      const z = Math.sin(ang) * arcRadius;

      const [px, py, pz] = pt(x * R, y * R, z * R);

      const maxZ = R * 1.5;
      const depth = (pz / maxZ + 1) / 2;

      dots.push({
        x: px,
        y: py,
        z: pz,
        r: ((o.rBase ?? 0.9) + (o.rDepth ?? 1.5) * depth) * rs,
        white: 0.58 - 0.4 * depth,
        a: 0.35 + 0.65 * depth,
      });
    }
  }

  // 3. Spinning Outer Base Pedestal Orbit (Extra spinning ring at the bottom)
  const pedestalDots = 18;
  for (let p = 0; p < pedestalDots; p++) {
    const ang = (p / pedestalDots) * Math.PI * 2 - baseAngleOffset * 1.5;
    const rad = 1.15 * (1 + 0.05 * Math.sin(t * 3 + p));
    const x = Math.cos(ang) * rad;
    const y = baseY - 0.08;
    const z = Math.sin(ang) * rad;

    const [px, py, pz] = pt(x * R, y * R, z * R);
    const depth = (pz / R + 1) / 2;

    dots.push({
      x: px,
      y: py,
      z: pz,
      r: (0.7 + 1.1 * depth) * rs,
      white: 0.5 - 0.35 * depth,
      a: 0.3 + 0.5 * depth,
    });
  }

  // 4. Central Energetic Core Beacon
  const coreCount = 10;
  for (let c = 0; c < coreCount; c++) {
    const cf = c / (coreCount - 1);
    const cy_ = baseY + 0.2 + cf * 1.1;
    const cr_ = 0.08 * Math.sin(cf * Math.PI) * (1 + 0.3 * Math.sin(t * 3 + cf * 5));
    const cang = -t * 2.5 + cf * 3;

    const cx_ = Math.cos(cang) * cr_;
    const cz_ = Math.sin(cang) * cr_;

    const [px, py, pz] = pt(cx_ * R, cy_ * R, cz_ * R);
    const depth = (pz / R + 1) / 2;

    dots.push({
      x: px,
      y: py,
      z: pz,
      r: (1.4 + 1.2 * depth) * rs,
      white: 0.75 - 0.45 * depth,
      a: 0.7 + 0.3 * depth,
    });
  }

  paint(ctx, dots, dark, o.rMin);
};
