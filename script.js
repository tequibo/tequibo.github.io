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
app.renderer.backgroundColor = 0xfafafa;
window.addEventListener("resize", resize);
// let tink = new Tink(PIXI, app.renderer.view);
resize();

function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    app.renderer.resize(w, h);
}
// var bunny = new PIXI.Text('☎️');
// var bunny = new PIXI.Text('😍');
// bunny.x = app.renderer.width / 2;
// bunny.y = app.renderer.height / 2

const loader = PIXI.Loader.shared;
loader.add('first', 'images/battery_1f50b.png')
.add('second', 'images/clown-face_1f921.png')
.add('third', 'images/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png')
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
    b1.x=0;
    b2.x=100;
    b3.x=200;
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
        bunny.targetScale=Math.random();
        
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;
        bunny.scale.x=0;
        bunny.scale.y=0;
        bunny.rotation=Math.random()*6.28;
        bunny.x=itr.mouse.global.x;//Math.random()*w;
        bunny.y=itr.mouse.global.y;//Math.random()*h;
        bs.push(bunny);

        app.stage.addChild(bunny)
        // superFastSprites.addChild(bunny)
    };
    for (let index = 0; index < bs.length; index++) {
        const element = bs[index];
        element.x += (Math.random()-.5)*2*delta;
        element.y += (Math.random()-.5)*2*delta;
        element.scale.x+=(element.targetScale-element.scale.x)/5;
        element.scale.y+=(element.targetScale-element.scale.y)/2;
        // element.rotation+=.1;


    }
    //Move the cat 1 pixel 
    // bunny.x += (Math.random()-.5)*10*delta;
    // bunny.rotation+=.1;
}
function onClick1() {
    texture=texture1;
}
function onClick2() {
    texture=texture2;
}
function onClick3() {
    texture=texture3;
}



