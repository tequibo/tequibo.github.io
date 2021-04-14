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

w = window.innerWidth;
h = window.innerHeight;
let app = new PIXI.Application({width: w, height: h, antialias: true,});

document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.backgroundColor = 0x000000;
window.addEventListener("resize", resize);
// let tink = new Tink(PIXI, app.renderer.view);

function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    b1.x=w/2+100;
    b2.x=w/2-100;
    b3.x=w/2;
    app.renderer.resize(w, h);
}
// var bunny = new PIXI.Text('☎️');
// var bunny = new PIXI.Text('😍');
// bunny.x = app.renderer.width / 2;
// bunny.y = app.renderer.height / 2

const loader = PIXI.Loader.shared;
loader.add('first', 'images/rolling-on-the-floor-laughing_1f923.png')
.add('second', 'images/sparkles_2728.png')
.add('third', 'images/heavy-black-heart_2764.png')
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
    texture1 = resources.first.texture;
    texture2 = resources.second.texture;
    texture3 = resources.third.texture;
    b1 = new PIXI.Sprite(texture1);
    b2 = new PIXI.Sprite(texture2);
    b3 = new PIXI.Sprite(texture3);
    app.stage.addChild(b1)
    app.stage.addChild(b2)
    app.stage.addChild(b3)
    b1.anchor.x = 0.5;
    b1.anchor.y = 1;
    b2.anchor.x = 0.5;
    b2.anchor.y = 1;
    b3.anchor.x = 0.5;
    b3.anchor.y = 1;
    b1.x=w/2+100;
    b2.x=w/2-100;
    b3.x=w/2;
    b1.y=h-20;
    b2.y=h-20;
    b3.y=h-20;
    b1.scale.x=b1.scale.y=b2.scale.x=b2.scale.y=b3.scale.x=b3.scale.y=.5;
    b1.interactive = true;
    b1.buttonMode = true;
    b1.on('pointerdown', onClick1);
    b2.interactive = true;
    b2.buttonMode = true;
    b2.on('pointerdown', onClick2);
    b3.interactive = true;
    b3.buttonMode = true;
    b3.on('pointerdown', onClick3);
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
    console.log(bs.length);
});
bs = [];
let texture;
let superFastSprites = new PIXI.ParticleContainer();
function gameLoop(delta){
    // tink.update();
    if(down){
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
            bunny.rotSpeed=(Math.random())*.2+.1;
            bunny.targetScale=.2+Math.random()*.3;

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

            
        }
        
        bs.push(bunny);

        app.stage.addChild(bunny)
        // superFastSprites.addChild(bunny)
    };
    for (let index = 0; index < bs.length; index++) {
        const element = bs[index];
        element.x += (Math.random()-.5)*2*delta;
        element.y += (Math.random()-.5)*2*delta;    
        if(element.sparkles){
            element.scale.x+=(element.targetScale*Math.random()-element.scale.x)/2;
            element.scale.y+=(element.targetScale*Math.random()-element.scale.y)/2;
        }    
        if(element.rotate){
            element.rotation+=element.rotSpeed*delta;
            element.scale.x+=(element.targetScale-element.scale.x)/5;
            element.scale.y+=(element.targetScale-element.scale.y)/2;
        }
        if(element.beating){
            var s = Math.abs(Math.sin(Date.now()*element.f+index))+.5;
            element.scale.x+=(element.targetScale*s-element.scale.x)/5;
            element.scale.y+=(element.targetScale*s-element.scale.y)/2;
        }
    }
    //Move the cat 1 pixel 
    // bunny.x += (Math.random()-.5)*10*delta;
    // bunny.rotation+=.1;
}
function onClick1() {
    texture=texture1;
    // b1.scale.y=Math.random()+.5;
}
function onClick2() {
    texture=texture2;
    // b2.scale.x=Math.random()+.5;

}
function onClick3() {
    texture=texture3;
}



