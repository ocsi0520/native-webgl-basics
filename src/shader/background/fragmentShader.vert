#version 300 es

precision highp float;

out vec4 outColor;
uniform sampler2D u_image;
in vec2 v_texCoord;
// https://webgl2fundamentals.org/webgl/lessons/webgl-image-processing.html

void main() {
  outColor = texture(u_image, v_texCoord);
}