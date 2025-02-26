#version 300 es

in vec2 a_position; // clip space [-1, 1] -- + 1 --> [0, 2] -- / 2 --> [0,1]
out vec2 v_texCoord; // texture coord [0, 1]
uniform float rotation;

void main() {
  vec2 upsideDownPosition = a_position * vec2(1, -1);
  vec2 scaledDownPosition = upsideDownPosition * 0.7;
  float cZ = cos(radians(rotation));
  float sZ = sin(radians(rotation));
  vec2 rotatedPosition = scaledDownPosition * mat2(cZ, sZ, -sZ, cZ);
  v_texCoord = (rotatedPosition + 1.0) / 2.0;
  gl_Position = vec4(a_position, 0.9, 1);
}
