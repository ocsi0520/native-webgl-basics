import cubeVertexShaderSource from "./shader/cube/vertexShader.vert?raw";
import cubeFragmentShaderSource from "./shader/cube/fragmentShader.vert?raw";
import backgroundVertexShaderSource from "./shader/background/vertexShader.vert?raw";
import backgroundFragmentShaderSource from "./shader/background/fragmentShader.vert?raw";
import blackHoleImage from "/black_hole.jpg?url";
import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory.js";
import { WebGLClient } from "./webgl-utilities/client/WebGLClient.js";
import { points } from "./vertex/cube-points";
import { colors } from "./vertex/cube-color";
import { RotationComponent } from "./rotation/RotationComponent.js";
import { allAxis } from "./rotation/axis";

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("no canvas found");
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("no gl context for canvas");

const bgProgram = new GLProgramFactory().createProgram(
  gl,
  backgroundVertexShaderSource,
  backgroundFragmentShaderSource
);

const bgClient = new WebGLClient(gl, bgProgram);
bgClient.useProgram();
const textureNumber = 0;
bgClient.uniform("u_image", "1i", textureNumber);
bgClient.loadImage(blackHoleImage, textureNumber);

const drawBg = (): void => {
  bgClient.useProgram();
  bgClient.attribute("a_position", {
    usage: gl.STATIC_DRAW,
    source: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    attributeDescriptor: {
      size: 2,
      type: gl.FLOAT,
    },
  });
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

const program1 = new GLProgramFactory().createProgram(
  gl,
  cubeVertexShaderSource,
  cubeFragmentShaderSource
);
const client1 = new WebGLClient(gl, program1);

const program2 = new GLProgramFactory().createProgram(
  gl,
  cubeVertexShaderSource,
  cubeFragmentShaderSource
);
const client2 = new WebGLClient(gl, program2);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

const rotationComponent = new RotationComponent();

const uploadRotation = (client: WebGLClient): void => {
  allAxis.forEach((axis) => {
    client.uniform(
      `rotation${axis.toUpperCase()}`,
      "1f",
      rotationComponent.getRotationFor(axis)
    );
  });
};

client1.useProgram();
uploadRotation(client1);
client1.uniform("translation", "4f", -0.5, -0.25, 0, 1);
client2.useProgram();
uploadRotation(client2);
client2.uniform("translation", "4f", 0.2, 0.25, 0, 0);

const drawCube = (client: WebGLClient): void => {
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
  drawBg();
  client1.useProgram();
  uploadRotation(client1);
  drawCube(client1);
  client2.useProgram();
  uploadRotation(client2);
  drawCube(client2);
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
