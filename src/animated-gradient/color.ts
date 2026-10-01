/**
 * Converts any CSS color format (hex, rgb, rgba, hsl, hsla) into a normalized [r, g, b, a] vec4 tuple in [0, 1].
 */
export function hexToRgba(hex: string): [number, number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  if (!hex) return [r, g, b, a];

  const trimmed = hex.trim();

  if (trimmed.startsWith('rgba(')) {
    const parts = trimmed.slice(5, -1).split(',');
    r = parseInt(parts[0], 10) / 255;
    g = parseInt(parts[1], 10) / 255;
    b = parseInt(parts[2], 10) / 255;
    a = parseFloat(parts[3]);
  } else if (trimmed.startsWith('rgb(')) {
    const parts = trimmed.slice(4, -1).split(',');
    r = parseInt(parts[0], 10) / 255;
    g = parseInt(parts[1], 10) / 255;
    b = parseInt(parts[2], 10) / 255;
  } else if (trimmed.startsWith('hsla(') || trimmed.startsWith('hsl(')) {
    const isHsla = trimmed.startsWith('hsla(');
    const parts = trimmed.slice(isHsla ? 5 : 4, -1).split(',');
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    a = isHsla ? parseFloat(parts[3]) : 1;
    [r, g, b] = hslToRgb(h, s, l);
  } else if (trimmed.startsWith('#')) {
    const c = trimmed.slice(1);
    if (c.length === 3) {
      r = parseInt(c[0] + c[0], 16) / 255;
      g = parseInt(c[1] + c[1], 16) / 255;
      b = parseInt(c[2] + c[2], 16) / 255;
    } else if (c.length >= 6) {
      r = parseInt(c.slice(0, 2), 16) / 255;
      g = parseInt(c.slice(2, 4), 16) / 255;
      b = parseInt(c.slice(4, 6), 16) / 255;
      if (c.length === 8) {
        a = parseInt(c.slice(6, 8), 16) / 255;
      }
    }
  }

  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b)),
    Math.max(0, Math.min(1, a)),
  ];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let val = t;
      if (val < 0) val += 1;
      if (val > 1) val -= 1;
      if (val < 1 / 6) return p + (q - p) * 6 * val;
      if (val < 1 / 2) return q;
      if (val < 2 / 3) return p + (q - p) * (2 / 3 - val) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}
