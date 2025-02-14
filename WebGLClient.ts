type UniformMethodName = Extract<
  keyof WebGL2RenderingContext,
  `uniform${string}`
>;
type SliceOfFirst<T extends unknown[]> = T extends [unknown, ...infer R]
  ? R
  : never;

type WebGL2MethodParams<MethodName extends UniformMethodName> = SliceOfFirst<
  Parameters<WebGL2RenderingContext[MethodName]>
>;

export type AttributeDescriptor = {
  size: GLint;
  type: GLenum;
  normalized?: boolean;
  stride?: GLsizei;
  offset?: GLintptr;
};

export type BufferData = {
  // contains ArrayBufferView
  source: AllowSharedBufferSource | null;
  usage: GLenum;
  attributeDescriptor: AttributeDescriptor;
};

export class WebGLClient {
  private vertexArrayObject: WebGLVertexArrayObject;

  constructor(
    public gl: WebGL2RenderingContext,
    public linkedProgram: WebGLProgram
  ) {
    this.vertexArrayObject = this.gl.createVertexArray();
  }

  public uniform<MethodName extends UniformMethodName>(
    uniformName: string,
    methodName: MethodName,
    ...methodParams: WebGL2MethodParams<MethodName>
  ): void {
    this.gl.bindVertexArray(this.vertexArrayObject);
    const uniformLocation = this.gl.getUniformLocation(
      this.linkedProgram,
      uniformName
    )!;
    const noTypeMethodParams = methodParams as [never, never, never, never];
    this.gl[methodName](uniformLocation, ...noTypeMethodParams);
  }

  public attribute(
    attributeName: string,
    { source, attributeDescriptor, usage }: BufferData
  ): void {
    this.gl.bindVertexArray(this.vertexArrayObject);
    const attribLocation = this.gl.getAttribLocation(
      this.linkedProgram,
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

  public useProgram(): void {
    this.gl.bindVertexArray(this.vertexArrayObject);
    this.gl.useProgram(this.linkedProgram);
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
}

// https://stackoverflow.com/a/70307091
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

// type Range<F extends number, T extends number> = Exclude<
//   Enumerate<T>,
//   Enumerate<F>
// >;
