import { GLProgramFactory } from "./webgl-utilities/GLProgramFactory.js";
import backgroundVertexShaderSource from "./shader/background/vertexShader.vert?raw";
import backgroundFragmentShaderSource from "./shader/background/fragmentShader.vert?raw";
import { WebGLClient } from './webgl-utilities/client/WebGLClient.js';

import blackHoleImage from "/black_hole.jpg?url";

export class BackgroundDrawer {
  private program: WebGLProgram
  constructor(private gl: WebGL2RenderingContext, private client: WebGLClient) {
    this.program = new GLProgramFactory().createProgram(
      gl,
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
      usage: this.gl.STATIC_DRAW,
      source: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      attributeDescriptor: {
        size: 2,
        type: this.gl.FLOAT,
      },
    });
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  };
}