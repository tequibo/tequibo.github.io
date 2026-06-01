varying vec2 vUv;

uniform float u_time;
uniform float u_f;
uniform float u_eye_variant;
#define TAU 6.283185307179586

float box(vec2 p, vec2 R){
    float d = length(max(abs(p)-R,0.));
    return d;
}

float sdCross( in vec2 p, in vec2 b, float r ) 
{
    p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;
    vec2  q = p - b;
    float k = max(q.y,q.x);
    vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);
    return sign(k)*length(max(w,0.0)) + r;
}
mat2 rotate2d(in float angle){
    return mat2(cos(angle),-sin(angle), 
                sin(angle), cos(angle));
}
void main() {
    vec2 uv = vUv-.5;
    float t = mod(u_time*5.,TAU);
    float eye_size=.3;
    float iris_scale=1.;
    vec2 po = uv;
    // float whites = length(po)-.3*eye_size;//whites
    float c =  1.;
    float iris= length(po)-.25*iris_scale*eye_size;
    if(u_f<0.5){

    po = po*rotate2d(TAU*u_time*.002);
    }
    else{
    po = po*rotate2d(-TAU*u_time*.002);

    }
    //hypno
    if(u_eye_variant==0.){
            iris = sin(length(po*100.)-.25*iris_scale*eye_size-u_time*.01);

    }
    //cross rotating
    if(u_eye_variant==1.){
        iris = sdCross(po,vec2(0.2*iris_scale*eye_size,0.06*iris_scale*eye_size),0.);
    }
    //square rotating
    if(u_eye_variant==2.){      
        iris = box(po,vec2(.18*iris_scale*eye_size,.18*iris_scale*eye_size));
    }
    //circle pulsing
    if(u_eye_variant==3.){
        iris = length(po)-.25*iris_scale*eye_size*(.5+sin(u_time*.05)*.25);
    }
    //hor rect
    if(u_eye_variant==4.){
        iris = box(po,vec2(.18*iris_scale*eye_size,.1*iris_scale*eye_size));
    }
    //vert rect
    if(u_eye_variant==5.){
        iris = box(po,vec2(.1*iris_scale*eye_size,.2*iris_scale*eye_size));
    }
    iris = smoothstep(0.,.01,iris);
    c*=iris;
    // c=sin(u_time);
    vec4 col = vec4(c, c, c, 1);   
    gl_FragColor = col;
}
