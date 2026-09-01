import type { JSX } from 'solid-js';
import type { ShadowLayer } from './shadow';

const BINARIZE = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -29.5';

function InsetPass(i: number, s: ShadowLayer): JSX.Element[] {
  const parts: JSX.Element[] = [];
  let src = 'bin';

  if (s.spread !== 0) {
    parts.push(
      <feMorphology
        in={src}
        operator={s.spread > 0 ? 'erode' : 'dilate'}
        radius={Math.abs(s.spread)}
        result={`s${i}-er`}
      />
    );
    src = `s${i}-er`;
  }
  if (s.x !== 0 || s.y !== 0) {
    parts.push(
      <feOffset in={src} dx={s.x} dy={s.y} result={`s${i}-o`} />
    );
    src = `s${i}-o`;
  }
  if (s.blur > 0) {
    parts.push(
      <feGaussianBlur
        in={src}
        stdDeviation={s.blur / 2}
        result={`s${i}-b`}
      />
    );
    src = `s${i}-b`;
  }

  parts.push(
    <feComposite in="bin" in2={src} operator="out" result={`s${i}-band`} />,
    <feFlood flood-color={s.color} result={`s${i}-c`} />,
    <feComposite
      in={`s${i}-c`}
      in2={`s${i}-band`}
      operator="in"
      result={`s${i}`}
    />
  );
  return parts;
}

function ShadowPass(i: number, s: ShadowLayer): JSX.Element[] {
  const parts: JSX.Element[] = [];
  let src = 'shape';

  if (s.spread !== 0) {
    parts.push(
      <feMorphology
        in="bin"
        operator={s.spread > 0 ? 'dilate' : 'erode'}
        radius={Math.abs(s.spread)}
        result={`s${i}-sp`}
      />
    );
    src = `s${i}-sp`;
  }
  if (s.blur > 0) {
    parts.push(
      <feGaussianBlur
        in={hasSpread(s) ? `s${i}-sp` : src}
        stdDeviation={s.blur / 2}
        result={`s${i}-b`}
      />
    );
    src = `s${i}-b`;
  }
  if (s.x !== 0 || s.y !== 0) {
    parts.push(
      <feOffset in={src} dx={s.x} dy={s.y} result={`s${i}-o`} />
    );
    src = `s${i}-o`;
  }

  parts.push(
    <feFlood flood-color={s.color} result={`s${i}-c`} />,
    <feComposite
      in={`s${i}-c`}
      in2={src}
      operator="in"
      result={`s${i}`}
    />
  );
  return parts;
}

function hasSpread(s: ShadowLayer): boolean {
  return s.spread !== 0;
}

export function GooFilterPrimitives(props: {
  blur: number;
  contrast: number;
  shadows: ShadowLayer[];
}): JSX.Element {
  const intercept = Math.round((0.5 - props.contrast * (5 / 12)) * 100) / 100;
  const hasBin = props.shadows.some((s) => s.inset || s.spread !== 0);

  const list: JSX.Element[] = [
    <feGaussianBlur in="SourceGraphic" stdDeviation={props.blur} result="blur" />,
    <feColorMatrix
      in="blur"
      type="matrix"
      values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${props.contrast} ${intercept}`}
      result="goo"
    />,
    <feComposite in="SourceGraphic" in2="goo" operator="atop" result="shape" />,
  ];

  if (hasBin) {
    list.push(
      <feColorMatrix in="shape" type="matrix" values={BINARIZE} result="bin" />
    );
  }

  for (let i = 0; i < props.shadows.length; i++) {
    const s = props.shadows[i];
    if (s.inset) {
      list.push(...InsetPass(i, s));
    } else {
      list.push(...ShadowPass(i, s));
    }
  }

  if (props.shadows.length > 0) {
    const outerNodes = props.shadows
      .map((s, i) => (!s.inset ? i : -1))
      .filter((i) => i >= 0)
      .reverse()
      .map((idx) => <feMergeNode in={`s${idx}`} />);

    const insetNodes = props.shadows
      .map((s, i) => (s.inset ? <feMergeNode in={`s${i}`} /> : null))
      .filter(Boolean);

    list.push(
      <feMerge>
        {outerNodes}
        <feMergeNode in="shape" />
        {insetNodes}
      </feMerge>
    );
  }

  return list;
}
