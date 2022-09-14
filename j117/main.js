function rr(min, max){
    return min+Math.random()*(max-min);
}

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


let canvas, ctx;
let w,h;
let side;
let brush={};
let size, str;
let counter=0;
let color;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    side = w>h?h:w;
}

function setup() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");   
    window.addEventListener("resize", resize); 
    resize();
    reset()
}
function draw(e) {
    
	stats.begin();
    counter++;
    if(counter>300){
        reset()
        counter=0;
    }
	ctx.fillStyle='rgba(235,235,235,1)';
    let r = rr(0,255)
    ctx.strokeStyle='rgba('+r+','+r+','+r+',.5)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    brush.x+=rr(-6,6); 
    brush.y+=rr(-6,6); 
    ctx.strokeRect(Math.floor(brush.x-size_w/2), Math.floor(brush.y-size_h/2),size_w,size_h); 
    // ctx.lineJoin = "round"
    ctx.lineWidth=str;
    // ctx.strokeStyle = 'rgb('+(.5+Math.sin(f*TAU+TAU*d1+t*.3)*.5)*255+','
    // +(.5+Math.sin(f*TAU+TAU*d2+t*.3)*.5)*255+','
    // +(.5+Math.sin(f*TAU+TAU*d3+t*.3)*.5)*255 +')';    
    // ctx.lineWidth = noise.perlin2(f*3.1,f*10)*15;//4-3*i/len;
    ctx.stroke(); 

	stats.end();
    requestAnimationFrame(draw);

}
function reset(){
    color='rgba('+rr(155,255)+','+rr(155,255)+','+rr(155,255)+','+rr(0,1)+')';
    brush.x=w/2;
    brush.y=h/2;
    size_w=rr(1,w/2);
    size_h=size_w;//rr(1,h);
    str=rr(0,55);
}
setup();
draw(1);