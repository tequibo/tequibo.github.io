#define TAU 6.28318530718
// const uint k = 1103515245U;  // GLIB C
//const uint k = 134775813U;   // Delphi and Turbo Pascal
//const uint k = 20170906U;    // Today's date (use three days ago's dateif you want a prime)
//const uint k = 1664525U;     // Numerical Recipes
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float rand(vec2 uv){
    return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
/* Math 2D Transformations */
mat2 rotate2d(in float angle){
    return mat2(cos(angle),-sin(angle), 
                sin(angle), cos(angle));
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

float opUnion( float d1, float d2 ) { return min(d1,d2); }

float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }

float opIntersection( float d1, float d2 ) { return max(d1,d2); }

float map(vec3 point){
    float dist = 0.;    
    vec3 p = point;
    float c = .2;
    p=point;
    p.xz = p.xz*rotate2d(-TAU*u_time*.1);
    float sphere = sdSphere(vec3(p.x*.8,p.y,p.z), .35);
    // p=point;
    float pr = sdTriPrism(p,vec2(.3));
    vec3 offset  = vec3(0,-.45, 0);
    float box = sdBox(p,vec3(.5,.1,.1)); 
    float plane = sdPlane(p, normalize(vec3(0,1.0,.0)),.4);//p.y+0.4;
    float cone = sdCone(p, vec2(sin(TAU*.05),cos(TAU*.05)),1.1);
    // float base = (cos(p.x) * sin(p.y) + cos(p.y) * sin(p.z) + cos(p.z) * sin(p.x));
    // float inverse = -base + (1.0+cos(u_time/4.0))*4.0;
    float gyroid = dot(sin(p*11.+u_time),cos(p.zxy*11.+u_time))*.1;
    float cone2 = length(vec2(cone,gyroid))-.03;
    // cone = opSubtraction(cone2,cone);
    dist = max(plane,cone);
    // dist = min(dist,box);
    // cone=abs(cone)-.05;
    // box=abs(box)-abs(sin(u_time*TAU))*.05;
    // dist=opIntersection(sphere, box);
    float cap = sdCapsule(p,vec3(.1,-1,0),vec3(.1,-1.5,0),.05);
    float cap2 = sdCapsule(p,vec3(-.1,-1,0),vec3(-.1,-1.5,0),.05);
    float ll = sdCone(p, vec2(sin(TAU*.05),cos(TAU*.05)),1.1);
    dist = min(dist,sphere);
    // dist=opSmoothUnion(cone,sphere,.2);
    // dist=opSmoothUnion(dist,box,.1);
    
    // dist = min(dist,box2);
    // dist = min(dist,box3);
    dist = min(dist,cap);
    dist = min(dist,cap2);
    // dist = cone;
    //dist = pr;
    // dist=opSubtraction(sphere, box);
    // dist = capsule;
    //  dist = min(dist,plane);
    //   dist=max(plane,dist);
    // dist *=sdSphere(p, 0.1);
    return dist;
}

float rayMarch(vec3 rayOrigin, vec3 rayDirection){
    float rayLength=0.;
    for(int i=0;i<55;i++){
        vec3 point = rayOrigin+rayDirection*rayLength;
        float dist = map(point);
        rayLength+=dist;
        if(abs(dist)<.0001 || rayLength>22.0){
            break;
        }
    }
    return rayLength;
}

vec3 getNormal(vec3 point){
    float dist = map(point);
    vec2 e = vec2(.01, 0);
    vec3 n = dist - vec3(
        map(point-e.xyy),
        map(point-e.yxy),
        map(point-e.yyx));
    return normalize(n);    
}

vec3 getLight(vec3 point, vec3 position, vec3 color){
    vec3 lightDirection = normalize(position - point);
    vec3 normal = getNormal(point);
    vec3 diffuse = vec3(clamp(dot(normal, lightDirection),0.,1.));
    //  diffuse += dot(normal, vec3(0,1,0));
    diffuse = diffuse*color;
    // vec3 p = point;
    // p.yz = p.yz*rotate2d(TAU/8.);
    // diffuse+=step(cos(p.y*151.+u_time),.0)*vec3(0.5137, 0.8863, 0.6667);
    // float shadow = 0.0;
    // float shadowRayCount =1.0;
    // for(float i=0.; i<1.; i++){
    //     // vec3 r = hash(uvec3(lightDirection+i))*2.-1.;
    //     float r = rand(lightDirection.xz)*2.-1.;
    //     float d = rayMarch(point+normal*.001, lightDirection);
    //         if(d<length(position-point)) {
    //             // diffuse=-diffuse;
    //             diffuse*=.5;
    //             shadow+=1.;
    //         }
    //     }
    // diffuse = mix(diffuse, diffuse*.5, shadow/shadowRayCount);
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
    vec3 target = vec3( 0., -0., -0. );
    // vec3 ro = target + vec3( 2.*cos(-TAU*u_time*.1), .3, 2.*sin(-TAU*u_time*.1));
    vec3 ro = target + vec3( 0, .50, 2.);
    mat3 cam = setCamera(ro, target, 0.);
    // focal length
    const float fl = 1.2;    
    // ray direction
    vec3 rd = cam * normalize(vec3(uv,fl));
    vec3 light1Pos = vec3(-1., 1.3, 0.);
    float d = rayMarch(ro, rd);
    vec3 p = ro+rd*d;
    vec3 dif1 = getLight(p, light1Pos, vec3(0.39, 0.83, 1));
    vec3 dif2 = getLight(p, vec3(.5, 0, 1.), vec3(0.17, 0.53, 0.82));
    vec3 dif3 = getLight(p, vec3(0, -1, 1.), vec3(0.79, 0.29, 0.57));
    // dif+=.5+smoothstep(0.8,1.,dif);    

    vec3 lightDirection = normalize(light1Pos - p);
    vec3 h = normalize (-rd + lightDirection);
	float specular = pow (max (.0, dot (getNormal(p), h)), 14.);
	// float specular2 = pow (max (.0, dot (getNormal(p), h)), 1.5);
    // dif+=.5+smoothstep(0.8,1.,dif);  
    vec3 col = vec3(0.1529, 0.0, 0.0);
    float light1 = 1.0; 
    float light2 = 1.0; 
    float light3 = 1.0; 
    col=dif1*light1+dif2*light2+dif3;//+specular*vec3(0.9922, 0.9922, 0.9922);
    // col = getNormal(p);
    if(d>12.1){
        // vec3 col2=mix(vec3(0.1608, 0.0, 0.0627),vec3(0.7529, 0.7882, 0.2353),
        // pow(abs(uv.y),1.+.5*sin(u_time)));
        // col=mix(col,col2,.9);
        col=vec3(0.0941, 0.0039, 0.0471);
    }
    vec3 normal = getNormal(p);
    // col += clamp(dot(normal, vec3(0.7922, 0.1137, 0.4863))*1.5,0.,1.);
    // col += clamp(dot(normal, vec3(0,-1,0))*.2,0.,1.);
    float startDist = 1.1;
    float fogAmount = 1.0 - exp(-d * (1.0/startDist));
    //1.0-exp( -0.0001*d*d*d )
    // col=mix(col,vec3(0.3725, 0.6196, 0.0471),fogAmount);
    return col; 
}
void main() {    
    vec2 R = u_resolution.xy;
    vec2 uv = (2.*gl_FragCoord.xy-R)/R.x;
    vec3 col = vec3(0.0, 0.0, 0.0);
    col = getColor(uv);
    // const float AA_size = 1.0;
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