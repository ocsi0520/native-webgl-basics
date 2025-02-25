import cubeVertexShaderSource from "./shader/cube/vertexShader.vert?raw";
import cubeFragmentShaderSource from "./shader/cube/fragmentShader.vert?raw";
import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory.js";
import { WebGLClient } from "./webgl-utilities/client/WebGLClient.js";
import { points } from "./vertex/cube-points";
import { colors } from "./vertex/cube-color";
import { RotationComponent } from "./rotation/RotationComponent.js";
import { allAxis } from "./rotation/axis";
import { BackgroundDrawer } from './BackgroundDrawer';

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("no canvas found");
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("no gl context for canvas");

const client = new WebGLClient(gl);

const cubeProgram1 = new GLProgramFactory().createProgram(
  gl,
  cubeVertexShaderSource,
  cubeFragmentShaderSource
);

const cubeProgram2 = new GLProgramFactory().createProgram(
  gl,
  cubeVertexShaderSource,
  cubeFragmentShaderSource
);

const bgDrawer = new BackgroundDrawer(gl, client);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

const rotationComponent = new RotationComponent();

const uploadRotationForCurrentProgram = (): void => {
  allAxis.forEach((axis) => {
    client.uniform(
      `rotation${axis.toUpperCase()}`,
      "1f",
      rotationComponent.getRotationFor(axis)
    );
  });
};

const initCubeProgram = (program: WebGLProgram, offset: [number, number, number, number]): void => {
  client.use(program);
  uploadRotationForCurrentProgram();
  client.uniform("translation", "4f", ...offset);
}

initCubeProgram(cubeProgram1, [-0.5, -0.25, 0, 1]);
initCubeProgram(cubeProgram2, [0.2, 0.25, 0, 0]);

const drawCube = (program: WebGLProgram): void => {
  client.use(program);
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

const drawLoop = (): void => {
  rotationComponent.increment();
  bgDrawer.draw();

  client.use(cubeProgram1);
  uploadRotationForCurrentProgram();
  drawCube(cubeProgram1);

  client.use(cubeProgram2);
  uploadRotationForCurrentProgram();
  drawCube(cubeProgram2);

  requestAnimationFrame(drawLoop);
};

const handleResize = (): void => {
  canvas.removeAttribute("width");
  canvas.removeAttribute("height");
  const shorterSide = Math.min(canvas.clientWidth, canvas.clientHeight);
  canvas.width = shorterSide;
  canvas.height = shorterSide;
  gl.viewport(0, 0, shorterSide, shorterSide);
};

window.onresize = handleResize;

rotationComponent.attach(document.body);

handleResize();
drawLoop();
