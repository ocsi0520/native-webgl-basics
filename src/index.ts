import { WebGLClient } from "./webgl-utilities/client/WebGLClient.js";
import { RotationComponent } from "./rotation/RotationComponent.js";
import { BackgroundDrawer } from "./BackgroundDrawer";
import { CubeDrawer } from "./CubeDrawer";
import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory";

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("no canvas found");
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("no gl context for canvas");

const client = new WebGLClient(gl);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

const rotationComponent = new RotationComponent();
const programFactory = new GLProgramFactory(gl);

const bgDrawer = new BackgroundDrawer(programFactory, client);
const cubeDrawer1 = new CubeDrawer(programFactory, client, [-0.5, -0.25, 0, 1]);
const cubeDrawer2 = new CubeDrawer(programFactory, client, [0.2, 0.25, 0, 0]);

const drawLoop = (): void => {
  rotationComponent.increment();
  bgDrawer.draw();

  cubeDrawer1.uploadRotationBy(rotationComponent);
  cubeDrawer1.draw();

  cubeDrawer2.uploadRotationBy(rotationComponent);
  cubeDrawer2.draw();
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
