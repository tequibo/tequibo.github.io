let side;
let h;
let w;

let x_position = 0;
let y_position = 0;
let circle_r;
let circle_attr=false;
let circle_dist_scale;
let color_patterns=[
    ["#08415C","#CC2936","#EBBAB9"],
    ["#210124","#750D37","#B3DEC1"],
    ["#D72638","#3F88C5","#FCF7F8"],
    ["#EF3E36","#17BEBB","#2E282A"],
    ["#262626","#FCF7F8","#8F0000"],
    ["#06102C","#00A6A6","#EFCA08"],
    ["#6B2D5C","#F0386B","#D2FDFF"],
    ["#FCD0A1","#B1B695","#53917E"],
    ["#363537","#0CCE6B","#DCED31"],
    ["#463F3A","#8A817C","#BCB8B1"],
    ["#C33149","#A8C256","#F3D9B1"],
    ["#333232","#D639DC","#28DEE0"],
    ["#845A6D","#3E1929","#F2EDEB"],
    ["#4F000B","#FF266E","#FFEE88"],
]
let words=["DEATH", "NEVER","NEW","SOFT","NO","YES","WHY","STOP","IMPORTANT",
"AGAIN","LOOP","PLAY","PLEASE","END","HERE","NOW","TIRED","GM","GN","RARE","STUPID","DAY","HOT",
"HELLO",".JPEG",".PNG",".GIF","SAVE AS","TEA","CATS","SMILE","LOVE","LIKE","SOLD","COFFEE",
"NOISE","LIFE","FOOD","MAKE","SENSE","TODAY","NIGHT", "TEARS","CORRECT","PERFECT","FUN","JOKE","LOL","ME","THANKS","BYE","SMOKE","HIGH"]
let eyes = ['˘','●','ȍ',' ﾟ','⍜','⌾','✿','๏','☉','❍','◕','─', '•','^','˘', '★','ʘ','▼','ಠ','°','*','＋','°','˘','✦','◉','◐','◑','♥','❛','ಡ','•ิ']
let mouths = ['‿', '‸','ヮ','ω','﹏','ε','､','ｪ','︵','╭╮','～','.', '.','─'];
let gl_dir;//p5.Vector.random2D()
class Brush{
    constructor(x,y, c, dev=PI/2, rot=PI*2,sc=1){
        this.scale=fxrand()*fxrand()*fxrand()*sc
        this.position=createVector(x,y);
        this.vel=createVector(6*w/600,0);
        // this.vel=p5.Vector.random2D()
        this.speed=fxrand()*fxrand()*w/600;
        this.dir=gl_dir.copy();//createVector(this.speed,0);
        // this.dir=p5.Vector.random2D()
        // this.dir.rotate(fxrand()*rot)
        this.dir.mult(this.speed)
        this.acc=createVector(0,0)
        this.color=color(c);
        this.life=0;
        this.lifetime=map(fxrand(),0,1,350,960)
        this.dev=(fxrand()-.5)*dev
        this.n_scale=map(fxrand(),0,1,.11,21)
        this.n_scale2=map(fxrand(),0,1,.001,1)
        this.o=y;
        this.rotating=fxrand()>.5?true:false;
        // this.sym="E"
        // console.log(word2)
        this.sym=word2[floor(fxrand()*word2.length)]
        this.ang=0
        this.rot_speed=fxrand()*TAU/8+.1;
    }
    update(){
        this.life++;
        if(this.life<this.lifetime){
        // this.vel=this.dir.copy()
        // for (var i = 0; i < brushes.length; ++i) {
        //     let b = brushes[i];
        //     // let dist=0;
        //     // if(!this.closest){
        //     // this.position.dist(b.position)<
        //     // }
        //     if(this.position.dist(b.position)<w/20){
        //     // this.s-=.1
        //         this.vel.add(p5.Vector.sub(this.position,b.position).mult(.005))
        //     }
        // }
        if(this.position.dist(circle_pos)<circle_r*.8){
            // this.s-=.1
            // if(circle_attr){
            //     this.vel.add(p5.Vector.add(this.position,circle_pos).mult(.007))
            // }
            // else{
                // }
                this.acc.add(p5.Vector.sub(this.position,circle_pos).mult(.01))
            }
        let xn=noise(this.life*.01)
        let yn=noise(this.position.y*.005)
        // this.scale*=1.051
        // this.vel.add(map(xn,0,1,-s,s),map(yn,0,1,-s,s));
        // let s = this.position.dist(circle_pos)/200
        // let s = (1+cos(this.position.x/w*PI))*.5
        // this.dev=this.o*.1;//this.position.dist(circle_pos)/w/22
        // this.n_scale=21.3;
        
        this.dir.rotate(map(noise(this.life*this.n_scale+this.o*.0001),0,1,-this.dev*gl_dev_scale,this.dev*gl_dev_scale))
        // this.dir.rotate(map(noise(this.position.x*this.n_scale,this.position.y*this.n_scale),0,1,0,PI*2))
        
        // this.dir=p5.Vector.fromAngle(map(noise(this.position.x*this.n_scale,this.position.y*this.n_scale),0,1,-PI*2,PI*2))
        // this.dir=createVector(noise(this.position.x*s),noise(this.position.y*s)-.5)
        // this.dir.normalize();
        // this.dir.mult(.025*this.noise_scale)

        this.acc.add(this.dir)
        this.acc.mult(.5)
        this.vel.add(this.acc)
        this.vel.mult(.98)
        this.position.add(this.vel)
        // this.vel=noise(frameCount)*3;
        push();
        translate(this.position.x, this.position.y);
        rotate(this.vel.heading());
        if(this.rotating){
            this.ang+=this.rot_speed;
            rotate(this.ang);
        }
        // this.color.setAlpha((1+cos(this.life/this.lifetime*PI*2+PI))*.5*255)
        // this.color.setAlpha(map(noise(frameCount*this.n_scale),0,1,0,255))
        fill(this.color)
        noStroke()
        
        // ellipse(map(noise(this.position.x),0,1,-25,25),map(noise(this.position.x),0,1,-25,25),map(noise(this.position.x),0,1,1,w*.5*this.scale),map(noise(this.position.x),0,1,1,w*1.5*this.scale));
        // rectMode(CENTER);
        let n=noise(frameCount*this.n_scale2);
        // rect(0,0,this.vel.mag()/2,w/10*(this.scale+n))
        textAlign(CENTER, CENTER);
        fill(this.color)
        textSize(w/2*(.01+this.scale*n))
        // text(this.sym,map(noise(this.position.x),0,1,-15*n,15*n),map(noise(this.position.x),0,1,-15*n,15*n))
        // text(this.sym,0,0)
        text(this.sym,map(noise(this.position.x),0,1,-brush_shift*n,brush_shift*n),map(noise(this.position.x),0,1,-brush_shift*n,brush_shift*n))
        pop()
        }
    }
}
let brushes=[]
let pattern;
let circle_pos;
let gl_dev_scale=1;
let patt_number;
let c_color;
let special=false
let bg_color;
let my_font;
let c1;
let c2;
let face_text;
let bt;
let face_o;
let face_b_noisescale;
let ch1_rot;
let ch2_rot;
let chr_r_offset;
let ch1_rot_an;
let ch2_rot_an;
let brush_shift;
function preload() {
  my_font = loadFont('arial.ttf');
}
function setup() {
    noiseSeed(fxrand());
    gl_dir=createVector(fxrand()*2-1,fxrand()*2-1);
    createCanvas(windowWidth, windowHeight);  
    windowResized();
    brush_shift=20*w/500*fxrand();
    word2=words[floor(words.length*fxrand())]
    word3=words[floor(words.length*fxrand())]
    word1=words[floor(words.length*fxrand())] 
    let e = eyes[floor(fxrand()*eyes.length)];
    let m;
    if(fxrand()>.5){
        m = mouths[floor(fxrand()*mouths.length)];
    }
    else{
        m =" "+mouths[floor(fxrand()*mouths.length)]+" ";
    }
    face_text = e+''+m+''+e;
    if(fxrand()>.1){
        special=true;
    }
    bt=fxrand()*w*.003
    gl_dev_scale=fxrand()+.5
    circle_dist_scale=1.1+fxrand()*3
    circle_attr=fxrand()>.5?true:false;
    c_color=fxrand()>.5?"#000":"#FFF";
    patt_number=floor(color_patterns.length*fxrand());
    pattern = color_patterns[patt_number];
    let bgr = floor(fxrand()*pattern.length);
    circle_r=fxrand()*w/3+w/5
    face_b_noisescale=map(fxrand(),0,1,0.005,15)
    ch1_rot = floor(fxrand()*4)
    ch2_rot=floor(fxrand()*4)
    ch1_rot_an = fxrand()*TAU
    ch2_rot_an = fxrand()*TAU
    chr_r_offset=fxrand()*TAU
    // background(pattern[bgr])
    bg_color=color(pattern[bgr])
    pattern.splice(bgr,1)
    let fr=floor(fxrand()*pattern.length);
    c1=color(pattern[fr])
    pattern.splice(fr,1)
    fr=floor(fxrand()*pattern.length);
    c2=color(pattern[fr])
    pattern.splice(fr,1)
    
    fill(bg_color)
    noStroke()
    rect(0,0,w,h)
    circle_pos = createVector(map(fxrand(),0,1,w*.25, w-w*.25),map(fxrand(),0,1,h*.25, h-h*.25))
    face_o = createVector(1,0).rotate(fxrand()*PI*2).mult(circle_r/8)
    let am=13+23*fxrand();
    
    let p1={x:map(fxrand(),0,1,w*.25, w-w*.25),y:map(fxrand(),0,1,w*.25, w-w*.25)};
    for(var i=0;i<am;i++){
        let a =i/am*PI*2
        // let b = new Brush(p1.x+cos(a)*circle_r/3, p1.y+sin(a)*circle_r/3,fxrand()>.5?c1:c2,PI/2,0,.23)
        let b = new Brush(0, i/am*h,fxrand()>.5?c1:c2,PI/2,0,.33)
        b.o=i;
        // let b = new Brush(fxrand()*w, fxrand()*h,pattern[floor(fxrand()*pattern.length)],i/am*PI/4,PI*2)
        // let b = new Brush(0, i/am*h,pattern[0],i/am*PI/4,0)
        brushes.push(b);
    }
    // for(var i=0;i<fxrand()*2+1;i++){
    //     let b = new Brush(0, fxrand()*h,pattern[floor(fxrand()*pattern.length)],PI/2,0,5)
    //     brushes.push(b);
    // }
               

    
window.$fxhashFeatures = {
  "special": special, 
}
   
}
let step=0;
let step_ex=false;
let word1;
let word2;
let word3;
function draw() {
    for (var i = 0; i < brushes.length; ++i) {
        let b = brushes[i];
        b.update()
    }
    if(frameCount%60==0){
        step++;
        step_ex=false;
    }
    if(step_ex==false){
        step_ex=true;
        switch(step){
            case 1:
            push()
            translate(w*.96, h);
            // translate(w*fxrand(), h*fxrand());
            fill("#fff")
            textSize(11*w*.005+fxrand()*w*.005*22)
            textAlign(RIGHT, BOTTOM);
            // blendMode(DIFFERENCE)
            text(word3,0,0)
            // text(" "+patt_number,0,0)
            pop();
            break;
            case 2:
                
            break;
            case 3:
                push()
            translate(0, h*.01);
            // translate(w*fxrand(), h*fxrand());
            fill("#fff")
            // pattern[floor(fxrand()*pattern.length)]
            textSize(11*w*.005);//+fxrand()*w*.005*22)
            textAlign(LEFT, TOP);
            // blendMode(DIFFERENCE)
            // text(word1,0,0)
            // text(" "+patt_number,0,0)
            pop();
            break;
        }
    }
    drawunderface()
    // blend(pic, 0, 0, pic.height, pic.width,0, 0, pic.height, pic.width,DIFFERENCE)
    // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
}
let f=0;
let face_made=false
function drawunderface(){
    let af=52;
    if(frameCount>30 && frameCount<31+af){

    let tm=createVector(1,0);
    let sp=createVector(1,0)
    for (let i = 0; i < 20; i++) {
        let n = noise(cos(f/af*TAU)*face_b_noisescale+face_b_noisescale,sin(f/af*TAU)*face_b_noisescale+face_b_noisescale)
        tm=createVector(1,0).rotate(chr_r_offset*TAU+f/af*TAU).mult(fxrand()*circle_r*n)
        sp=circle_pos.copy()
        sp.add(tm)                  
        // sp.y=circle_pos.y+tm.y;//map(fxrand(),0,1,-circle_r,circle_r)                  
        let d=sp.dist(circle_pos)
        // if(d<circle_r){
            push();
            translate(sp.x, sp.y);
            // rect(0,0,1,12*(d/circle_r))
            // blendMode(DIFFERENCE)
            textAlign(CENTER, CENTER);
            textSize(2*w*.015*(1-d/circle_r))
            
            if(noise(sp.x*1.1,sp.y+1)>d/circle_r*.3){
                if(d/circle_r>.3 ){
                    fill(c1)
                    // ellipse(0,0,12,2)
                    switch (ch1_rot) {
                        case 0:
                        rotate(f/af*TAU-fxrand()*TAU)
                            
                        break;
                        case 1:
                            rotate(chr_r_offset*TAU+f/af*TAU-TAU/4)

                        break;
                        case 2:
                            rotate(chr_r_offset*TAU+f/af*TAU-TAU/2)

                        break;
                        case 3:
                            rotate(ch1_rot_an+f/af*TAU-TAU/2)

                        break;
                    }
                text(word1,0,0)
                
            }
            else{
                if(noise(sp.x*1.1,sp.y+1)>.2){
                fill(c2)
                // ellipse(0,0,2,12)
                // switch (ch2_rot) {
                //     case 0:
                //     rotate(f/af*TAU-fxrand()*TAU)
                        
                //     break;
                //     case 1:
                //         rotate(chr_r_offset*TAU+f/af*TAU-TAU/2)

                //     break;
                //     case 2:
                //         // rotate(chr_r_offset*TAU+f/af*TAU-TAU/2)
                //         rotate(f/af*TAU-fxrand()*TAU)

                //         // rotate(chr_r_offset*TAU+f/af*TAU-TAU/2)

                //     break;
                //     case 3:
                //         rotate(ch2_rot_an+f/af*TAU-TAU/2)

                //     break;
                // }
                        // rotate(f/af*TAU-TAU/2)
                        
                // textSize(2*w*.015*(1-d/circle_r))
                textSize(2.5*w*.015*fxrand())

            text(word2,0,0)
            }
        }
        }
        pop()
    }
    
    }
    if(frameCount>30+af && !face_made){
        face_made=true;
        push();
        translate(circle_pos.x, circle_pos.y);
        translate(face_o)
        // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
        textFont(my_font);
        // fill(pattern[floor(fxrand()*pattern.length)])
        fill(bg_color)
        textSize(bt+55*w*.001)
        let str=""
        for (let i = 0; i < eyes.length; i++) {
            str=str+"|"+eyes[i]
        }
        textSize(15)
        // text(str,0,0)
        textSize(bt+55*w*.001)
        // textSize(20)
            // blendMode(DIFFERENCE)
    
        textAlign(CENTER, CENTER);
        text(face_text,0,0)
        
        pop()
        }
    f++
    
}


function windowResized() {
    const css = getComputedStyle(canvas.parentElement),
            marginWidth = round(float(css.marginLeft) + float(css.marginRight)),
            marginHeight = round(float(css.marginTop) + float(css.marginBottom));
            w = windowWidth - marginWidth, h = windowHeight - marginHeight;
    resizeCanvas(w, h, true);
    side=w>h?h:w;
}