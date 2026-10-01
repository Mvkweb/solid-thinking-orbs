import {
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  type JSX,
} from 'solid-js';
import { hexToRgba } from './color';
import { animatedGradientPresets, PatternShapes } from './presets';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';
import type { AnimatedGradientProps, PresetParams } from './types';

const NOISE_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMCCgkGBAVJOAVJAAAASklEQVQ4y2NgGAWjYBSMglEwCgY/YGRgZBQUYmJiZGQEkYwMjIyMgoKCjIyMIJKBgRFIMjIyAklGRkYGRkFBYEcwMDIyMjAOUQAA1I4HwVwZAkYAAAAASUVORK5CYII=';

export function AnimatedGradient(props: AnimatedGradientProps) {
  const [local, others] = splitProps(props, [
    'config',
    'noise',
    'radius',
    'theme',
    'class',
    'style',
  ]);

  let canvasRef!: HTMLCanvasElement;
  let containerRef!: HTMLDivElement;

  const [isLightMode, setIsLightMode] = createSignal(false);

  onMount(() => {
    const updateTheme = () => {
      if (local.theme === 'light') {
        setIsLightMode(true);
      } else if (local.theme === 'dark') {
        setIsLightMode(false);
      } else {
        const docDark = document.documentElement.classList.contains('dark');
        const docLight = document.documentElement.classList.contains('light');
        if (docLight) setIsLightMode(true);
        else if (docDark) setIsLightMode(false);
        else {
          setIsLightMode(window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false);
        }
      }
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    onCleanup(() => observer.disconnect());
  });

  const params = createMemo((): PresetParams => {
    const cfg = local.config ?? { preset: 'Prism' };

    if (cfg.preset === 'custom') {
      return {
        color1: cfg.color1,
        color2: cfg.color2,
        color3: cfg.color3,
        rotation: cfg.rotation ?? 0,
        proportion: cfg.proportion ?? 35,
        scale: cfg.scale ?? 1,
        speed: cfg.speed ?? 25,
        distortion: cfg.distortion ?? 12,
        swirl: cfg.swirl ?? 80,
        swirlIterations: cfg.swirlIterations ?? 10,
        softness: cfg.softness ?? 100,
        offset: cfg.offset ?? 0,
        shape: cfg.shape ?? 'Checks',
        shapeSize: cfg.shapeSize ?? 10,
      };
    }

    const preset = animatedGradientPresets[cfg.preset] ?? animatedGradientPresets.Prism;
    const useLight = isLightMode() && Boolean(preset.lightColors);

    return {
      ...preset,
      ...(useLight && preset.lightColors ? preset.lightColors : null),
      speed: cfg.speed ?? preset.speed,
    };
  });

  onMount(() => {
    const canvas = canvasRef;
    const container = containerRef;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl2', {
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });
    if (!gl) return;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;
    gl.shaderSource(vertexShader, VERTEX_SHADER);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      gl.deleteShader(vertexShader);
      return;
    }
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('AnimatedGradient: WebGL program linking failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_pixelRatio: gl.getUniformLocation(program, 'u_pixelRatio'),
      u_scale: gl.getUniformLocation(program, 'u_scale'),
      u_rotation: gl.getUniformLocation(program, 'u_rotation'),
      u_color1: gl.getUniformLocation(program, 'u_color1'),
      u_color2: gl.getUniformLocation(program, 'u_color2'),
      u_color3: gl.getUniformLocation(program, 'u_color3'),
      u_proportion: gl.getUniformLocation(program, 'u_proportion'),
      u_softness: gl.getUniformLocation(program, 'u_softness'),
      u_shape: gl.getUniformLocation(program, 'u_shape'),
      u_shapeScale: gl.getUniformLocation(program, 'u_shapeScale'),
      u_distortion: gl.getUniformLocation(program, 'u_distortion'),
      u_swirl: gl.getUniformLocation(program, 'u_swirl'),
      u_swirlIterations: gl.getUniformLocation(program, 'u_swirlIterations'),
    };

    let animationFrameId: number | undefined;
    const startTime = performance.now();

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const animate = (time: number) => {
      if (canvas.width === 0 || canvas.height === 0) {
        resize();
      }

      const currentParams = params();
      const elapsed = (time - startTime) / 1000;
      const speed = (currentParams.speed / 100) * 5;

      gl.useProgram(program);

      gl.uniform1f(uniforms.u_time, elapsed * speed + currentParams.offset * 0.01);
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_pixelRatio, window.devicePixelRatio || 1);
      gl.uniform1f(uniforms.u_scale, currentParams.scale);
      gl.uniform1f(uniforms.u_rotation, (currentParams.rotation * Math.PI) / 180);

      const c1 = hexToRgba(currentParams.color1);
      const c2 = hexToRgba(currentParams.color2);
      const c3 = hexToRgba(currentParams.color3);
      gl.uniform4f(uniforms.u_color1, c1[0], c1[1], c1[2], c1[3]);
      gl.uniform4f(uniforms.u_color2, c2[0], c2[1], c2[2], c2[3]);
      gl.uniform4f(uniforms.u_color3, c3[0], c3[1], c3[2], c3[3]);

      gl.uniform1f(uniforms.u_proportion, currentParams.proportion / 100);
      gl.uniform1f(uniforms.u_softness, currentParams.softness / 100);
      gl.uniform1f(uniforms.u_shape, PatternShapes[currentParams.shape]);
      gl.uniform1f(uniforms.u_shapeScale, currentParams.shapeSize / 100);
      gl.uniform1f(uniforms.u_distortion, currentParams.distortion / 50);
      gl.uniform1f(uniforms.u_swirl, currentParams.swirl / 100);
      gl.uniform1f(
        uniforms.u_swirlIterations,
        currentParams.swirl === 0 ? 0 : currentParams.swirlIterations
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    onCleanup(() => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    });
  });

  const resolvedStyle = (): JSX.CSSProperties => {
    const userStyle = typeof local.style === 'object' ? local.style : {};
    return {
      position: 'absolute',
      inset: '0',
      'z-index': 0,
      'border-radius': local.radius ?? 'inherit',
      overflow: 'hidden',
      'pointer-events': 'none',
      ...userStyle,
    };
  };

  return (
    <div
      ref={containerRef}
      class={local.class}
      style={resolvedStyle()}
      {...others}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
      {local.noise && local.noise.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: '0',
            'background-image': `url("${NOISE_BASE64}")`,
            'background-size': `${(local.noise.scale ?? 1) * 200}px`,
            'background-repeat': 'repeat',
            opacity: local.noise.opacity / 2,
            'pointer-events': 'none',
          }}
        />
      )}
    </div>
  );
}

export default AnimatedGradient;
