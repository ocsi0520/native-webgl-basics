import vertexShaderSource from "./vertex/vertexShader.vert?raw";
import fragmentShaderSource from "./vertex/fragmentShader.vert?raw";
import blackHoleImage from "/black_hole.jpg?url";
import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory.js";
import { WebGLClient } from "./webgl-utilities/WebGLClient.js";

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

// these are in clipspace
const points: Array<[number, number, number]> = [
  // front
  [0, 0.5, 0.25], // 1
  [0, 0, 0.25], // 2
  [0.5, 0.5, 0.25], // 3
  [0.5, 0, 0.25], // 4

  // right side
  [0.5, 0.5, -0.25], // 5
  [0.5, 0, -0.25], // 6

  // back side
  [0, 0.5, -0.25], // 7
  [0, 0, -0.25], // 8

  // left side
  [0, 0.5, 0.25], // 9 (1),
  [0, 0, 0.25], // 10 (2)

  // cut
  // upper side
  [0, 0, 0.25], // 10 (2)
  [0, 0, -0.25], // 11 (8)
  [0.5, 0, 0.25], // 12 (4)
  [0.5, 0, -0.25], // 13 (6)

  // cut
  // down side
  [0, 0.5, -0.25], // 7
  [0, 0.5, 0.25], // 1
  [0.5, 0.5, -0.25], // 5
  [0.5, 0.5, 0.25], // 3
];

type Number3 = [number, number, number];

const multiplyItem = <T>(item: T, times: number): T[] =>
  Array.from({ length: times }).map(() => item);

const colors: Array<Number3> = [
  ...multiplyItem<Number3>([Math.random(), Math.random(), Math.random()], 4),
  ...multiplyItem<Number3>([Math.random(), Math.random(), Math.random()], 2),
  ...multiplyItem<Number3>([Math.random(), Math.random(), Math.random()], 2),
  ...multiplyItem<Number3>([Math.random(), Math.random(), Math.random()], 2),
  ...multiplyItem<Number3>([Math.random(), Math.random(), Math.random()], 4),
  ...multiplyItem<Number3>([Math.random(), Math.random(), Math.random()], 4),
];

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

client.uniform("rotationX", "uniform1f", rotationXInDegrees);
client.uniform("rotationY", "uniform1f", rotationYInDegrees);
client.uniform("rotationZ", "uniform1f", rotationZInDegrees);
client.uniform("translation", "uniform4f", -0.25, -0.25, 0, 0);

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
  client.uniform("rotationX", "uniform1f", rotationXInDegrees);
  client.uniform("rotationY", "uniform1f", rotationYInDegrees);
  client.uniform("rotationZ", "uniform1f", rotationZInDegrees);
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
