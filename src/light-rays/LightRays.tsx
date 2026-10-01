import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  type JSX,
} from 'solid-js';
import {
  colorToRgb,
  generateRandomRaysColors,
  mapRange,
} from './color';
import {
  FRAGMENT_SHADER,
  FRAGMENT_SHADER_WEBGL1,
  VERTEX_SHADER,
  VERTEX_SHADER_WEBGL1,
} from './shaders';
import type { LightRaysProps } from './types';

const RAY_Y_POSITION_1 = -0.4;
const RAY_Y_POSITION_2 = -0.5;

export function LightRays(props: LightRaysProps) {
  const [local, others] = splitProps(props, [
    'intensity',
    'rays',
    'reach',
    'position',
    'radius',
    'backgroundColor',
    'animation',
    'raysColor',
    'theme',
    'class',
    'className',
    'style',
    'children',
    'ref',
  ]);

  let canvasRef!: HTMLCanvasElement;
  let containerRef!: HTMLDivElement;

  const intensity = () => local.intensity ?? 13;
  const rays = () => local.rays ?? 32;
  const reach = () => local.reach ?? 16;
  const position = () => local.position ?? 50;
  const radius = () => local.radius ?? '0px';
  const backgroundColor = () => local.backgroundColor ?? '#000000';
  const animation = createMemo(() => ({
    animate: local.animation?.animate ?? true,
    speed: local.animation?.speed ?? 10,
  }));
  const raysColor = createMemo(() => local.raysColor ?? { mode: 'single' as const, color: '#639AFF' });

  // Random color state
  const [randomColors, setRandomColors] = createSignal<[
    [number, number, number, number],
    [number, number, number, number],
  ]>(generateRandomRaysColors());

  createEffect(() => {
    if (raysColor().mode === 'random') {
      setRandomColors(generateRandomRaysColors());
    }
  });

  const parsedColors = createMemo((): [
    [number, number, number, number],
    [number, number, number, number],
  ] => {
    const rc = raysColor();
    if (rc.mode === 'random') {
      return randomColors();
    }
    if (rc.mode === 'multi') {
      return [colorToRgb(rc.color1), colorToRgb(rc.color2)];
    }
    const c = colorToRgb(rc.color ?? '#639AFF');
    return [c, c];
  });

  onMount(() => {
    const canvas = canvasRef;
    const container = containerRef;
    if (!canvas || !container) return;

    if (typeof local.ref === 'function') {
      local.ref(canvas);
    }

    // Try WebGL2 first, fallback to WebGL1
    let isWebGL2 = true;
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      canvas.getContext('webgl2', {
        preserveDrawingBuffer: true,
        premultipliedAlpha: true,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });

    if (!gl) {
      isWebGL2 = false;
      gl =
        (canvas.getContext('webgl', {
          preserveDrawingBuffer: true,
          premultipliedAlpha: true,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }) as WebGLRenderingContext) ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
    }

    if (!gl) return;

    const vSource = isWebGL2 ? VERTEX_SHADER : VERTEX_SHADER_WEBGL1;
    const fSource = isWebGL2 ? FRAGMENT_SHADER : FRAGMENT_SHADER_WEBGL1;

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vShader) return;
    gl.shaderSource(vShader, vSource);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fShader) {
      gl.deleteShader(vShader);
      return;
    }
    gl.shaderSource(fShader, fSource);
    gl.compileShader(fShader);

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      return;
    }

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer: 2 triangles covering [-1, 1]
    const quadVertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const posAttrLoc = gl.getAttribLocation(
      program,
      isWebGL2 ? 'a_position' : 'a_position'
    );
    gl.enableVertexAttribArray(posAttrLoc);
    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uColors = gl.getUniformLocation(program, 'u_colors[0]');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');
    const uRays = gl.getUniformLocation(program, 'u_rays');
    const uReach = gl.getUniformLocation(program, 'u_reach');
    const uRayPos1 = gl.getUniformLocation(program, 'u_rayPos1');
    const uRayPos2 = gl.getUniformLocation(program, 'u_rayPos2');

    let accumulatedTime = Math.random() * 10000;
    let lastTime = performance.now();
    let animId = 0;

    const resize = () => {
      if (!canvas || !container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(container);

    const render = (now: number) => {
      const delta = Math.min(100, now - lastTime);
      lastTime = now;

      const anim = animation();
      if (anim.animate) {
        accumulatedTime += (delta * anim.speed) / 1000 / 10;
      }

      gl.useProgram(program);

      // Uniform updates
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;

      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, 0, 0);
      if (uTime) gl.uniform1f(uTime, accumulatedTime);

      const [c1, c2] = parsedColors();
      if (uColors) {
        gl.uniform4fv(uColors, new Float32Array([...c1, ...c2]));
      }

      if (uIntensity) {
        gl.uniform1f(uIntensity, mapRange(intensity(), 0, 100, 0, 0.5));
      }
      if (uRays) {
        gl.uniform1f(uRays, mapRange(rays(), 0, 100, 0, 0.3));
      }
      if (uReach) {
        gl.uniform1f(uReach, mapRange(reach(), 0, 100, 0, 0.5));
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (uRayPos1) {
        gl.uniform2f(
          uRayPos1,
          (position() / 100) * w * dpr,
          RAY_Y_POSITION_1 * h * dpr
        );
      }
      if (uRayPos2) {
        gl.uniform2f(
          uRayPos2,
          (position() / 100 + 0.02) * w * dpr,
          RAY_Y_POSITION_2 * h * dpr
        );
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    onCleanup(() => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (program) gl.deleteProgram(program);
      if (vShader) gl.deleteShader(vShader);
      if (fShader) gl.deleteShader(fShader);
    });
  });

  return (
    <div
      ref={containerRef}
      class={local.class || local.className}
      style={{
        position: 'absolute',
        inset: '0',
        'z-index': '-1',
        'border-radius': radius(),
        overflow: 'hidden',
        'background-color': backgroundColor(),
        'pointer-events': 'none',
        ...(typeof local.style === 'object' ? local.style : {}),
      }}
      {...others}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          'pointer-events': 'none',
        }}
      />
      {local.children}
    </div>
  );
}

export const Rays = LightRays;
export default LightRays;
