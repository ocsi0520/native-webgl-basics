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
    programFactory: GLProgramFactory,
    private client: WebGLClient,
    offset: [number, number, number, number]
  ) {
    this.program = programFactory.createProgram(
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
      usage: 0x88e4 satisfies WebGL2RenderingContext["STATIC_DRAW"],
      attributeDescriptor: {
        size: 3,
        type: 0x1406 satisfies WebGL2RenderingContext["FLOAT"],
      },
    });

    this.client.attribute("a_color", {
      source: new Float32Array(colors.flat()),
      usage: 0x88e4 satisfies WebGL2RenderingContext["STATIC_DRAW"],
      attributeDescriptor: {
        size: 3,
        type: 0x1406 satisfies WebGL2RenderingContext["FLOAT"],
      },
    });
    // https://en.wikipedia.org/wiki/Triangle_fan
    // https://en.wikipedia.org/wiki/Triangle_strip
    this.client.drawArrays(
      0x0005 satisfies WebGL2RenderingContext["TRIANGLE_STRIP"],
      0,
      10
    );
    this.client.drawArrays(
      0x0005 satisfies WebGL2RenderingContext["TRIANGLE_STRIP"],
      10,
      4
    );
    this.client.drawArrays(
      0x0005 satisfies WebGL2RenderingContext["TRIANGLE_STRIP"],
      14,
      4
    );
  }
}
