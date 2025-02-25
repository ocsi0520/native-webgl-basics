import cubeVertexShaderSource from "./shader/cube/vertexShader.vert?raw";
import cubeFragmentShaderSource from "./shader/cube/fragmentShader.vert?raw";
import { allAxis } from "./rotation/axis";
import type { RotationComponent } from "./rotation/RotationComponent";
import { WebGLClient } from "./webgl-utilities/client/WebGLClient";
import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory.js";
import { points } from "./vertex/cube-points";
import { colors } from "./vertex/cube-color";

export class CubeDrawer {
  private program: WebGLProgram;
  constructor(
    private gl: WebGL2RenderingContext,
    private client: WebGLClient,
    offset: [number, number, number, number]
  ) {
    this.program = new GLProgramFactory().createProgram(
      this.gl,
      cubeVertexShaderSource,
      cubeFragmentShaderSource
    );

    client.use(this.program);
    client.uniform("translation", "4f", ...offset);
  }

  public uploadRotationBy(rotationComponent: RotationComponent): void {
    this.client.use(this.program);

    allAxis.forEach((axis) => {
      this.client.uniform(
        `rotation${axis.toUpperCase()}`,
        "1f",
        rotationComponent.getRotationFor(axis)
      );
    });
  }

  public draw(): void {
    this.client.use(this.program);

    const allCoordinates = points.flat();
    this.client.attribute("a_position", {
      source: new Float32Array(allCoordinates),
      usage: this.gl.STATIC_DRAW,
      attributeDescriptor: {
        size: 3,
        type: this.gl.FLOAT,
      },
    });

    this.client.attribute("a_color", {
      source: new Float32Array(colors.flat()),
      usage: this.gl.STATIC_DRAW,
      attributeDescriptor: {
        size: 3,
        type: this.gl.FLOAT,
      },
    });
    // https://en.wikipedia.org/wiki/Triangle_fan
    // https://en.wikipedia.org/wiki/Triangle_strip
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 10);
    // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 2, 4);
    // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 4, 4);
    // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 6, 4);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 10, 4);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 14, 4);
  }
}
