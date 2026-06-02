import * as THREE from 'three';
import { gsap } from 'gsap';
import font_glob from './Space_Mono_Regular.json';
// import font_glob from './Kawashiro Gothic_Regular.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { createSeededRandom, generateRandomAddress, seededRandom, stringToHash, map } from './utils.js';
import { fetchObjktHoldersFromTzkt } from './fetchDataObjkt';
import Stats from 'three/examples/jsm/libs/stats.module'
import { PerlinNoise } from './perlinNoise.js';

const stats = new Stats();
stats.setMode(0); // 0: FPS
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
// document.body.appendChild(stats.domElement);

const clock = new THREE.Clock();

const TAU = 6.283185307179586;
let renderer, scene, camera, controls, composer;
let w = window.innerWidth;
let h = window.innerHeight;
const font_loader = new FontLoader();
var le_font;
let address, generator, noise;
// let address = generateRandomAddress().slice(3);

// const generator = createSeededRandom(stringToHash(address));
// const noise = new PerlinNoise(stringToHash(address));
let letters = [];
let rhytms = [];
let rhytms_amount;
let easings = ["power2.inOut", "elastic.out", "power3.out"];
let addresses = [];
function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}
function createSpritesheet(font = 'bold 64px Arial', gridSize = 10) {
    // Generate ASCII characters from 32 (' ') to 126 ('~')
    const characters = [];
    for (let i = 32; i <= 126; i++) {
        characters.push(String.fromCharCode(i));
    }

    // Calculate dimensions of the canvas
    const charWidth = 64; // Width of each character cell
    const charHeight = 64; // Height of each character cell
    const columns = gridSize; // Number of characters per row
    const rows = Math.ceil(characters.length / columns); // Number of rows needed
    const canvasWidth = columns * charWidth;
    const canvasHeight = rows * charHeight;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext('2d');

    // Style the text
    context.fillStyle = 'white'; // Text color
    context.font = font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw each character onto the canvas
    characters.forEach((char, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = col * charWidth + charWidth / 2;
        const y = row * charHeight + charHeight / 2;
        context.fillText(char, x, y);
    });

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return { texture, charWidth, charHeight, columns, rows };
}

// Usage in Three.js
const { texture, charWidth, charHeight, columns, rows } = createSpritesheet();
const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

// Example: Using the spritesheet to display a letter
function createLetterSprite(character) {
    const charCode = character.charCodeAt(0) - 32; // Map ASCII value
    const col = charCode % columns;
    const row = Math.floor(charCode / columns);

    // Adjust texture offsets
    const spriteMaterial = material.clone();
    spriteMaterial.map.offset.set(col / columns, 1 - (row + 1) / rows);
    spriteMaterial.map.repeat.set(1 / columns, 1 / rows);

    // Create sprite
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 2, 1); // Adjust scale as needed
    return sprite;
}

// Example: Add the letter 'A' to the scene
// const letterSprite = createLetterSprite('A');
// scene.add(letterSprite);

let rhytm_counter = 0;
let beats_counter = 0;
let string_to_hash;
function animateLetters() {
    const rhytm = rhytms[rhytm_counter % rhytms_amount];
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (generator.random() > rhytm.animated_chance && letter.active) {
            if(true){
                gsap.to(letter.rotation, {
                    z:0,
                    x:generator.range(-rhytm.angleChange, rhytm.angleChange),
                    // y:generator.range(-rhytm.angleChange, rhytm.angleChange),
                    duration: rhytm.duration,
                    delay: letter.offset*rhytm.delay*.5,
                    ease: rhytm.ease
                }); 
            }
            else{
            gsap.to(letter.rotation, {
                z:generator.range(-rhytm.angleChange, rhytm.angleChange),
                x:0,
                // y:generator.range(-rhytm.angleChange, rhytm.angleChange),
                duration: rhytm.duration,
                delay: letter.offset*rhytm.delay*.5,//+letter.offset2,
                ease: rhytm.ease
            });
        }
        }
    }
    beats_counter++;
    if (beats_counter >= rhytm.numer_of_beats) {
        beats_counter = 0;
        rhytm_counter++;
    }
    setTimeout(() => animateLetters(), rhytm.delay*1000);
}

