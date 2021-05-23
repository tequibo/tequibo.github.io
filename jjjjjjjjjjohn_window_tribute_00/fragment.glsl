varying vec2 vUv;
uniform float u_time;
uniform sampler2D uTexture;
uniform float u_scale;
vec3 u_color1 = vec3(0.93, 0, 0.34);
vec3 u_color2 = vec3(0.04, 0.78, 0.96);
float box(vec2 p, vec2 R){
    float d = length(max(abs(p)-R,0.));
    return d;
}
/* Shape 2D rect */
float sRect(in vec2 p, in vec2 w) {    
    float d = max(abs(p.x / w.x), abs(p.y / w.y)) * 2.0;
    float m = max(w.x, w.y);
    return d * m - m;
}

/* Staggered animation */
struct Animation { float time; float pow; };
Animation animation = Animation(0.0, 0.0);
void totalTime(in float t, in float offset) { animation.time = mod(u_time + offset, t); }
void totalTime(in float t) { totalTime(t, 0.0); }
bool between(in float duration, in float offset) {
    float p = (animation.time - offset) / duration;
    animation.pow = p;
    animation.time -= (duration + offset);
    return (p >= 0.0 && p <= 1.0);
}
bool between(in float duration) { return between(duration, 0.0); }
#define TAU			6.283185307179586
float easeCubicOut(float t) {
    return ((t = t - 1.0) * t * t + 1.0);
}
float easeElasticOut(float t) {
    if (t == 0.0) { return 0.0; }
    if (t == 1.0) { return 1.0; }
    float p = 0.3;
    float a = 1.0; 
    float s = p / 4.0;
    return (a * pow(2.0, -10.0 * t) * sin((t - s) * TAU / p) + 1.0);
}
float easeCubicInOut(float t) {
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t + 2.0);
}
/* Boolean functions */
float sUnion(float a, float b) {
    return min(a, b);
}
float sIntersect(float a, float b) {
    return max(a, b);
}
float sDifference(float a, float b) {
    return max(a, -b);
}
float s=.8;
void main() {
  vec2 uv = vUv-.5;
  float v = 0.;
  float d = 1.;
  float d2 = 1.;
  vec3 color = vec3(0);;
  totalTime(2.);
  if(between(.5)){
    v = easeCubicInOut(animation.pow);
    d = sRect(uv,vec2(s+v*(1.-s),s+v*(1.-s)));
    d2 = sRect(uv,vec2(s*v,s*v));
    d=sDifference(d,d2);
  }
  if(between(.5)){
    d = sRect(uv,vec2(s,s));
    d=-d;

  }
  if(between(.5)){
    v = easeCubicInOut(animation.pow);
    d = sRect(uv,vec2(s+v*(1.-s),s+v*(1.-s)));
    d2 = sRect(uv,vec2(s*v,s*v));
    d=sDifference(d,d2);
    d=-d;
  }
  if(between(.5)){
    d = sRect(uv,vec2(s,s));
    // d=-d;
  }
 
  d = smoothstep(0., .05, d);
  // d2 = smoothstep(0., .05, d2);
  //  d=1.-d;
//   vec4 color = texture2D(uTexture, uv);
  color = vec3(d,d,d);
  color = mix(u_color1,u_color2,u_scale);
  // color = mix(mix(vec3(0.0, 0.0, 0.0),vec3(1),u_scale),color,d);
  color = mix(vec3(0),color,d);
  gl_FragColor = vec4(color,1.);
}