#ifdef GL_ES
precision highp float;
#endif
#define TAU 6.28318530718
// const uint k = 1103515245U;  // GLIB C
//const uint k = 134775813U;   // Delphi and Turbo Pascal
//const uint k = 20170906U;    // Today's date (use three days ago's dateif you want a prime)
//const uint k = 1664525U;     // Numerical Recipes

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_rotation;

uniform float eyebrow_angle;
uniform float eyebrow_weight;
uniform float eyebrow_offset;
uniform float iris_scale;
uniform float eye_space;
uniform float eye_size;
uniform float eye_variant;
uniform float head_pattern;
uniform float body_pattern;
uniform float mouth_variant;
uniform float mouth_curve;
vec3 oklab_mix( vec3 colA, vec3 colB, float h )
{
    // https://bottosson.github.io/posts/oklab
    const mat3 kCONEtoLMS = mat3(                
         0.4121656120,  0.2118591070,  0.0883097947,
         0.5362752080,  0.6807189584,  0.2818474174,
         0.0514575653,  0.1074065790,  0.6302613616);
    const mat3 kLMStoCONE = mat3(
         4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827,  2.6093323231, -0.7034763098,
         0.2307590544, -0.3411344290,  1.7068625689);
                    
    // rgb to cone (arg of pow can't be negative)
    vec3 lmsA = pow( kCONEtoLMS*colA, vec3(1.0/3.0) );
    vec3 lmsB = pow( kCONEtoLMS*colB, vec3(1.0/3.0) );
    // lerp
    vec3 lms = mix( lmsA, lmsB, h );
    // gain in the middle (no oaklab anymore, but looks better?)
 // lms *= 1.0+0.2*h*(1.0-h);
    // cone to rgb
    return kLMStoCONE*(lms*lms*lms);
}
float rand(vec2 uv){
    return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
/* Math 2D Transformations */
mat2 rotate2d(in float angle){
    return mat2(cos(angle),-sin(angle), 
                sin(angle), cos(angle));
}

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

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
  vec3 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}
float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}
float sdRoundCone( vec3 p, float r1, float r2, float h )
{
  vec2 q = vec2( length(p.xz), p.y );
    
  float b = (r1-r2)/h;
  float a = sqrt(1.0-b*b);
  float k = dot(q,vec2(-b,a));
    
  if( k < 0.0 ) return length(q) - r1;
  if( k > a*h ) return length(q-vec2(0.0,h)) - r2;
        
  return dot(q, vec2(a,b) ) - r1;
}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}
float sdPlane( vec3 p, vec3 n, float h )
{
  // n must be normalized
  return dot(p,n) + h;
}
float sdTriPrism(vec3 p, vec2 h) {
  vec3 q = abs(p);
  return max(q.z - h.y, max(q.x * 0.866025 + p.y * 0.5, -p.y) - h.x * 0.5);
}
float sdCone( in vec3 p, in vec2 c, float h ) {
  // c is the sin/cos of the angle, h is height
  // Alternatively pass q instead of (c,h),
  // which is the point at the base in 2D
  vec2 q = h*vec2(c.x/c.y,-1.0);    
  vec2 w = vec2( length(p.xz), p.y );
  vec2 a = w - q*clamp( dot(w,q)/dot(q,q), 0.0, 1.0 );
  vec2 b = w - q*vec2( clamp( w.x/q.x, 0.0, 1.0 ), 1.0 );
  float k = sign( q.y );
  float d = min(dot( a, a ),dot(b, b));
  float s = max( k*(w.x*q.y-w.y*q.x),k*(w.y-q.y)  );
  return sqrt(d)*sign(s);
}

float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}
float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}
float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); }

float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h); }

vec2 opUnion( float d1, float d2, float m ) { 
    return vec2(min(d1,d2)); 
}
vec2 opU(vec2 d1, vec2 d2)
{
    return (d1.x < d2.x) ? d1 : d2;
}
float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }

float opIntersection( float d1, float d2 ) { return max(d1,d2); }

