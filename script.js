/**
 * NOTE:
 * Please read the README.md file provided in this template.
 */

// If you want to create OBJKT's with different seeds, you can access the creator and viewer wallet ids. This values will only be injected once the piece has been minted
// they will not work locally.
// if the user is not sync, the viewer comes in as false
const creator = new URLSearchParams(window.location.search).get('creator')
const viewer = new URLSearchParams(window.location.search).get('viewer')

// console.log('NFT created by', creator)
// console.log('NFT viewed by', viewer)

w = window.innerWidth;
h = window.innerHeight;
let app = new PIXI.Application({width: 900, height: 900, antialias: true,});

document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.backgroundColor = 0x000000;
window.addEventListener("resize", resize);
// let tink = new Tink(PIXI, app.renderer.view);
let bside
function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    if(w>600){
        b1.scale.x=b1.scale.y=b2.scale.x=b2.scale.y=b3.scale.x=b3.scale.y=
        b4.scale.x=b4.scale.y=b5.scale.x=b5.scale.y=b6.scale.x=b6.scale.y=.5;
    }
    else{
        b1.scale.x=b1.scale.y=b2.scale.x=b2.scale.y=b3.scale.x=b3.scale.y=
        b4.scale.x=b4.scale.y=b5.scale.x=b5.scale.y=b6.scale.x=b6.scale.y=.25;
    }
    
    bside=b1.width*1.2;

    b1.x=w/2+bside/2+bside*2;
    b2.x=w/2+bside/2+bside;
    b3.x=w/2+bside/2;
    b4.x=w/2-bside/2;
    b5.x=w/2-bside/2-bside;
    b6.x=w/2-bside/2-bside*2;

    b1.y=h-20;
    b2.y=h-20;
    b3.y=h-20;
    b4.y=h-20;
    b5.y=h-20;
    b6.y=h-20;
    app.renderer.resize(w, h);
    
}
// var bunny = new PIXI.Text('☎️');
// var bunny = new PIXI.Text('😍');
// bunny.x = app.renderer.width / 2;
// bunny.y = app.renderer.height / 2

const loader = PIXI.Loader.shared;
loader.add('t1', 'images/rolling-on-the-floor-laughing_1f923.png')
.add('t2', 'images/sparkles_2728.png')
.add('t3', 'images/heavy-black-heart_2764.png')
.add('t4', 'images/nauseated-face_1f922.png')
.add('t5', 'images/skull_1f480.png')
.add('t6', 'images/eggplant_1f346.png')
const sprites = {};

// The `load` method loads the queue of resources, and calls the passed in callback called once all
// resources have loaded.

