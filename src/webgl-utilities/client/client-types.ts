import { SliceOfFirst } from '../type-utils';

type CompleteUniformMethodName = Extract<
  keyof WebGL2RenderingContext,
  `uniform${string}`
>;
type RemoveUniformPrefix<T extends CompleteUniformMethodName> = T extends `uniform${infer R}` ? R : never;

export type UniformMethodName = RemoveUniformPrefix<CompleteUniformMethodName>;
export type AddUniformPrefix<T extends UniformMethodName> = `uniform${T}`;
export type WebGL2MethodParams<MethodName extends CompleteUniformMethodName> = SliceOfFirst<
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