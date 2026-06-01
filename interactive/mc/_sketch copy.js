let side;
let h;
let w;

let x_position = 0;
let y_position = 0;

let color_patterns=[
    ["#08415C","#CC2936","#EBBAB9","#388697","#B5FFE1"],
    ["#210124","#750D37","#B3DEC1","#DBF9F0","#F7F9F7"],
    ["#F7C59F","#2A324B","#767B91","#C7CCDB","#E1E5EE"]
]
class Brush{
    constructor(x,y){
        this.position=createVector(x,y);
        this.vel=createVector(0,0);
        this.acc=createVector(0,0);
    }
    update(){
        this.position.add(this.vel)
        this.vel.add(this.acc);
    }
}

function setup() {
    windowResized();
    createCanvas(windowWidth, windowHeight);   
   
}

function resetBrush(){
    x_position=fxrand()*w;

    ccolor=fxrand()>.5?color1:color2;
    step=map(fxrand(),0,1,h/12,h/260);
    y_position=-step;
    font_size=w/2*fxrand()
}
let size=110;
let a=0;
let colors;
direction=1;
let cc;
lines=0;
function draw() {
    // a=a+0.5;
    // image(pic,0,0,pic.width,pic.height)

    a=.1*fxrand()-.05;
    size=fxrand()*10+4;
    push();
    // rotate(a)
    translate(x_position+noise(y_position)*w/20,y_position);
    noStroke()
    fill(ccolor)
    textSize(font_size);
    if(lines<1){
        rectMode(CENTER);
        rect(0,0,font_size,step/2)
    }
    pop()
    y_position+=step;
    if(y_position>h && lines<1){
        resetBrush()
        lines++;
        push()
        translate(fxrand()*w,fxrand()*h)
        let s=fxrand()*w/2;
        noStroke()
        fill(ccolor)
        ellipse(0,0,s,s)
    }
    // blend(pic, 0, 0, pic.height, pic.width,0, 0, pic.height, pic.width,DARKEST)
    // blend(pic, 0, 0, pic.height, pic.width,0, 0, pic.height, pic.width,DIFFERENCE)
    // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
}



function windowResized() {
    const css = getComputedStyle(canvas.parentElement),
            marginWidth = round(float(css.marginLeft) + float(css.marginRight)),
            marginHeight = round(float(css.marginTop) + float(css.marginBottom));
            w = windowWidth - marginWidth, h = windowHeight - marginHeight;
    resizeCanvas(w, h, true);
    side=w>h?h:w;
}