import {
  WebGL2MethodParams,
  AddUniformPrefix,
  BufferData,
  UniformMethodName,
} from "./client-types";
import { Enumerate } from "../type-utils";

export class WebGLClient {
  private get vertexArrayObject(): WebGLVertexArrayObject {
    return this.vaoByProgram.get(this.currentProgram)!;
  }
  private set vertexArrayObject(value: WebGLVertexArrayObject) {
    this.vaoByProgram.set(this.currentProgram, value);
  }
  private currentProgram!: WebGLProgram;
  private vaoByProgram: Map<WebGLProgram, WebGLVertexArrayObject> = new Map();

  constructor(private gl: WebGL2RenderingContext) {}

  public drawArrays = this.gl.drawArrays.bind(this.gl);

  @WebGLClient.needProgram
  public uniform<MethodName extends UniformMethodName>(
    uniformName: string,
    methodName: MethodName,
    ...methodParams: WebGL2MethodParams<AddUniformPrefix<MethodName>>
  ): void {
    this.gl.bindVertexArray(this.vertexArrayObject);
    const uniformLocation = this.gl.getUniformLocation(
      this.currentProgram,
      uniformName
    )!;
    const noTypeMethodParams = methodParams as [never, never, never, never];
    this.gl[`uniform${methodName}`](uniformLocation, ...noTypeMethodParams);
  }

  @WebGLClient.needProgram
  public attribute(
    attributeName: string,
    { source, attributeDescriptor, usage }: BufferData
  ): void {
    this.gl.bindVertexArray(this.vertexArrayObject);
    const attribLocation = this.gl.getAttribLocation(
      this.currentProgram,
      attributeName
    );
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, source, usage);

    // TODO: IDK whether we need to avoid multiple enable
    this.gl.enableVertexAttribArray(attribLocation);
    this.gl.vertexAttribPointer(attribLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.vertexAttribPointer(
      attribLocation,
      attributeDescriptor.size,
      attributeDescriptor.type,
      attributeDescriptor.normalized ?? false,
      attributeDescriptor.stride ?? 0,
      attributeDescriptor.offset ?? 0
    );
  }

  public use(program: WebGLProgram): void {
    this.currentProgram = program;
    if (!this.vertexArrayObject)
      this.vertexArrayObject = this.gl.createVertexArray();

    this.gl.bindVertexArray(this.vertexArrayObject);
    this.gl.useProgram(this.currentProgram);
  }

  public clearCanvas(): void {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  public async loadImage(
    imgSrc: string,
    textureNumber: Enumerate<32>
  ): Promise<void> {
    // this.gl.texture
    const img = new Image();
    img.src = imgSrc;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = (_ev, _src, _lineno, _colno, error) => reject(error);
    });

    const texture = this.gl.createTexture();
    this.gl.activeTexture(this.gl.TEXTURE0 + textureNumber);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Set the parameters so we don't need mips and so we're not filtering
    // and we don't repeat
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );

    // Upload the image into the texture.
    const mipLevel = 0; // the largest mip
    const internalFormat = this.gl.RGBA; // format we want in the texture
    const srcFormat = this.gl.RGBA; // format of data we are supplying
    const srcType = this.gl.UNSIGNED_BYTE; // type of data we are supplying
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      mipLevel,
      internalFormat,
      srcFormat,
      srcType,
      img
    );
  }

  private static needProgram(
    _target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void {
    const originalFn = descriptor.value;
    descriptor.value = function (this: WebGLClient, ...args: any[]) {
      if (!this.currentProgram)
        throw new Error(`no program: ${propertyKey.toString()}`);
      return originalFn.call(this, ...args);
    };
  }
}
