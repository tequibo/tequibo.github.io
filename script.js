/**
 * NOTE:
 * Please read the README.md file provided in this template.
 */

// If you want to create OBJKT's with different seeds, you can access the creator and viewer wallet ids. This values will only be injected once the piece has been minted
// they will not work locally.
// if the user is not sync, the viewer comes in as false
const creator = new URLSearchParams(window.location.search).get('creator')
const viewer = new URLSearchParams(window.location.search).get('viewer')

console.log('NFT created by', creator)
console.log('NFT viewed by', viewer)
function setup(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    // ctx.fillStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
    // ctx.fillStyle='rgb(155,155,155)';
    resize();
    ctx.textAlign = "center";
    ctx.font = '18px monospace';
    ctx.fillText('❤️', w/2, h/2);
    window.addEventListener("resize", resize);
}
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
    };
}
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
class Particle{
    constructor(){

    }
}
let mousePos;  
let mousePosPrev;
let mousePosMM
let mouseIsPressed=false;
let emojis = "qmc20tqx9,30";//☎️😀😁😉😍😛🤨😬😎🤓";
let smth;
function draw(e) {
    // var dt = e-time_old;
    // time_old = e;
    requestAnimationFrame(draw);
    mousePosPrev = mousePos;
    mousePos = mousePosMM;
    if (mouseIsPressed) {
        ctx.save();
        ctx.translate(mousePos.x, mousePos.y);
        ctx.rotate(Math.random()*6.28);
        ctx.textAlign = "center";
        ctx.font = 55*Math.random()+'px monospace';
        var emoji = emojis.charAt(Math.floor(Math.random()*emojis.length));
        if(smth>.5){
            ctx.fillText("☎️",0, 0);
        }
        else{
            ctx.fillText("🔋",0, 0);

        }
        ctx.restore();
    //  console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);

    }
}
canvas.onmousemove = function(e){
    // mousePosPrev = mousePos;
    mousePosMM = getMousePos(canvas, e);
    if(mouseIsPressed){
      
    }
    
}
canvas.onmousedown = function(e){
    mouseIsPressed=true;
    show_tip=false;
    smth = Math.random();
}
canvas.onmouseup = function(e){
    mouseIsPressed = false;
}
canvas.touchstart  = function(e){
    mouseIsPressed=true;
    smth = Math.random();
}
canvas.touchend = function(e){
    mouseIsPressed=true;
}
setup();
draw(1);