let w,h=0;
let ladies = [];
let fishes = [];
let building_parts = [];
let roof_parts = [];
const TAU = 6.283185307179586;

const bg_count = 5;//количество картинок в папке
const ladies_count = 12;
const fish_count = 5;
const pistols_count = 10;
function rr(min, max){
    return min+fxrand()*(max-min);
}
function loadPics(folder_name, count, ext='png'){
    let arr=[];
    for (let i = 0; i < count; i++) {
        let img = loadImage("pics/"+folder_name+"/"+nf(i+1,3)+"."+ext);
        arr[i]=img;
    }
    return arr;
}

function preload(){
    // ladies=loadPics("ladies", ladies_count);
    // sch=loadPics("schematics", 5,'jpg');
    building_parts=loadPics("building_parts", 29,'png');
    roof_parts=loadPics("roofs", 6,'png');
}
function makeNoisy(){
    let pink = color(255, 102, 204);
    let img = createImage(w, h);
    img.loadPixels();
    let d = pixelDensity();
    let am = 4 * (img.width * d) * (img.height  * d);
    let x=0,y=0
    for (let i = 0; i < am; i += 4) {
    let v = map(fxrand(),0,1,20,70);
    img.pixels[i] = v;
    img.pixels[i + 1] = v;
    img.pixels[i + 2] = v;
    img.pixels[i + 3] = 70;
    x++
    if(x>img.width){
        y++
    }
    }
    img.updatePixels();
    return img;
}

function shift_c(s_img,v=0){
    let pink = color(255, 102, 204);
    let img = createImage(s_img.width,s_img.height);
    img.copy(s_img,0,0,img.width,img.height,0,0,img.width,img.height)
    img.loadPixels();
    let d = pixelDensity();
    let am = 4 * (img.width * d) * (img.height  * d);
    // let v = 10;//fxrand()*25;
    let r=fxrand()>.9?true:false
    let a = map(fxrand(),0,1,200,250,)
    for (let i = 0; i < am; i += 4) {
        //Gray = (Red * 0.2126 + Green * 0.7152 + Blue * 0.0722)
        let g = img.pixels[i] * 0.2126+img.pixels[i + 1] * 0.7152+img.pixels[i + 2] * 0.0722;
    img.pixels[i] =g-v;
    img.pixels[i + 1] =g-v;
    img.pixels[i + 2] =g-v;
    if(img.pixels[i + 3]>10){
    img.pixels[i + 3] = a;
    }
        // if(r){
    // img.pixels[i]+=200 ;
    // img.pixels[i + 1] +=100;
    // img.pixels[i + 2] +=100;
        }
    // }
    img.updatePixels();
    return img;
}
function makeNoisyCirc(){
    let pink = color(255, 102, 204);
    let img = createImage(w, h);
    img.loadPixels();
    let d = pixelDensity();
    let am = 4 * (img.width * d) * (img.height  * d);
    for (let i = 0; i < am; i += 4) {
    let v = 21+fxrand()*122;

    img.pixels[i] = v;
    img.pixels[i + 1] = v;
    img.pixels[i + 2] = v;
    img.pixels[i + 3] = 30;
    }
    img.updatePixels();
    return img;
}
function choosePic(array, offset=0){
    let img_src = array[floor(fxrand()*ladies.length)];
    let img = createImage(img_src.width, img_src.height)
   
    img.copy(img_src,0, 0, img.width, img.height,0, 0, img.width, img.height)
    img.wobble=fxrand()*.1
    let dimension = 4*img.width * img.height;
    img.loadPixels();
    let h1=fxrand()
    for (let i = 0; i < dimension; i += 4) { 
        img.pixels[i] += sin(h1*TAU)*65;
        img.pixels[i + 1] += sin(h1*TAU+TAU*.33)*65;
        img.pixels[i + 2] += sin(h1*TAU*.66)*65;
        // img.pixels[i] *=offset;
        // img.pixels[i + 1]*=offset;
        // img.pixels[i + 2]*=offset;
      
    }
    img.updatePixels();
    
    return img;
}

let c;
let random_lady;
function getBuildingPart(){
    return building_parts[floor(fxrand()*building_parts.length)]
}
function getRoofPart(){
    return roof_parts[floor(fxrand()*roof_parts.length)]
}

