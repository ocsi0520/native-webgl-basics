import { WebGLClient } from "./webgl-utilities/client/WebGLClient";
import { RotationComponent } from "./rotation/RotationComponent";
import { BackgroundDrawer } from "./background/BackgroundDrawer";
import { CubeDrawer } from "./cube/CubeDrawer";
import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory";

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("no canvas found");
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("no gl context for canvas");

const client = new WebGLClient(gl);

client.clearCanvas();
client.configGLWith([gl.DEPTH_TEST, gl.CULL_FACE]);

const rotationComponent = new RotationComponent();
const programFactory = new GLProgramFactory(gl);

const bgDrawer = new BackgroundDrawer(programFactory, client);
const cubeDrawer1 = new CubeDrawer(programFactory, client, [-0.5, -0.25, 0, 1]);
const cubeDrawer2 = new CubeDrawer(programFactory, client, [0.2, 0.25, 0, 0]);

const drawLoop = (now: number): void => {
  rotationComponent.increment();
  const secondsPassed = now / 1000;
  bgDrawer.draw(secondsPassed * 10);

  cubeDrawer1.uploadRotationBy(rotationComponent.getRotations());
  cubeDrawer1.draw();

  cubeDrawer2.uploadRotationBy(rotationComponent.getRotations());
  cubeDrawer2.draw();
  requestAnimationFrame(drawLoop);
};

const handleResize = (): void => {
  canvas.removeAttribute("width");
  canvas.removeAttribute("height");
  const shorterSide = Math.min(canvas.clientWidth, canvas.clientHeight);
  canvas.width = shorterSide;
  canvas.height = shorterSide;
  client.viewport(0, 0, shorterSide, shorterSide);
};

window.onresize = handleResize;

rotationComponent.attach(document.body);

handleResize();
requestAnimationFrame(drawLoop);
