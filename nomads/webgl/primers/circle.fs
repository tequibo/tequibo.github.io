precision mediump float;
uniform vec2 u_resolution;
// uniform vec2 u_mouse;
uniform float u_time;
uniform float u_param1;
uniform float u_param2;
uniform float u_param3;
uniform vec2 u_mouse;
vec3 color1 = vec3(0.61, 0.99, 0.11);
vec3 color2 = vec3(0);
void main() {
    vec2 R = u_resolution.xy;
    vec2 uv = (2.*gl_FragCoord.xy-R)/R.x;
    float c = length(uv)-u_mouse.x/u_resolution.x;
    c = max(c,0.);
    c = pow(c,.5);
    c = smoothstep(0., .55, c);
    vec3 col = mix(color1, color2, c);
    gl_FragColor = vec4(col,1);
}