function makeBuilding(y){
     //   building   
     let x_cent=map(fxrand(),0,1,w*.1,w*.9)
     let b_w,x=0
    //  let y = h*.1+fxrand()*h*.75;
     b_w=w*.1+fxrand()*w*.35;
     b_levels=floor(5+fxrand()*5);
     for (let i = 0; i < b_levels; i++) {
        //  if(y<h*.7){
            //  break;
        //  }
         
         x = x_cent-b_w/2-fxrand()*b_w*.1;
         let c_w=0;
         let level_h=side*.03+fxrand()*side*.09;
         let s = .3;//1+fxrand()*.5
         let v=map(fxrand(),0,1,-30,30)
         y-=level_h;

         while(c_w<b_w){
            let inverse=false;
            // if(fxrand()>.5){
            //     inverse=true
            // }
             let img=getBuildingPart()
             if(i==b_levels-1){
                 img=getRoofPart()
             }
             push()

             translate(x,y)
             s=level_h/img.height;
             if(c_w+img.width*s>b_w){
                 translate(-(img.width*s-(b_w-c_w)),0)
                }
                
                img=shift_c(img,v)
                if(inverse & i<b_levels-1){
                 blend(img, 0, 0, img.width, img.height,0, 0, floor(img.width*s), floor(img.height*s),EXCLUSION)
                }
                else{
                blend(img, 0, 0, img.width, img.height,0, 0, floor(img.width*s), floor(img.height*s),MULTIPLY)
             }
             pop()
             c_w+=img.width*s;
             x+=img.width*s*.9;
         }
        //  filter(GRAY)
     // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
 
     }
     //          building         end
}
let creatures_pos=[]
let sun_colors=["#4B004C","#990000","#6A8A12","#001F33","#CEE321","#7CE6E5","#7E9D20"]
let nose_width;
let body_width;
let leg_width;
let nose_step;
let body_step;
let leg_step;
let head_size; 
let eye_w;
let eye_h
let iris_size;
let rain_d;
let sunny=false;
let rainy=false;
function setup() {
    noiseSeed(fxrand())
    createCanvas(windowWidth, windowHeight);    
    windowResized()
    background('white');
    while(!sunny || !rainy){
        rainy=(fxrand()>.7)?true:false;
        sunny=(fxrand()>.5)?true:false;
    }
    body_width=map(fxrand()*fxrand()*fxrand(),0,1,side*.013,side*.04);fxrand()*5+5;
    body_step=map(fxrand()*fxrand(),0,1,side*.008,side*.02);
    head_size=map(fxrand()*fxrand()*fxrand(),0,1,side*.1, side*.15);
    nose_width=map(fxrand()*fxrand(),0,1,side*.007,side*.05);
    nose_step=map(fxrand(),0,1,side*.0015,side*.0035);
    leg_width=map(fxrand()*fxrand(),0,1,side*.003,side*.015);
    leg_step=map(fxrand(),0,1,side*.0015,side*.01);
    eye_w=map(fxrand(),0,1,head_size*.75,head_size*.8)
    eye_h=map(fxrand(),0,1,head_size*.2,head_size*.7)
    iris_size=map(fxrand(),0,1,eye_h*.9,eye_h*1);
    let layers_am=floor(rr(6,9));
    let wide=map(fxrand(),0,1,w*.5,w)
    let sc=color(sun_colors[floor(fxrand()*sun_colors.length)])
    // sc=color("#7E9D20")
    let smol=true
    rainy=true
    rain_d=createVector(0,map(fxrand(),0,1,side*.01,side*.06) )
        rain_d.rotate(map(fxrand(),0,1,-TAU/12,TAU/12))
    // if(fxrand()>.5){
    //     smol=true
    // }
    for (var i = 0; i < layers_am; i++) {
        let cr_x = w/2+(fxrand()-.5)*wide
        let cr_y= h*.5-h*.2+ h*.5*(i/layers_am);//map(fxrand(),0,1,h*.25,h*.75)
        if(i==floor(layers_am/2) && sunny){
            let s = map(fxrand(),0,1,side*.1,side*.3)
            let x_s=map(fxrand(),0,1,side*.1,w-side*.1)
            let y_s=fxrand()*fxrand()*h*.5;
            push()
            translate(x_s,y_s)
            noStroke();
            fill(sc)
            // fill("#38267C")
            ellipse(0,0,s,s)
            // let sun_c=color(sun_colors[floor(fxrand()*sun_colors.length)]);
            // let sun_c=color("#000000");
            // sun_c.setAlpha(25);
            // let sun_layers=33;
            // let sun_points=21
            // for (let i = 0; i < sun_layers; i++) {
            //     beginShape()
            //     for (let j = 0; j < sun_points; j++) {
                    
            //         f=i/sun_layers;
            //         fill(0,255,255,25)
            //         fill(sun_c)
            //         let a = j/sun_points*TAU+i/sun_layers*TAU;
            //         vertex(cos(a)*map(fxrand(),0,1,s,s+f*s*.8) ,sin(a)*map(fxrand(),0,1,s,s+f*s*.8))
            //     }
            //     endShape()
            // }
            pop()
        }
        push()
        noStroke()
        fill(238,234,232,22)
        rect(0,0,w,h)
        pop()
        // if(i>layers_am*.3){
            if(fxrand()>.3){
            makeCreature(cr_x+map(fxrand(),0,1,-w*.03,w*.03), cr_y+map(fxrand(),0,1,0,h*.03))
            }
            if(fxrand()>.5){
            makeBuilding(h*.5+ h*.5*(i/layers_am))
        }

        if(rainy && fxrand()>.8){
        

        beginShape(LINES);
        let la=map(fxrand()*fxrand()*fxrand(),0,1,1,1)
        let rw = map(fxrand(),0,1,side*.01,side*.2)
        if(smol){
            la=map(fxrand()*fxrand()*fxrand(),0,1,5,22)
            rw = map(fxrand(),0,1,side*.001,side*.003)
        }
        let l=floor(map(fxrand(),0,1,20,100))
        
        for (let i = 0; i < la; i++) {
            strokeWeight(rw)
            if(fxrand()>.6){
                rc=sc
            }
            else{
                rc=color("#000000")
                
            }
            strokeCap(SQUARE)
            let rain_p=createVector(map(fxrand(),0,1,-w,w*2),map(fxrand(),0,1,-h*.1,0))
            for (let j = 0; j < l; j++) {
                sc.setAlpha(map(fxrand(),0,1,50,255))
                stroke(rc)
                if(j%2==0){
                    vertex(rain_p.x,rain_p.y)
                }
                rain_p.add(rain_d)
                if(j%2==0){
                    vertex(rain_p.x,rain_p.y)
                }
            }
        }
        endShape()
    }

    ///// hair ~~~~~~~~~~~~~~~~~~~~~~~~~~
   
    if(fxrand()>.7){
        let offset=fxrand()*.1

    let brush_pos=createVector(fxrand()*w,(fxrand()*fxrand()*fxrand()*fxrand())*h)
    // let brush_pos=createVector(fxrand()*w,h)
    let brush_pos_p=brush_pos.copy()
    let step=map(fxrand()*fxrand(),0,1,side*.003,side*.015)
    let dir = createVector(0,step*-1)
    dir.rotate(fxrand()*TAU)
    let line_l=map(fxrand(),0,1,20,80);
    stroke(30,200)
    let ang=map(fxrand()*fxrand(),0,1,TAU/66,TAU/12)
    for (let j = 0; j < line_l; j++) {      
        strokeWeight(.5)  
        // dir.rotate((fxrand()-.5)*.2)
        dir.rotate(map(noise(offset*12,offset*12+j*.05),0,1,-ang,ang))
        brush_pos.add(dir)
        line(brush_pos.x, brush_pos.y, brush_pos_p.x, brush_pos_p.y);
        brush_pos_p=brush_pos.copy()         
        }
    }

    filter(BLUR, 1);
    
    }
    // let pos = createVector(w/2, h/2)
    // let dir = createVector(0, -1)

    // let t = new Tree(pos, dir, h*.1)
    let noise_img= makeNoisy()
    // console.log(noise_img)
    blend(noise_img, 0, 0, noise_img.width, noise_img.height,0, 0, noise_img.width, noise_img.height,BLEND)
    if(isFxpreview){
        fxpreview();
    }
    // image(noise_img,0,0);
}

