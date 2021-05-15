#define TAU 6.28318530718
  const uint k = 1103515245U;  // GLIB C
//const uint k = 134775813U;   // Delphi and Turbo Pascal
//const uint k = 20170906U;    // Today's date (use three days ago's dateif you want a prime)
//const uint k = 1664525U;     // Numerical Recipes
#iUniform float light1 = 1.0 in { 0.0, 10.0 } 
#iUniform float light2 = 1.0 in { 0.0, 10.0 } 
#iUniform float light3 = 1.0 in { 0.0, 10.0 } 
#iUniform float spec = 1.0 in { 0.0, 110.0 } 
vec3 hash( uvec3 x )
{
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;

    return vec3(x)*(1.0/float(0xffffffffU));
}
float rand(vec2 uv){
    return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float N21(vec2 p) {
    return fract(sin(p.x*100.+p.y*6574.)*5647.);
}

float SmoothNoise(vec2 uv) {
    vec2 lv = fract(uv);
    vec2 id = floor(uv);
    
    lv = lv*lv*(3.-2.*lv);
    
    float bl = N21(id);
    float br = N21(id+vec2(1,0));
    float b = mix(bl, br, lv.x);
    
    float tl = N21(id+vec2(0,1));
    float tr = N21(id+vec2(1,1));
    float t = mix(tl, tr, lv.x);
    
    return mix(b, t, lv.y);
}

float SmoothNoise2(vec2 uv) {
    float c = SmoothNoise(uv*4.);
    
    // don't make octaves exactly twice as small
    // this way the pattern will look more random and repeat less
    c += SmoothNoise(uv*8.2)*.5;
    c += SmoothNoise(uv*16.7)*.25;
    c += SmoothNoise(uv*32.4)*.125;
    c += SmoothNoise(uv*64.5)*.0625;
    
    c /= 2.;
    
    return c;
}

/* Math 2D Transformations */
mat2 rotate2d(in float angle){
    return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
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
    // point.y+=sin(iTime)*1.;
    vec3 p = point;
    // p.xy=p.xy*rotate2d(TAU*.4+iTime*TAU*.1);
    // p.xz=p.xz*rotate2d(TAU*.4+iTime*TAU*.1);
    
    // p.y+=.1;//*(mod(p.x*2.,2.);
    //  p.z=p.z-.3;
    float c = .4;
    float d2 = cos(p.x*10.-iTime*1.)*1.1+cos(p.x*10.-iTime*4.)*1.2+cos(p.x*70.-iTime*4.)+sin(p.z*75.-iTime*2.)*1.4+sin(p.z*55.+iTime*2.)*.8+sin(p.z*15.+iTime*2.);
    // float d3 = SmoothNoise2(p.xz+vec2(iTime*.01,iTime*.1));
    //   p.xz=mod(p.xz+0.5*c,c)-0.5*c;
    //  p.xz = p.xz*rotate2d(sin(-TAU*iTime*.5)*p.y*TAU*2.);
    p=point;
    p.y-=.2;
    p.xy = p.xy*rotate2d(TAU*iTime*.2);
    p.xz = p.xz*rotate2d(TAU*iTime*.1);
    p.yz = p.yz*rotate2d(TAU*iTime*.1);
    float d = cos(p.x*110.+iTime*4.)+sin(p.y*155.+iTime*2.)+sin(p.z*155.+iTime*2.);
    float box = sdBox(p, vec3(.15))+d*.00;
    float box2 = sdBox(p, vec3(.1,.02,.2))+d*.001;
    float capsule = sdCapsule(p,vec3(0,0,-.50),vec3(0,0,.50),.04);
    box=opSubtraction(capsule,box);
    float sphere = sdSphere(p, .1);
    p=point;
    float plane = sdPlane(p, vec3(0,1.0,.0),.0);//p.y+0.4;
    dist = sphere+d*.002;
    dist=opSmoothUnion(box,plane+d2*.005,.3);

    // dist=opIntersection(sphere, box)+d*.004;
    // dist=opSubtraction(sphere, box);
    //  dist=opSmoothUnion(dist,plane,.05);
    // dist = capsule;
    //  dist = min(dist,plane);
    //   dist=max(plane,dist);
    // dist *=sdSphere(p, 0.1);
    return dist;
}

float rayMarch(vec3 rayOrigin, vec3 rayDirection){
    float rayLength=0.;
    for(int i=0;i<255;i++){
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

vec3 getLight(vec3 point, vec3 rayDirection, vec3 position, vec3 color){
    vec3 lightDirection = normalize(position - point);
    vec3 normal = getNormal(point);
    vec3 diffuse = vec3(clamp(dot(normal, lightDirection),0.,1.));
    //  diffuse += dot(normal, vec3(0,1,0));
    diffuse = diffuse*color;
    vec3 p = point;
    // p.yz = p.yz*rotate2d(TAU/8.);
    // diffuse+=step(cos(p.y*151.+iTime),.0)*vec3(0.5137, 0.8863, 0.6667);
    float shadow = 0.0;
    float shadowRayCount =1.0;
    for(float i=0.; i<shadowRayCount; i++){
        // vec3 r = hash(uvec3(lightDirection+i))*2.-1.;
        float r = rand(lightDirection.xz)*2.-1.;
        float d = rayMarch(point+normal*.001, lightDirection);
            if(d<length(position-point)) {
                // diffuse=-diffuse;
                // diffuse*=.5;
                shadow+=1.;
            }
        }
    diffuse = mix(diffuse, diffuse*.1, shadow/shadowRayCount);
    // vec3 h = normalize (-rayDirection + lightDirection);
	// float specular = pow (max (.0, dot (normal, h)), spec);
    return diffuse;
}
vec3 getColor(vec2 uv){
    vec3 R = iResolution;
    
    vec3 ro = vec3(0., .3, -.5);
     vec4 m = iMouse/R.x;
     mat2 rot = rotate2d(TAU*(m.z-m.x));
   // mat2 rot = rotate2d(TAU*iTime*.06);
    // mat2 rot2 = rotate2d(TAU*(m.w-m.y));
    mat2 rot2 = rotate2d(TAU*.3);
    // ro.yz=ro.yz*rot2;
     ro.xz=ro.xz*rot;
    vec3 rd = vec3(uv.x, uv.y, 1);
    // rd.yz=rd.yz*rot2;
     rd.xz=rd.xz*rot;
    float d = rayMarch(ro, rd);
    vec3 p = ro+rd*d;
    // p.x+=iTime*.11;
    vec3 light1Pos = vec3(1.5, 1.3, -1.);
    vec3 dif1 = getLight(p, rd, light1Pos, vec3(0.4784, 0.9294, 0.9529));
    vec3 dif2 = getLight(p, rd, vec3(-1, 1, -1.), vec3(0.9725, 0.0, 0.2118));
    vec3 dif3 =  getLight(p, rd,  vec3(0, 0, -1.), vec3(0.9608, 0.8588, 0.9333));
    
    vec3 lightDirection = normalize(light1Pos - p);
    vec3 h = normalize (-rd + lightDirection);
	float specular = pow (max (.0, dot (getNormal(p), h)), spec);
	float specular2 = pow (max (.0, dot (getNormal(p), h)), 1.5);
    // dif+=.5+smoothstep(0.8,1.,dif);  
    vec3 col = vec3(0.6196, 0.0392, 0.0392);
    // col = mix(dif1,dif2,.5);
    col=dif1*light1+dif2*light2+specular*light3;
    // col = (dif1*light1,dif2*light2,specular*light3)
    // col=mix(dif1*light1,dif2*light2, smoothstep(1.-(sin(p.x*142.))*exp(sin(p.z*122.10)),0.,.3))+dif3;
    // col=mix(dif1*light1,dif2*light2,.5)+specular*light3;
    if(d>10.1){
        col = vec3(0.9216, 0.9216, 0.6353);
    }
    float startDist = 2.1;
    float fogAmount = 1.0 - exp(-d * (1.0/startDist));
    //1.0-exp( -0.0001*d*d*d )
    col=mix(col,vec3(0.0, 0.0549, 0.0667),fogAmount);
    return col; 
}
void mainImage(out vec4 fragColor, in vec2 fragCoords){

    vec3 R = iResolution;
    vec2 uv = (2.*fragCoords-R.xy)/R.x;
    float AA_size = 2.0;
    float count = 0.0;
    vec3 col = vec3(0.0, 0.0, 0.0);

    for (float aaY = 0.0; aaY < AA_size; aaY++)
    {
        for (float aaX = 0.0; aaX < AA_size; aaX++)
        {
            col += getColor(uv + vec2(aaX/R.x, aaY/R.x) / AA_size);
            count += 1.0;
        }
    }
    col /= count;
    col = pow( col, vec3(0.4545) );
    // col=(1.-exp(-abs(col*2.6)));
    fragColor=vec4(col, 1.);
}