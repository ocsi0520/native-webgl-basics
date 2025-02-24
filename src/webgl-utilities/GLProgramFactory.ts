export class GLProgramFactory {
  public createProgram(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): WebGLProgram {
    const vertexShader = this.createShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER
    );
    const fragmentShader = this.createShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) throw new Error("could not link program");

    return program;
  }

  private createShader(
    gl: WebGL2RenderingContext,
    shaderSource: string,
    shaderType:
      | WebGL2RenderingContext["VERTEX_SHADER"]
      | WebGL2RenderingContext["FRAGMENT_SHADER"]
  ): WebGLShader {
    const shader = gl.createShader(shaderType);
    if (!shader)
      throw new Error(
        "could not create shader " + this.getShaderTypeString(shaderType)
      );
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success)
      throw new Error(
        "could not compile shader " + this.getShaderTypeString(shaderType)
      );

    return shader;
  }

  private getShaderTypeString(
    shaderType:
      | WebGL2RenderingContext["VERTEX_SHADER"]
      | WebGL2RenderingContext["FRAGMENT_SHADER"]
  ): string {
    return shaderType === 0x8b31 ? "VERTEX_SHADER" : "FRAGMENT_SHADER";
  }
}
