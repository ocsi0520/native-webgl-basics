#version 300 es

in vec2 a_position; // clip space [-1, 1] -- + 1 --> [0, 2] -- / 2 --> [0,1]
out vec2 v_texCoord; // texture coord [0, 1]

void main() {
  vec2 upsideDownPosition = a_position * vec2(1, -1);
  v_texCoord = (upsideDownPosition + 1.0) / 2.0;
  gl_Position = vec4(a_position, 0.9, 1);
}