function init() {
    
    
    le_font = font_loader.parse(font_glob);
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    // scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.z = 25;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.autoRotate=true;
    controls.autoRotateSpeed = 3.1;
    controls.zoomSpeed = 1.6;
    controls.update();

    // controls = new FlyControls( camera, renderer.domElement );
    // controls.movementSpeed = 5;
    // controls.domElement = renderer.domElement;
    // controls.rollSpeed = Math.PI / 24;
    // controls.autoForward = false;
    // controls.dragToLook = false;
    // controls.update();
    // controls = new FirstPersonControls( camera, renderer.domElement );
    // controls.movementSpeed = 5;

    if(holders!=null && holders.length > 0){
        // address = holders[0].holder_id.slice(3);
        addresses = holders.map(h => h.holder_id.slice(3));
       
    }
    else{
        // address = generateRandomAddress().slice(3);
        for (let i = 0; i < 42; i++) {
            addresses.push(generateRandomAddress().slice(3));
        }
    }
    string_to_hash = addresses.join("");

    generator = createSeededRandom(stringToHash(string_to_hash));
    noise = new PerlinNoise(stringToHash(string_to_hash));


    const delay = generator.range(0.3, 3.0)//*generator.rangeInt(1,4);
    rhytms_amount = generator.rangeInt(2, 6);
    for (let i = 0; i < rhytms_amount; i++) {
        const number_of_beats = generator.rangeInt(2, 4);
        let animated_chance = false;
        if(generator.random() > 0.7){
            animated_chance = true;
        }
        
        const rhytm = {
            xturn: generator.random() > 0.5?true:false,
            numer_of_beats:number_of_beats,
            duration: generator.range(0.2, delay),
            delay: delay,
            angleChange: generator.range(0, TAU/2),
            ease: generator.random() > 0.5 ? "power3.out" : "elastic.out",
            animated_chance: generator.range(0.1, 0.7),
        };
        rhytms.push(rhytm);
    }

    const spacing = 3;
    const animated_chance = generator.range(0.4, 0.8);
    
    const letterMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0) });
    for (let i = 0; i < addresses.length; i++) {
        const noiseScale = generator.range(0.01,5);
        address = addresses[i];
        let parent_letter;
        const noiseSpeed = generator.range(0.00005, 0.00071);//map(noise.noise(i * 0.5, 1.12, 12.22), -0.6, 0.6, 0.0001, 0.001);
        const amount = address.length//map(noise.noise(i * 0.15, 1.12, 12.22), -0.6, 0.6, 3, 33);
        const direction = 1//generator.random() > 0.5 ? 1 : -1;
        // const textMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(generator.range(0.5,1), generator.range(0.5,1), generator.range(0.5,1)) });

        const some_color = new THREE.Color(generator.range(0.5,1), generator.range(0.5,1), generator.range(0.5,1));
        for (let j = 0; j < amount; j++) {
            
            const offset = 1-j/amount
            const letter = new Letter(address[j], letterMat,i/addresses.length*noiseScale, j/amount*noiseScale, noiseSpeed, offset);
            letter.noiseScale = noiseScale;
            if (j > 0) {
                letter.active=true;
                parent_letter.add(letter);
                letter.position.set(0, 1.2*offset, 0);
                // letter.rotation.x = generator.range(-TAU/32, TAU/32);
                // letter.rotation.y = generator.range(-TAU, TAU);
                // letter.rotation.z = generator.range(-TAU/32, TAU/32);
                
                if(generator.random() > 0.95){
                    CreateBranch(letter, address[j], generator.rangeInt(3, 12));
                }
            } else {
                scene.add(letter);
                letter.rotation.z = generator.range(-TAU, TAU);
                letter.rotation.x = generator.range(-TAU, TAU);
                letter.rotation.y = generator.range(-TAU, TAU);
                // letter.color = new THREE.Color(generator.random(), generator.random(), generator.random());
                // gsap.from(letter.rotation, {
                //     z:0,
                //     x:TAU/2,
                //     // y:generator.range(-rhytm.angleChange, rhytm.angleChange),
                //     duration: 1,
                //     delay: .5*j+i,
                //     ease: "power3.out"
                // }); 
                // letter.position.set(i * spacing - address.length / 2 * spacing, -32, 0);
                // letter.position.set(generator.range(-50,50), -20, generator.range(-50,50));
            }
            letters.push(letter);
            parent_letter = letter;
        }
    }
    
    // animateLetters();
    resize();
    window.addEventListener('resize', resize);
    // window.addEventListener('pointerdown', onMouseDown, true);
    // window.addEventListener('pointerup', onMouseUp, true);
    animate();
}
function CreateBranch(parent, character, length) {
    let start;
    for (let i = 0; i < length; i++) {
        const letter = new Letter(character, parent.mesh.material, i/length*parent.noiseScale, parent.y, parent.noiseSpeed, parent.offset*(1-i/length));
        letter.position.set(0, 2*parent.offset*(1-i/length), 0);
        // letter.position.set(0, 1.2, 0);
        // letter.rotation.y = generator.range(-TAU/8, TAU/8);
        // letter.rotation.z = generator.range(-TAU/8, TAU/8);
        letter.active = true;
        if(start!==undefined){
            start.add(letter);
        }
        else{
            parent.add(letter);
        }
        start = letter;
        if(generator.random() > 0.95){
            CreateBranch(letter, character, generator.rangeInt(3, 8));
        }
        letters.push(letter);
    }
}



const simpleMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0) });

class Letter extends THREE.Object3D {
    constructor(character, textMat, x, y, noiseSpeed, offset) {
        super();
        const textGeo = new TextGeometry(character, {
            font: le_font,
            size: 1,//*(1-offset),
            depth: .1,
            curveSegments: 1,
            bevelEnabled: false,
        });
        textGeo.computeBoundingBox();
        textGeo.center();
        this.mesh = new THREE.Mesh(textGeo, simpleMat);
        // this.letterSprite = createLetterSprite(character);
        this.noiseSpeed = noiseSpeed;
        this.x = x;
        this.y = y;
        this.offset = offset;
        const scale = offset;
        this.mesh.scale.set(scale, scale, scale);
        // this.container = new THREE.Object3D();
        this.add(this.mesh)
        // this.container.add(this.letterSprite)
        this.mesh.position.set(0, 2, 0);
        // this.add(this.container);
    }
    update(time) {
        if(!this.active){
            return;
        }
        this.rotation.y = map(noise.noise(this.x+time*this.noiseSpeed, this.y, 1.11), -1, 1, -TAU/16, TAU/16);
        this.rotation.x = map(noise.noise(this.x+time*this.noiseSpeed, this.y+12.23, 1.11), -1, 1, -TAU/16, TAU/16);
        this.rotation.z = map(noise.noise(this.x+time*this.noiseSpeed, this.y+2.23, 1.11), -1, 1, -TAU/16, TAU/16);
       
    }
}
function animate(time) {
    const delta = clock.getDelta();
    stats.update();
    for (let i = 0; i < letters.length; i++) {
        letters[i].update(time);
    }
    controls.update(delta);
    renderer.setSize(w, h);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

const contract = "KT1PCa8pufaSpvdA7ad8tPa69USGnqZDhhPk";
let tokenId = 3;
let id = new URLSearchParams(window.location.search).get('objkt')
if(id!=null){
    tokenId = id
}

let holders;

console.log(id);



// fetchObjktHoldersFromTzkt(contract, tokenId).then(h => {
//     holders = h;
//     console.log(holders);
//     init()
//   });
  init()