vec2 map(vec3 point){
    vec2 dist_mat = vec2(0);    
    vec3 p = point;
    // p.xz = p.xz*rotate2d(-TAU*sin(u_time)*.1);
    p=point;
    vec3 head_p = p;
    // head_p.x*=.8;    
    // float head = sdSphere(head_p, .5);
    vec2 head = vec2(sdEllipsoid(head_p, vec3(.6,.5,.5)),1.);
    vec3 body_p = p-vec3(0.,0.0,0.);
    body_p.y+=0.55;
    body_p.x*=.9;
    body_p.y*=1.2;
    float a_body = TAU*.025;
    float a_body2 = TAU*.03;
    float body1 = sdCone(body_p,vec2(sin(a_body), cos(a_body)),0.5)-.1;
    body_p.z*=2.;
    body_p.x*=0.9;
    body_p.y*=3.;
    float body2 = sdCone(body_p,vec2(sin(a_body2), cos(a_body2)),1.0)-.2;
    // vec2 body = vec2(opSmoothUnion(body1,body2,.3),3.0);
    vec2 body = vec2(body1,2.0);
    vec3 leg_p = p;
    leg_p.x=abs(leg_p.x);
    leg_p.x-=0.14;
    leg_p.y+=1.2;
    // leg_p.z+=.1;
    // leg_p.z-=sin(leg_p.y*1.)*.1;
    leg_p.xy=leg_p.xy*rotate2d(TAU*.5);
    float a_leg = TAU*.03;
    vec2 leg = vec2(sdCone(leg_p,vec2(sin(a_leg), cos(a_leg)),0.2),2.0);
    vec3 arm_p = p;
    arm_p.x=abs(arm_p.x);
    // arm_p.xy=arm_p.xy*rotate2d(TAU*.75);
    arm_p.x+=-0.35;
    arm_p.y+=0.9;
    arm_p.xy=arm_p.xy*rotate2d(TAU*.3);
    arm_p.x-=sin(arm_p.y*2.5-0.2)*.3;
    float a_arm = TAU*.02;
    vec2 arm = vec2(sdCone(arm_p,vec2(sin(a_arm), cos(a_arm)),0.4),2.0);
    // body_p.xy=body_p.xy*rotate2d(TAU*.5);
    // vec2 body = vec2(sdRoundCone(body_p,0.3,0.19,.5),3.0);
    vec3 mouth_p = p-vec3(0.,-0.2,0.5);
    vec2 mouth = vec2(sdSphere(mouth_p, .1),2.);
    vec3 nose_p = p+vec3(0.,0.05,-0.45);
    nose_p.y*=.9;
    // vec2 nose = vec2(opSmoothUnion(sdBox(nose_p,vec3(.0051)), sdSphere(nose_p,.001),.9),2.);
    // vec2 nose = vec2(sdBox(nose_p,vec3(.05,.1,.05)),2.);
    vec2 nose = vec2(sdSphere(nose_p,.08),2.);
    dist_mat = opU(nose, head);
    dist_mat = opU(head, body);
    dist_mat = opU(dist_mat, leg);
    dist_mat = opU(dist_mat, arm);
    // dist_mat=arm;
    // dist_mat = opSubtraction(mouth, dist_mat);    
    return dist_mat;
}

vec2 rayMarch(vec3 rayOrigin, vec3 rayDirection){
    float rayLength=0.;
    vec2 dist_mat = vec2(0);
    for(int i=0;i<55;i++){
        vec3 point = rayOrigin+rayDirection*rayLength;
        dist_mat = map(point);
        rayLength+=dist_mat.x;
        if(abs(dist_mat.x)<.001 || rayLength>5.0){
            break;
        }
    }
    return vec2(rayLength, dist_mat.y);
}

vec3 getNormal(vec3 point){
    float dist = map(point).x;
    vec2 e = vec2(.01, 0);
    vec3 n = dist - vec3(
        map(point-e.xyy).x,
        map(point-e.yxy).x,
        map(point-e.yyx).x);
    return normalize(n);    
}