function makeCreature(x,y){
    // BODY
    noFill();
    stroke(20)
    let offset = fxrand()
    strokeCap(SQUARE);
    let brush_pos=createVector(x,y)
    let brush_pos_p=brush_pos.copy()
    let dir = createVector(0,body_step*-1)
    let line_l=25;
    for (let j = 0; j < line_l; j++) {      
        strokeWeight(body_width*(2-j/line_l))  
        // dir.rotate((fxrand()-.5)*.2)
        dir.rotate(map(noise(offset*12,offset*12+j*.02),0,1,-TAU/166,TAU/166))
        brush_pos.add(dir)
        line(brush_pos.x, brush_pos.y, brush_pos_p.x, brush_pos_p.y);
        brush_pos_p=brush_pos.copy()         
         
    }

    //////////     HEAD
    let s = 40;
    fill(20)
    noStroke()
    ellipse(brush_pos.x, brush_pos.y,head_size,head_size)
    let eye_pos = brush_pos.copy()
    
    //           nose
    strokeCap(ROUND);
    stroke(20)
    // let nose_w=map(fxrand()*fxrand()*fxrand(),0,1,14,40);
    
    let sign=1;
    dir = createVector(-1,0)
    if(fxrand()>.5){
        sign=-1;
        dir = createVector(1,0)
    }
    dir.rotate(fxrand()*TAU/6-TAU/12-TAU/12*sign)
    let dir2=dir.copy()
    let dir_n = dir.copy()
    dir_n.mult(head_size/2-nose_step)
    dir.mult(nose_step)
    // brush_pos=createVector(brush_pos.x+dir.x*(head_size/3-nose_step),brush_pos.y+dir.y*(head_size/3-nose_step))
    brush_pos=createVector(brush_pos.x+dir_n.x,brush_pos.y+dir_n.y)
    brush_pos_p=brush_pos.copy()
    for (let j = 0; j < line_l; j++) {      
        strokeWeight(nose_width*(1-j/line_l))  
        dir.rotate(map(noise(121,112+j*.03),0,1,-TAU/116*sign,TAU/166*sign))
        brush_pos.add(dir)
        line(brush_pos.x, brush_pos.y, brush_pos_p.x, brush_pos_p.y);
        brush_pos_p=brush_pos.copy()         
    }
    noStroke()
    
    push()
    ////       eye
    translate(eye_pos.x,eye_pos.y)
    rotate(-dir2.angleBetween(createVector(0,-1))-TAU/4+TAU/12*sign)

    fill(255)
    ellipse(0, 0,eye_w,eye_h)
    fill(20)
    let a = fxrand()*TAU;
    let dist=fxrand()
    ellipse(0+cos(a)*(eye_w/2-iris_size/3)*dist, 0+sin(a)*(eye_h/2-iris_size/3)*dist,iris_size,iris_size)
    pop()

    ///// LLLLLLLLLLLLLL    EEEEEEE    GGGGG       SSSSS
    step=2
    stroke(20)
    noFill()
    strokeCap(ROUND);
    
    stroke_w=map(fxrand(),0,1,side*.0015,side*.002)// fxrand()*2+2
    brush_pos=createVector(x-body_width+leg_width,y)
    brush_pos_p=brush_pos.copy()
    dir = createVector(0,leg_step*1)
    for (let j = 0; j < line_l; j++) {      
        strokeWeight(leg_width*(1-j/line_l))  
        dir.rotate(map(noise(offset*12,offset*12+j*.02),0,1,-TAU/166,TAU/166))
        brush_pos.add(dir)
        line(brush_pos.x, brush_pos.y, brush_pos_p.x, brush_pos_p.y);
        brush_pos_p=brush_pos.copy()         
    }


    brush_pos=createVector(x+body_width-leg_width,y)
    brush_pos_p=brush_pos.copy()
    dir = createVector(0,leg_step*1)
    for (let j = 0; j < line_l; j++) {      
        strokeWeight(leg_width*(1-j/line_l))  
        dir.rotate(map(noise(offset*2,offset*12+j*.02),0,1,-TAU/166,TAU/166))
        brush_pos.add(dir)
        line(brush_pos.x, brush_pos.y, brush_pos_p.x, brush_pos_p.y);
        brush_pos_p=brush_pos.copy()         
    }


    let cir_s=fxrand()*fxrand()*fxrand()*side*.05+side*.05
    dir.normalize();

    dir.mult(cir_s)

    let ci_am=115+fxrand()*5300;
    let st = 0;
    
    let r_am=fxrand()*551;
    


}
let updown=rr(0.01,0.05)
function makeLayer(amount){   
    for (let i = 0; i < amount; i++) {
        img=ladies[floor(fxrand()*ladies.length)]
        img=sch[floor(fxrand()*sch.length)]
        img=sch[1]
        // img=choosePic(ladies)
        // push();
        // scale(fxrand());
        let s = 1;.5+fxrand()*.5
        
        // translate(-img.width/2,-img.height/2)
        // rotate(fxrand()*TAU/16-TAU/32)
        // translate(img.width*s+fxrand()*(w-img.width*s),img.height*s+fxrand()*(h-img.height*s))
        // translate(fxrand()*(w)-img.width/2,fxrand()*(h)-img.height/2)
        // translate(fxrand()*(w-img.width*s),fxrand()*(h-img.height*s))
        // image(img,0,0,img.width*s,img.height*s);
        blend(img, 0, 0, img.width, img.height,0, 0, img.width*s, img.height*s,DARKEST)
    // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
        // pop();
    }
}
let timescale1=.9+fxrand()*.2
let timescale2=.75+(fxrand()*fxrand())
function draw() {
    
}
function windowResized() {
    const css = getComputedStyle(canvas.parentElement),
            marginWidth = round(float(css.marginLeft) + float(css.marginRight)),
            marginHeight = round(float(css.marginTop) + float(css.marginBottom));
            w = windowWidth - marginWidth, h = windowHeight - marginHeight;
    resizeCanvas(w, h, true);
    side=w>h?h:w;
}