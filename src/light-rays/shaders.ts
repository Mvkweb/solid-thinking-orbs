export const VERTEX_SHADER = `#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  float diagonal = length(u_resolution);

  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
    (0.30 + 0.20 * cos(-cosAngle * seedB + u_time * speed)),
    u_reach, 1.0) *
    clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;
  vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
  float speed = u_rays * 10.0;

  vec2 rayPos1 = u_rayPos1;
  vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
  float raySeedA1 = 36.2214 * speed;
  float raySeedB1 = 21.11349 * speed;
  float raySpeed1 = 1.5 * speed;

  vec2 rayPos2 = u_rayPos2;
  vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
  float raySeedA2 = 22.39910 * speed;
  float raySeedB2 = 18.0234 * speed;
  float raySpeed2 = 1.1 * speed;

  float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
  float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

  float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
  float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

  float alpha1 = strength1 * attenuation * u_colors[0].a;
  float alpha2 = strength2 * attenuation * u_colors[1].a;

  vec3 premultColor1 = u_colors[0].rgb * alpha1;
  vec3 premultColor2 = u_colors[1].rgb * alpha2;

  vec3 blendedColor = premultColor1 + premultColor2;
  float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

  vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

  fragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;

// WebGL 1.0 Fallback Shaders for broad browser compatibility
export const VERTEX_SHADER_WEBGL1 = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER_WEBGL1 = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  float diagonal = length(u_resolution);

  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
    (0.30 + 0.20 * cos(-cosAngle * seedB + u_time * speed)),
    u_reach, 1.0) *
    clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;
  vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
  float speed = u_rays * 10.0;

  vec2 rayPos1 = u_rayPos1;
  vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
  float raySeedA1 = 36.2214 * speed;
  float raySeedB1 = 21.11349 * speed;
  float raySpeed1 = 1.5 * speed;

  vec2 rayPos2 = u_rayPos2;
  vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
  float raySeedA2 = 22.39910 * speed;
  float raySeedB2 = 18.0234 * speed;
  float raySpeed2 = 1.1 * speed;

  float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
  float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

  float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
  float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

  float alpha1 = strength1 * attenuation * u_colors[0].a;
  float alpha2 = strength2 * attenuation * u_colors[1].a;

  vec3 premultColor1 = u_colors[0].rgb * alpha1;
  vec3 premultColor2 = u_colors[1].rgb * alpha2;

  vec3 blendedColor = premultColor1 + premultColor2;
  float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

  vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

  gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;
