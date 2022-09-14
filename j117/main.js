function rr(min, max){
    return min+Math.random()*(max-min);
}



let canvas, ctx;
let w,h;
let side;
let brush={};
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
}
function draw(e) {
    requestAnimationFrame(draw);
    ctx.fillStyle='rgba(235,235,235,1)';
    ctx.strokeStyle='rgba(235,'+rr(155,255)+','+rr(155,255)+',1)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    brush.x+=rr(-1,1); 
    brush.y+=rr(-1,1); 
    ctx.strokeRect(Math.floor(brush.x-50), Math.floor(brush.y-50),100,100); 
    // ctx.lineJoin = "round"
    ctx.lineWidth=21;
    // ctx.strokeStyle = 'rgb('+(.5+Math.sin(f*TAU+TAU*d1+t*.3)*.5)*255+','
    // +(.5+Math.sin(f*TAU+TAU*d2+t*.3)*.5)*255+','
    // +(.5+Math.sin(f*TAU+TAU*d3+t*.3)*.5)*255 +')';    
    // ctx.lineWidth = noise.perlin2(f*3.1,f*10)*15;//4-3*i/len;
    ctx.stroke(); 

}
setup();
draw(1);