precision highp float;

float time_scale = 0.5;

#define PI 3.14159265359
#define TAU 6.28318530718

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.x;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0);
    float a = atan(uv.x, uv.y);
    
    float l = length(uv);
    uv = sin(uv*15.);
    float a2 = atan(uv.x, uv.y);
    float t = fract(iTime*time_scale-sin(iTime*2.)*0.5*l+sin(iTime*6.)*l);
    t = -sin(iTime*1.)*l*.5-sin(iTime*3.)*1.5*l-sin(iTime*0.5)*1.5*l;
    t = sin(iTime*1.)*l*2.5;
    float c = 0.;
    float rad_time = t*TAU;
    float r = 0.5 + 0.5 * cos(atan(uv.x, uv.y)-rad_time+l*-11.);
    // c = g;
    // r = r * 0.5;
    c = r;
    // c = step(c,0.5);
    finalColor += vec3(c, c, c);
    fragColor = vec4(finalColor, 1.);
}
