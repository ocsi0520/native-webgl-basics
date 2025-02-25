import cubeVertexShaderSource from "./shader/vertexShader.vert?raw";
import cubeFragmentShaderSource from "./shader/fragmentShader.vert?raw";
import type { RotationDescriptor } from "../rotation/RotationComponent.js";
import { WebGLClient } from "../webgl-utilities/client/WebGLClient.js";
import { GLProgramFactory } from "../webgl-utilities/GLProgramFactory.js";
import { points } from "./vertex/cube-points.js";
import { colors } from "./vertex/cube-color.js";

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

  public uploadRotationBy(rotationDescriptor: RotationDescriptor): void {
    this.client.use(this.program);

    this.client.uniform("rotationX", "1f", rotationDescriptor.x);
    this.client.uniform("rotationY", "1f", rotationDescriptor.y);
    this.client.uniform("rotationZ", "1f", rotationDescriptor.z);
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
