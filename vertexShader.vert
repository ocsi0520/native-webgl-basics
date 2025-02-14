#version 300 es

in vec4 a_position;
uniform float rotationX;
uniform float rotationY;
uniform float rotationZ;
uniform vec4 translation;

in vec4 a_color;
out vec4 v_color;

void main() {
  // vec2 rotationXY = vec2(sin(radians(rotation)), cos(radians(rotation)));
  float cX = cos(radians(rotationX));
  float sX = sin(radians(rotationX));

  float cY = cos(radians(rotationY));
  float sY = sin(radians(rotationY));

  float cZ = cos(radians(rotationZ));
  float sZ = sin(radians(rotationZ));

  mat4 rotationX = mat4(vec4(1, 0, 0, 0), vec4(0, cX, sX, 0), vec4(0, -sX, cX, 0), vec4(0, 0, 0, 1));
  mat4 rotationY = mat4(vec4(cY, 0, -sY, 0), vec4(0, 1, 0, 0), vec4(sY, 0, cY, 0), vec4(0, 0, 0, 1));

  mat4 rotationZ = mat4(vec4(cZ, sZ, 0, 0), vec4(-sZ, cZ, 0, 0), vec4(0, 0, 1, 0), vec4(0, 0, 0, 1));
  vec4 result = (a_position * rotationX * rotationY * rotationZ) + translation;

  v_color = a_color;
  gl_Position = result * vec4(1, -1, 1, 1);
}