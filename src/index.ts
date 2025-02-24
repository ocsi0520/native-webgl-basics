import vertexShaderSource from "./shader/vertexShader.vert?raw";
import fragmentShaderSource from "./shader/fragmentShader.vert?raw";
import blackHoleImage from "/black_hole.jpg?url";
import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory.js";
import { WebGLClient } from "./webgl-utilities/client/WebGLClient.js";
import { points } from './vertex/cube-points';
import { colors } from './vertex/cube-color';

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("no canvas found");
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("no gl context for canvas");

canvas.style.backgroundImage = `url(${blackHoleImage})`;

const program = new GLProgramFactory().createProgram(
  gl,
  vertexShaderSource,
  fragmentShaderSource
);
const client = new WebGLClient(gl, program);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

client.useProgram();

let rotationXInDegrees = 0;
let rotationYInDegrees = 0;
let rotationZInDegrees = 0;

let rotationXChange = 1;
let rotationYChange = 1;
let rotationZChange = 1;

document.querySelector<HTMLInputElement>("#x-axis")!.onchange = (ev) => {
  const isRotationOn = (ev.target as HTMLInputElement).checked;
  rotationXChange = isRotationOn ? 1 : 0;
};

document.querySelector<HTMLInputElement>("#y-axis")!.onchange = (ev) => {
  const isRotationOn = (ev.target as HTMLInputElement).checked;
  rotationYChange = isRotationOn ? 1 : 0;
};

document.querySelector<HTMLInputElement>("#z-axis")!.onchange = (ev) => {
  const isRotationOn = (ev.target as HTMLInputElement).checked;
  rotationZChange = isRotationOn ? 1 : 0;
};

client.uniform("rotationX", "1f", rotationXInDegrees);
client.uniform("rotationY", "1f", rotationYInDegrees);
client.uniform("rotationZ", "1f", rotationZInDegrees);
client.uniform("translation", "4f", -0.25, -0.25, 0, 0);

const drawCube = (): void => {
  const allCoordinates = points.flat();
  client.attribute("a_position", {
    source: new Float32Array(allCoordinates),
    usage: gl.STATIC_DRAW,
    attributeDescriptor: {
      size: 3,
      type: gl.FLOAT,
    },
  });

  client.attribute("a_color", {
    source: new Float32Array(colors.flat()),
    usage: gl.STATIC_DRAW,
    attributeDescriptor: {
      size: 3,
      type: gl.FLOAT,
    },
  });
  // https://en.wikipedia.org/wiki/Triangle_fan
  // https://en.wikipedia.org/wiki/Triangle_strip
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 10);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 2, 4);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 6, 4);
  gl.drawArrays(gl.TRIANGLE_STRIP, 10, 4);
  gl.drawArrays(gl.TRIANGLE_STRIP, 14, 4);
};

drawCube();

const drawLoop = (): void => {
  rotationXInDegrees += rotationXChange;
  rotationYInDegrees += rotationYChange;
  rotationZInDegrees += rotationZChange;
  client.uniform("rotationX", "1f", rotationXInDegrees);
  client.uniform("rotationY", "1f", rotationYInDegrees);
  client.uniform("rotationZ", "1f", rotationZInDegrees);
  drawCube();
  requestAnimationFrame(drawLoop);
};

const handleResize = (): void => {
  canvas.removeAttribute("width");
  canvas.removeAttribute("height");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
};

window.onresize = handleResize;

handleResize();
drawLoop();