loader.load((loader, resources) => {
    // resources is an object where the key is the name of the resource loaded and the value is the resource object.
    // They have a couple default properties:
    // - `url`: The URL that the resource was loaded from
    // - `error`: The error that happened when trying to load (if any)
    // - `data`: The raw data that was loaded
    // also may contain other properties based on the middleware that runs.
    texture1 = resources.t1.texture;
    texture2 = resources.t2.texture;
    texture3 = resources.t3.texture;
    texture4 = resources.t4.texture;
    texture5 = resources.t5.texture;
    texture6 = resources.t6.texture;
    b1 = new PIXI.Sprite(texture1);
    b2 = new PIXI.Sprite(texture2);
    b3 = new PIXI.Sprite(texture3);
    b4 = new PIXI.Sprite(texture4);
    b5 = new PIXI.Sprite(texture5);
    b6 = new PIXI.Sprite(texture6);
    app.stage.addChild(b1)
    app.stage.addChild(b2)
    app.stage.addChild(b3)
    app.stage.addChild(b4)
    app.stage.addChild(b5)
    app.stage.addChild(b6)
    b1.anchor.x = 0.5;
    b1.anchor.y = 1;
    b2.anchor.x = 0.5;
    b2.anchor.y = 1;
    b3.anchor.x = 0.5;
    b3.anchor.y = 1;
    b4.anchor.x = 0.5;
    b4.anchor.y = 1;
    b5.anchor.x = 0.5;
    b5.anchor.y = 1;
    b6.anchor.x = 0.5;
    b6.anchor.y = 1;
    
    b1.scale.x=b1.scale.y=b2.scale.x=b2.scale.y=b3.scale.x=b3.scale.y=
    b4.scale.x=b4.scale.y=b5.scale.x=b5.scale.y=b6.scale.x=b6.scale.y=.5;

    b1.interactive = true;
    b1.buttonMode = true;
    b1.on('pointerdown', onClick1);
    b2.interactive = true;
    b2.buttonMode = true;
    b2.on('pointerdown', onClick2);
    b3.interactive = true;
    b3.buttonMode = true;
    b3.on('pointerdown', onClick3);

    b4.interactive = true;
    b4.buttonMode = true;
    b4.on('pointerdown', onClick4);
    b5.interactive = true;
    b5.buttonMode = true;
    b5.on('pointerdown', onClick5);
    b6.interactive = true;
    b6.buttonMode = true;
    b6.on('pointerdown', onClick6);
    app.ticker.add(delta => gameLoop(delta));
    resize();

    // pointer = tink.makePointer();
});
const itr = app.renderer.plugins.interaction;
let down=false;
itr.on('pointerdown', ()=>{
    down=true;
});
itr.on('pointerup', ()=>{
    down=false;
    // console.log(bs.length);
});
bs = [];
let texture;
let superFastSprites = new PIXI.ParticleContainer();
let counter=0;
let freq=1;
function gameLoop(delta){
    // tink.update();
    counter++;
    if(down&&counter%freq==0){
        let bunny = new PIXI.Sprite(texture);
        // let bunny =new PIXI.Text('😍');
        bunny.rotation=Math.random()*6.283185;
        bunny.targetScale=Math.random()*.3+.1;
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;
        bunny.scale.x=0;
        bunny.scale.y=0;
        bunny.x=itr.eventData.data.global.x+(Math.random()-.5)*22;//Math.random()*w;
        bunny.y=itr.eventData.data.global.y+(Math.random()-.5)*22;//Math.random()*h;
        if(texture == texture1){
            bunny.rotate=true;
            bunny.direction=Math.random()>.5?-1:1;
            bunny.rotSpeed=(Math.random())*.1+.1;
            bunny.targetScale=.2+Math.random()*.2;
            bunny.f=Math.random()*.01+.001;

        }
        if(texture == texture2){
            bunny.sparkles=true;
            let a = Math.random()*6.283185;
            let d = Math.random()*55;
            bunny.x=itr.eventData.data.global.x+Math.cos(a)*d;//Math.random()*w;
            bunny.y=itr.eventData.data.global.y+Math.sin(a)*d;//Math.random()*h;
        }
        if(texture == texture3){
            bunny.beating=true;
            bunny.f=Math.random()*.01+.001;
            bunny.rotation=Math.random()*.5-.25;
            bunny.targetScale=.1+Math.random()*.1;
            bunny.x=itr.eventData.data.global.x+(Math.random()-.5)*15;//Math.random()*w;
            bunny.y=itr.eventData.data.global.y+(Math.random()-.5)*15;//Math.random()*h;            
        }
        if(texture == texture4){
            bunny.sick=true;
            bunny.f=Math.random()*.0015+.0006;
            
        }
        if(texture == texture5){
            bunny.skull=true;
            bunny.rotation=0;counter/10;
            bunny.targetScale=.2+Math.random()*.1;
            bunny.x=itr.eventData.data.global.x+(Math.random()-.5)*11;//Math.random()*w;
            bunny.y=itr.eventData.data.global.y+(Math.random()-.5)*11;//Math.random()*h;
            
        }
        if(texture == texture6){
            bunny.eggplant=true;
            bunny.rotation=counter/20;
            bunny.anchor.x = 0;
            bunny.anchor.y = 0;
            bunny.x=itr.eventData.data.global.x+(Math.random()-.5)*1;//Math.random()*w;
            bunny.y=itr.eventData.data.global.y+(Math.random()-.5)*1;//Math.random()*h;
            bunny.f=Math.random()*.0001+.016;
            
        }
        bs.push(bunny);

        app.stage.addChild(bunny)
        // superFastSprites.addChild(bunny)
    };
    for (let index = 0; index < bs.length; index++) {
        const element = bs[index];
           
        if(element.sparkles){
            element.x += (Math.random()-.5)*5*delta;
            element.y += (Math.random()-.5)*5*delta; 
            element.scale.x+=(element.targetScale*Math.random()-element.scale.x)/2;
            element.scale.y+=(element.targetScale*Math.random()-element.scale.y)/2;
        }    
        else if(element.rotate){
            // element.x += Math.cos(Date.now()*element.f*2+index)*2;
            // element.y += Math.sin(Date.now()*element.f*2+index)*2;
            element.x += (Math.random()-.5)*2*delta;
            element.y += (Math.random()-.5)*2*delta;
            element.rotation+=element.rotSpeed*delta*element.direction;
            element.scale.x+=(element.targetScale-element.scale.x)/5;
            element.scale.y+=(element.targetScale-element.scale.y)/2;
        }
        else if(element.beating){
            element.x += (Math.random()-.5)*delta*2;
            element.y += (Math.random()-.5)*delta*2; 
            var s = Math.abs(Math.sin(Date.now()*element.f+index))+.5;
            element.scale.x+=(element.targetScale*s-element.scale.x)/5;
            element.scale.y+=(element.targetScale*s-element.scale.y)/2;
        }
        else if(element.sick){
            element.rotation=Math.sin(Date.now()*element.f+index)*Math.PI/4;

            element.scale.x+=(element.targetScale-element.scale.x)/8;
            element.scale.y+=(element.targetScale-element.scale.y)/8;
        }
        else if(element.eggplant){
            // element.rotation+=.1;
            element.s=(1-Math.sin(Date.now()*0.003+index*.2))*.3+.3;
            element.scale.x+=(element.targetScale*element.s-element.scale.x)/3;
            element.scale.y+=(element.targetScale*element.s-element.scale.y)/3;
        }
        else if(element.skull){
            // element.rotation+=.1;
            element.x += (Math.random()-.5)*delta;
            element.y += (Math.random()-.5)*delta; 
            element.scale.x+=(element.targetScale-element.scale.x)/5;
            element.scale.y+=(element.targetScale-element.scale.y)/2;
        }
        else{
            element.scale.x+=(element.targetScale-element.scale.x)/5;
            element.scale.y+=(element.targetScale-element.scale.y)/2;
        }
    }
    //Move the cat 1 pixel 
    // bunny.x += (Math.random()-.5)*10*delta;
    // bunny.rotation+=.1;
}
function onClick1() {//laugh
    texture=texture1;
    freq=2;
    // b1.scale.y=Math.random()+.5;
}
function onClick2() {//sparks
    freq=2;
    texture=texture2;
    // b2.scale.x=Math.random()+.5;

}
function onClick3() {//heart
    texture=texture3;
    freq=2;
}
function onClick4() {//green
    texture=texture4;
    freq=2;
    // b1.scale.y=Math.random()+.5;
}
function onClick5() {//skull
    freq=4;
    texture=texture5;
    // b2.scale.x=Math.random()+.5;

}
function onClick6() {//eggplant
    texture=texture6;
    freq=1;
}



