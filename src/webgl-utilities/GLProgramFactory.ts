export class GLProgramFactory {
  constructor(private gl: WebGL2RenderingContext) {}
  public createProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): WebGLProgram {
    const vertexShader = this.createShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    );
    const fragmentShader = this.createShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    );

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);

    this.gl.linkProgram(program);
    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!success) throw new Error("could not link program");

    return program;
  }

  private createShader(
    shaderSource: string,
    shaderType:
      | WebGL2RenderingContext["VERTEX_SHADER"]
      | WebGL2RenderingContext["FRAGMENT_SHADER"]
  ): WebGLShader {
    const shader = this.gl.createShader(shaderType);
    if (!shader)
      throw new Error(
        "could not create shader " + this.getShaderTypeString(shaderType)
      );
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);

    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
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
