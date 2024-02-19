const fragShaderSrc = `
// Mazure3D
// https://www.shadertoy.com/view/lX23z1

#version 100
precision mediump float;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform float iTime;
uniform vec2 iResolution;

const float SPEED = 0.0055;
const float INTERVAL = 1.0 / 6.0;

vec4 noise(vec2 uv) {
  vec4 noise1 = texture2D(iChannel0, vec2(fract(uv.x + floor(iTime/INTERVAL)* SPEED), uv.y)).rrra;
  vec4 noise2 = texture2D(iChannel0, vec2(fract(0.7 + uv.x - floor(iTime/INTERVAL) * SPEED), uv.y)).rrra;
  vec4 noise3 = texture2D(iChannel0, vec2(uv.x, fract(0.3 + uv.y + floor(iTime/INTERVAL) * SPEED))).rrra;
  vec4 noise4 = texture2D(iChannel0, vec2(uv.x, fract(0.8 + uv.y - floor(iTime/INTERVAL) * SPEED))).rrra;
  
  return vec4(noise1.rgb * noise2.rgb * noise3.rgb * noise4.rgb, 1.0);
}

vec4 noise(vec2 uv, float speed) {
  vec4 noise1 = texture2D(iChannel0, vec2(fract(uv.x + iTime * speed), uv.y)).rrra;
  vec4 noise2 = texture2D(iChannel0, vec2(fract(0.7 + uv.x - iTime * speed), uv.y)).rrra;
  vec4 noise3 = texture2D(iChannel0, vec2(uv.x, fract(0.3 + uv.y + iTime * speed))).rrra;
  vec4 noise4 = texture2D(iChannel0, vec2(uv.x, fract(0.8 + uv.y - iTime * speed))).rrra;
  
  return vec4(noise1.rgb * noise2.rgb * noise3.rgb * noise4.rgb, 1.0);
}

void main() {
    // Define fragCoord
    vec2 fragCoord = gl_FragCoord.xy;

    vec2 uv = fragCoord / iResolution.xy;

    // Bright ripples mask
    vec4 brightMask = noise(uv);

    // Dark ripples mask
    vec4 darkMask = noise(uv / 3.0);

    // Masks out ripples at the lower parts of the screen. Combine the ripple masks with gradient
    vec4 gradientMask = vec4(smoothstep(0.7, 1.0, uv.y));
    vec4 combinedMask = brightMask * gradientMask;
    vec4 combinedMask2 = darkMask * gradientMask;

    // Colors
    vec4 bg = vec4(0.0, smoothstep(0.0, 1.0, uv.y - 0.1), smoothstep(0.0, 1.0, uv.y + 0.8), 1.0);
    vec4 ripples = vec4(0.5, 1.0, 1.0, 1.0);

    // Layer mixing and image display
    vec4 col;
    vec2 distorted = clamp(uv + noise(uv / 10.0, 0.005).xy * 0.1, 0.0, 1.0);

    bg = mix(bg, texture2D(iChannel1, distorted), 0.2);
    col = mix(bg, mix(bg, ripples, 0.4), step(0.06, combinedMask2.r));
    col = mix(col, ripples, step(0.06, combinedMask.r));

    gl_FragColor = col;
}`
const vertShaderSrc = `
attribute vec4 a_position;
     
void main() {
   gl_Position = a_position;
}`

const noise = new Image()
const bg = new Image()
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

const fragShader = compileShader(gl, fragShaderSrc, gl.FRAGMENT_SHADER);
const vertShader = compileShader(gl, vertShaderSrc, gl.VERTEX_SHADER);

const program = gl.createProgram();
gl.attachShader(program, fragShader);
gl.attachShader(program, vertShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    -1, -1,
    1, -1,
    -1, 1,
    1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Set up attributes and uniforms
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

/* IMAGE STUFF */
noise.onload = () => {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, noise);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.uniform1i(gl.getUniformLocation(program, 'iChannel0'), 0);
}

noise.src = './assets/noise.png';

bg.onload = () => {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bg);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.uniform1i(gl.getUniformLocation(program, 'iChannel1'), 1);
}

bg.src = './assets/screenshot.png';

const timeUniformLocation = gl.getUniformLocation(program, 'iTime');
const resolutionUniformLocation = gl.getUniformLocation(program, 'iResolution');

gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

function render() {
  const currentTime = performance.now() / 1000.0; // Convert to seconds
  // Pass time uniform to the shader
  gl.uniform1f(timeUniformLocation, currentTime);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Render the images
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(render);
}

render()