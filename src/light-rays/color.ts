export function colorToRgb(colorStr?: string): [number, number, number, number] {
  if (!colorStr) return [1, 1, 1, 1];
  const str = colorStr.trim();

  // CSS variable fallback or transparent
  if (str === 'transparent' || str === 'none') return [0, 0, 0, 0];

  // Hex format
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return [r, g, b, 1];
    }
    if (hex.length === 4) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      const a = parseInt(hex[3] + hex[3], 16) / 255;
      return [r, g, b, a];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return [r, g, b, 1];
    }
    if (hex.length >= 8) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return [r, g, b, a];
    }
  }

  // rgba(r, g, b, a)
  if (str.startsWith('rgba(')) {
    const parts = str.slice(5, -1).split(',').map((p) => p.trim());
    const r = parseFloat(parts[0]) / 255;
    const g = parseFloat(parts[1]) / 255;
    const b = parseFloat(parts[2]) / 255;
    const a = parts.length > 3 ? parseFloat(parts[3]) : 1;
    return [r, g, b, isNaN(a) ? 1 : a];
  }

  // rgb(r, g, b)
  if (str.startsWith('rgb(')) {
    const parts = str.slice(4, -1).split(',').map((p) => p.trim());
    const r = parseFloat(parts[0]) / 255;
    const g = parseFloat(parts[1]) / 255;
    const b = parseFloat(parts[2]) / 255;
    return [r, g, b, 1];
  }

  // hsla(h, s, l, a) or hsl(h, s, l)
  if (str.startsWith('hsl')) {
    const isHsla = str.startsWith('hsla(');
    const content = isHsla ? str.slice(5, -1) : str.slice(4, -1);
    const parts = content.split(',').map((p) => p.trim());
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]);
    const l = parseFloat(parts[2]);
    const a = parts.length > 3 ? parseFloat(parts[3]) : 1;
    const [r, g, b] = hslToRgb(h, s, l);
    return [r, g, b, isNaN(a) ? 1 : a];
  }

  // Try browser DOM computation if available
  if (typeof document !== 'undefined') {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.fillStyle = str;
      const computed = ctx.fillStyle;
      if (computed && computed !== str) {
        return colorToRgb(computed);
      }
    }
  }

  return [1, 1, 1, 1];
}

export function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  const normS = s > 1 ? s / 100 : s;
  const normL = l > 1 ? l / 100 : l;
  const c = (1 - Math.abs(2 * normL - 1)) * normS;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = normL - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h <= 360) {
    r = c;
    g = 0;
    b = x;
  }

  return [r + m, g + m, b + m];
}

export function generateRandomRaysColors(): [
  [number, number, number, number],
  [number, number, number, number],
] {
  const h = Math.random() * 360;
  const s = 60 + Math.random() * 40;
  const [r1, g1, b1] = hslToRgb(h, s, 50);
  const [r2, g2, b2] = hslToRgb(h, s, 65);
  return [
    [r1, g1, b1, 1],
    [r2, g2, b2, 1],
  ];
}

export function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}
