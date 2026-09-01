import {
  createSignal,
  createMemo,
  createEffect,
  onCleanup,
  onMount,
  createUniqueId,
  type JSX,
} from 'solid-js';
import { GooeyContext, type GooeyContextValue } from './context';
import { GooFilterPrimitives } from './filter';
import { ObserveEngine } from './observer';
import { parseShadow } from './shadow';

export interface GooeyProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Goo blur sigma in px — how far apart pieces start bridging. Default 6. */
  blur?: number;
  /** Alpha-contrast slope — how sharp the liquid edge is. Default 18. */
  contrast?: number;
  /** Fill of the liquid surface. Any CSS color, `var()` welcome. Default '#fff'. */
  fill?: string;
  /** `box-shadow` syntax; rendered on the MERGED silhouette. */
  shadow?: string;
  /** Extra filter-region slack in px for blobs travelling outside the group box. Default 24. */
  filterPadding?: number;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  children?: JSX.Element;
}

export function GooeyRoot(props: GooeyProps) {
  let groupRef!: HTMLDivElement;
  const [portal, setPortal] = createSignal<SVGGElement | null>(null);
  const [meltPortal, setMeltPortal] = createSignal<SVGGElement | null>(null);
  const [size, setSize] = createSignal({ w: 400, h: 400 });

  const blur = () => props.blur ?? 6;
  const contrast = () => props.contrast ?? 18;
  const fill = () => props.fill ?? '#fff';
  const filterPadding = () => props.filterPadding ?? 24;

  const rawId = createUniqueId();
  const filterId = `gooey-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const shadows = createMemo(() => parseShadow(props.shadow));

  onMount(() => {
    if (typeof props.ref === 'function') {
      props.ref(groupRef);
    }
    const measure = () => {
      if (!groupRef) return;
      setSize({ w: groupRef.offsetWidth, h: groupRef.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(groupRef);
    onCleanup(() => ro.disconnect());
  });

  const engine = new ObserveEngine(() => groupRef);
  onCleanup(() => engine.dispose());

  createEffect(() => {
    engine.gooBlur = blur();
  });

  const ctx: GooeyContextValue = {
    portal,
    meltPortal,
    fill,
    getGroup: () => groupRef,
    engine,
  };

  const svgShadows = createMemo(() =>
    shadows().filter((s) => s.inset || s.spread !== 0)
  );

  const cssShadowFilter = createMemo(() => {
    const list = shadows()
      .filter((s) => !s.inset && s.spread === 0)
      .map((s) => `drop-shadow(${s.x}px ${s.y}px ${s.blur}px ${s.color})`);
    return list.length > 0 ? list.join(' ') : undefined;
  });

  const shadowExtent = createMemo(() =>
    svgShadows().reduce(
      (m, s) =>
        Math.max(
          m,
          Math.max(Math.abs(s.x), Math.abs(s.y)) +
            s.blur * 1.5 +
            Math.max(0, s.spread)
        ),
      0
    )
  );

  const pad = createMemo(() =>
    Math.ceil(blur() * 3 + shadowExtent() + filterPadding())
  );

  return (
    <div
      {...props}
      ref={(el) => {
        groupRef = el;
        if (typeof props.ref === 'function') props.ref(el);
      }}
      class={props.class}
      style={{
        position: 'relative',
        isolation: 'isolate',
        ...(typeof props.style === 'object' ? props.style : {}),
      }}
    >
      {/* Background Liquid Silhouette SVG */}
      <svg
        aria-hidden="true"
        focusable="false"
        data-gooey-svg=""
        style={{
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          overflow: 'visible',
          'pointer-events': 'none',
          'z-index': '-1',
          filter: cssShadowFilter(),
          'will-change': 'filter, transform',
        }}
      >
        <defs>
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            x={-pad()}
            y={-pad()}
            width={size().w + pad() * 2}
            height={size().h + pad() * 2}
            color-interpolation-filters="sRGB"
          >
            <GooFilterPrimitives
              blur={blur()}
              contrast={contrast()}
              shadows={svgShadows()}
            />
          </filter>
        </defs>
        <g
          id={`${filterId}-sil`}
          ref={setPortal}
          filter={`url(#${filterId})`}
          style={{ fill: fill() }}
        />
      </svg>

      {/* Foreground Melt Overlay SVG */}
      <svg
        aria-hidden="true"
        focusable="false"
        data-gooey-overlay=""
        style={{
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          overflow: 'visible',
          'pointer-events': 'none',
          'z-index': '9999',
        }}
      >
        <defs>
          <mask
            id={`${filterId}-meltmask`}
            maskUnits="userSpaceOnUse"
            x={-pad()}
            y={-pad()}
            width={size().w + pad() * 2}
            height={size().h + pad() * 2}
          >
            <use href={`#${filterId}-sil`} />
          </mask>
        </defs>
        <g mask={`url(#${filterId}-meltmask)`}>
          <g ref={setMeltPortal} />
        </g>
      </svg>

      <GooeyContext.Provider value={ctx}>{props.children}</GooeyContext.Provider>
    </div>
  );
}
