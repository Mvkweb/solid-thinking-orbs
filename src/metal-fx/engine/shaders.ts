export const VERT_SHADER_SRC = /* glsl */ `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

export const FRAG_SHADER_SRC = /* glsl */ `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color1, u_color2, u_color3, u_color4, u_color5, u_color6, u_color7;
  uniform float u_alpha1, u_alpha2, u_alpha3, u_alpha4, u_alpha5, u_alpha6, u_alpha7;
  uniform float u_intensity, u_scale, u_direction;
  uniform float u_softness, u_distortion, u_complexity, u_shape;
  uniform float u_vignette, u_vigOpacity, u_blur, u_shaderOpacity;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p, float oct) {
    float val = 0.0, amp = 0.5;
    int n = int(oct);
    for (int i = 0; i < 7; i++) {
      if (i >= n) break;
      val += amp * snoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return val;
  }

  float nfbm(vec2 p) { return fbm(p, 3.0 + u_complexity * 4.0); }

  vec3 palette(float t) {
    t = clamp(t, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float k = 64.0;
    float w1 = u_alpha1 * exp(-k * t * t);
    float w2 = u_alpha2 * exp(-k * (t - 0.25) * (t - 0.25));
    float w3 = u_alpha3 * exp(-k * (t - 0.5)  * (t - 0.5));
    float w4 = u_alpha4 * exp(-k * (t - 0.75) * (t - 0.75));
    float w5 = u_alpha5 * exp(-k * (t - 1.0)  * (t - 1.0));
    float total = w1 + w2 + w3 + w4 + w5 + 0.0001;
    return (u_color1 * w1 + u_color2 * w2 + u_color3 * w3 +
            u_color4 * w4 + u_color5 * w5) / total;
  }

  float paletteAlpha(float t) {
    t = clamp(t, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float k = 64.0;
    float w1 = u_alpha1 * exp(-k * t * t);
    float w2 = u_alpha2 * exp(-k * (t - 0.25) * (t - 0.25));
    float w3 = u_alpha3 * exp(-k * (t - 0.5)  * (t - 0.5));
    float w4 = u_alpha4 * exp(-k * (t - 0.75) * (t - 0.75));
    float w5 = u_alpha5 * exp(-k * (t - 1.0)  * (t - 1.0));
    float totalW = w1 + w2 + w3 + w4 + w5 + 0.0001;
    float rawW = exp(-k * t * t)
               + exp(-k * (t - 0.25) * (t - 0.25))
               + exp(-k * (t - 0.5)  * (t - 0.5))
               + exp(-k * (t - 0.75) * (t - 0.75))
               + exp(-k * (t - 1.0)  * (t - 1.0))
               + 0.0001;
    return totalW / rawW;
  }

  vec2 warp(vec2 p, float t) {
    float str = u_distortion * 2.0;
    return vec2(
      nfbm(p + vec2(t * 0.1, 0.0)),
      nfbm(p + vec2(0.0, t * 0.12) + 5.0)
    ) * str;
  }

  vec3 computeEffect(vec2 uv, float aspect, float t, float dist, float cpx) {
    vec2 p = (uv - 0.5) * u_scale;
    p.x *= aspect;
    p += vec2(cos(u_direction), sin(u_direction)) * t * 0.15;

    float freq = 3.0 + cpx * 8.0;
    float val = 0.0;
    val += sin(p.x * freq + t);
    val += sin(p.y * freq + t * 1.3);
    val += sin((p.x + p.y) * freq * 0.7 + t * 0.7);
    val += sin(length(p) * freq * 0.8 - t * 1.5);
    vec2 w = warp(p, t);
    val += (w.x + w.y) * dist;
    val = val * 0.2 * u_intensity + 0.5;

    return palette(clamp(val, 0.0, 1.0));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    float t = u_time;
    float dist = u_distortion;
    float cpx = u_complexity;

    vec3 col;
    if (u_blur < 0.01) {
      col = computeEffect(uv, aspect, t, dist, cpx);
    } else {
      float r = u_blur * 0.02;
      col  = computeEffect(uv,                  aspect, t, dist, cpx) * 0.4;
      col += computeEffect(uv + vec2( r, 0.0),  aspect, t, dist, cpx) * 0.15;
      col += computeEffect(uv + vec2(-r, 0.0),  aspect, t, dist, cpx) * 0.15;
      col += computeEffect(uv + vec2(0.0,  r),  aspect, t, dist, cpx) * 0.15;
      col += computeEffect(uv + vec2(0.0, -r),  aspect, t, dist, cpx) * 0.15;
    }

    col = pow(col, vec3(1.3));

    float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float vigPx = 40.0 / min(u_resolution.x, u_resolution.y);
    float vigRange = vigPx * (1.0 + u_vignette * 3.0);
    float vig = edgeDist * edgeDist / (vigRange * vigRange);
    vig = smoothstep(0.0, 1.0, vig);
    col *= mix(1.0, vig, u_vignette * u_vigOpacity);

    float colorAlpha = (u_alpha1 + u_alpha2 + u_alpha3 + u_alpha4 + u_alpha5) / 5.0;
    if (colorAlpha < 0.999) {
      vec3 c1d = col - u_color1, c2d = col - u_color2, c3d = col - u_color3,
           c4d = col - u_color4, c5d = col - u_color5;
      float prox1 = exp(-8.0 * dot(c1d, c1d));
      float prox2 = exp(-8.0 * dot(c2d, c2d));
      float prox3 = exp(-8.0 * dot(c3d, c3d));
      float prox4 = exp(-8.0 * dot(c4d, c4d));
      float prox5 = exp(-8.0 * dot(c5d, c5d));
      float pTotal = prox1 + prox2 + prox3 + prox4 + prox5 + 0.0001;
      colorAlpha = (prox1 * u_alpha1 + prox2 * u_alpha2 + prox3 * u_alpha3 +
                    prox4 * u_alpha4 + prox5 * u_alpha5) / pTotal;
    }
    float alpha = colorAlpha;

    alpha += 0.0 * (u_softness + u_shape +
                    u_alpha6 + u_alpha7 +
                    u_color6.x + u_color7.x);

    gl_FragColor = vec4(col, alpha * u_shaderOpacity);
  }
`;

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('metal-fx: gl.createShader returned null');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`metal-fx: shader compile failed: ${info ?? '(no info log)'}`);
  }
  return shader;
}

export function linkProgram(
  gl: WebGLRenderingContext,
  vert: WebGLShader,
  frag: WebGLShader
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('metal-fx: gl.createProgram returned null');
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`metal-fx: program link failed: ${info ?? '(no info log)'}`);
  }
  return program;
}