vec3 getLight(vec3 point, vec3 position, vec3 color){
    vec3 lightDirection = normalize(position - point);
    vec3 normal = getNormal(point);
    vec3 diffuse = vec3(clamp(dot(normal, lightDirection),0.,1.));
    diffuse = diffuse*color;
    vec3 p = point;
    return diffuse;
}
mat3 setCamera(in vec3 ro, in vec3 ta, float cr){
    vec3 cw = normalize(ta-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv =          ( cross(cu,cw) );
    return mat3( cu, cv, cw );
}
vec3 getColor(vec2 uv){    
    // vec3 ro = vec3(0., 0., -1.);  
    // float angle = -TAU*u_time*.4;
    // float angle = sin(-TAU*u_time*.2)-TAU*.8;
    float angle =TAU*.25+u_rotation;//u_mouse.x/u_resolution.x*TAU+TAU*.25;
    vec3 target = vec3( 0., -0.5, 0. );
    // vec3 ro = target + vec3( 2.*cos(angle), .3, 2.*sin(angle));
    vec3 ro = target + vec3(2.*cos(angle), .3, 2.*sin(angle));
    // vec3 ro = target + vec3( 0, .50, 2.);
    mat3 cam = setCamera(ro, target, 0.);
    // focal length
    const float fl = 1.2;
    vec3 rd = cam * normalize(vec3(uv,fl));
    vec3 light1Pos = vec3(-2., 1.3, 1.5);
    vec2 d_m = rayMarch(ro, rd);
    vec3 p = ro+rd*d_m.x;
    vec3 dif1 = getLight(p, light1Pos, vec3(1));
    // dif1=smoothstep(0.2,1.,dif1);      

    // vec3 lightDirection = normalize(light1Pos - p);
    // vec3 h = normalize (-rd + lightDirection);
    // float specular = pow (max (.0, dot (getNormal(p), h)), 222.2);
    vec3 col = vec3(0.0667, 0.5216, 0.5804);

    if(d_m.y==1.0){//head
        
        if(head_pattern==0.){
            col=abs(vec3(
        (cos(p.y*5.+(u_time*.5)*1.5)),
        (cos(p.y*5.+(u_time*1.5)*1.5)),
        (cos(p.y*1.+(u_time*.5)*1.5))));
        }
        if(head_pattern==1.){
            col=vec3(0.075, 0.7647, 0.95);

        }
        if(head_pattern==2.){
            col=vec3(p.y*2., 1.0706, 0.0706);
        }
        //gradient y
        if(head_pattern==3.){
            col=oklab_mix(vec3(0.1216, 0.6235, 0.6392), vec3(0.9529, 0.1882, 0.4824),p.y*2.+0.5);
        }
        if(head_pattern==4.){
            col=vec3(
            cos(p.y*23.-p.x*23.+(u_time*1.1)*TAU), 
            cos(p.y*23.-p.x*23.+(u_time*1.)*TAU), 
            cos(p.y*23.-p.x*23.+(u_time*1.)*TAU));
        }
            col=vec3(
            cos(p.y*23.-p.x*23.+(u_time*1.1)*TAU), 
            cos(p.y*23.-p.x*23.+(u_time*1.)*TAU), 
            cos(p.y*23.-p.x*23.+(u_time*1.)*TAU));

        // float c = length(p.xy)-.1;
        if(p.z>0.){
            vec2 po = getNormal(p).xy;
            vec2 po2 = getNormal(p).xy;
            // vec2 po3 = getNormal(p).xy;
            po.x=abs(po.x);
            po.x-=1.*eye_space;
            po.y+=.06;
            po.x*=1.4;
            po2.y+=.6;
            po2.y+=sin(po2.x*9.0*mouth_curve-4.7)*0.1;//pow(po2.x,4.)*5.;
            float eyebrows = box((po+vec2(0.0,-0.4+eyebrow_offset))*rotate2d(-TAU*eyebrow_angle),vec2(.2,0.05*eyebrow_weight));

            float whites = length(po)-.3*eye_size;//whites

            float iris= length(po)-.25*iris_scale*eye_size;
            //circle
            if(eye_variant==0.){
                iris = length(po)-.25*iris_scale*eye_size;
            }
            //cross rotating
            if(eye_variant==1.){
                po = po*rotate2d(TAU*u_time*.2);
                iris = sdCross(po,vec2(0.2*iris_scale*eye_size,0.06*iris_scale*eye_size),0.);
            }
            //square rotating
            if(eye_variant==2.){      
                po = po*rotate2d(TAU*u_time*.2);
                iris = box(po,vec2(.18*iris_scale*eye_size,.18*iris_scale*eye_size));
            }
            //circle pulsing
            if(eye_variant==3.){
                iris = length(po)-.25*iris_scale*eye_size*(.5+sin(u_time*30.)*.25);
            }
            //hor rect
            if(eye_variant==4.){
                iris = box(po,vec2(.18*iris_scale*eye_size,.1*iris_scale*eye_size));
            }
            //vert rect
            if(eye_variant==5.){
                iris = box(po,vec2(.1*iris_scale*eye_size,.2*iris_scale*eye_size));
            }
            float mouth = box(po2,vec2(.1,.02));

            whites = 1.0-smoothstep(0.,.01,whites);
            iris = smoothstep(0.,.01,iris);
            mouth = smoothstep(0.,.01,mouth);
            eyebrows= smoothstep(0.,.01,eyebrows);

            vec3 eyes_col=vec3(whites);
            vec3 eyes_col2=vec3(iris);
            vec3 mouth_col=vec3(mouth);
            vec3 eyebrows_col=vec3(eyebrows);
            // eyes_col=min(eyes_col2,eyes_col);
            col = max(col,eyes_col);
            // col+=eyes_col;
            col*=eyes_col2;
            col*=mouth_col;
            col*=eyebrows_col;
        }
        // col=mix(col, vec3(0.0235, 0.6235, 0.9725),p.y*3.+1.);
        // col=mix(vec3(0.5529, 0.0275, 0.2745), vec3(0.0235, 0.6235, 0.9725),dif1.r);
    }
    //body
    if(d_m.y==2.0){
        col=vec3(0.0392, 0.0, 0.0196);
        //diagonal
        if(body_pattern==.0){
            col=vec3(
            cos(p.y*23.+p.x*23.+(u_time*5.1)*TAU), 
            cos(p.y*23.+p.x*23.+(u_time*5.)*TAU), 
            cos(p.y*23.+p.x*23.+(u_time*5.)*TAU));
        }
        //gradient y
        if(body_pattern==1.0){
            col=oklab_mix(vec3(0.0392, 0.2549, 0.8549), vec3(0.0118, 0.6667, 0.6353),p.y*3.+3.0);

        }
        //stripes horizontal
        if(body_pattern==2.0){
            float cc = sin(p.y*33.+u_time*15.)-.8;
            cc = smoothstep(0.,0.1,cc);
            col=vec3(0., cc, cc);
        }
        if(body_pattern==3.0){
            col=oklab_mix(vec3(0.8549, 0.0392, 0.2157), vec3(0.0118, 0.6667, 0.6353),p.y*3.+3.0);
        }
        if(body_pattern==4.0){
            col=abs(vec3(
            cos(p.y*23.+p.x*23.+(u_time*1.1)*TAU), 
            cos(p.y*23.-p.x*3.+(u_time*2.)*TAU), 
            cos(p.y*23.+(u_time*3.)*TAU)));
        }
        if(body_pattern==5.0){
        }
        if(body_pattern==6.0){
        }
        if(body_pattern==7.0){
        }
        if(body_pattern==8.0){
        }
        if(body_pattern==9.0){
        }
            

    }
    //background
    if(d_m.x>3.){
        float gr = length(uv*.5);
        col=oklab_mix(vec3(0.1412, 0.6549, 0.8941),vec3(0.102, 0.0039, 0.0157),gr);
    }
    
    vec3 normal = getNormal(p);
    // col += clamp(dot(normal, vec3(0.7922, 0.1137, 0.4863))*1.5,0.,1.);
    // col += clamp(dot(normal, vec3(0,-1,0))*.2,0.,1.);
    float startDist = 1.1;
    float fogAmount = 1.0 - exp(-d_m.x * (1.0/startDist));
    //1.0-exp( -0.0001*d*d*d )
    //  col=mix(col,vec3(0.9882, 0.9882, 0.9882),fogAmount);
    return col; 
}
void main() {    
    vec2 R = u_resolution.xy;
    vec2 uv = (2.*gl_FragCoord.xy-R)/R.x;
    vec3 col = vec3(0.0, 0.0, 0.0);
    col = getColor(uv);
    // const float AA_size = 2.0;
    // float count = 0.0;
    // for (float aaY = 0.0; aaY < AA_size; aaY++)
    // {
    //     for (float aaX = 0.0; aaX < AA_size; aaX++)
    //     {
    //         col += getColor(uv + vec2(aaX/R.x, aaY/R.x) / AA_size);
    //         count += 1.0;
    //     }
    // }
    // col /= count;
    col = pow(col, vec3(0.45));
    // fragColor=vec4(mix(col,vec3(0.4196, 0.0353, 0.5686),normal), 1.);
    gl_FragColor=vec4(col, 1.);
}