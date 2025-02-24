import vertexShaderSource from "./shader/vertexShader.vert?raw";
import fragmentShaderSource from "./shader/fragmentShader.vert?raw";
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

const rotationComponent = new RotationComponent();

const uploadRotation = (): void => {
  allAxis.forEach((axis) => {
    client.uniform(
      `rotation${axis.toUpperCase()}`,
      "1f",
      rotationComponent.getRotationFor(axis)
    );
  });
};

uploadRotation();
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

const drawLoop = (): void => {
  rotationComponent.increment();
  uploadRotation();
  drawCube();
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
