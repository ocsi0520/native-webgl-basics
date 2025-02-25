import { GLProgramFactory } from "../webgl-utilities/GLProgramFactory.js";
import backgroundVertexShaderSource from "./shader/vertexShader.vert?raw";
import backgroundFragmentShaderSource from "./shader/fragmentShader.vert?raw";
import { WebGLClient } from "../webgl-utilities/client/WebGLClient.js";

import blackHoleImage from "/black_hole.jpg?url";

export class BackgroundDrawer {
  private program: WebGLProgram;
  constructor(programFactory: GLProgramFactory, private client: WebGLClient) {
    this.program = programFactory.createProgram(
      backgroundVertexShaderSource,
      backgroundFragmentShaderSource
    );

    client.use(this.program);
    const textureNumber = 0;
    client.uniform("u_image", "1i", textureNumber);
    client.loadImage(blackHoleImage, textureNumber);
  }

  public draw(): void {
    this.client.use(this.program);
    this.client.attribute("a_position", {
      usage: 0x88e4 satisfies WebGL2RenderingContext["STATIC_DRAW"],
      source: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      attributeDescriptor: {
        size: 2,
        type: 0x1406 satisfies WebGL2RenderingContext["FLOAT"],
      },
    });
    this.client.drawArrays(
      0x0005 satisfies WebGL2RenderingContext["TRIANGLE_STRIP"],
      0,
      4
    );
  }
}
