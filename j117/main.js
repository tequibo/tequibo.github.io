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
    brush.x=w/2;
    brush.y=h/2;
    size=rr(10,200);
    str=rr(0,30);
}
function draw(e) {
    
	stats.begin();

	ctx.fillStyle='rgba(235,235,235,1)';
    ctx.strokeStyle='rgba(235,'+rr(155,255)+','+rr(155,255)+',1)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    brush.x+=rr(-5,5); 
    brush.y+=rr(-5,5); 
    ctx.strokeRect(Math.floor(brush.x-size/2), Math.floor(brush.y-size/2),size,size); 
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
setup();
draw(1);